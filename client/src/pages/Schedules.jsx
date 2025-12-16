import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fdf4ff 100%)",
    padding: "40px 20px 60px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  decorativeBlob1: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
    top: "-200px",
    right: "-150px",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  decorativeBlob2: {
    position: "fixed",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)",
    bottom: "-150px",
    left: "-100px",
    filter: "blur(70px)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    marginBottom: 48,
    textAlign: "center",
    position: "relative",
    animation: "fadeInDown 0.6s ease-out",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 16px 0",
    letterSpacing: "-1.5px",
    textShadow: "0 2px 20px rgba(124, 58, 237, 0.1)",
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    margin: 0,
    fontWeight: "500",
  },
  controls: {
    display: "flex",
    gap: 20,
    marginBottom: 40,
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    animation: "fadeIn 0.8s ease-out 0.2s both",
  },
  searchBox: {
    flex: "1 1 320px",
    padding: "16px 20px",
    fontSize: 15,
    borderRadius: "14px",
    border: "2px solid #e9d5ff",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)",
  },
  addButton: {
    padding: "16px 32px",
    fontSize: 16,
    fontWeight: "600",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 16px rgba(124, 58, 237, 0.35)",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: 28,
    marginBottom: 40,
    animation: "fadeIn 1s ease-out 0.4s both",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 6px 20px rgba(124, 58, 237, 0.12)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "2px solid #f3e8ff",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  cardHover: {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 16px 40px rgba(124, 58, 237, 0.25)",
    borderColor: "#e9d5ff",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 12px 0",
    lineHeight: 1.3,
    background: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  dateTime: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    padding: "8px 12px",
    background: "#faf5ff",
    borderRadius: "8px",
    fontWeight: "500",
  },
  badge: {
    display: "inline-block",
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: "600",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.7,
    marginBottom: 18,
    maxHeight: 60,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  attendees: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  attendeeChip: {
    padding: "6px 12px",
    fontSize: 12,
    background: "linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%)",
    color: "#7c3aed",
    borderRadius: "8px",
    fontWeight: "600",
    border: "1px solid #e9d5ff",
  },
  actions: {
    display: "flex",
    gap: 10,
    paddingTop: 18,
    borderTop: "2px solid #f3e8ff",
  },
  actionButton: {
    flex: 1,
    padding: "12px",
    fontSize: 14,
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  editButton: {
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "#ffffff",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#ffffff",
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 40px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(124, 58, 237, 0.12)",
    border: "2px solid #f3e8ff",
    backdropFilter: "blur(10px)",
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
    filter: "drop-shadow(0 4px 12px rgba(124, 58, 237, 0.2))",
  },
  emptyText: {
    fontSize: 20,
    color: "#6b7280",
    marginBottom: 32,
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: 20,
    color: "#7c3aed",
    fontWeight: "600",
  },
  error: {
    padding: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "12px",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.15)",
  },
};

export default function Schedules() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((apt) =>
        apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.attendees?.some((email) => email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAppointments(filtered);
    }
  }, [searchTerm, appointments]);

  async function fetchAppointments() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments");
      if (!res.ok) {
        throw new Error(`Failed to fetch appointments (${res.status})`);
      }
      const data = await res.json();
      setAppointments(data.data || data || []);
      setFilteredAppointments(data.data || data || []);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete appointment");
      }

      setAppointments((prev) => prev.filter((apt) => apt._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete appointment");
    }
  }

  function handleEdit(appointment) {
    // Navigate to edit page
    navigate(`/edit/${appointment._id}`);
  }

  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return dateStr;
    }
  }

  function formatTime(timeStr) {
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      });
    } catch {
      return timeStr;
    }
  }

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.loading}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div>Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.decorativeBlob1}></div>
      <div style={styles.decorativeBlob2}></div>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>💫 My Schedules</h1>
          <p style={styles.subtitle}>Manage and view all your appointments</p>
        </div>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="🔍 Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBox}
          />
          <button
            style={styles.addButton}
            onClick={() => navigate("/")}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px) scale(1.05)";
              e.target.style.boxShadow = "0 10px 24px rgba(124, 58, 237, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
              e.target.style.boxShadow = "0 6px 16px rgba(124, 58, 237, 0.35)";
            }}
          >
            ➕ New Appointment
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <div style={styles.emptyText}>
              {searchTerm ? "No appointments match your search" : "No appointments scheduled yet"}
            </div>
            {!searchTerm && (
              <button
                style={styles.addButton}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-4px) scale(1.05)";
                  e.target.style.boxShadow = "0 10px 24px rgba(124, 58, 237, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 6px 16px rgba(124, 58, 237, 0.35)";
                }}
              >
                Create Your First Appointment
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                style={{
                  ...styles.card,
                  ...(hoveredCard === appointment._id ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(appointment._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{...styles.cardAccent, opacity: hoveredCard === appointment._id ? 1 : 0}}></div>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{appointment.title}</h3>
                    <div style={styles.dateTime}>
                      <span>📅 {formatDate(appointment.date)}</span>
                      <span>•</span>
                      <span>🕐 {formatTime(appointment.time)}</span>
                    </div>
                  </div>
                  <span style={styles.badge}>{appointment.duration} min</span>
                </div>

                {appointment.description && (
                  <p style={styles.description}>{appointment.description}</p>
                )}

                {appointment.attendees && appointment.attendees.length > 0 && (
                  <div style={styles.attendees}>
                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                      👥 Attendees:
                    </span>
                    {appointment.attendees.slice(0, 3).map((email, idx) => (
                      <span key={idx} style={styles.attendeeChip}>
                        {email}
                      </span>
                    ))}
                    {appointment.attendees.length > 3 && (
                      <span style={styles.attendeeChip}>
                        +{appointment.attendees.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div style={styles.actions}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() => handleEdit(appointment)}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(124, 58, 237, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "none";
                      e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(appointment._id)}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "none";
                      e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
