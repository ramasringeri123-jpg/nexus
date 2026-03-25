import React from "react";

export default function StudyReelsButton({ onClick, isLoading, text = "Generate Study Reel" }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative w-full md:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] ${
        isLoading
          ? "bg-slate-800 border border-indigo-500/30 cursor-not-allowed opacity-80"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98]"
      }`}
    >
      {isLoading ? (
        <>
          {/* Loading Spinner */}
          <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse text-indigo-300">Building your video...</span>
        </>
      ) : (
        <>
          <span className="text-xl">🎬</span>
          {text}
        </>
      )}
    </button>
  );
}