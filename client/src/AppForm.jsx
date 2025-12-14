import React, { useState } from "react";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  },
  container: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
  },
  header: {
    marginBottom: 32,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
  },
  row: { display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" },
  col: { flex: 1, display: "flex", flexDirection: "column" },
  fieldGroup: { display: "flex", flexDirection: "column", marginBottom: 24 },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  labelIcon: {
    fontSize: 16,
  },
  input: {
    padding: "12px 14px",
    fontSize: 14,
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    background: "#f9fafb",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#667eea",
    background: "#fff",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  textarea: {
    padding: "12px 14px",
    fontSize: 14,
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    background: "#f9fafb",
    minHeight: 100,
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s ease",
  },
  textareaFocus: {
    outline: "none",
    borderColor: "#667eea",
    background: "#fff",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    cursor: "pointer",
    accentColor: "#667eea",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    cursor: "pointer",
  },
  button: {
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: "600",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },
  formActions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 28,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  serverError: {
    padding: "12px 14px",
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "8px",
    fontSize: 14,
    fontWeight: "500",
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
			// Optionally clear form
			setTitle("");
			setDate("");
			setTime("");
			setDuration(30);
			setDescription("");
			setAttendees("");

			if (typeof onSuccess === "function") onSuccess();
			else window.location.href = "/"; // fallback navigation
		} catch (err) {
			setServerError(err.message || "Failed to create appointment.");
			setLoading(false);
		}
	}

	return (
		<div style={styles.pageWrapper}>
			<div style={styles.container}>
				<div style={styles.header}>
					<h1 style={styles.title}>📅 Schedule Meeting</h1>
					<p style={styles.subtitle}>Create a new appointment and invite attendees</p>
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
							placeholder="name@example.com&#10;another@example.com"
							style={{
								...styles.textarea,
								...(focusedField === "attendees" ? styles.textareaFocus : {}),
							}}
						/>
						<p style={{ fontSize: 12, color: "#9ca3af", margin: "6px 0 0 0" }}>
							Separate with commas, semicolons, or new lines
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
							placeholder="Add meeting details, agenda, or notes..."
							style={{
								...styles.textarea,
								...(focusedField === "description" ? styles.textareaFocus : {}),
							}}
						/>
					</div>

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
							onMouseLeave={(e) => Object.assign(e.target.style, { transform: "none" })}
							disabled={loading}
						>
							{loading ? "⏳ Creating..." : "✓ Create Appointment"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}  

