import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialFilters = { query: "", location: "", category: "", jobType: "", experience: "" };

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { const fetchJobs = async () => { try { const { data } = await api.get("/jobs"); setJobs(data.jobs || []); } catch (err) { setError(err.response?.data?.message || "Failed to load jobs"); } finally { setLoading(false); } }; void fetchJobs(); }, []);
  const categories = useMemo(() => [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(), [jobs]);
  const locations = useMemo(() => [...new Set(jobs.map((job) => job.location).filter(Boolean))].sort(), [jobs]);
  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.description} ${(job.skills || []).join(" ")}`.toLowerCase();
    return (!filters.query || text.includes(filters.query.toLowerCase())) && (!filters.location || job.location === filters.location) && (!filters.category || job.category === filters.category) && (!filters.jobType || job.jobType === filters.jobType) && (!filters.experience || job.experienceLevel === filters.experience);
  }), [jobs, filters]);
  if (loading) return <section className="page"><p className="muted">Loading opportunities…</p></section>;
  if (error) return <section className="page"><p className="alert error">{error}</p></section>;
  return <section className="page"><p className="eyebrow">Explore opportunities</p><h1>Find work that fits</h1><p className="lead">Search active roles from growing teams and apply when you are ready.</p>
    <div className="filters card"><input aria-label="Search jobs" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="Search by title, company, skill…" /><select aria-label="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}><option value="">All locations</option>{locations.map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Job type" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}><option value="">All job types</option>{["Full-time", "Part-time", "Internship", "Contract", "Freelance"].map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Experience level" value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })}><option value="">All experience</option>{["Fresher", "Entry Level", "Mid Level", "Senior Level"].map((value) => <option key={value}>{value}</option>)}</select><button className="text-button" onClick={() => setFilters(initialFilters)}>Clear</button></div>
    <p className="result-count">{filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found</p>{filteredJobs.length ? <div className="job-list">{filteredJobs.map((job) => <article className="card job-card" key={job._id}><div><p className="job-category">{job.category}</p><h2>{job.title}</h2><p className="company">{job.company}</p><p className="job-meta">{job.location} · {job.jobType} · {job.experienceLevel}</p>{job.skills?.length > 0 && <div className="skill-list">{job.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</div>}</div><button className="button" onClick={() => navigate(`/jobs/${job._id}`)}>View role</button></article>)}</div> : <div className="empty card"><h2>No jobs match these filters</h2><p>Try removing a filter or searching for a different skill.</p></div>}</section>;
}
export default Jobs;
