import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <section className="page">
        <p className="muted">Checking your session…</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "recruiter" ? "/dashboard" : "/jobs"} replace />;
  }

  return children;
}
