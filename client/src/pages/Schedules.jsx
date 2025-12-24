import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%),
      linear-gradient(135deg, #0a0e27 0%, #1a1625 25%, #1e1b4b 50%, #312e81 75%, #1e1439 100%)
    `,
    padding: "40px 20px 60px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  backgroundPattern: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 20%),
      radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 30%),
      radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.15), transparent),
      radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(2px 2px at 90% 60%, rgba(255, 255, 255, 0.15), transparent),
      radial-gradient(1px 1px at 33% 50%, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(2px 2px at 79% 53%, rgba(255, 255, 255, 0.1), transparent)
    `,
    backgroundSize: "200% 200%, 200% 200%, 200% 200%, 550px 550px, 350px 350px, 250px 250px, 150px 150px, 400px 400px, 200px 200px, 300px 300px",
    backgroundPosition: "0% 0%, 100% 100%, 50% 50%, 0% 0%, 40% 60%, 130% 270%, 70% 100%, 20% 30%, 80% 80%, 50% 50%",
    pointerEvents: "none",
    zIndex: 0,
    animation: "moveStars 120s linear infinite",
  },
  glowingOrb: {
    position: "fixed",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(168, 85, 247, 0.3) 30%, transparent 70%)",
    top: "-250px",
    right: "-200px",
    filter: "blur(90px)",
    pointerEvents: "none",
    animation: "float 10s ease-in-out infinite",
    zIndex: 1,
  },
  glowingOrb2: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(219, 39, 119, 0.2) 30%, transparent 70%)",
    bottom: "-180px",
    left: "-120px",
    filter: "blur(80px)",
    pointerEvents: "none",
    animation: "float 8s ease-in-out infinite reverse",
    zIndex: 1,
  },
  glowingOrb3: {
    position: "fixed",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.15) 30%, transparent 70%)",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    filter: "blur(100px)",
    pointerEvents: "none",
    animation: "pulse 6s ease-in-out infinite",
    zIndex: 1,
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
    position: "relative",
    animation: "fadeInDown 0.6s ease-out",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    background: "linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 16px 0",
    letterSpacing: "-1.5px",
    animation: "pulse 2s ease-in-out infinite",
  },
  subtitle: {
    fontSize: 16,
    color: "#a5b4fc",
    margin: 0,
    fontWeight: "500",
  },
  controls: {
    display: "flex",
    gap: 20,
    marginBottom: 35,
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
    border: "2px solid rgba(139, 92, 246, 0.4)",
    background: "rgba(15, 23, 42, 0.7)",
    color: "#e0e7ff",
    backdropFilter: "blur(15px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
  },
  addButton: {
    padding: "16px 32px",
    fontSize: 16,
    fontWeight: "600",
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(139, 92, 246, 0.5)",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginBottom: 40,
    animation: "fadeIn 1s ease-out 0.4s both",
  },
  card: {
    background: "linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.85) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: `
      0 0 0 1px rgba(139, 92, 246, 0.2),
      0 10px 40px rgba(0, 0, 0, 0.4),
      0 20px 60px rgba(139, 92, 246, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(139, 92, 246, 0.4)",
    position: "relative",
    overflow: "hidden",
    animation: "slideIn 0.5s ease-out",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "3px",
    background: "linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)",
    backgroundSize: "200% 100%",
    animation: "shimmer 3s linear infinite",
  },
  cardHover: {
    transform: "translateY(-6px) scale(1.01)",
    boxShadow: `
      0 0 0 1px rgba(139, 92, 246, 0.5),
      0 15px 50px rgba(0, 0, 0, 0.5),
      0 25px 80px rgba(139, 92, 246, 0.4),
      0 0 40px rgba(139, 92, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    borderColor: "rgba(139, 92, 246, 0.7)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    background: "linear-gradient(135deg, #f0abfc 0%, #e879f9 50%, #d946ef 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 12px 0",
    lineHeight: 1.3,
    textShadow: "0 2px 10px rgba(240, 171, 252, 0.3)",
    filter: "drop-shadow(0 0 8px rgba(240, 171, 252, 0.4))",
  },
  dateTime: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "#e0e7ff",
    marginBottom: 14,
    padding: "10px 14px",
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)",
    borderRadius: "10px",
    fontWeight: "500",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    backdropFilter: "blur(10px)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: "600",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(139, 92, 246, 0.4)",
  },
  description: {
    fontSize: 14,
    color: "#e0e7ff",
    lineHeight: 1.7,
    marginBottom: 16,
    maxHeight: 60,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  attendees: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  attendeeChip: {
    padding: "6px 12px",
    fontSize: 12,
    background: "rgba(139, 92, 246, 0.2)",
    color: "#c4b5fd",
    borderRadius: "8px",
    fontWeight: "600",
    border: "1px solid rgba(139, 92, 246, 0.4)",
  },
  actions: {
    display: "flex",
    gap: 10,
    paddingTop: 16,
    borderTop: "2px solid rgba(139, 92, 246, 0.2)",
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
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  editButton: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    color: "#ffffff",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#ffffff",
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 40px",
    background: "rgba(30, 27, 75, 0.6)",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
    border: "2px solid rgba(139, 92, 246, 0.3)",
    backdropFilter: "blur(15px)",
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
    filter: "drop-shadow(0 4px 12px rgba(139, 92, 246, 0.4))",
  },
  emptyText: {
    fontSize: 20,
    color: "#94a3b8",
    marginBottom: 32,
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: 20,
    color: "#c4b5fd",
    fontWeight: "600",
  },
  error: {
    padding: "20px",
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    borderRadius: "12px",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 24,
    boxShadow: "0 6px 20px rgba(239, 68, 68, 0.3)",
    backdropFilter: "blur(10px)",
    border: "2px solid #ef4444",
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
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes moveStars {
            0% { background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%, 40% 60%, 130% 270%, 70% 100%, 20% 30%, 80% 80%, 50% 50%; }
            100% { background-position: 100% 100%, 0% 0%, 0% 0%, 20% 20%, 60% 80%, 150% 290%, 90% 120%, 40% 50%, 100% 100%, 70% 70%; }
          }
        `}
      </style>
      <div style={styles.pageWrapper}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.glowingOrb}></div>
        <div style={styles.glowingOrb2}></div>
        <div style={styles.glowingOrb3}></div>
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
                <div style={styles.cardAccent}></div>
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
    </>
  );
}
