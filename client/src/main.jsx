import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

function AuthEventBridge({ children }) {
  const { logout } = useAuth();

  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener("careerconnect:logout", onLogout);
    return () => window.removeEventListener("careerconnect:logout", onLogout);
  }, [logout]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AuthEventBridge>
        <App />
      </AuthEventBridge>
    </AuthProvider>
  </StrictMode>
);
