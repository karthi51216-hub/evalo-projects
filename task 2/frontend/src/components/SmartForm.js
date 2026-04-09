

import { useState } from "react";
import axios from "axios";

export default function SmartForm() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", message: ""
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let errs = {};
    if (!form.full_name.trim())
      errs.full_name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!/^[0-9]{10}$/.test(form.phone))
      errs.phone = "Phone must be 10 digits";
    if (form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setSuggestions(null);
    setSuccess(false);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/form-submit/",
        form
      );
      setSuggestions(res.data.ai_suggestions);
      setSuccess(true);
    } 
    catch (err) {
  console.error(err);

  // 🔥 fallback suggestions (manual)
  const fallback = {
    full_name: "Looks good!",
    email: "Looks good!",
    phone: "Looks good!",
    message: "Looks good!"
  };

 setSuggestions({
  ...fallback,
  note: "AI unavailable (quota exceeded)"
});
  setSuccess(true);
}
    
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h3 className="mb-1 text-primary">Smart Form Assistant</h3>
      <p className="text-muted mb-4">Fill the form — AI will suggest improvements!</p>

      {success && (
        <div className="alert alert-success">
          ✅ Form submitted successfully!
        </div>
      )}

      {suggestions && (
        <div className="alert alert-info">
          <strong>🤖 AI Suggestions:</strong>
          <ul className="mb-0 mt-2">
            {Object.entries(suggestions).map(([key, val]) => (
              <li key={key}>
                <b>{key.replace("_", " ")}:</b> {val}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="full_name"
            className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
            value={form.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          <div className="invalid-feedback">{errors.full_name}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={form.phone}
            onChange={handleChange}
            placeholder="10 digit number"
          />
          <div className="invalid-feedback">{errors.phone}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            name="message"
            rows={4}
            className={`form-control ${errors.message ? "is-invalid" : ""}`}
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
          />
          <div className="invalid-feedback">{errors.message}</div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Getting AI suggestions...
            </>
          ) : "Submit Form"}
        </button>
      </form>
    </div>
  );
}

