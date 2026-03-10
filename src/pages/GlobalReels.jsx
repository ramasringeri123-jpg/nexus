import { useState } from "react";

export default function GlobalReels() {
  // Mock data: This will later fetch from your MongoDB Global Reels collection
  const [globalFeed, setGlobalFeed] = useState([
    {
      id: 1,
      author: "@alexj",
      title: "Newton's Laws Explained",
      description: "A quick breakdown of classical mechanics for finals prep.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 342,
    },
    {
      id: 2,
      author: "@priyap",
      title: "Cell Mitosis Fast",
      description: "Biology 101: Understanding cellular division.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 89,
    }
  ]);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      
      {/* Absolute Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🌍 Global Reels
        </h1>
        <button className="text-sm font-semibold text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          Trending
        </button>
      </div>

      {/* Full Screen Scrollable Feed */}
      <div className="w-full max-w-md h-[100dvh] overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        
        {globalFeed.map((reel) => (
          <div key={reel.id} className="w-full h-full snap-start relative bg-slate-900 group">
            
            <video 
              src={reel.videoUrl} 
              className="w-full h-full object-cover"
              autoPlay
              muted // Required for browser autoplay
              loop 
              playsInline
            />

            {/* Video Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

            <div className="absolute bottom-8 left-4 right-16 z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 border border-white"></div>
                <span className="font-bold text-white text-lg">{reel.author}</span>
                <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-sm ml-2">PRO</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{reel.title}</h3>
              <p className="text-sm text-slate-200">{reel.description}</p>
            </div>

            {/* Social Action Buttons */}
            <div className="absolute bottom-8 right-4 flex flex-col items-center gap-6 z-10">
              <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-2xl">
                  ❤️
                </div>
                <span className="text-xs font-bold text-white">{reel.likes}</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-xl">
                  💬
                </div>
                <span className="text-xs font-bold text-white">Chat</span>
              </button>
            </div>

          </div>
        ))}
        
      </div>
    </div>
  );
}