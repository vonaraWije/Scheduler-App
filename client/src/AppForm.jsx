import React, { useState } from "react";

const styles = {
	container: { maxWidth: 720, margin: "32px auto", padding: 20 },
	row: { display: "flex", gap: 12, marginBottom: 12, alignItems: "center" },
	col: { flex: 1, display: "flex", flexDirection: "column" },
	label: { marginBottom: 6, fontSize: 14, color: "#222" },
	input: { padding: 8, fontSize: 14, borderRadius: 4, border: "1px solid #ccc" },
	textarea: { padding: 8, fontSize: 14, borderRadius: 4, border: "1px solid #ccc", minHeight: 90 },
	button: { padding: "10px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
	error: { color: "#b91c1c", fontSize: 13, marginTop: 6 },
};

function isISODate(str) {
	// Basic YYYY-MM-DD check
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
		<div style={styles.container}>
			<h3>Create appointment</h3>
			<form onSubmit={handleSubmit} noValidate>
				<div style={styles.row}>
					<div style={styles.col}>
						<label htmlFor="title" style={styles.label}>
							Title
						</label>
						<input id="title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
						{errors.title && <div role="alert" style={styles.error}>{errors.title}</div>}
					</div>
					<div style={{ width: 180 }}>
						<label htmlFor="duration" style={styles.label}>
							Duration (min)
						</label>
						<input id="duration" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} style={styles.input} />
						{errors.duration && <div role="alert" style={styles.error}>{errors.duration}</div>}
					</div>
				</div>

				<div style={styles.row}>
					<div style={{ ...styles.col, maxWidth: 220 }}>
						<label htmlFor="date" style={styles.label}>Date</label>
						<input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
						{errors.date && <div role="alert" style={styles.error}>{errors.date}</div>}
					</div>

					<div style={{ ...styles.col, maxWidth: 160 }}>
						<label htmlFor="time" style={styles.label}>Time</label>
						<input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} style={styles.input} />
						{errors.time && <div role="alert" style={styles.error}>{errors.time}</div>}
					</div>
				</div>

				<div style={{ marginBottom: 12 }}>
					<label htmlFor="attendees" style={styles.label}>Attendees (comma, semicolon or newline separated emails)</label>
					<textarea id="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} style={styles.textarea} />
				</div>

				<div style={{ marginBottom: 12 }}>
					<label htmlFor="description" style={styles.label}>Description</label>
					<textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={styles.textarea} />
				</div>

				<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
					<button type="submit" style={styles.button} disabled={loading}>{loading ? "Creating..." : "Create appointment"}</button>
					{serverError && <div role="alert" style={styles.error}>{serverError}</div>}
				</div>
			</form>
		</div>
	);
}  

