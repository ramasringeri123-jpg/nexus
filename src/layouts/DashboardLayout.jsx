import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import AIChat from "../components/AIchat";

export default function DashboardLayout() {

  return (

    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2 className="logo">NEXUS</h2>

        <nav>

          <Link className="nav-item" to="/dashboard">
            Dashboard
          </Link>

          <Link className="nav-item" to="/dashboard/study-reels">
            Study Reels
          </Link>

          <Link className="nav-item" to="/dashboard/image-generator">
            Image Generator
          </Link>

          <Link className="nav-item" to="/dashboard/my-reels">
            My Reels
          </Link>

          <Link className="nav-item" to="/dashboard/profile">
            Profile
          </Link>

          <Link className="nav-item" to="/dashboard/students">
            Students
          </Link>

        </nav>

        <div style={{ marginTop: "auto" }}>
          <LogoutButton />
        </div>

      </aside>

      {/* MAIN */}

      <main className="main">
        <Outlet />
      </main>

      <AIChat />

    </div>

  );
}