import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import NavigationBar from "../components/NavigationBar";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%),
      linear-gradient(135deg, #0a0e27 0%, #1a1625 25%, #1e1b4b 50%, #312e81 75%, #1e1439 100%)
    `,
    padding: "40px 20px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
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
    zIndex: 0,
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
    zIndex: 0,
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
    zIndex: 0,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    background: "linear-gradient(135deg, #a78bfa 0%, #f0abfc 50%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
    textShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
    filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
  },
  subtitle: {
    fontSize: 16,
    color: "#a5b4fc",
    margin: 0,
    fontWeight: 500,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  statCard: {
    background: "linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.85) 100%)",
    backdropFilter: "blur(20px)",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: `
      0 0 0 1px rgba(139, 92, 246, 0.3),
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 16px 48px rgba(139, 92, 246, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: "1px solid rgba(139, 92, 246, 0.4)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },
  statCardHover: {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: `
      0 0 0 1px rgba(139, 92, 246, 0.6),
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 20px 60px rgba(139, 92, 246, 0.4),
      0 0 30px rgba(139, 92, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
  },
  statIcon: {
    fontSize: 36,
    marginBottom: 12,
    filter: "drop-shadow(0 4px 12px rgba(139, 92, 246, 0.6))",
  },
  statLabel: {
    fontSize: 13,
    color: "#c4b5fd",
    fontWeight: 600,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: 36,
    fontWeight: 800,
    background: "linear-gradient(135deg, #f0abfc 0%, #e879f9 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    filter: "drop-shadow(0 2px 8px rgba(240, 171, 252, 0.4))",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 24,
  },
  chartCard: {
    background: "linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.85) 100%)",
    backdropFilter: "blur(20px)",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: `
      0 0 0 1px rgba(139, 92, 246, 0.3),
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 16px 48px rgba(139, 92, 246, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: "1px solid rgba(139, 92, 246, 0.4)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 700,
    background: "linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 20,
  },
  loading: {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: 18,
    color: "#c4b5fd",
    fontWeight: 600,
  },
  error: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    padding: "16px 24px",
    borderRadius: "12px",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 600,
    border: "2px solid #ef4444",
    backdropFilter: "blur(10px)",
  },
};

// Colors for charts
const COLORS = ["#8b5cf6", "#a855f7", "#ec4899", "#f0abfc", "#c084fc"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments/stats/dashboard");
      
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }
      
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>\n        <style>\n          {`\n            @keyframes float {\n              0%, 100% { transform: translateY(0px); }\n              50% { transform: translateY(-30px); }\n            }\n            @keyframes pulse {\n              0%, 100% { opacity: 1; transform: scale(1); }\n              50% { opacity: 0.7; transform: scale(1.1); }\n            }\n          `}\n        </style>
        {/* <NavigationBar /> */}
        <div style={styles.pageWrapper}>
          <div style={styles.glowingOrb}></div>
          <div style={styles.glowingOrb2}></div>
          <div style={styles.glowingOrb3}></div>
          <div style={styles.loading}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <div>Loading dashboard...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* <NavigationBar /> */}
        <div style={styles.pageWrapper}>
          <div style={styles.glowingOrb}></div>
          <div style={styles.glowingOrb2}></div>
          <div style={styles.glowingOrb3}></div>
          <div style={styles.container}>
            <div style={styles.error}>⚠️ {error}</div>
          </div>
        </div>
      </>
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
        `}
      </style>
      {/* <NavigationBar /> */}
      <div style={styles.pageWrapper}>
        <div style={styles.glowingOrb}></div>
        <div style={styles.glowingOrb2}></div>
        <div style={styles.glowingOrb3}></div>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>📊 Dashboard Analytics</h1>
            <p style={styles.subtitle}>Overview of your appointments and meetings</p>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div
              style={{
                ...styles.statCard,
                ...(hoveredCard === 1 ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.statIcon}>📅</div>
              <div style={styles.statLabel}>Total Meetings</div>
              <h2 style={styles.statValue}>{stats.totalMeetings}</h2>
            </div>

            <div
              style={{
                ...styles.statCard,
                ...(hoveredCard === 2 ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.statIcon}>⏱️</div>
              <div style={styles.statLabel}>Average Duration</div>
              <h2 style={styles.statValue}>{stats.avgDuration} min</h2>
            </div>

            <div
              style={{
                ...styles.statCard,
                ...(hoveredCard === 3 ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.statIcon}>🔥</div>
              <div style={styles.statLabel}>Busiest Day</div>
              <h2 style={{ ...styles.statValue, fontSize: 24 }}>{stats.busiestDay}</h2>
            </div>

            <div
              style={{
                ...styles.statCard,
                ...(hoveredCard === 4 ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.statIcon}>📈</div>
              <div style={styles.statLabel}>Meetings on Busiest Day</div>
              <h2 style={styles.statValue}>{stats.busiestDayCount}</h2>
            </div>
          </div>

          {/* Charts */}
          <div style={styles.chartsGrid}>
            {/* Weekly Meetings Bar Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>📊 Meetings per Week</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: "#ffffff", 
                      border: "2px solid #a855f7",
                      borderRadius: "8px",
                      fontFamily: "'Poppins', sans-serif"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="meetings" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Day Distribution Pie Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>🗓️ Meetings by Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.dayDistribution}
                    dataKey="count"
                    nameKey="day"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.day}: ${entry.count}`}
                  >
                    {stats.dayDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: "#ffffff", 
                      border: "2px solid #a855f7",
                      borderRadius: "8px",
                      fontFamily: "'Poppins', sans-serif"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Duration Distribution Bar Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>⏰ Meeting Duration Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.durationDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: "#ffffff", 
                      border: "2px solid #a855f7",
                      borderRadius: "8px",
                      fontFamily: "'Poppins', sans-serif"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Day Distribution Line Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>📈 Daily Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dayDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: "#ffffff", 
                      border: "2px solid #a855f7",
                      borderRadius: "8px",
                      fontFamily: "'Poppins', sans-serif"
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#7c3aed" 
                    strokeWidth={3}
                    dot={{ fill: "#a855f7", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
