import React, { useState } from "react";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    padding: "60px 20px",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top: "-100px",
    right: "-100px",
    filter: "blur(60px)",
  },
  decorativeCircle2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.08)",
    bottom: "-80px",
    left: "-80px",
    filter: "blur(50px)",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
    position: "relative",
  },
  titleWrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    margin: 0,
    fontWeight: "400",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
    margin: "32px 0",
  },
  row: { 
    display: "flex", 
    gap: 20, 
    marginBottom: 28, 
    alignItems: "flex-start",
  },
  col: { flex: 1, display: "flex", flexDirection: "column" },
  fieldGroup: { display: "flex", flexDirection: "column", marginBottom: 28 },
  label: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  labelIcon: {
    fontSize: 18,
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
  },
  input: {
    padding: "14px 16px",
    fontSize: 15,
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#667eea",
    background: "#fff",
    boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-1px)",
  },
  textarea: {
    padding: "14px 16px",
    fontSize: 15,
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    minHeight: 110,
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    lineHeight: "1.6",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  textareaFocus: {
    outline: "none",
    borderColor: "#667eea",
    background: "#fff",
    boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-1px)",
  },
  button: {
    padding: "15px 36px",
    fontSize: 16,
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.35)",
    letterSpacing: "0.5px",
    position: "relative",
    overflow: "hidden",
  },
  buttonHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 28px rgba(102, 126, 234, 0.5)",
  },
  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
  },
  formActions: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginTop: 36,
    justifyContent: "center",
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 10,
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  serverError: {
    padding: "16px 18px",
    backgroundColor: "#fee2e2",
    border: "2px solid #fecaca",
    color: "#991b1b",
    borderRadius: "12px",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.15)",
  },
  successMessage: {
    padding: "16px 18px",
    backgroundColor: "#d1fae5",
    border: "2px solid #a7f3d0",
    color: "#065f46",
    borderRadius: "12px",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
    animation: "slideDown 0.4s ease-out",
  },
  helperText: {
    fontSize: 12,
    color: "#9ca3af",
    margin: "8px 0 0 0",
    fontStyle: "italic",
  },
};

function isISODate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default function AppForm({ onSuccess } = {}) {
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
		<div style={styles.pageWrapper}>
			<div style={styles.decorativeCircle1}></div>
			<div style={styles.decorativeCircle2}></div>
			<div style={styles.container}>
				<div style={styles.header}>
					<div style={styles.titleWrapper}>
						<h1 style={styles.title}>Schedule Your Meeting</h1>
					</div>
					<p style={styles.subtitle}>Create appointments and invite your team with ease</p>
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
							{loading ? "🔄 Creating Appointment..." : "✨ Create Appointment"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}  

