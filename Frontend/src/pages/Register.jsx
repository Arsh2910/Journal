import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { googleLogin } from "../services/authApi";
import { useGoogleIdentity } from "../hooks/useGoogleIdentity";

export default function Register() {
  const { register, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleScriptLoaded = useGoogleIdentity();

  // Reuses the exact same backend endpoint as Login — findOrCreateGoogleUser
  // already handles "new email → create account" on the backend, so this
  // is genuinely a sign-up path even though it calls the same function.
  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      setError("");
      setGoogleLoading(true);
      try {
        const data = await googleLogin(response.credential);
        loginWithGoogle(data);
        navigate("/create");
      } catch (err) {
        setError(err.message || "Google sign-up failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    [loginWithGoogle, navigate],
  );

  const googleBtnRef = useCallback(
    (element) => {
      if (element && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
          });
          window.google.accounts.id.renderButton(element, {
            theme: "outline",
            size: "large",
            width: 400,
          });
        } catch (err) {
          console.error("Failed to render Google Sign-In button:", err);
        }
      }
    },
    [handleGoogleCredentialResponse],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.userName, form.email, form.password);
      // Backend doesn't set cookie on register — auto-login after
      await login(form.userName, "", form.password);
      navigate("/create");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background desk-texture px-4 py-16">
      <div
        className="w-full max-w-md journal-paper p-10 shadow-paper-lift"
        style={{ animation: "fade-in 0.4s ease-out" }}
      >
        {/* Header */}
        <div className="mb-10 space-y-2">
          <Link
            to="/"
            className="stamp-label text-outline hover:text-secondary transition-colors"
          >
            ← Daybook
          </Link>
          <h1 className="font-serif text-headline-lg text-secondary-fixed mt-4">
            Open a New Journal
          </h1>
          <p className="font-serif italic text-on-surface-variant text-body-md">
            Create your account to begin your first challenge.
          </p>
        </div>

        <div className="w-full h-px bg-outline-variant/30 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="stamp-label">Username</label>
            <input
              type="text"
              required
              className="ink-input mt-1"
              placeholder="Arsh"
              value={form.userName}
              onChange={(e) =>
                setForm((p) => ({ ...p, userName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="stamp-label">Email</label>
            <input
              type="email"
              required
              className="ink-input mt-1"
              placeholder="arsh@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="stamp-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="ink-input mt-1"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
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
              {loading ? "Preparing your journal..." : "Create My Journal"}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="stamp-label">or</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Custom Continue with Google Button — same pattern as Login.jsx */}
        <div className="relative mb-8">
          <div className="btn-embossed w-full justify-center flex items-center gap-2 pointer-events-none">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>
              {googleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </span>
          </div>
          {!loading && !googleLoading && googleScriptLoaded && (
            <div
              ref={googleBtnRef}
              id="google-signup-btn-container"
              className="absolute inset-0 cursor-pointer opacity-0 overflow-hidden flex justify-center [&_iframe]:min-w-full [&_iframe]:min-h-full"
            />
          )}
        </div>

        <p className="font-sans text-label-sm text-center text-on-surface-variant">
          Already have a journal?{" "}
          <Link
            to="/login"
            className="text-secondary hover:text-secondary-fixed transition-colors"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
