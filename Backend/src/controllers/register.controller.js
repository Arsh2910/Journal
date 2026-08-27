const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
async function registerUser(req, res, next) {
  try {
    const { userName, email, password } = req.body;
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
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      username: user.userName,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  const { userName, email, password } = req.body;
  try {
    const user = await userModel.findOne({
      $or: [{ userName }, { email }],
    });
    if (!user) {
      throw new AppError("User does not exist", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 404);
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      message: "User Logged in Successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res, next) {
  const token = req.cookies.token;
  try {
    if (!token) {
      throw new AppError("No token found", 400);
    }
    await tokenBlacklistModel.create({ token });
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    next(err);
  }
}
module.exports = { registerUser, loginUser };
