import React from "react";
import { Link, useLocation } from "react-router-dom";

const navStyles = {
  navbar: {
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 15%, #7c3aed 40%, #a855f7 60%, #ec4899 85%, #f97316 100%)",
    backdropFilter: "blur(20px)",
    padding: "18px 40px",
    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4), 0 0 80px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid rgba(236, 72, 153, 0.4)",
    borderTop: "1px solid rgba(139, 92, 246, 0.3)",
  },
  brand: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 10,
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
  },
  navLinks: {
    display: "flex",
    gap: 12,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "600",
    fontSize: 15,
    padding: "10px 22px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  activeLink: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "#ffffff",
    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
  },
};

function Navigation() {
  const location = useLocation();

  return (
    <nav style={navStyles.navbar}>
      <Link 
        to="/" 
        style={navStyles.brand}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        📅 Scheduler App
      </Link>
      <ul style={navStyles.navLinks}>
        <li>
          <Link
            to="/"
            style={{
              ...navStyles.navLink,
              ...(location.pathname === "/" ? navStyles.activeLink : {}),
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/") {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/") {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            ➕ New Appointment
          </Link>
        </li>
        <li>
          <Link
            to="/ai-agent"
            style={{
              ...navStyles.navLink,
              ...(location.pathname === "/ai-agent" ? navStyles.activeLink : {}),
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/ai-agent") {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/ai-agent") {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            🤖 AI Agent
          </Link>
        </li>
        <li>
          <Link
            to="/schedules"
            style={{
              ...navStyles.navLink,
              ...(location.pathname === "/schedules" ? navStyles.activeLink : {}),
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/schedules") {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/schedules") {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            📋 View Schedules
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            style={{
              ...navStyles.navLink,
              ...(location.pathname === "/dashboard" ? navStyles.activeLink : {}),
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/dashboard") {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/dashboard") {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            💎 Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;