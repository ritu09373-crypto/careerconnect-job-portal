import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
          skills: (data.user.skills || []).join(", "),
        });
      })
      .catch(() => setError("Unable to load your profile."))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.patch("/auth/me", {
        ...form,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      updateUser({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
      setMessage("Your profile has been saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="page narrow">
        <p className="muted">Loading profile…</p>
      </section>
    );
  }

  return (
    <section className="page narrow">
      <p className="eyebrow">Account</p>
      <h1>Your profile</h1>
      <p className="lead">
        Keep your skills and summary current so AI matching and recruiters see the real you.
      </p>

      <form className="card form-grid" onSubmit={submit}>
        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert success">{message}</p>}

        <label>
          Full name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label>
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Your phone number"
          />
        </label>

        <label>
          Location
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="City, state"
          />
        </label>

        <label>
          Skills <small>Separate skills with commas</small>
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="React, Node.js, MongoDB"
          />
        </label>

        <label className="full">
          Professional summary
          <textarea
            rows="5"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell recruiters about your experience and goals"
          />
        </label>

        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </section>
  );
}
