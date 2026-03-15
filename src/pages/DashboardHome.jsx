import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://nexus-api-q4u2.onrender.com";

export default function Dashboard() {
  const [profile, setProfile] = useState({
    displayName: "Student",
    exactHoursStudied: 0,
    totalMinutesStudied: 0
  });
  const [stats, setStats] = useState({
    reelsCount: 0,
    imagesCount: 0, 
    questionsCount: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserId = localStorage.getItem("firebaseUid") || "mock_uid_123"; 

    const fetchRealData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/api/users/${currentUserId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setProfile(userData);
        }

        const reelsRes = await fetch(`${API_URL}/reels?userId=${currentUserId}`);
        if (reelsRes.ok) {
          const reelsData = await reelsRes.json();
          setStats(prev => ({ ...prev, reelsCount: reelsData.length }));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 max-w-7xl mx-auto flex flex-col">
      
      {/* Welcome Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back,<br/>
            <span className="text-indigo-400">{profile.displayName} 👋</span>
          </h1>
          <p className="text-slate-400">Ready to crush your study goals today? Select a tool below to get started.</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
          👑 Upgrade to Pro
        </button>
      </div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-indigo-400 mb-1">
            {loading ? "..." : stats.reelsCount}
          </div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Study Reels Created</div>
        </div>
        
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {loading ? "..." : profile.exactHoursStudied || 0}
          </div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hours Studied</div>
        </div>
        
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {loading ? "..." : stats.questionsCount}
          </div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Questions Asked</div>
        </div>
        
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-emerald-400 mb-1">0 Days</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Streak</div>
        </div>
      </div>

      {/* Tools Section */}
      <h2 className="text-xl font-bold text-white mb-6">Your AI & Social Toolkit</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-4">🎬</div>
          <h3 className="text-lg font-bold text-white mb-2">Study Reels Generator</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Generate AI micro-lessons tailored to your syllabus.</p>
          {/* 👇 LINK 1: STUDY REELS */}
          <Link to="/dashboard/reels" className="text-indigo-400 font-medium text-sm hover:text-indigo-300">Launch tool →</Link>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-4">🌍</div>
          <h3 className="text-lg font-bold text-white mb-2">Global Feed</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Watch and learn from Reels published by students all over the world.</p>
          {/* 👇 LINK 2: GLOBAL FEED */}
          <Link to="/dashboard/feed" className="text-blue-400 font-medium text-sm hover:text-blue-300">Watch now →</Link>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4">🤝</div>
          <h3 className="text-lg font-bold text-white mb-2">Student Network</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Find friends, compare study hours, and connect with peers.</p>
          {/* 👇 LINK 3: STUDENT NETWORK (This one works!) */}
          <Link to="/dashboard/network" className="text-emerald-400 font-medium text-sm hover:text-emerald-300">Find friends →</Link>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4">🖼️</div>
          <h3 className="text-lg font-bold text-white mb-2">Visual Generator</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Generate complex diagrams, charts, and visual mind maps instantly.</p>
          {/* 👇 LINK 4: VISUAL GENERATOR */}
          <Link to="/dashboard/visuals" className="text-purple-400 font-medium text-sm hover:text-purple-300">Launch tool →</Link>
        </div>

      </div>
    </div>
  );
}