const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const blacklistModel = require("../models/blacklist.model");
async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }
    const isBlacklisted = await blacklistModel.findOne({ token });
    if (isBlacklisted) {
      throw new AppError("Unauthorized access denied", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
module.exports = authUser;
