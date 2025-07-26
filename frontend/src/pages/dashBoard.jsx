import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


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
    <div className="container">
      <h2>Welcome {user?.name}</h2>
      <p>📦 Leave Balance: {user?.leaveQuota.Sick + user?.leaveQuota.Casual +user?.leaveQuota.Vacation} days</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Apply for Leave</h2>
        <Link to="/myleaves">View My Leaves</Link>
        <button onClick={handleLogout} className="button">Logout</button>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <select name="leaveType" value={form.leaveType} onChange={handleChange}>
          <option value="Sick">Sick</option>
          <option value="Casual">Casual</option>
          <option value="Vacation">Vacation</option>
          <option value="Academic">Academic</option>
          <option value="WFH">Work From Home</option>
          <option value="CompOff">Comp Off</option>
        </select>
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
        <textarea name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} required></textarea>
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
}

export default Dashboard;
