import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashBoard";
import MyLeaves from "./pages/myLeaves";
import AdminPanel from "./pages/adminPanel";
import PrivateRoute from "./components/privateRoute";
import AdminRoute from "./components/adminRoute";
import ApplyLeave from "./pages/applyLeave";
import Navbar from "./components/navbar";
import RealAdmin from "./pages/realAdmin"
import Home from "./pages/home"
import { useLocation } from "react-router-dom";


function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myleaves" element={<MyLeaves />} />
        <Route path="/manager" element={<AdminPanel />} />
        <Route path="/admin" element={<RealAdmin/>}/>
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/myleaves" element={
          <PrivateRoute><MyLeaves /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminPanel /></AdminRoute>
        } />
        <Route
          path="/apply"
          element={<PrivateRoute><ApplyLeave /></PrivateRoute>}
        />
      </Routes>
    </>
  );
}

export default App;
