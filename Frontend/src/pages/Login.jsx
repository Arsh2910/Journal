import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="w-full max-w-md journal-paper p-10 shadow-paper-lift" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="mb-10 space-y-2">
          <Link to="/" className="stamp-label text-outline hover:text-secondary transition-colors">
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
              onChange={(e) => setForm((p) => ({ ...p, identifier: e.target.value }))}
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
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
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
              {loading ? "Opening journal..." : "Open My Journal"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="stamp-label">or</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        <p className="font-sans text-label-sm text-center text-on-surface-variant">
          Starting a new challenge?{" "}
          <Link to="/register" className="text-secondary hover:text-secondary-fixed transition-colors">
            Begin here →
          </Link>
        </p>
      </div>
    </div>
  );
}
