import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import NavigationBar from "../components/NavigationBar";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9ff 0%, #faf5ff 50%, #fdf4ff 100%)",
    padding: "40px 20px",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  statCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.1)",
    border: "2px solid rgba(168, 85, 247, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  statCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(124, 58, 237, 0.2)",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 500,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#7c3aed",
    margin: 0,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 24,
  },
  chartCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.1)",
    border: "2px solid rgba(168, 85, 247, 0.1)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 20,
  },
  loading: {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: 18,
    color: "#6b7280",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "16px 24px",
    borderRadius: "12px",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 500,
  },
};

// Colors for charts
const COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#e9d5ff"];

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
      <>
        {/* <NavigationBar /> */}
        <div style={styles.pageWrapper}>
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
          <div style={styles.container}>
            <div style={styles.error}>⚠️ {error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <NavigationBar /> */}
      <div style={styles.pageWrapper}>
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
