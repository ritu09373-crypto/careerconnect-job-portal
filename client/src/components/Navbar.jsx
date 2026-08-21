import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">CC</span>
          CareerConnect
        </Link>

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
    </header>
  );
}

export default Navbar;
