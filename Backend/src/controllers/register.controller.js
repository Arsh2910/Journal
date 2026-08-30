const userModel = require("../models/user.model");
const { verifyGoogleToken } = require("../services/googleAuth.service");
const { findOrCreateGoogleUser } = require("../services/auth.service");
const tokenBlacklistModel = require("../models/blacklist.model");
const OTP = require("../models/otp.model");
const { generateOTP, hashOTP } = require("../utils/otp");
const { sendOtpEmail } = require("../services/email.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
async function registerUser(req, res, next) {
  try {
    const { userName, email, password, avatar } = req.body;
    const UserAlreadyExist = await userModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (UserAlreadyExist) {
      throw new AppError("User with same username or email already exist", 409);
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName,
      email,
      password: hash,
      avatar: avatar || "avatar-default",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { userName, email, password } = req.body;

    const query = email
      ? { email: email.toLowerCase().trim() }
      : { userName: userName.trim() };

    const user = await userModel.findOne(query);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.password) {
      throw new AppError("This account uses Google login", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}
async function googleLogin(req, res, next) {
  try {
    const { idToken, avatar } = req.body;
    const { email, googleId } = await verifyGoogleToken(idToken);
    const { user, isNew } = await findOrCreateGoogleUser({
      email,
      googleId,
      avatar,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      isNewUser: isNew,
    });
  } catch (err) {
    next(err);
  }
}
async function logoutUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("No token found", 400);
    }

    const decoded = jwt.decode(token);

    if (!decoded?.exp) {
      throw new AppError("Invalid token", 400);
    }

    await tokenBlacklistModel.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function sendOTP(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingOTP = await OTP.findOne({
      email: normalizedEmail,
    });

    if (existingOTP) {
      const elapsed = Date.now() - existingOTP.createdAt.getTime();

      if (elapsed < 60 * 1000) {
        throw new AppError(
          "Please wait 60 seconds before requesting another OTP",
          429,
        );
      }

      await OTP.deleteOne({
        _id: existingOTP._id,
      });
    }

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const otpRecord = await OTP.create({
      email: normalizedEmail,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      throw error;
    }

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
}
async function verifyOTP(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    if (!/^\d{6}$/.test(otp)) {
      throw new AppError("OTP must be 6 digits", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
    });

    if (!otpRecord) {
      throw new AppError("OTP not found or expired", 404);
    }

    if (otpRecord.attempts >= 5) {
      throw new AppError("Too many attempts", 429);
    }

    const hashedInput = hashOTP(otp);

    if (hashedInput !== otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      if (otpRecord.attempts >= 5) {
        throw new AppError("Too many attempts", 429);
      }

      throw new AppError("Invalid OTP", 400);
    }

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new AppError("User does not exist", 404);
    }
    console.log("User found:", user); // Debugging line
    const existingOTP = await OTP.findOne({
      email: normalizedEmail,
    });

    if (existingOTP) {
      const elapsed = Date.now() - existingOTP.createdAt.getTime();

      if (elapsed < 60 * 1000) {
        throw new AppError(
          "Please wait 60 seconds before requesting another OTP",
          429,
        );
      }

      await OTP.deleteOne({
        _id: existingOTP._id,
      });
    }
    console.log("Generating new OTP for:", normalizedEmail); // Debugging line
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const otpRecord = await OTP.create({
      email: normalizedEmail,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    try {
      console.log("Sending OTP email to:", normalizedEmail, "OTP:", otp); // Debugging line
      await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      throw error;
    }

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
}
async function verifyForgotPasswordOTP(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    if (!/^\d{6}$/.test(otp)) {
      throw new AppError("OTP must be 6 digits", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
    });

    if (!otpRecord) {
      throw new AppError("OTP not found or expired", 404);
    }

    if (otpRecord.attempts >= 5) {
      throw new AppError("Too many attempts", 429);
    }

    const hashedInput = hashOTP(otp);

    if (hashedInput !== otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      if (otpRecord.attempts >= 5) {
        throw new AppError("Too many attempts", 429);
      }

      throw new AppError("Invalid OTP", 400);
    }

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new AppError("Unable to reset password", 400);
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
}
async function resetPassword(req, res, next) {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      throw new AppError("Reset token and new password are required", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError("Invalid or expired reset token", 401);
    }

    if (decoded.purpose !== "password-reset") {
      throw new AppError("Invalid reset token", 401);
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const hash = await bcrypt.hash(newPassword, 10);

    user.password = hash;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
};
