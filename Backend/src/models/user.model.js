const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: false,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  avatar: {
    type: String,
    default: "avatar-default",
  },

  tokenVersion: {
    type: Number,
    default: 0,
  },

  passwordResetVersion: {
    type: Number,
    default: 0,
  },
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
