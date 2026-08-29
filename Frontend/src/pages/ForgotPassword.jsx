import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
} from "../services/authApi";

// step: "email" | "otp" | "reset" | "done"

const RESEND_COOLDOWN = 60; // seconds — must match backend

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(null); // in-memory only
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  // ---------- resend countdown ----------
  const countdownRef = useRef(null);

  function startCooldown() {
    setResendSeconds(RESEND_COOLDOWN);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  useEffect(() => () => clearInterval(countdownRef.current), []);

  // ---------- step 1 — request OTP ----------
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      startCooldown();
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- step 2 — verify OTP ----------
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyForgotPasswordOTP(email.trim(), otp);
      setResetToken(data.resetToken); // store in memory only, not URL/localStorage
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- resend OTP ----------
  const handleResend = async () => {
    if (resendSeconds > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setOtp("");
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- step 3 — reset password ----------
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setResetToken(null); // clear from memory immediately after use
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- shared layout shell (mirrors Login.jsx) ----------
  const shell = (heading, sub, content) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background desk-texture px-4 py-16">
      <div
        className="w-full max-w-md journal-paper p-10 shadow-paper-lift"
        style={{ animation: "fade-in 0.4s ease-out" }}
      >
        {/* Back link */}
        <Link
          to="/login"
          className="stamp-label text-outline hover:text-secondary transition-colors"
        >
          ← Back to Sign In
        </Link>

        <div className="mt-4 mb-10 space-y-2">
          <h1 className="font-serif text-headline-lg text-secondary-fixed">
            {heading}
          </h1>
          <p className="font-serif italic text-on-surface-variant text-body-md">
            {sub}
          </p>
        </div>

        <div className="w-full h-px bg-outline-variant/30 mb-8" />

        {content}
      </div>
    </div>
  );

  // ---------- step: email ----------
  if (step === "email") {
    return shell(
      "Recover Your Journal",
      "Enter your email and we'll send you a one-time code.",
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="stamp-label">Email</label>
          <input
            type="email"
            required
            autoFocus
            className="ink-input mt-1"
            placeholder="arsh@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-embossed w-full justify-center flex items-center gap-2"
          >
            {loading ? "Sending code..." : "Send Reset Code"}
          </button>
        </div>
      </form>
    );
  }

  // ---------- step: otp ----------
  if (step === "otp") {
    return shell(
      "Enter Your Code",
      `We sent a 6-digit code to ${email}. It expires in 5 minutes.`,
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="stamp-label">Verification Code</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            className="ink-input mt-1 tracking-widest text-center text-headline-md font-serif"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
        </div>

        {error && (
          <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
            {error}
          </p>
        )}

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-embossed w-full justify-center flex items-center gap-2"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          {/* Resend */}
          <p className="font-sans text-label-sm text-center text-on-surface-variant">
            Didn't receive it?{" "}
            {resendSeconds > 0 ? (
              <span className="text-outline">
                Resend in {resendSeconds}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-secondary hover:text-secondary-fixed transition-colors disabled:opacity-40"
              >
                Resend code
              </button>
            )}
          </p>
        </div>
      </form>
    );
  }

  // ---------- step: reset ----------
  if (step === "reset") {
    return shell(
      "Set a New Password",
      "Choose a strong password — at least 8 characters.",
      <form onSubmit={handleResetSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="stamp-label">New Password</label>
          <input
            type="password"
            required
            minLength={8}
            autoFocus
            className="ink-input mt-1"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="stamp-label">Confirm Password</label>
          <input
            type="password"
            required
            minLength={8}
            className="ink-input mt-1"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-embossed w-full justify-center flex items-center gap-2"
          >
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </div>
      </form>
    );
  }

  // ---------- step: done ----------
  return shell(
    "Password Updated",
    "Your password has been reset. You can now sign in with your new password.",
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="stamp-label text-primary">✓ Reset successful</span>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="btn-embossed w-full justify-center flex items-center gap-2"
      >
        Go to Sign In
      </button>
    </div>
  );
}
