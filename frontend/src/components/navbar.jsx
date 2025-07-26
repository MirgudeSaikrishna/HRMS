import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const Navbar = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // assuming your JWT has a `role` field
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3 className="logo">HRMS</h3>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/apply">Apply Leave</Link></li>
        <li><Link to="/myleaves">My Leaves</Link></li>
        {role === "admin" && <li><Link to="/admin">Admin Panel</Link></li>}
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
