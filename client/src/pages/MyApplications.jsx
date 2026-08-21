import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my");
        setApplications(response.data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    void fetchApplications();
  }, []);

  if (loading) {
    return (
      <section className="page">
        <p className="muted">Loading your applications…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <p className="alert error">{error}</p>
      </section>
    );
  }

  return (
    <section className="page">
      <p className="eyebrow">Your pipeline</p>
      <h1>My applications</h1>
      <p className="lead">Track every role you have applied to and revisit the details anytime.</p>

      {applications.length === 0 ? (
        <div className="card empty">
          <h2>You have not applied for any jobs yet.</h2>
          <p>Browse open roles and submit your first application.</p>
          <button className="button" type="button" onClick={() => navigate("/jobs")}>
            Browse jobs
          </button>
        </div>
      ) : (
        <div className="app-list">
          {applications.map((application) => {
            const job = application.job;
            return (
              <article className="card app-card" key={application._id}>
                <div className="app-card-top">
                  <div>
                    <h2>{job?.title || "Job no longer available"}</h2>
                    <p className="job-meta">
                      {job?.company || "N/A"} · {job?.location || "N/A"}
                    </p>
                  </div>
                  <span className={`status-pill ${application.status || "applied"}`}>
                    {application.status || "applied"}
                  </span>
                </div>

                <p className="muted">
                  Applied on{" "}
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {application.coverLetter && (
                  <p className="description">{application.coverLetter}</p>
                )}

                <div className="split-actions">
                  {application.resume && (
                    <a className="button small" href={application.resume} target="_blank" rel="noreferrer">
                      View resume
                    </a>
                  )}
                  {job?._id && (
                    <button className="ghost-btn" type="button" onClick={() => navigate(`/jobs/${job._id}`)}>
                      View job
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyApplications;
