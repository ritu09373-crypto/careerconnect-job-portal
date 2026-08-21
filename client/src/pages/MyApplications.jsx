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
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/applications/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Fetch Applications Error:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  if (loading) {
    return <h2>Loading your applications...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <div>
          <p>You have not applied for any jobs yet.</p>

          <button onClick={() => navigate("/jobs")}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div>
          {applications.map((application) => {
            const job = application.job;

            return (
              <div key={application._id}>
                <h2>
                  {job?.title || "Job no longer available"}
                </h2>

                <p>
                  <strong>Company:</strong>{" "}
                  {job?.company || "N/A"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {job?.location || "N/A"}
                </p>

                <p>
                  <strong>Application Status:</strong>{" "}
                  {application.status || "applied"}
                </p>

                <p>
                  <strong>Applied On:</strong>{" "}
                  {application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                {application.resume && (
                  <p>
                    <strong>Resume:</strong>{" "}
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  </p>
                )}

                {application.coverLetter && (
                  <div>
                    <strong>Cover Letter:</strong>
                    <p>{application.coverLetter}</p>
                  </div>
                )}

                {job?._id && (
                  <button
                    onClick={() =>
                      navigate(`/jobs/${job._id}`)
                    }
                  >
                    View Job
                  </button>
                )}

                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;