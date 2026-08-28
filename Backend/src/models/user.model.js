const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: { type: String, required: false, unique: true, sparse: true },
  avatar: { type: String, default: "avatar-default" },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
