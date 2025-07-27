import { useEffect, useState } from "react";
import axios from "axios";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        // Fetch leaves for the logged-in user
        const res = await axios.get("http://localhost:5000/api/leave/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (err) {
        setError("Failed to fetch leaves");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)"
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#3b82f6" }}>Loading your leave records...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 32px rgba(0,0,0,0.08)",
          padding: "36px 32px",
          minWidth: "350px",
          maxWidth: "95vw"
        }}
      >
        <h2 style={{ color: "#3b82f6", marginBottom: "18px", textAlign: "center" }}>
          My Leave Requests
        </h2>

        {error && <p style={{ color: "red", marginBottom: "18px" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "10px",
              fontSize: "1rem"
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: "10px", borderRadius: "6px 0 0 6px" }}>Type</th>
                <th style={{ padding: "10px" }}>Start</th>
                <th style={{ padding: "10px" }}>End</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px", borderRadius: "0 6px 6px 0" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave, idx) => (
                  <tr
                    key={leave._id || idx}
                    style={{
                      background: idx % 2 === 0 ? "#f9fafb" : "#fff"
                    }}
                  >
                    <td style={{ padding: "10px", fontWeight: 500 }}>{leave.leaveType}</td>
                    <td style={{ padding: "10px" }}>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        color:
                          leave.status === "Approved"
                            ? "#16a34a"
                            : leave.status === "Rejected"
                            ? "#ef4444"
                            : "#f59e42",
                        fontWeight: "bold"
                      }}
                    >
                      {leave.status}
                    </td>
                    <td style={{ padding: "10px" }}>{leave.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "18px", color: "#64748b" }}>
                    No leave records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default MyLeaves;