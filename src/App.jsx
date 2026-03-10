import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Chat from "./pages/Chat";

import DashboardHome from "./pages/DashboardHome";
import StudyReels from "./pages/StudyReels";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import ImageGenerator from "./pages/ImageGenerator";
import MyReels from "./pages/MyReels";
import UserProfile from "./pages/UserProfile";

/* NEW Social & Premium Pages */
import GlobalReels from "./pages/GlobalReels";
import Premium from "./pages/Premium";
import Network from "./pages/Network";

/* Components */
import AIChat from "./components/AIchat";

export default function App() {

  return (

    <BrowserRouter>

      {/* TechBot stays global so it appears everywhere */}
      <AIChat />

      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard Tools */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/study-reels" element={<StudyReels />} />
        <Route path="/dashboard/image-generator" element={<ImageGenerator />} />
        <Route path="/dashboard/my-reels" element={<MyReels />} />

        {/* Profiles */}
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/students" element={<Students />} />
        
        {/* Social public profile */}
        <Route path="/u/:username" element={<UserProfile />} />

        {/* NEW Social & Premium Routes */}
        <Route path="/dashboard/global-reels" element={<GlobalReels />} />
        <Route path="/dashboard/network" element={<Network />} />
        <Route path="/dashboard/chat" element={<Chat />} />
        <Route path="/premium" element={<Premium />} />

      </Routes>

    </BrowserRouter>

  );

}