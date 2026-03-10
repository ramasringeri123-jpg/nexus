export default function Premium() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Supercharge Your Learning
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Upgrade to NEXUS Premium to unlock unlimited AI generations, global reel publishing, and advanced group study features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Free Tier */}
        <div className="card border border-white/5 hover:border-slate-700 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-2">Basic Student</h2>
          <p className="text-slate-400 mb-6">Perfect for light studying.</p>
          <div className="text-4xl font-extrabold text-white mb-8">Free</div>
          
          <ul className="space-y-4 mb-8 text-slate-300">
            <li className="flex items-center gap-3">✅ 1 AI Study Reel per day</li>
            <li className="flex items-center gap-3">✅ 5 Image Generations per day</li>
            <li className="flex items-center gap-3">✅ Standard TechBot Chat</li>
            <li className="flex items-center gap-3 opacity-50">❌ Publish to Global Reels</li>
            <li className="flex items-center gap-3 opacity-50">❌ Create Study Groups</li>
          </ul>
          
          <button className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="card relative border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] transform md:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            MOST POPULAR
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">NEXUS Pro</h2>
          <p className="text-purple-300 mb-6">For power learners who want it all.</p>
          <div className="text-4xl font-extrabold text-white mb-8">₹499<span className="text-lg text-slate-400 font-medium">/mo</span></div>
          
          <ul className="space-y-4 mb-8 text-slate-200">
            <li className="flex items-center gap-3">🔥 <strong className="text-white">Unlimited</strong> AI Study Reels</li>
            <li className="flex items-center gap-3">🔥 <strong className="text-white">Unlimited</strong> Image Generations</li>
            <li className="flex items-center gap-3">🌍 Publish to Global Reels Feed</li>
            <li className="flex items-center gap-3">💬 Create Unlimited Study Groups</li>
            <li className="flex items-center gap-3">👑 Premium Profile Badge</li>
          </ul>
          
          <button className="btn">
            Upgrade to Pro
          </button>
        </div>

      </div>
    </div>
  );
}