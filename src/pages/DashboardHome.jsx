import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* --- DASHBOARD HEADER --- */}
      <header className="mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Student</span> 👋
        </h1>
        <p className="text-slate-400">Ready to crush your study goals today? Select a tool below to get started.</p>
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

      {/* --- AI TOOLS GRID --- */}
      <h2 className="text-xl font-bold text-white mb-4">Your AI Toolkit</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Tool 1: Study Reels */}
        <Link to="/dashboard/study-reels" className="card group hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Study Reels</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Swipe through AI-generated micro-lessons tailored to your syllabus.</p>
          <span className="text-indigo-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Launch tool &rarr;
          </span>
        </Link>

        {/* Tool 2: Image Generator */}
        <Link to="/dashboard/image-generator" className="card group hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Visual Generator</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Generate complex diagrams, charts, and visual mind maps instantly.</p>
          <span className="text-purple-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Launch tool &rarr;
          </span>
        </Link>

        {/* Tool 3: Global TechBot / Chat */}
        <div className="card group hover:border-pink-500/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">TechBot Assistant</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">Your floating AI tutor is always active. Check the bottom corner of your screen!</p>
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