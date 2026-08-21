import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };
  return <header className="navbar"><div className="nav-inner">
    <Link to="/" className="logo"><span>CC</span>CareerConnect</Link>
    <nav className="nav-links"><NavLink to="/jobs">Find jobs</NavLink>{user?.role === "jobseeker" && <NavLink to="/applications">Applications</NavLink>}{user?.role === "recruiter" && <NavLink to="/dashboard">Recruiter dashboard</NavLink>}</nav>
    <div className="nav-actions">{user ? <><Link className="profile-link" to="/profile">{user.name?.split(" ")[0] || "Profile"}</Link><button className="text-button" onClick={logout}>Log out</button></> : <><Link to="/login">Log in</Link><Link className="button small" to="/register">Get started</Link></>}</div>
  </div></header>;
}

export default Navbar;
