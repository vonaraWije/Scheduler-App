import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const styles = {
  pageWrapper: {
    height: "calc(100vh - 64px)",
    maxHeight: "calc(100vh - 64px)",
    background: "linear-gradient(135deg, #f8f9ff 0%, #faf5ff 50%, #fdf4ff 100%)",
    padding: "20px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  decorativeCircle1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(168, 85, 247, 0.1)",
    top: "-100px",
    right: "-100px",
    filter: "blur(60px)",
  },
  decorativeCircle2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(124, 58, 237, 0.08)",
    bottom: "-80px",
    left: "-80px",
    filter: "blur(50px)",
  },
  container: {
    maxWidth: "1100px",
    width: "100%",
    maxHeight: "calc(100vh - 104px)",
    padding: "30px 40px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(124, 58, 237, 0.15), 0 0 0 1px rgba(124, 58, 237, 0.1)",
    position: "relative",
    border: "2px solid rgba(233, 213, 255, 0.5)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
    position: "relative",
    flexShrink: 0,
  },
  titleWrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
    fontWeight: "400",
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #e9d5ff, transparent)",
    margin: "10px 0",
  },
  row: { 
    display: "flex", 
    gap: 16, 
    marginBottom: 10, 
    alignItems: "flex-start",
  },
  col: { flex: 1, display: "flex", flexDirection: "column" },
  fieldGroup: { display: "flex", flexDirection: "column", marginBottom: 10 },
  label: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  required: { color: "#a855f7", fontSize: 14 },
  input: {
    padding: "10px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
  },
  inputFocused: {
    borderColor: "#a855f7",
    boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.1)",
  },
  inputError: { borderColor: "#ef4444" },
  textarea: {
    padding: "10px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s ease",
    resize: "vertical",
    minHeight: 60,
    backgroundColor: "#ffffff",
  },
  errorText: {
    fontSize: 11,
    color: "#ef4444",
    marginTop: 4,
    fontWeight: 500,
  },
  serverError: {
    padding: "10px 14px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 10,
    fontWeight: 500,
    border: "1px solid #fecaca",
  },
  successMessage: {
    padding: "10px 14px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 10,
    fontWeight: 600,
    border: "1px solid #a7f3d0",
  },
  formActions: { display: "flex", gap: 10, marginTop: 16 },
  button: {
    flex: 1,
    padding: "11px 20px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "#ffffff",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.35)",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 28px rgba(102, 126, 234, 0.45)",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
  },
  cancelButton: {
    flex: 1,
    padding: "11px 20px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 10,
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    background: "#ffffff",
    color: "#6b7280",
  },
  cancelButtonHover: {
    borderColor: "#9ca3af",
    color: "#374151",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
  },
  helperText: {
    fontSize: 11,
    color: "#9ca3af",
    margin: "4px 0 0 0",
    fontStyle: "italic",
  },
  formScrollContainer: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: 4,
  },
};

