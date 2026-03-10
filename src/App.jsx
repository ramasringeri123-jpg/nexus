import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

/* Ensure these filenames are CAPITALIZED in your src/pages folder */
import Chat from "./pages/Chat"; 
import Network from "./pages/Network";
import Premium from "./pages/Premium";
import GlobalReels from "./pages/GlobalReels";

import DashboardHome from "./pages/DashboardHome";
import StudyReels from "./pages/StudyReels";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import ImageGenerator from "./pages/ImageGenerator";
import MyReels from "./pages/MyReels";
import UserProfile from "./pages/UserProfile";

/* Components */
import AIChat from "./components/AIchat";

export default function App() {
  return (
    <BrowserRouter>
      {/* TechBot stays global so it appears everywhere */}
      <AIChat />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/premium" element={<Premium />} />

        {/* Dashboard & Tool Routes */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/study-reels" element={<StudyReels />} />
        <Route path="/dashboard/image-generator" element={<ImageGenerator />} />
        <Route path="/dashboard/my-reels" element={<MyReels />} />

        {/* Profiles & Community */}
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/students" element={<Students />} />
        <Route path="/u/:username" element={<UserProfile />} />

        {/* Social & Real-time Routes */}
        <Route path="/dashboard/global-reels" element={<GlobalReels />} />
        <Route path="/dashboard/network" element={<Network />} />
        <Route path="/dashboard/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}