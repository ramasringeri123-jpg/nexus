import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import AIChat from "../components/AIchat";

export default function DashboardLayout() {

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}

      <div
        style={{
          width: "220px",
          background: "#020617",
          padding: "30px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >

        <h2>NEXUS</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/study-reels">Study Reels</Link>
        <Link to="/dashboard/profile">Profile</Link>
        <Link to="/dashboard/students">Students</Link>
        <Link to="/dashboard/upgrade">Upgrade</Link>

        <div style={{ marginTop: "40px" }}>
          <LogoutButton />
        </div>

      </div>

      {/* Main Content */}

      <div style={{ flex: 1, padding: "40px" }}>
        <Outlet />
      </div>

      {/* TechBot only inside dashboard */}

      <AIChat />

    </div>
  );
}