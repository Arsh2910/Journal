const rateLimit = require("express-rate-limit");

const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many OTP requests. Please try again later.",
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many OTP verification attempts. Please try again later.",
  },
});

module.exports = {
  otpSendLimiter,
  otpVerifyLimiter,
};
