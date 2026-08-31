const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const authController = require("./auth.controller");
const {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  emailSchema,
  otpSchema,
  resetPasswordSchema,
} = require("./auth.schema");
const { authUser } = require("../../middlewares/auth.middleware");
const {
  otpSendLimiter,
  otpVerifyLimiter,
} = require("../../middlewares/rateLimiter.middleware");
const { googleLogin } = require("./auth.controller");

router.post("/register", validate(registerSchema), authController.registerUser);
router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/logout", authUser, authController.logoutUser);
router.post("/google", validate(googleLoginSchema), authController.googleLogin);
router.post(
  "/verify-otp",
  validate(otpSchema),
  otpVerifyLimiter,
  authController.verifyOTP,
);
router.post(
  "/send-otp",
  validate(emailSchema),
  otpSendLimiter,
  authController.sendOTP,
);
router.post(
  "/forgot-password",
  validate(emailSchema),
  otpSendLimiter,
  authController.forgotPassword,
);
router.post(
  "/verify-forgot-password-otp",
  validate(otpSchema),
  otpVerifyLimiter,
  authController.verifyForgotPasswordOTP,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);
module.exports = router;
