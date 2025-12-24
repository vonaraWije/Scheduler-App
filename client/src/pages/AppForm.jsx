import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const styles = {
  pageWrapper: {
    height: "calc(100vh - 64px)",
    maxHeight: "calc(100vh - 64px)",
    background: "linear-gradient(135deg, #9a77a3ff 0%, #706da1ff 50%, #8568acff 100%)",
    padding: "20px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  glowingOrb: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(12, 6, 26, 0.4) 0%, transparent 70%)",
    top: "-150px",
    right: "-150px",
    filter: "blur(80px)",
    animation: "float 8s ease-in-out infinite",
  },
  glowingOrb2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
    bottom: "-120px",
    left: "-120px",
    filter: "blur(70px)",
    animation: "float 6s ease-in-out infinite reverse",
  },
  container: {
    maxWidth: "1100px",
    width: "100%",
    maxHeight: "calc(100vh - 85px)",
    padding: "40px 50px",
    background: "rgba(39, 39, 84, 0.85)",
    backdropFilter: "blur(25px)",
    borderRadius: "24px",
    boxShadow: "0 25px 70px rgba(41, 32, 63, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.3)",
    position: "relative",
    border: "2px solid rgba(139, 92, 246, 0.4)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    position: "relative",
    flexShrink: 0,
  },
  titleWrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    background: "linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    letterSpacing: "-0.5px",
    animation: "pulse 2s ease-in-out infinite",
  },
  subtitle: {
    fontSize: 14,
    color: "#a5b4fc",
    margin: 0,
    fontWeight: "400",
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)",
    margin: "12px 0",
    boxShadow: "0 0 10px rgba(139, 92, 246, 0.4)",
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
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#c4b5fd",
    display: "flex",
    alignItems: "center",
    gap: 6,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  labelIcon: {
    fontSize: 16,
    filter: "drop-shadow(0 2px 4px rgba(139, 92, 246, 0.4))",
  },
  input: {
    padding: "12px 16px",
    fontSize: 14,
    borderRadius: "12px",
    border: "2px solid rgba(139, 92, 246, 0.4)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#e0e7ff",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
    boxShadow: "0 4px 10px rgba(139, 92, 246, 0.2)",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#a78bfa",
    background: "rgba(15, 23, 42, 0.9)",
    boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.25), 0 8px 20px rgba(139, 92, 246, 0.35)",
    transform: "translateY(-2px)",
  },
  textarea: {
    padding: "12px 16px",
    fontSize: 14,
    borderRadius: "12px",
    border: "2px solid rgba(139, 92, 246, 0.4)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#e0e7ff",
    minHeight: 70,
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    lineHeight: "1.6",
    boxShadow: "0 4px 10px rgba(139, 92, 246, 0.2)",
  },
  textareaFocus: {
    outline: "none",
    borderColor: "#a78bfa",
    background: "rgba(15, 23, 42, 0.9)",
    boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.25), 0 8px 20px rgba(139, 92, 246, 0.35)",
    transform: "translateY(-2px)",
  },
  button: {
    padding: "14px 40px",
    fontSize: 15,
    fontWeight: "700",
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)",
    letterSpacing: "0.5px",
    position: "relative",
    overflow: "hidden",
  },
  buttonHover: {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: "0 15px 40px rgba(139, 92, 246, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
  },
  formActions: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginTop: 16,
    justifyContent: "center",
    flexShrink: 0,
  },
  error: {
    color: "#fca5a5",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  serverError: {
    padding: "12px 16px",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "2px solid #ef4444",
    color: "#fca5a5",
    borderRadius: "12px",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 14,
    boxShadow: "0 6px 20px rgba(239, 68, 68, 0.3)",
    backdropFilter: "blur(10px)",
  },
  successMessage: {
    padding: "12px 16px",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    border: "2px solid #10b981",
    color: "#6ee7b7",
    borderRadius: "12px",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 14,
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
    backdropFilter: "blur(10px)",
    animation: "slideDown 0.4s ease-out",
  },
  helperText: {
    fontSize: 11,
    color: "#94a3b8",
    margin: "6px 0 0 0",
    fontStyle: "italic",
  },
};


