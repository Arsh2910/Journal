import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="5"  />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2"  y1="12" x2="5"  y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
      <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Landing() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/journal");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background desk-texture">
      {/* Top nav strip */}
      <header className="w-full px-page-margin py-6 flex items-center justify-between border-b border-outline-variant/20">
        <span className="font-serif text-headline-md text-secondary tracking-tight">Daybook</span>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="btn-embossed text-xs px-5 py-2">Begin</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-page-margin py-16 relative overflow-hidden">
        {/* Faint gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/30 to-background pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 max-w-5xl w-full">
          {/* Text side */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Stamp label */}
            <p className="font-sans text-label-sm uppercase tracking-[0.3em] text-primary">
              A Personal Challenge Journal
            </p>

            {/* Hero headline */}
            <h1 className="font-serif text-display-lg text-secondary-fixed leading-none" style={{ letterSpacing: "-0.02em" }}>
              Make Your<br />
              <span className="italic text-secondary">Days Count.</span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif text-body-lg text-on-surface-variant italic max-w-md">
              A journal for the challenges you choose to finish.
              100 days. 75 days. However long you decide.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-4">
              <Link
                to="/register"
                className="btn-embossed flex items-center gap-3 group"
              >
                Start a Challenge
                <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
              </Link>
              <Link to="/login" className="btn-ghost">
                Sign In
              </Link>
            </div>

            {/* Footnote */}
            <p className="font-sans text-label-sm text-outline italic">
              No resets. No streaks. Just your pages.
            </p>
          </div>

          {/* Journal book illustration */}
          <div className="relative w-72 h-96 flex-shrink-0 opacity-85 hover:opacity-100 transition-opacity duration-700 group">
            {/* Shadow book (behind) */}
            <div
              className="absolute inset-0 bg-surface-container-low paper-texture border border-outline-variant/30 shadow-paper"
              style={{ transform: "rotate(3deg) translateX(6px) translateY(4px)" }}
            />

            {/* Main book */}
            <div className="absolute inset-0 bg-surface-container paper-texture border border-outline-variant/30 shadow-paper-lift group-hover:shadow-paper transition-shadow duration-500">
              {/* Spine */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-surface-container-high border-r border-outline-variant/40 shadow-[2px_0_8px_rgba(0,0,0,0.5)]" />

              {/* Inner content */}
              <div className="absolute inset-0 left-8 flex flex-col items-center justify-center p-6 space-y-6">
                {/* Emblem */}
                <div className="w-20 h-20 border border-outline-variant/20 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="0.8" className="text-outline-variant/40">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>

                {/* Title on book */}
                <div className="text-center space-y-1">
                  <p className="font-serif text-sm text-secondary-fixed-dim/60 tracking-widest uppercase">
                    Daybook
                  </p>
                  <div className="w-12 h-px bg-outline-variant/30 mx-auto" />
                  <p className="font-serif italic text-xs text-on-surface-variant/40">
                    A journal for the days<br />you choose to show up
                  </p>
                </div>

                {/* Ruled lines decoration */}
                <div className="w-full space-y-2 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-px bg-outline-variant" />
                  ))}
                </div>
              </div>

              {/* Clasps */}
              <div className="absolute right-0 top-1/4 w-3 h-8 bg-tertiary-container/20 border border-outline-variant/40" />
              <div className="absolute right-0 bottom-1/4 w-3 h-8 bg-tertiary-container/20 border border-outline-variant/40" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-page-margin py-6 border-t border-outline-variant/20 flex justify-center">
        <p className="font-sans text-label-sm text-outline/50">
          Hand-inked in the digital age. © {new Date().getFullYear()} Daybook.
        </p>
      </footer>
    </div>
  );
}
