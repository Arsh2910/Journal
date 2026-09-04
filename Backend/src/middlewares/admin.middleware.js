const AppError = require("../utils/appError");

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return next(new AppError("Forbidden — admin access required", 403));
  }
  next();
}

module.exports = { requireAdmin };
