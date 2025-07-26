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
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
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
    <div className="container">
      <h2>Admin Panel: Leave Approvals</h2>
      <table className="leave-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Dates</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves && leaves.length > 0 ? (
            leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.userId.name}</td>
              <td>{leave.leaveType}</td>
              <td>
                {leave.startDate.slice(0, 10)} to {leave.endDate.slice(0, 10)}
              </td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === "Pending" ? (
                  <>
                    <button
                      className="button"
                      onClick={() => handleAction(leave._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="button"
                      style={{ backgroundColor: "#dc3545", marginLeft: "8px" }}
                      onClick={() => handleAction(leave._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <em>No Action</em>
                )}
              </td>
            </tr>
            ))
          ):(
            <tr>
            <td colSpan="7">No leave requests found.</td>
          </tr>
          )}
        </tbody>
      </table>
      <h3>Update User Leave Quota</h3>
      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        value={selectedUser}
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
      />

      <button className="button" onClick={handleUpdateQuota}>
        Update Quota
      </button>

    </div>
  );
}

export default AdminPanel;
