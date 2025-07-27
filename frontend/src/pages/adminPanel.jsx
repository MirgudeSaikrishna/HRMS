import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newQuota, setNewQuota] = useState("");
  const token = localStorage.getItem("token");

  const fetchAllLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves);
    } catch (err) {
      alert("Failed to fetch leave requests");
    }
  };

  useEffect(() => {
    fetchAllLeaves();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/leave/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllLeaves();
    } catch (err) {
      alert("Failed to update leave status");
    }
  };

  const handleUpdateQuota = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser}/leave-quota`,
        { leaveQuota: newQuota },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Leave quota updated!");
      setNewQuota("");
      fetchUsers(); // refresh
    } catch (err) {
      alert("Failed to update quota");
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)",
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
        <h2 style={{ color: "#3b82f6", marginBottom: "24px", textAlign: "center" }}>
          Admin Panel: Leave Approvals
        </h2>

        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem"
            }}
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="New Quota"
            value={newQuota}
            onChange={e => setNewQuota(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              width: "120px"
            }}
          />
          <button
            onClick={handleUpdateQuota}
            style={{
              padding: "8px 18px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Update Quota
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "1rem",
              marginBottom: "10px"
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: "10px", borderRadius: "6px 0 0 6px" }}>User</th>
                <th style={{ padding: "10px" }}>Type</th>
                <th style={{ padding: "10px" }}>Dates</th>
                <th style={{ padding: "10px" }}>Reason</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px", borderRadius: "0 6px 6px 0" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves && leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    style={{
                      background: leave.status === "Approved"
                        ? "#e0fce0"
                        : leave.status === "Rejected"
                        ? "#fee2e2"
                        : "#f9fafb"
                    }}
                  >
                    <td style={{ padding: "10px", fontWeight: 500 }}>{leave.userId.name}</td>
                    <td style={{ padding: "10px" }}>{leave.leaveType}</td>
                    <td style={{ padding: "10px" }}>
                      {leave.startDate.slice(0, 10)} to {leave.endDate.slice(0, 10)}
                    </td>
                    <td style={{ padding: "10px" }}>{leave.reason}</td>
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
                    <td style={{ padding: "10px" }}>
                      {leave.status === "Pending" ? (
                        <>
                          <button
                            className="button"
                            style={{
                              background: "#3b82f6",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 14px",
                              fontWeight: 500,
                              cursor: "pointer",
                              marginRight: "8px"
                            }}
                            onClick={() => handleAction(leave._id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="button"
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 14px",
                              fontWeight: 500,
                              cursor: "pointer"
                            }}
                            onClick={() => handleAction(leave._id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <em style={{ color: "#64748b" }}>No Action</em>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "18px", color: "#64748b" }}>
                    No leave requests found.
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
export default AdminPanel;