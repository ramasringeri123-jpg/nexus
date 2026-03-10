import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* --- DASHBOARD HEADER --- */}
      <header className="mb-10 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Student</span> 👋
          </h1>
          <p className="text-slate-400">Ready to crush your study goals today? Select a tool below to get started.</p>
        </div>
        
        {/* Upgrade Button */}
        <Link to="/premium" className="btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <span className="text-xl">👑</span> Upgrade to Pro
        </Link>
      </header>

      {/* --- QUICK STATS / OVERVIEW --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Study Reels Watched", value: "12", color: "text-indigo-400" },
          { label: "Images Generated", value: "24", color: "text-purple-400" },
          { label: "Questions Asked", value: "89", color: "text-pink-400" },
          { label: "Current Streak", value: "5 Days", color: "text-emerald-400" }
        ].map((stat, i) => (
          <div key={i} className="card !padding-6 flex flex-col justify-center items-center text-center !p-6">
            <span className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* --- AI & SOCIAL TOOLKIT GRID --- */}
      <h2 className="text-xl font-bold text-white mb-4">Your AI & Social Toolkit</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Tool 1: Study Reels */}
        <Link to="/dashboard/study-reels" className="card group hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🎬</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Study Reels Generator</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Swipe through AI-generated micro-lessons tailored to your syllabus.</p>
          <span className="text-indigo-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Launch tool &rarr;
          </span>
        </Link>

        {/* Tool 2: Global Reels (NEW) */}
        <Link to="/dashboard/global-reels" className="card group hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Global Feed</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Watch and learn from Reels published by students all over the world.</p>
          <span className="text-blue-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Watch now &rarr;
          </span>
        </Link>

        {/* Tool 3: Student Network (NEW) */}
        <Link to="/dashboard/network" className="card group hover:border-emerald-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Student Network</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Find friends, compare study hours, and connect with peers.</p>
          <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Find friends &rarr;
          </span>
        </Link>

        {/* Tool 4: Image Generator */}
        <Link to="/dashboard/image-generator" className="card group hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🖼️</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Visual Generator</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Generate complex diagrams, charts, and visual mind maps instantly.</p>
          <span className="text-purple-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Launch tool &rarr;
          </span>
        </Link>

        {/* Tool 5: Global TechBot / Chat */}
        <div className="card group hover:border-pink-500/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden lg:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">TechBot Assistant</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Your floating AI tutor is always active. Check the bottom corner of your screen to ask a question anytime!</p>
          <span className="text-pink-400 text-sm font-semibold flex items-center gap-1">
            Active Globally <span className="relative flex h-3 w-3 ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span></span>
          </span>
        </div>

      </div>

      {/* --- RECENT ACTIVITY SECTION --- */}
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      <div className="card !p-0 overflow-hidden">
        <ul className="divide-y divide-white/5">
          {[
            { action: "Generated a diagram for", subject: "Cellular Mitosis", time: "2 hours ago" },
            { action: "Connected with", subject: "@priyap", time: "5 hours ago" },
            { action: "Watched a Study Reel on", subject: "Quantum Computing Basics", time: "Yesterday" },
            { action: "Asked TechBot about", subject: "Python Array Methods", time: "2 days ago" },
          ].map((item, i) => (
            <li key={i} className="p-4 md:p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <p className="text-slate-300 text-sm md:text-base">
                  <span className="text-slate-500">{item.action}</span> <strong className="text-white font-medium">{item.subject}</strong>
                </p>
              </div>
              <span className="text-xs text-slate-500 ml-5 md:ml-0">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}