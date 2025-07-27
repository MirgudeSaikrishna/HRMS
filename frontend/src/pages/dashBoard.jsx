import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    leaveType: "Sick",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/leave/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // --- Leave Rules ---
    const today = new Date();
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    // 1. Sick Leave: Allow same day (before 2 PM)
    if (form.leaveType === "Sick") {
      if (
        start.toDateString() === today.toDateString() &&
        today.getHours() >= 14
      ) {
        alert("Same-day sick leave must be applied before 2 PM.");
        return;
      }
    }

    // 2. Casual/Vacation: Must apply at least 2 working days in advance
    if (form.leaveType === "Casual" || form.leaveType === "Vacation") {
      // Calculate working days difference
      let diffDays = 0, temp = new Date(today);
      while (temp < start) {
        temp.setDate(temp.getDate() + 1);
        if (temp.getDay() !== 0 && temp.getDay() !== 6) diffDays++; // skip weekends
      }
      if (diffDays < 2) {
        alert("Casual/Vacation leave must be applied at least 2 working days in advance.");
        return;
      }
    }

    // 3. Beyond quota = LOP, 4. Max LOP days per year (e.g., 10)
    const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    let quota = user?.leaveQuota?.[form.leaveType] || 0;
    let lopUsed = user?.lopUsed || 0;
    let lopNeeded = Math.max(0, leaveDays - quota);

    if (lopNeeded > 0) {
      if (lopUsed + lopNeeded > 10) {
        alert("You have exceeded the maximum allowed LOP days (10) for this year.");
        return;
      }
      if (!window.confirm(`You are exceeding your quota. ${lopNeeded} day(s) will be marked as LOP. Continue?`)) {
        return;
      }
    }
    const isStartWeekend = start.getDay() === 0 || start.getDay() === 6;
    const isEndWeekend = end.getDay() === 0 || end.getDay() === 6;
    if (isStartWeekend || isEndWeekend) {
      const msg = "Selected start or end date falls on a weekend. Do you still want to continue?";
      if (!window.confirm(msg)) {
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/leave/apply", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Leave request submitted!");
      setForm({ leaveType: "Sick", startDate: "", endDate: "", reason: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
        <h2 style={{ color: "#3b82f6", marginBottom: "12px" }}>
          Welcome {user?.name}
        </h2>
        <div style={{ marginBottom: "18px" }}>
          <span style={{ fontWeight: 500, color: "#64748b" }}>
            📦 Leave Balance:{" "}
            <span style={{ color: "#16a34a" }}>
              {user?.leaveQuota?.Sick + user?.leaveQuota?.Casual + user?.leaveQuota?.Vacation} days
            </span>
          </span>
          <br />
          <span style={{ fontWeight: 500, color: "#64748b" }}>
            💸 LOP Used:{" "}
            <span style={{ color: "#ef4444" }}>
              {user?.lopUsed || 0} / 10 days
            </span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px"
          }}
        >
          <h3 style={{ margin: 0, color: "#0f172a" }}>Apply for Leave</h3>
          <div>
            <Link to="/myleaves" style={{ marginRight: "12px", color: "#3b82f6", textDecoration: "underline" }}>
              View My Leaves
            </Link>
            {user?.role === "Admin" && (
              <Link to="/admin">
                <button
                  style={{
                    marginLeft: "8px",
                    padding: "8px 18px",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Go to Admin Panel
                </button>
              </Link>
            )}
            {user?.role === "Manager" && (
              <Link to="/manager">
                <button
                  style={{
                    marginLeft: "8px",
                    padding: "8px 18px",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Go to Manager Panel
                </button>
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "8px",
                padding: "8px 18px",
                background: "#f59e42",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem"
            }}
          >
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
            <option value="Vacation">Vacation</option>
            <option value="Academic">Academic</option>
            <option value="WFH">Work From Home</option>
            <option value="CompOff">Comp Off</option>
          </select>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem"
            }}
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem"
            }}
          />
          <textarea
            name="reason"
            placeholder="Reason"
            value={form.reason}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              minHeight: "60px"
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              padding: "12px 0",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default Dashboard;