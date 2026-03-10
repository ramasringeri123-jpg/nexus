import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Chat() {
  const [activeChat, setActiveChat] = useState("general");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Mock Conversations (Left Sidebar) - Will fetch from MongoDB later
  const conversations = [
    { id: "general", name: "Global Study Lounge", type: "group", avatar: "🌍", unread: 0 },
    { id: "cs101", name: "CS 101 Group", type: "group", avatar: "💻", unread: 3 },
    { id: "user1", name: "Priya Patel", type: "direct", avatar: "👩", unread: 1 },
    { id: "user2", name: "Alex Johnson", type: "direct", avatar: "🧑", unread: 0 },
  ];

  // Mock Messages (Right Panel) - Will fetch from MongoDB later
  const [messages, setMessages] = useState([
    { id: 1, senderId: "user2", senderName: "Alex Johnson", text: "Hey! Did anyone understand the physics lecture today?", time: "10:30 AM", isMe: false },
    { id: 2, senderId: "me", senderName: "You", text: "Not really, I generated a Study Reel about it though, it helped a lot.", time: "10:32 AM", isMe: true },
    { id: 3, senderId: "user1", senderName: "Priya Patel", text: "Can you share the link to that reel?", time: "10:35 AM", isMe: false },
  ]);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add message to UI instantly
    setMessages([...messages, {
      id: Date.now(),
      senderId: "me",
      senderName: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    
    setMessage("");
    // In Phase 3, we will emit this message to Socket.io here!
  };

  // Find the currently active chat details
  const currentChatDetails = conversations.find(c => c.id === activeChat) || conversations[0];

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 max-w-7xl mx-auto flex flex-col">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Messages</h1>
          <p className="text-slate-400 text-sm">Connect with friends and study groups.</p>
        </div>
        <Link to="/dashboard/network" className="btn bg-slate-800 hover:bg-slate-700 text-white border border-white/10">
          + Find Friends
        </Link>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-[70vh] min-h-[500px]">
        
        {/* --- LEFT SIDEBAR (Chats List) --- */}
        <div className="w-1/3 max-w-[320px] bg-[#020617]/50 border-r border-white/5 flex flex-col hidden md:flex">
          
          {/* Search */}
          <div className="p-4 border-b border-white/5">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 hide-scrollbar">
            {conversations.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                  activeChat === chat.id 
                    ? "bg-indigo-600/20 border-indigo-500/30" 
                    : "hover:bg-white/5 border-transparent"
                } border`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 shadow-inner ${
                  chat.type === 'group' ? 'bg-gradient-to-tr from-indigo-500 to-purple-500' : 'bg-slate-800 border border-white/10'
                }`}>
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">{chat.name}</h3>
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'text-indigo-300 font-medium' : 'text-slate-400'}`}>
                    {chat.unread > 0 ? 'New message received' : 'Click to view chat...'}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- RIGHT PANEL (Active Chat) --- */}
        <div className="flex-1 bg-[#020617] flex flex-col relative">
          
          {/* Chat Header */}
          <div className="h-[76px] border-b border-white/5 flex items-center px-6 justify-between bg-slate-900/30 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg border border-white/10">
                {currentChatDetails.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{currentChatDetails.name}</h2>
                  {currentChatDetails.type === 'group' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Group</span>
                  )}
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  {currentChatDetails.type === 'group' ? '124 Online' : 'Online'}
                </div>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                📞
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                ℹ️
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-gradient-to-b from-transparent to-indigo-900/5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"} animate-fade-in`}>
                {!msg.isMe && (
                  <span className="text-xs text-slate-400 ml-2 mb-1.5 font-medium">{msg.senderName}</span>
                )}
                <div 
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                    msg.isMe 
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm" 
                      : "bg-slate-800 text-slate-200 border border-white/5 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 mx-2 font-medium">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/50 backdrop-blur-md border-t border-white/5">
            <form onSubmit={sendMessage} className="flex gap-3 items-center">
              <button type="button" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors shrink-0">
                📎
              </button>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-black/50 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-500"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="h-12 w-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}