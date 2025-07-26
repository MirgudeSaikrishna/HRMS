import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 32px",
          borderRadius: "16px",
          boxShadow: "0 6px 32px rgba(0,0,0,0.08)",
          textAlign: "center",
          minWidth: "320px"
        }}
      >
        <h1 style={{ color: "#3b82f6", marginBottom: "24px" }}>Welcome to HRMS</h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>
          Human Resource Management System
        </p>
        <div>
          <Link to="/login">
            <button
              style={{
                marginRight: "20px",
                padding: "12px 36px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              Login
            </button>
          </Link>
          <Link to="/register">
            <button
              style={{
                padding: "12px 36px",
                background: "#f59e42",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;