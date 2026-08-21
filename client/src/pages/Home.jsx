import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">

        <div className="hero-content">
          <div className="hero-badge">
            🚀 AI-Powered Career Platform
          </div>

          <h1>
            Find the Job That
            <span> Builds Your Future.</span>
          </h1>

          <p>
            Discover opportunities, upload your resume, and let AI
            help you find jobs that match your skills and career goals.
          </p>

          {/* Search */}
          <div className="hero-search">

            <div className="search-input">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Job title, skills or keywords"
              />
            </div>

            <div className="search-input location-input">
              <span>📍</span>
              <input
                type="text"
                placeholder="Location"
              />
            </div>

            <button
              onClick={() => navigate("/jobs")}
              className="search-btn"
            >
              Search Jobs
            </button>

          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            <button onClick={() => navigate("/jobs")}>
              Software Engineer
            </button>
            <button onClick={() => navigate("/jobs")}>
              React Developer
            </button>
            <button onClick={() => navigate("/jobs")}>
              Data Scientist
            </button>
          </div>
        </div>

        <div className="hero-visual">

          <div className="hero-card main-card">
            <div className="card-top">
              <div className="company-logo">CC</div>

              <div>
                <h3>MERN Stack Developer</h3>
                <p>CareerConnect Technologies</p>
              </div>

              <span className="verified">✓</span>
            </div>

            <div className="job-info">
              <span>📍 Jaipur</span>
              <span>💼 Full Time</span>
              <span>💰 ₹6-10 LPA</span>
            </div>

            <div className="skills">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
            </div>

            <div className="match-box">
              <div>
                <strong>AI Match</strong>
                <p>Excellent match for your profile</p>
              </div>

              <div className="match-score">
                92%
              </div>
            </div>
          </div>

          <div className="floating-card candidate-card">
            <div className="avatar">👩‍💻</div>

            <div>
              <strong>Profile Match</strong>
              <p>AI found 12 suitable jobs</p>
            </div>

            <span>✓</span>
          </div>

          <div className="floating-card resume-card">
            <span className="resume-icon">📄</span>

            <div>
              <strong>Resume Analyzed</strong>
              <p>Score: 88/100</p>
            </div>
          </div>

        </div>
      </section>


      {/* ================= STATS ================= */}
      <section className="stats-section">

        <div className="stat">
          <strong>10K+</strong>
          <span>Active Jobs</span>
        </div>

        <div className="stat">
          <strong>5K+</strong>
          <span>Companies</span>
        </div>

        <div className="stat">
          <strong>25K+</strong>
          <span>Job Seekers</span>
        </div>

        <div className="stat">
          <strong>95%</strong>
          <span>AI Match Accuracy</span>
        </div>

      </section>


      {/* ================= AI SECTION ================= */}
      <section className="ai-section">

        <div className="ai-content">

          <div className="section-badge">
            🤖 SMART CAREER TECHNOLOGY
          </div>

          <h2>
            Your career search,
            <span> powered by AI.</span>
          </h2>

          <p>
            Stop applying randomly. CareerConnect analyzes your
            resume, skills and experience to help you discover
            opportunities that actually match your profile.
          </p>

          <div className="ai-features">

            <div className="ai-feature">
              <div className="feature-icon">🎯</div>
              <div>
                <h3>Smart Job Matching</h3>
                <p>
                  Get personalized job recommendations based on
                  your skills and experience.
                </p>
              </div>
            </div>

            <div className="ai-feature">
              <div className="feature-icon">📄</div>
              <div>
                <h3>AI Resume Analysis</h3>
                <p>
                  Upload your resume and receive intelligent
                  insights to improve your profile.
                </p>
              </div>
            </div>

            <div className="ai-feature">
              <div className="feature-icon">📈</div>
              <div>
                <h3>Career Insights</h3>
                <p>
                  Understand your strengths and discover skills
                  that can improve your career opportunities.
                </p>
              </div>
            </div>

          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/jobs")}
          >
            Explore AI-Matched Jobs →
          </button>

        </div>

        <div className="ai-dashboard">

          <div className="dashboard-header">
            <div>
              <span>AI Job Match</span>
              <h3>MERN Stack Developer</h3>
            </div>

            <span className="ai-icon">✨</span>
          </div>

          <div className="score-circle">
            <div>
              <strong>92%</strong>
              <span>Match</span>
            </div>
          </div>

          <div className="match-details">

            <div>
              <span>✓</span>
              React.js
              <b>Strong</b>
            </div>

            <div>
              <span>✓</span>
              Node.js
              <b>Strong</b>
            </div>

            <div>
              <span>✓</span>
              MongoDB
              <b>Strong</b>
            </div>

            <div className="missing">
              <span>!</span>
              Docker
              <b>Learn</b>
            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">

        <div className="section-heading">

          <span className="section-badge">
            SIMPLE PROCESS
          </span>

          <h2>
            Your next opportunity is
            <span> three steps away.</span>
          </h2>

          <p>
            Everything you need to take the next step in your career.
          </p>

        </div>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <div className="step-icon">👤</div>

            <h3>Create Your Profile</h3>

            <p>
              Build your professional profile and showcase
              your skills, experience and career goals.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-icon">📄</div>

            <h3>Upload Your Resume</h3>

            <p>
              Upload your resume and let our AI analyze
              your skills and experience.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-icon">🚀</div>

            <h3>Find & Apply</h3>

            <p>
              Discover relevant jobs, apply with confidence
              and track your applications.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div>
          <span>READY TO START?</span>

          <h2>
            Your next career opportunity
            <br />
            could be one click away.
          </h2>

          <p>
            Join CareerConnect and discover opportunities
            designed for your skills.
          </p>

          <div className="cta-buttons">

            <button
              className="cta-primary"
              onClick={() => navigate("/jobs")}
            >
              Find Jobs →
            </button>

            <button
              className="cta-secondary"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </button>

          </div>
        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-brand">

          <h2>
            Career<span>Connect</span>
          </h2>

          <p>
            Connecting talent with opportunity through
            intelligent technology.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>Platform</h4>
            <button onClick={() => navigate("/jobs")}>
              Find Jobs
            </button>
            <button onClick={() => navigate("/applications")}>
              My Applications
            </button>
          </div>

          <div>
            <h4>Account</h4>
            <button onClick={() => navigate("/login")}>
              Login
            </button>
            <button onClick={() => navigate("/register")}>
              Register
            </button>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 CareerConnect. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;