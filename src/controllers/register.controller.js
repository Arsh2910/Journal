const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
async function registerUser(req, res) {
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
    console.log("creation failed", error);
  }
}

async function loginUser(req, res) {
  const { userName, email, password } = req.body;
  try {
    const user = await userModel.findOne({
      $or: [{ userName }, { email }],
    });
    if (!user) {
      return res.status(404).json({ message: "USER DOES NOT EXISTS" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "INVALID PASSWORD" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      message: "User Logged in Successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.log("failed", error);
  }
}
module.exports = { registerUser, loginUser };
