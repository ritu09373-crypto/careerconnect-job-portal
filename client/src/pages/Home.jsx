import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobCount, setJobCount] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/jobs")
      .then(({ data }) => {
        if (active) setJobCount(data.count ?? data.jobs?.length ?? 0);
      })
      .catch(() => {
        if (active) setJobCount(0);
      });
    return () => {
      active = false;
    };
  }, []);

  const searchJobs = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (location.trim()) params.set("location", location.trim());
    const qs = params.toString();
    navigate(qs ? `/jobs?${qs}` : "/jobs");
  };

  const popularSearch = (term) => {
    navigate(`/jobs?query=${encodeURIComponent(term)}`);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="brand-wordmark">CareerConnect</p>
          <h1>Find work that fits the way you grow.</h1>
          <p className="hero-copy">
            Browse live roles, apply with your resume, and use AI matching to see
            how your skills line up with each opportunity.
          </p>

          <form className="hero-search" onSubmit={searchJobs}>
            <label className="search-field">
              <span className="sr-only">Job title or skill</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skills, or keywords"
              />
            </label>
            <label className="search-field location-field">
              <span className="sr-only">Location</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
            </label>
            <button type="submit" className="search-btn">
              Search jobs
            </button>
          </form>

          <div className="popular-searches">
            <span>Popular:</span>
            {["React Developer", "Data Analyst", "Product Designer"].map((term) => (
              <button key={term} type="button" onClick={() => popularSearch(term)}>
                {term}
              </button>
            ))}
          </div>

          {jobCount !== null && (
            <p className="hero-live">
              {jobCount} open {jobCount === 1 ? "role" : "roles"} on the board right now
            </p>
          )}
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <p className="section-kicker">How it works</p>
          <h2>Three clear steps from profile to offer.</h2>
          <p>Built for job seekers and recruiters who want a focused hiring flow.</p>
        </div>

        <div className="steps">
          <article className="step">
            <span className="step-number">01</span>
            <h3>Create your profile</h3>
            <p>Set your role, skills, and experience so matches stay relevant.</p>
          </article>
          <article className="step">
            <span className="step-number">02</span>
            <h3>Discover roles</h3>
            <p>Search by skill, location, and experience — then open the details that matter.</p>
          </article>
          <article className="step">
            <span className="step-number">03</span>
            <h3>Apply and track</h3>
            <p>Submit a PDF resume, follow status updates, and keep every application in one place.</p>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="section-kicker">For both sides of hiring</p>
          <h2>One platform. Two clear workspaces.</h2>
          <p>
            Job seekers get search, applications, and AI fit scores. Recruiters get
            posting tools, candidate review, and status updates.
          </p>
          <div className="split-actions">
            <button type="button" className="primary-btn" onClick={() => navigate("/jobs")}>
              Browse jobs
            </button>
            <button type="button" className="ghost-btn" onClick={() => navigate("/register")}>
              Create account
            </button>
          </div>
        </div>
        <ul className="feature-list">
          <li>
            <strong>Smart matching</strong>
            <span>Compare your profile skills with a role and get a clear fit score.</span>
          </li>
          <li>
            <strong>Resume-ready applications</strong>
            <span>Upload a PDF and send a cover letter in one short flow.</span>
          </li>
          <li>
            <strong>Recruiter dashboard</strong>
            <span>Publish openings and manage candidates without leaving the app.</span>
          </li>
        </ul>
      </section>

      <section className="cta-section">
        <div>
          <p className="section-kicker light">Ready when you are</p>
          <h2>Start with a search or create your free account.</h2>
          <div className="cta-buttons">
            <button type="button" className="cta-primary" onClick={() => navigate("/jobs")}>
              Find jobs
            </button>
            <button type="button" className="cta-secondary" onClick={() => navigate("/register")}>
              Join CareerConnect
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-brand">
          <h2>
            Career<span>Connect</span>
          </h2>
          <p>Connecting talent with opportunity through a clear, practical hiring experience.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <button type="button" onClick={() => navigate("/jobs")}>Find jobs</button>
            <button type="button" onClick={() => navigate("/applications")}>My applications</button>
          </div>
          <div>
            <h4>Account</h4>
            <button type="button" onClick={() => navigate("/login")}>Login</button>
            <button type="button" onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} CareerConnect. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Home;
