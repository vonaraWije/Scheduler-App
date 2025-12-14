import React, { useState } from "react";

const styles = {
	container: {
		maxWidth: 420,
		margin: "48px auto",
		padding: 24,
		border: "1px solid #e6e6e6",
		borderRadius: 8,
		boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
		fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
	},
	field: { display: "flex", flexDirection: "column", marginBottom: 16 },
	label: { marginBottom: 6, fontSize: 14, color: "#333" },
	input: {
		padding: "10px 12px",
		fontSize: 14,
		borderRadius: 4,
		border: "1px solid #ccd0d5",
	},
	button: {
		width: "100%",
		padding: 10,
		fontSize: 15,
		borderRadius: 6,
		border: "none",
		background: "#2563eb",
		color: "white",
		cursor: "pointer",
	},
	error: { color: "#b91c1c", fontSize: 13, marginTop: 6 },
	hint: { fontSize: 13, color: "#666", marginTop: 8 },
};

function validateEmail(email) {
	return /^[\w-.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState("");

	function clientValidate() {
		const e = {};
		if (!email) e.email = "Email is required.";
		else if (!validateEmail(email)) e.email = "Please enter a valid email.";
		if (!password) e.password = "Password is required.";
		else if (password.length < 6) e.password = "Password must be at least 6 characters.";
		return e;
	}

	async function handleSubmit(ev) {
		ev.preventDefault();
		setServerError("");
		const e = clientValidate();
		setErrors(e);
		if (Object.keys(e).length) return;

		setLoading(true);
		try {
			// Adjust the URL to match your server's login endpoint
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, remember }),
			});

			if (!res.ok) {
				const payload = await res.json().catch(() => ({}));
				throw new Error(payload.message || `Login failed (${res.status})`);
			}

			// on success, redirect to the app home (change as needed)
			window.location.href = "/";
		} catch (err) {
			setServerError(err.message || "Login failed");
			setLoading(false);
		}
	}

	return (
		<div style={styles.container}>
			<h2 style={{ marginTop: 0 }}>Sign in</h2>
			<form onSubmit={handleSubmit} noValidate>
				<div style={styles.field}>
					<label htmlFor="email" style={styles.label}>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						style={styles.input}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "email-error" : undefined}
					/>
					{errors.email && (
						<div id="email-error" role="alert" style={styles.error}>
							{errors.email}
						</div>
					)}
				</div>

				<div style={styles.field}>
					<label htmlFor="password" style={styles.label}>
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={styles.input}
						aria-invalid={!!errors.password}
						aria-describedby={errors.password ? "password-error" : undefined}
					/>
					{errors.password && (
						<div id="password-error" role="alert" style={styles.error}>
							{errors.password}
						</div>
					)}
				</div>

				<div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
					<input
						id="remember"
						type="checkbox"
						checked={remember}
						onChange={(e) => setRemember(e.target.checked)}
						style={{ marginRight: 8 }}
					/>
					<label htmlFor="remember" style={{ fontSize: 13, color: "#333" }}>
						Remember me
					</label>
				</div>

				<button type="submit" style={styles.button} disabled={loading}>
					{loading ? "Signing in..." : "Sign in"}
				</button>

				{serverError && (
					<div role="alert" aria-live="assertive" style={styles.error}>
						{serverError}
					</div>
				)}

				<div style={styles.hint}>
					Don’t have an account? <a href="/register">Register</a>
				</div>
			</form>
		</div>
	);
}

