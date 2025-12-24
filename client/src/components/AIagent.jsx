import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  pageWrapper: {
    height: "calc(100vh - 64px)",
    background: "linear-gradient(135deg, #39445fff 0%, #706da1ff 50%, #312e81 100%)",
    padding: "40px 20px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "center",        // ← Centers vertically
    justifyContent: "center",    // ← Centers horizontally
    position: "relative",
    overflow: "auto",
  },
  splitContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    gap: "0",
  },
  centeredContainer: {
    maxWidth: "800px",           // ← Maximum width for centered content
    width: "100%",
    padding: "50px 60px",
    background: "rgba(30, 27, 75, 0.85)",
    backdropFilter: "blur(25px)",
    borderRadius: "28px",
    boxShadow: "0 25px 70px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.3)",
    border: "2px solid rgba(139, 92, 246, 0.4)",
    position: "relative",
    zIndex: 1,
  },
  leftPanel: {
    flex: "0 0 55%",
    padding: "40px",
    overflowY: "auto",
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    borderRight: "3px solid rgba(139, 92, 246, 0.3)",
    position: "relative",
  },
  rightPanel: {
    flex: "1",
    padding: "40px 30px",
    overflowY: "auto",
    background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
    position: "relative",
  },
  glowingOrb: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
    top: "10%",
    left: "-100px",
    filter: "blur(60px)",
    animation: "float 8s ease-in-out infinite",
  },
  glowingOrb2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
    bottom: "15%",
    right: "-80px",
    filter: "blur(50px)",
    animation: "float 6s ease-in-out infinite reverse",
  },
  header: {
    textAlign: "left",
    marginBottom: 35,
    position: "relative",
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
    display: "inline-block",
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "pulse 2s ease-in-out infinite",
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    background: "linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 8,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 14,
    color: "#a5b4fc",
    fontWeight: 400,
    lineHeight: "1.6",
  },
  rightHeader: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2px solid rgba(139, 92, 246, 0.2)",
  },
  rightTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#f0abfc",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  rightSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
  },
  nlpInputContainer: {
    marginBottom: 25,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#c4b5fd",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: "100%",
    padding: "18px 20px",
    fontSize: 15,
    border: "2px solid rgba(139, 92, 246, 0.4)",
    borderRadius: "14px",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    background: "rgba(30, 27, 75, 0.7)",
    color: "#e0e7ff",
    transition: "all 0.3s ease",
    marginBottom: 10,
  },
  inputFocus: {
    borderColor: "#a78bfa",
    background: "rgba(30, 27, 75, 0.9)",
    boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.2), 0 10px 25px rgba(139, 92, 246, 0.3)",
  },
  examples: {
    background: "rgba(30, 27, 75, 0.6)",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: 20,
    border: "1px solid rgba(139, 92, 246, 0.3)",
    backdropFilter: "blur(10px)",
  },
  examplesTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#f0abfc",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  exampleItem: {
    fontSize: 12,
    color: "#cbd5e1",
    marginBottom: 6,
    paddingLeft: 18,
    position: "relative",
    transition: "color 0.2s ease",
    cursor: "pointer",
  },
  exampleBullet: {
    position: "absolute",
    left: 0,
    color: "#8b5cf6",
  },
  button: {
    width: "100%",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
    position: "relative",
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  resultBox: {
    marginTop: 20,
    padding: "18px 20px",
    borderRadius: "12px",
    fontSize: 13,
    backdropFilter: "blur(10px)",
    border: "2px solid",
  },
  successBox: {
    background: "rgba(16, 185, 129, 0.15)",
    borderColor: "#10b981",
    color: "#6ee7b7",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    borderColor: "#ef4444",
    color: "#fca5a5",
  },
  warningBox: {
    background: "rgba(245, 158, 11, 0.15)",
    borderColor: "#f59e0b",
    color: "#fcd34d",
  },
  parsedDetails: {
    marginTop: 20,
    padding: "20px",
    background: "rgba(30, 27, 75, 0.7)",
    borderRadius: "14px",
    border: "2px solid rgba(139, 92, 246, 0.3)",
    backdropFilter: "blur(15px)",
  },
  detailRow: {
    display: "flex",
    marginBottom: 12,
    fontSize: 14,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontWeight: 600,
    color: "#c4b5fd",
    minWidth: "100px",
    fontSize: 13,
  },
  detailValue: {
    color: "#e0e7ff",
    fontSize: 14,
  },
  actionButtons: {
    display: "flex",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s ease",
  },
  confirmButton: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
  },
  cancelButton: {
    background: "rgba(100, 116, 139, 0.3)",
    color: "#cbd5e1",
    border: "2px solid rgba(100, 116, 139, 0.5)",
  },
  conflictWarning: {
    marginTop: 14,
    padding: "14px 18px",
    background: "rgba(245, 158, 11, 0.15)",
    border: "2px solid #f59e0b",
    borderRadius: "10px",
    fontSize: 12,
    color: "#fcd34d",
    fontWeight: 500,
  },
  suggestedSlots: {
    marginTop: 16,
    padding: "14px",
    background: "rgba(14, 165, 233, 0.15)",
    border: "2px solid #0ea5e9",
    borderRadius: "10px",
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#7dd3fc",
    marginBottom: 10,
  },
  slotButton: {
    padding: "8px 14px",
    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    marginRight: 8,
    marginBottom: 6,
    transition: "all 0.2s ease",
  },
  // Right panel styles
  // meetingCard: {
  //   background: "rgba(30, 27, 75, 0.6)",
  //   backdropFilter: "blur(15px)",
  //   borderRadius: "14px",
  //   padding: "20px",
  //   marginBottom: "16px",
  //   border: "2px solid rgba(139, 92, 246, 0.3)",
  //   transition: "all 0.3s ease",
  //   animation: "slideIn 0.5s ease-out",
  //   position: "relative",
  //   overflow: "hidden",
  // },
  // meetingCardGlow: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   height: "3px",
  //   background: "linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)",
  //   backgroundSize: "200% 100%",
  //   animation: "shimmer 3s linear infinite",
  // },
  // meetingTitle: {
  //   fontSize: "18px",
  //   fontWeight: "600",
  //   color: "#f0abfc",
  //   marginBottom: "12px",
  //   display: "flex",
  //   alignItems: "center",
  //   gap: "8px",
  // },
  // meetingInfo: {
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: "8px",
  // },
  // meetingInfoRow: {
  //   display: "flex",
  //   alignItems: "center",
  //   gap: "10px",
  //   fontSize: "13px",
  //   color: "#cbd5e1",
  // },
  // meetingIcon: {
  //   fontSize: "16px",
  //   minWidth: "20px",
  // },
  // emptyState: {
  //   textAlign: "center",
  //   padding: "60px 20px",
  //   color: "#64748b",
  // },
  // emptyIcon: {
  //   fontSize: "64px",
  //   marginBottom: "16px",
  //   opacity: 0.5,
  // },
  // emptyText: {
  //   fontSize: "16px",
  //   fontWeight: "500",
  //   marginBottom: "8px",
  //   color: "#94a3b8",
  // },
  // emptySubtext: {
  //   fontSize: "13px",
  //   color: "#64748b",
  // },
  // statsBar: {
  //   display: "flex",
  //   gap: "12px",
  //   marginBottom: "25px",
  //   flexWrap: "wrap",
  // },
  // statCard: {
  //   flex: "1",
  //   minWidth: "120px",
  //   background: "rgba(139, 92, 246, 0.15)",
  //   backdropFilter: "blur(10px)",
  //   padding: "16px",
  //   borderRadius: "10px",
  //   border: "1px solid rgba(139, 92, 246, 0.3)",
  // },
  // statNumber: {
  //   fontSize: "24px",
  //   fontWeight: "700",
  //   color: "#c4b5fd",
  //   display: "block",
  //   marginBottom: "4px",
  // },
  // statLabel: {
  //   fontSize: "11px",
  //   color: "#94a3b8",
  //   textTransform: "uppercase",
  //   letterSpacing: "0.5px",
  // },
};

