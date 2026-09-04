import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { getAvatarSrc } from "../components/AvatarPicker";

// Sun icon (shown in dark mode — click to go light)
function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon (shown in light mode — click to go dark)
function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Resolve avatar image; falls back to default if no avatar set
  const avatarSrc = user ? getAvatarSrc(user.avatar || "avatar-default") : null;

  return (
    <header
      className="w-full border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300"
      style={{
        borderBottomColor:
          "color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-page-margin py-4 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          to={user ? "/journal" : "/"}
          className="font-serif text-headline-md text-secondary tracking-tight"
        >
          Daybook
        </Link>

        {/* Nav links */}
        {user && (
          <nav className="flex items-center gap-8">
            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Today
            </NavLink>
            <NavLink
              to="/journey"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Journey
            </NavLink>
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Archive
            </NavLink>
            {user.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
        )}

        {/* Right controls: theme toggle + profile + auth */}
        <div className="flex items-center gap-4">
          {/* Theme toggle — sun/moon */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            aria-label={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link flex items-center gap-2 ${isActive ? "active" : ""}`
                }
              >
                <span
                  className="w-6 h-6 overflow-hidden flex-shrink-0 inline-block"
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--color-outline-variant) 50%, transparent)",
                  }}
                >
                  <img
                    src={avatarSrc}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </span>
                Profile
              </NavLink>
              <button
                onClick={() => navigate("/")}
                className="btn-ghost py-1.5 text-xs"
              >
                Close Journal
              </button>
              <button
                onClick={handleLogout}
                className="btn-ghost py-1.5 text-xs text-tertiary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="btn-embossed text-xs px-5 py-2">
                Begin
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
