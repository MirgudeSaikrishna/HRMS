import { useEffect, useState } from "react";
import axios from "axios";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("");


  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/leave/mine", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaves(res.data.leaves);
      } catch (err) {
        alert("Failed to fetch leaves");
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="container">
      <h2>My Leave Requests</h2>

      {/* Filter dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="filter">Filter by Status: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {leaves
            .filter((leave) => (filter ? leave.status === filter : true))
            .map((leave, idx) => (
              <tr key={idx}>
                <td>{leave.leaveType}</td>
                <td>{leave.startDate.slice(0, 10)}</td>
                <td>{leave.endDate.slice(0, 10)}</td>
                <td>{leave.status}</td>
                <td>{leave.reason}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

}

export default MyLeaves;
