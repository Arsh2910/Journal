const jwt = require("jsonwebtoken");

const AppError = require("../utils/appError");
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
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return next(new AppError("Session expired, please log in again", 401));
    }
    next(err);
  }
}
module.exports = { authUser };
