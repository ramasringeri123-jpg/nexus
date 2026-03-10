import { useState, useRef, useEffect } from "react";
// Make sure this path to your API config is correct!
import { API } from "../services/api"; 

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference to auto-scroll to the bottom of the chat
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isLoading]);

  const sendMessage = async (e) => {
    // Allow sending via 'Enter' key or button click
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const userText = message;
    
    // Add user message to chat immediately
    setChat((prev) => [
      ...prev,
      { role: "user", text: userText }
    ]);
    
    setMessage("");
    setIsLoading(true);

    try {
      // Use your API configuration
      const res = await fetch(API.techbot, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();

      if (data.reply) {
        setChat((prev) => [
          ...prev,
          { role: "bot", text: data.reply }
        ]);
      } else {
        throw new Error("No reply received");
      }

    } catch (error) {
      console.error("TechBot Error:", error);
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Connection error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-50">
      
      {/* --- FLOATING TOGGLE BUTTON --- */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300 flex items-center justify-center group"
          aria-label="Open TechBot"
        >
          <svg className="w-6 h-6 text-white group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* --- CHAT WINDOW --- */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
          
          {/* Header */}
          <div className="h-16 bg-slate-950 border-b border-white/10 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-sm">🤖</span>
                </div>
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">TechBot Assistant</h3>
                <p className="text-green-400 text-xs font-medium">Online</p>
              </div>
            </div>
            
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat History Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth hide-scrollbar">
            
            {/* Welcome Message */}
            {chat.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-2xl">
                  👋
                </div>
                <p className="text-sm">Hi! I'm TechBot. Ask me anything about your studies.</p>
              </div>
            )}

            {/* Chat Bubbles */}
            {chat.map((c, i) => (
              <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    c.role === "user" 
                      ? "bg-indigo-600 text-white rounded-br-sm" // User Bubble
                      : "bg-slate-800 text-slate-200 rounded-bl-sm border border-white/5" // Bot Bubble
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl rounded-bl-sm border border-white/5 px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950 border-t border-white/10">
            <form 
              onSubmit={sendMessage}
              className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-indigo-500/50 transition-colors"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors shrink-0"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}