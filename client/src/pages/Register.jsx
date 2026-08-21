import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      // Save token
      localStorage.setItem("token", response.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate(
          response.data.user.role === "recruiter" ? "/dashboard" : "/jobs",
          { replace: true }
        );
      }, 800);

    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CareerConnect</h1>

        <h2>Create Account</h2>

        <p style={styles.subtitle}>
          Create your account and start exploring opportunities.
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={styles.field}>
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Account Type</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="jobseeker">
                Job Seeker
              </option>

              <option value="recruiter">
                Recruiter
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.linkButton}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "35px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "18px",
  },

  error: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
  },

  success: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "#dcfce7",
    color: "#15803d",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  loginText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#555",
  },

  linkButton: {
    border: "none",
    background: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Register;
