import React from "react";
import { Link, useLocation } from "react-router-dom";

const navStyles = {
  navbar: {
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    backdropFilter: "blur(10px)",
    padding: "16px 32px",
    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navLinks: {
    display: "flex",
    gap: 16,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    fontSize: 15,
    padding: "10px 20px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  },
  activeLink: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
  },
};

function Navigation() {
  const location = useLocation();

  return (
    <nav style={navStyles.navbar}>
      <Link to="/" style={navStyles.brand}>
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
          >
            ➕ New Appointment
          </Link>
        </li>
        <li>
          <Link
            to="/schedules"
            style={{
              ...navStyles.navLink,
              ...(location.pathname === "/schedules" ? navStyles.activeLink : {}),
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
          >
            📊 Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;