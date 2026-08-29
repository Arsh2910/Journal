import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { googleLogin } from "../services/authApi";
import { useGoogleIdentity } from "../hooks/useGoogleIdentity";
import AvatarPicker from "../components/AvatarPicker";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const googleScriptLoaded = useGoogleIdentity();

  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      setError("");
      setGoogleLoading(true);
      try {
        const data = await googleLogin(response.credential);
        loginWithGoogle(data);
        if (data.isNewUser) {
          setShowAvatarPicker(true);
        } else {
          navigate("/journal");
        }
      } catch (err) {
        setError(err.message || "Google sign-in failed");
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
      // Backend accepts userName or email in the same field
      const isEmail = form.identifier.includes("@");
      await login(
        isEmail ? "" : form.identifier,
        isEmail ? form.identifier : "",
        form.password,
      );
      navigate("/journal");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background desk-texture px-4 py-16">
      {/* Book card */}
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
            Return to Your Pages
          </h1>
          <p className="font-serif italic text-on-surface-variant text-body-md">
            Sign in to continue your challenge.
          </p>
        </div>

        {/* Decorative ruled line */}
        <div className="w-full h-px bg-outline-variant/30 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="stamp-label">Username or Email</label>
            <input
              type="text"
              required
              className="ink-input mt-1"
              placeholder="arsh or arsh@example.com"
              value={form.identifier}
              onChange={(e) =>
                setForm((p) => ({ ...p, identifier: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="stamp-label">Password</label>
            <input
              type="password"
              required
              className="ink-input mt-1"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
            />
            <div className="text-right pt-1">
              <Link
                to="/forgot-password"
                className="stamp-label normal-case font-normal text-outline hover:text-secondary transition-colors"
                style={{ letterSpacing: 0 }}
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="font-sans text-label-sm text-error border-l-2 border-error pl-3">
              {error}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-embossed w-full justify-center flex items-center gap-2"
            >
              {loading ? "Opening journal..." : "Open My Journal"}
            </button>
          </div>
        </form>

        {/* Subtle divider line styled like a rule on notebook paper */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="stamp-label normal-case font-sans [font-variant:small-caps] text-sm tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Custom Continue with Google Button */}
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
              id="google-signin-btn-container"
              className="absolute inset-0 cursor-pointer opacity-0 overflow-hidden flex justify-center [&_iframe]:min-w-full [&_iframe]:min-h-full"
            />
          )}
        </div>

        <p className="font-sans text-label-sm text-center text-on-surface-variant">
          Starting a new challenge?{" "}
          <Link
            to="/register"
            className="text-secondary hover:text-secondary-fixed transition-colors"
          >
            Begin here →
          </Link>
        </p>
      </div>
      
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-lg w-full">
            <AvatarPicker onClose={() => navigate("/create")} />
          </div>
        </div>
      )}
    </div>
  );
}
