import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const getMatch = async () => {
    if (!isAuthenticated) return navigate("/login", { state: { from: `/jobs/${id}` } });
    if (user.role !== "jobseeker") {
      return setMatchError("AI matching is available for job seeker profiles.");
    }

    setMatching(true);
    setMatchError("");
    try {
      const { data } = await api.post("/ai/job-match", { jobId: id });
      setMatch(data.result);
    } catch (err) {
      setMatchError(err.response?.data?.message || "Could not generate your job match.");
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p className="muted">Loading role details…</p>
      </section>
    );
  }

  if (error || !job) {
    return (
      <section className="page">
        <p className="alert error">{error || "Job not found"}</p>
      </section>
    );
  }

  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? `₹${Number(job.salaryMin || 0).toLocaleString()} – ₹${Number(job.salaryMax || 0).toLocaleString()}`
      : "Salary not disclosed";

  return (
    <section className="page job-detail">
      <button className="back-link" type="button" onClick={() => navigate("/jobs")}>
        ← All jobs
      </button>

      <div className="detail-hero">
        <div>
          <p className="eyebrow">{job.category}</p>
          <h1>{job.title}</h1>
          <p className="detail-company">{job.company}</p>
          <p className="job-meta">
            {job.location} · {job.jobType} · {job.experienceLevel}
          </p>
        </div>
        {(!isAuthenticated || user?.role === "jobseeker") && (
          <button
            className="button light"
            type="button"
            onClick={() => navigate(`/apply/${job._id}`, { state: { job } })}
          >
            Apply now
          </button>
        )}
      </div>

      <div className="detail-layout">
        <article className="card detail-main">
          <h2>About this role</h2>
          <p className="description">{job.description}</p>

          <h2>Skills you’ll use</h2>
          <div className="skill-list">
            {job.skills?.length ? (
              job.skills.map((skill) => <span key={skill}>{skill}</span>)
            ) : (
              <span>Not specified</span>
            )}
          </div>

          <h2>Application deadline</h2>
          <p>
            {job.applicationDeadline
              ? new Date(job.applicationDeadline).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })
              : "Open until filled"}
          </p>
        </article>

        <aside className="detail-side">
          <div className="card">
            <p className="eyebrow">At a glance</p>
            <dl>
              <dt>Compensation</dt>
              <dd>{salary}</dd>
              <dt>Posted by</dt>
              <dd>{job.recruiter?.name || "Recruiter"}</dd>
              <dt>Role type</dt>
              <dd>{job.jobType}</dd>
            </dl>
          </div>

          <div className="match-card">
            <p className="eyebrow">CareerConnect AI</p>
            <h2>Check your match</h2>
            <p>See how your profile aligns with this role and what to improve.</p>
            <button className="button light" type="button" disabled={matching} onClick={getMatch}>
              {matching ? "Analysing profile…" : "Get AI match"}
            </button>
            {matchError && <p className="match-error">{matchError}</p>}
            {match && (
              <div className="match-result">
                <div className="score">
                  {match.matchScore}
                  <small>/100</small>
                </div>
                <strong>Your fit score</strong>
                {match.source === "local" && (
                  <p className="match-source">Skill-based analysis is active. Add OPENAI_API_KEY in server/.env for GPT scoring.</p>
                )}
                <p>{match.recommendation}</p>
                {match.matchingSkills?.length > 0 && (
                  <p>
                    <b>Matching:</b> {match.matchingSkills.join(", ")}
                  </p>
                )}
                {match.missingSkills?.length > 0 && (
                  <p>
                    <b>Build next:</b> {match.missingSkills.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
