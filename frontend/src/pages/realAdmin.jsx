import { useEffect, useState } from "react";
import axios from "axios";

function RealAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newQuota, setNewQuota] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

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

  // Holiday list
  const holidays = [
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-01-26", name: "Republic Day" },
    { date: "2025-03-29", name: "Good Friday" },
    { date: "2025-08-15", name: "Independence Day" },
    { date: "2025-10-02", name: "Gandhi Jayanti" },
    { date: "2025-12-25", name: "Christmas" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 0"
      }}
    >
      {/* Main Panel */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 32px rgba(0,0,0,0.08)",
          padding: "36px 32px",
          minWidth: "350px",
          maxWidth: "95vw",
          marginRight: "32px"
        }}
      >
        <h2 style={{ color: "#3b82f6", marginBottom: "24px", textAlign: "center" }}>
          Update User Leave Quota
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
          <select
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              minWidth: "180px"
            }}
          >
            <option value="">Select User</option>
            {users && users.length > 0 ? (
              users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))
            ) : (
              <option disabled>No users available</option>
            )}
          </select>
          <input
            type="number"
            placeholder="New Quota"
            value={newQuota}
            onChange={(e) => setNewQuota(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              width: "120px"
            }}
          />
          <button
            className="button"
            onClick={handleUpdateQuota}
            style={{
              padding: "10px 24px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer"
            }}
            disabled={!selectedUser || !newQuota}
          >
            Update Quota
          </button>
        </div>
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ color: "#64748b", marginBottom: "10px" }}>All Users</h4>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "1rem"
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "8px", borderRadius: "6px 0 0 6px" }}>Name</th>
                  <th style={{ padding: "8px" }}>Email</th>
                  <th style={{ padding: "8px", borderRadius: "0 6px 6px 0" }}>Current Quota</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} style={{ background: "#f9fafb" }}>
                      <td style={{ padding: "8px" }}>{u.name}</td>
                      <td style={{ padding: "8px" }}>{u.email}</td>
                      <td style={{ padding: "8px" }}>
                        {u.leaveQuota?.Casual + u.leaveQuota?.Vacation + u.leaveQuota?.Sick?? "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "14px", color: "#64748b" }}>
                      No users available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Public Holidays Side Panel */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 32px rgba(0,0,0,0.08)",
          padding: "28px 24px",
          minWidth: "270px",
          maxHeight: "420px",
          overflowY: "auto"
        }}
      >
        <h4 style={{ color: "#3b82f6", marginBottom: "16px", textAlign: "center" }}>
          Public Holidays 2025
        </h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1rem"
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "8px", borderRadius: "6px 0 0 6px" }}>Date</th>
              <th style={{ padding: "8px", borderRadius: "0 6px 6px 0" }}>Holiday</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h, idx) => (
              <tr key={h.date} style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff" }}>
                <td style={{ padding: "8px", fontWeight: 500 }}>
                  {new Date(h.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "8px" }}>{h.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RealAdmin;