function isISODate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // Fetch appointment details when component mounts
  useEffect(() => {
    fetchAppointment();
  }, [id]);

  async function fetchAppointment() {
    try {
      setLoading(true);
      setServerError("");
      
      console.log("Fetching appointment with ID:", id);
      const res = await fetch(`/api/appointments/${id}`);
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Fetch error:", errorData);
        if (res.status === 404) {
          throw new Error("Appointment not found");
        }
        throw new Error(errorData.message || "Failed to fetch appointment details");
      }
      
      const response = await res.json();
      console.log("Fetched data:", response);
      const data = response.data || response;
      
      // Pre-populate form fields with fetched data
      setTitle(data.title || "");
      setDate(data.date || "");
      setTime(data.time || "");
      setDuration(data.duration || 30);
      setDescription(data.description || "");
      setAttendees(Array.isArray(data.attendees) ? data.attendees.join(", ") : "");
      
      console.log("Form populated successfully");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointment:", err);
      setServerError(err.message || "Failed to load appointment");
      setLoading(false);
    }
  }

  function validate() {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!date || !isISODate(date)) e.date = "Please choose a valid date.";
    if (!time) e.time = "Please choose a time.";
    if (!duration || duration <= 0) e.duration = "Duration must be a positive number.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    setSuccessMessage("");
    
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        date,
        time,
        duration: Number(duration),
        description: description.trim(),
        attendees: attendees
          .split(/[;,\n]/)
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || `Failed to update (${res.status})`);
      }

      setSubmitting(false);
      setSuccessMessage("✓ Appointment updated successfully!");
      
      // Navigate back to schedules after a brief delay
      setTimeout(() => navigate("/schedules"), 1500);
    } catch (err) {
      setServerError(err.message || "Failed to update appointment.");
      setSubmitting(false);
    }
  }

  function handleCancel() {
    navigate("/schedules");
  }

  if (loading) {
    return (
      <>
        {/* <NavigationBar /> */}
        <div style={styles.pageWrapper}>
          <div style={styles.decorativeCircle1}></div>
          <div style={styles.decorativeCircle2}></div>
          <div style={styles.container}>
            <div style={styles.loadingContainer}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Loading appointment details...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div style={styles.pageWrapper}>
        <div style={styles.decorativeCircle1}></div>
        <div style={styles.decorativeCircle2}></div>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.titleWrapper}>
              <h1 style={styles.title}>✏️ Edit Appointment</h1>
            </div>
            <p style={styles.subtitle}>Update your appointment details</p>
            <div style={styles.divider}></div>
          </div>

          {/* <div style={styles.formScrollContainer}> */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Title */}
              {/* console.log(appointment.id); */}

              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  📌 Title <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "title" ? styles.inputFocused : {}),
                    ...(errors.title ? styles.inputError : {}),
                  }}
                  placeholder="e.g., Team Sync Meeting"
                />
                {errors.title && <p style={styles.errorText}>{errors.title}</p>}
              </div>

              {/* Date, Time, Duration Row */}
              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>
                    📅 Date <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "date" ? styles.inputFocused : {}),
                      ...(errors.date ? styles.inputError : {}),
                    }}
                  />
                  {errors.date && <p style={styles.errorText}>{errors.date}</p>}
                </div>

                <div style={styles.col}>
                  <label style={styles.label}>
                    🕒 Time <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    onFocus={() => setFocusedField("time")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "time" ? styles.inputFocused : {}),
                      ...(errors.time ? styles.inputError : {}),
                    }}
                  />
                  {errors.time && <p style={styles.errorText}>{errors.time}</p>}
                </div>

                <div style={styles.col}>
                  <label style={styles.label}>
                    ⏱️ Duration (min) <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    onFocus={() => setFocusedField("duration")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...styles.input,
                      ...(focusedField === "duration" ? styles.inputFocused : {}),
                      ...(errors.duration ? styles.inputError : {}),
                    }}
                    placeholder="30"
                    min="1"
                  />
                  {errors.duration && <p style={styles.errorText}>{errors.duration}</p>}
                </div>
              </div>

              {/* Attendees */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>👥 Attendees</label>
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  onFocus={() => setFocusedField("attendees")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "attendees" ? styles.inputFocused : {}),
                  }}
                  placeholder="john@example.com, jane@example.com"
                />
                <p style={styles.helperText}>Separate multiple emails with commas</p>
              </div>

              {/* Description */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>📝 Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.textarea,
                    ...(focusedField === "description" ? styles.inputFocused : {}),
                  }}
                  placeholder="Meeting agenda, notes, or additional details..."
                  rows={3}
                />
              </div>

              {/* Success and Error Messages */}
              {successMessage && (
                <div role="status" style={styles.successMessage}>
                  {successMessage}
                </div>
              )}

              {serverError && (
                <div role="alert" style={styles.serverError}>
                  ⚠️ {serverError}
                </div>
              )}

              {/* Form Actions */}
              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={styles.cancelButton}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.cancelButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", color: "#6b7280" })}
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    ...(submitting ? styles.buttonDisabled : {}),
                  }}
                  onMouseEnter={(e) => !submitting && Object.assign(e.target.style, styles.buttonHover)}
                  onMouseLeave={(e) => !submitting && Object.assign(e.target.style, { transform: "none", boxShadow: "0 8px 20px rgba(102, 126, 234, 0.35)" })}
                  disabled={submitting}
                >
                  {submitting ? "🔄 Updating..." : "💾 Update Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      {/* </div> */}
    </>
  );
}
