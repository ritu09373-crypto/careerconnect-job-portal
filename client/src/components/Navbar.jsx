import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", menuOpen);
    return () => document.body.classList.remove("nav-locked");
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-mark">CC</span>
          <span className="logo-text">CareerConnect</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className={menuOpen ? "nav-toggle-bars open" : "nav-toggle-bars"} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>

        <div id="site-nav" className={menuOpen ? "nav-panel open" : "nav-panel"}>
          <nav className="nav-links">
            <NavLink to="/jobs">Find jobs</NavLink>
            {user?.role === "jobseeker" && (
              <NavLink to="/applications">Applications</NavLink>
            )}
            {user?.role === "recruiter" && (
              <NavLink to="/dashboard">Dashboard</NavLink>
            )}
          </nav>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link className="profile-link" to="/profile">
                  {user.name?.split(" ")[0] || "Profile"}
                </Link>
                <button className="text-button" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link className="button small" to="/register">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
