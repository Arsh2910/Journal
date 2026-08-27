import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-page-margin py-4 flex items-center justify-between">
        {/* Wordmark */}
        <Link to={user ? "/journal" : "/"} className="font-serif text-headline-md text-secondary tracking-tight">
          Daybook
        </Link>

        {/* Nav links */}
        {user && (
          <nav className="flex items-center gap-8">
            <NavLink to="/journal" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Today
            </NavLink>
            <NavLink to="/journey" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Journey
            </NavLink>
            <NavLink to="/archive" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Archive
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Profile
            </NavLink>
          </nav>
        )}

        {/* Auth controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={handleLogout} className="btn-ghost py-1.5 text-xs">
              Close Journal
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
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
