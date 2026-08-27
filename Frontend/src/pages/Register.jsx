import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register, login } = useAuth();
  const navigate            = useNavigate();
  const [form, setForm]     = useState({ userName: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="w-full max-w-md journal-paper p-10 shadow-paper-lift" style={{ animation: "fade-in 0.4s ease-out" }}>
        {/* Header */}
        <div className="mb-10 space-y-2">
          <Link to="/" className="stamp-label text-outline hover:text-secondary transition-colors">
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
              onChange={(e) => setForm((p) => ({ ...p, userName: e.target.value }))}
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
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
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
              {loading ? "Preparing your journal..." : "Create My Journal"}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="stamp-label">or</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        <p className="font-sans text-label-sm text-center text-on-surface-variant">
          Already have a journal?{" "}
          <Link to="/login" className="text-secondary hover:text-secondary-fixed transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