function isISODate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default function AppForm({ onSuccess } = {}) {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditMode = Boolean(id);

	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [duration, setDuration] = useState(30);
	const [description, setDescription] = useState("");
	const [attendees, setAttendees] = useState("");
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // Fetch appointment data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchAppointment();
    }
  }, [id]);

  async function fetchAppointment() {
    try {
      setLoading(true);
      const res = await fetch(`/api/appointments/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch appointment");
      }
      const data = await res.json();
      
      // Pre-populate form fields
      setTitle(data.title || "");
      setDate(data.date || "");
      setTime(data.time || "");
      setDuration(data.duration || 30);
      setDescription(data.description || "");
      setAttendees(Array.isArray(data.attendees) ? data.attendees.join(", ") : "");
      setLoading(false);
    } catch (err) {
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

		setLoading(true);
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

			const res = await fetch("/api/appointments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				throw new Error(json.message || `Failed (${res.status})`);
			}

			setLoading(false);
			setSuccessMessage("✓ Appointment created successfully!");
			// Optionally clear form
			setTitle("");
			setDate("");
			setTime("");
			setDuration(30);
			setDescription("");
			setAttendees("");

			if (typeof onSuccess === "function") {
				setTimeout(() => onSuccess(), 2000);
			}
		} catch (err) {
			setServerError(err.message || "Failed to create appointment.");
			setLoading(false);
		}
	}

	return (
		<>
			<style>
				{`
					@keyframes float {
						0%, 100% { transform: translateY(0px); }
						50% { transform: translateY(-20px); }
					}
					@keyframes pulse {
						0%, 100% { opacity: 1; transform: scale(1); }
						50% { opacity: 0.8; transform: scale(1.05); }
					}
					@keyframes slideDown {
						from {
							opacity: 0;
							transform: translateY(-10px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
				`}
			</style>
			<div style={styles.pageWrapper}>
				<div style={styles.glowingOrb}></div>
				<div style={styles.glowingOrb2}></div>
			<div style={styles.container}>
				<div style={styles.header}>
					<div style={styles.titleWrapper}>
						<h1 style={styles.title}>{isEditMode ? "✏️ Edit Appointment" : "Schedule Your Meeting"}</h1>
					</div>
					<p style={styles.subtitle}>{isEditMode ? "Update your appointment details" : "Create appointments and invite your team with ease"}</p>
					<div style={styles.divider}></div>
				</div>

				<form onSubmit={handleSubmit} noValidate>
					<div style={styles.row}>
						<div style={styles.col}>
							<label htmlFor="title" style={styles.label}>
								<span style={styles.labelIcon}>📌</span> Meeting Title
							</label>
							<input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onFocus={() => setFocusedField("title")}
								onBlur={() => setFocusedField(null)}
								placeholder="e.g., Team Standup"
								style={{
									...styles.input,
									...(focusedField === "title" ? styles.inputFocus : {}),
								}}
							/>
							{errors.title && <div role="alert" style={styles.error}>❌ {errors.title}</div>}
						</div>
						<div style={{ width: 160 }}>
							<label htmlFor="duration" style={styles.label}>
								<span style={styles.labelIcon}>⏱️</span> Duration
							</label>
							<input
								id="duration"
								type="number"
								min={1}
								value={duration}
								onChange={(e) => setDuration(e.target.value)}
								onFocus={() => setFocusedField("duration")}
								onBlur={() => setFocusedField(null)}
								placeholder="30"
								style={{
									...styles.input,
									...(focusedField === "duration" ? styles.inputFocus : {}),
								}}
							/>
							{errors.duration && <div role="alert" style={styles.error}>❌ {errors.duration}</div>}
						</div>
					</div>

					<div style={styles.row}>
						<div style={{ ...styles.col, maxWidth: 240 }}>
							<label htmlFor="date" style={styles.label}>
								<span style={styles.labelIcon}>📆</span> Date
							</label>
							<input
								id="date"
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								onFocus={() => setFocusedField("date")}
								onBlur={() => setFocusedField(null)}
								style={{
									...styles.input,
									...(focusedField === "date" ? styles.inputFocus : {}),
								}}
							/>
							{errors.date && <div role="alert" style={styles.error}>❌ {errors.date}</div>}
						</div>

						<div style={{ ...styles.col, maxWidth: 180 }}>
							<label htmlFor="time" style={styles.label}>
								<span style={styles.labelIcon}>🕐</span> Time
							</label>
							<input
								id="time"
								type="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								onFocus={() => setFocusedField("time")}
								onBlur={() => setFocusedField(null)}
								style={{
									...styles.input,
									...(focusedField === "time" ? styles.inputFocus : {}),
								}}
							/>
							{errors.time && <div role="alert" style={styles.error}>❌ {errors.time}</div>}
						</div>
					</div>

					<div style={styles.fieldGroup}>
						<label htmlFor="attendees" style={styles.label}>
							<span style={styles.labelIcon}>👥</span> Attendees
						</label>
						<textarea
							id="attendees"
							value={attendees}
							onChange={(e) => setAttendees(e.target.value)}
							onFocus={() => setFocusedField("attendees")}
							onBlur={() => setFocusedField(null)}
							placeholder="email@example.com, another@example.com"
							style={{
								...styles.textarea,
								...(focusedField === "attendees" ? styles.textareaFocus : {}),
							}}
						/>
						<p style={styles.helperText}>
							💡 Separate multiple emails with commas, semicolons, or new lines
						</p>
					</div>

					<div style={styles.fieldGroup}>
						<label htmlFor="description" style={styles.label}>
							<span style={styles.labelIcon}>📝</span> Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							onFocus={() => setFocusedField("description")}
							onBlur={() => setFocusedField(null)}
							placeholder="Add meeting agenda, objectives, or important notes..."
							style={{
								...styles.textarea,
								...(focusedField === "description" ? styles.textareaFocus : {}),
							}}
						/>
					</div>

					{successMessage && (
						<div role="alert" style={styles.successMessage}>
							✨ {successMessage}
						</div>
					)}

					{serverError && (
						<div role="alert" style={styles.serverError}>
							⚠️ {serverError}
						</div>
					)}

					<div style={styles.formActions}>
						<button
							type="submit"
							style={{
								...styles.button,
								...(loading ? styles.buttonDisabled : {}),
							}}
							onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.buttonHover)}
							onMouseLeave={(e) => !loading && Object.assign(e.target.style, { transform: "none", boxShadow: "0 8px 20px rgba(102, 126, 234, 0.35)" })}
							disabled={loading}
						>
							{loading 
								? (isEditMode ? "🔄 Updating..." : "🔄 Creating Appointment...")
								: (isEditMode ? "💾 Update Appointment" : "✨ Create Appointment")
							}
						</button>
					</div>
				</form>
			</div>
			</div>
		</>
	);
}  