export default function AIAgent() {
  const navigate = useNavigate();
  const [nlpText, setNlpText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "error", "warning"
  const [focusedField, setFocusedField] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [createdMeetings, setCreatedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments on component mount and after creation
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointments");
      if (response.ok) {
        const data = await response.json();
        // Sort by date and time, most recent first
        const sorted = data.sort((a, b) => {
          const dateCompare = new Date(b.date) - new Date(a.date);
          if (dateCompare !== 0) return dateCompare;
          return b.time.localeCompare(a.time);
        });
        setCreatedMeetings(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Parse natural language and check for conflicts
  const handleParse = async () => {
    if (!nlpText.trim()) {
      setMessage("Please enter a description of your meeting");
      setMessageType("error");
      return;
    }

    setProcessing(true);
    setMessage("");
    setMessageType("");
    setParsedData(null);
    setSuggestedSlots([]);

    try {
      // Parse natural language
      const parseResponse = await fetch("/api/appointments/ai/parse-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nlpText }),
      });

      if (!parseResponse.ok) {
        throw new Error("Failed to parse text");
      }

      const parseResult = await parseResponse.json();

      if (parseResult.success && parseResult.parsed) {
        setParsedData({
          ...parseResult.parsed,
          hasConflicts: parseResult.hasConflicts,
          conflicts: parseResult.conflicts || [],
          originalText: nlpText,
        });

        if (parseResult.hasConflicts) {
          setMessage(
            `⚠️ Time conflict detected with ${parseResult.conflicts.length} appointment(s)!`
          );
          setMessageType("warning");

  
          // Get alternative time slots
          const altResponse = await fetch("/api/appointments/ai/smart-schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: parseResult.parsed.date,
              duration: parseResult.parsed.duration,
              preferredStartTime: "09:00",
              preferredEndTime: "17:00",
            }),
          });

          if (altResponse.ok) {
            const altResult = await altResponse.json();
            if (altResult.allAvailableSlots && altResult.allAvailableSlots.length > 0) {
              setSuggestedSlots(altResult.allAvailableSlots.slice(0, 5));
            }
          }
        } else {
          setMessage("✅ AI successfully parsed your request! Time slot is available.");
          setMessageType("success");
        }
      } else {
        setMessage(
          parseResult.message ||
            "Could not understand your request. Try: 'meeting tomorrow at 2pm'"
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Parse error:", error);
      setMessage(`❌ Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setProcessing(false);
    }
  };

  // Apply suggested time slot
  const applySuggestedSlot = (slot) => {
    setParsedData({
      ...parsedData,
      time: slot.time,
      hasConflicts: false,
      conflicts: [],
    });
    setSuggestedSlots([]);
    setMessage("✅ Time updated! This slot is conflict-free.");
    setMessageType("success");
  };

  // Create the appointment
  const handleConfirm = async () => {
    if (!parsedData) return;

    try {
      setProcessing(true);
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: parsedData.title,
          date: parsedData.date,
          time: parsedData.time,
          duration: parsedData.duration,
          description: parsedData.description || parsedData.originalText,
          attendees: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create appointment");
      }

      setMessage("✅ Meeting created successfully!");
      setMessageType("success");

      // Refresh appointments list
      await fetchAppointments();

      // Reset and redirect after 2 seconds
      setTimeout(() => {
        setNlpText("");
        setParsedData(null);
        setSuggestedSlots([]);
        setMessage("");
        setMessageType("");
      }, 2000);
    } catch (error) {
      console.error("Create error:", error);
      setMessage(`❌ Failed to create meeting: ${error.message}`);
      setMessageType("error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setParsedData(null);
    setMessage("");
    setMessageType("");
    setSuggestedSlots([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !processing && !parsedData) {
      e.preventDefault();
      handleParse();
    }
  };

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
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <div style={styles.pageWrapper}>
        <div style={styles.glowingOrb}></div>
        <div style={styles.glowingOrb2}></div>
        
        <div style={styles.centeredContainer}>
          <div style={styles.header}>
            <span style={styles.headerIcon}>🤖✨</span>
            <h1 style={styles.title}>AI Scheduling Agent</h1>
            <p style={styles.subtitle}>
              Schedule meetings using natural language • Automatic conflict detection<br/>
              9 AM - 5 PM • Real-time preview
            </p>
          </div>

            <div style={styles.nlpInputContainer}>
              <label style={styles.label}>
                <span>💬</span>
                <span>Describe your meeting in plain English</span>
              </label>
              <input
                type="text"
                value={nlpText}
                onChange={(e) => setNlpText(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
                placeholder='e.g., "schedule a meeting 20th of this month 8 am"'
                style={{
                  ...styles.input,
                  ...(focusedField ? styles.inputFocus : {}),
                }}
                disabled={processing || parsedData}
              />
            </div>

            <div style={styles.examples}>
              <div style={styles.examplesTitle}>
                <span>💡</span>
                <span>Try these examples:</span>
              </div>
              <div style={styles.exampleItem} onClick={() => !parsedData && setNlpText("team meeting tomorrow at 2pm")}>
                <span style={styles.exampleBullet}>•</span>
                "team meeting tomorrow at 2pm"
              </div>
              <div style={styles.exampleItem} onClick={() => !parsedData && setNlpText("standup next Monday 9am for 15 minutes")}>
                <span style={styles.exampleBullet}>•</span>
                "standup next Monday 9am for 15 minutes"
              </div>
              <div style={styles.exampleItem} onClick={() => !parsedData && setNlpText("planning session 25th of this month 10:00")}>
                <span style={styles.exampleBullet}>•</span>
                "planning session 25th of this month 10:00"
              </div>
              <div style={styles.exampleItem} onClick={() => !parsedData && setNlpText("client sync in 3 days at 3pm for 1 hour")}>
                <span style={styles.exampleBullet}>•</span>
                "client sync in 3 days at 3pm for 1 hour"
              </div>
            </div>

            {!parsedData && (
              <button
                onClick={handleParse}
                disabled={processing || !nlpText.trim()}
                style={{
                  ...styles.button,
                  ...(processing || !nlpText.trim() ? styles.buttonDisabled : {}),
                }}
              >
                <span style={{ fontSize: 18 }}>✨</span>
                {processing ? "Parsing & Checking Conflicts..." : "Parse & Create Meeting"}
              </button>
            )}

            {message && (
              <div
                style={{
                  ...styles.resultBox,
                  ...(messageType === "success"
                    ? styles.successBox
                    : messageType === "warning"
                    ? styles.warningBox
                    : styles.errorBox),
                }}
              >
                {message}
              </div>
            )}

            {parsedData && (
              <div style={styles.parsedDetails}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#f0abfc",
                    marginBottom: 16,
                    fontSize: 15,
                  }}
                >
                  📋 Meeting Details:
                </div>
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Title:</div>
                  <div style={styles.detailValue}>{parsedData.title}</div>
                </div>
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Date:</div>
                  <div style={styles.detailValue}>{parsedData.date}</div>
                </div>
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Time:</div>
                  <div style={styles.detailValue}>{parsedData.time}</div>
                </div>
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Duration:</div>
                  <div style={styles.detailValue}>{parsedData.duration} minutes</div>
                </div>

                {parsedData.hasConflicts && suggestedSlots.length > 0 && (
                  <div style={styles.suggestedSlots}>
                    <div style={styles.suggestedTitle}>
                      ⏰ Available Alternative Times (9 AM - 5 PM):
                    </div>
                    {suggestedSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => applySuggestedSlot(slot)}
                        style={styles.slotButton}
                      >
                        {slot.time} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}

                {parsedData.hasConflicts && (
                  <div style={styles.conflictWarning}>
                    ⚠️ Warning: The requested time conflicts with existing appointments. 
                    Choose an alternative time above or proceed anyway.
                  </div>
                )}

                <div style={styles.actionButtons}>
                  <button
                    onClick={handleCancel}
                    style={{ ...styles.actionButton, ...styles.cancelButton }}
                    disabled={processing}
                  >
                    ✖️ Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    style={{ ...styles.actionButton, ...styles.confirmButton }}
                    disabled={processing}
                  >
                    {processing ? "Creating..." : "✓ Confirm & Create"}
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
