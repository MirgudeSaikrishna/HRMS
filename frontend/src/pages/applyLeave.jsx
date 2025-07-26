
import React, { useState } from "react";
import axios from "axios";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason) {
      alert("All fields are required.");
      return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    if (start < today || end < today) {
      alert("Dates must be in the future.");
      return;
    }

    if (start > end) {
      alert("Start date can't be after end date.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/leaves/apply",
        { leaveType, startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Leave applied!");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      console.error(err);
      alert("Failed to apply leave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Apply Leave</h2>
      <form onSubmit={handleSubmit}>
        <label>Leave Type</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option value="">Select</option>
          <option value="casual">Casual</option>
          <option value="sick">Sick</option>
        </select>

        <label>Start Date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End Date</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <label>Reason</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />

        <button type="submit" disabled={loading}>
          {loading ? "Applying..." : "Apply"}
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
