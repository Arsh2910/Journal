const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const authController = require("../controllers/register.controller");
const {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  emailSchema,
  otpSchema,
  resetPasswordSchema,
} = require("../schemas/auth.schema");
const { authUser } = require("../middlewares/auth.middleware");
const { googleLogin } = require("../controllers/register.controller");
const {
  otpSendLimiter,
  otpVerifyLimiter,
} = require("../middlewares/rateLimiter.middleware");
router.post("/register", validate(registerSchema), authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authUser, authController.logoutUser);
router.post("/google", validate(googleLoginSchema), authController.googleLogin);
router.post("/verify-otp", otpVerifyLimiter, authController.verifyOTP);
router.post("/send-otp", otpSendLimiter, authController.sendOTP);
router.post("/forgot-password", otpSendLimiter, authController.forgotPassword);
router.post(
  "/verify-forgot-password-otp",
  otpVerifyLimiter,
  authController.verifyForgotPasswordOTP,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);
module.exports = router;
