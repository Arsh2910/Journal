const { z } = require("zod");

const registerSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  avatar: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").optional(),

  userName: z.string().trim().min(3, "Invalid username").optional(),

  password: z.string().min(1, "Password is required"),
});

const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),

  avatar: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

const otpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),

  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  emailSchema,
  otpSchema,
  resetPasswordSchema,
};
