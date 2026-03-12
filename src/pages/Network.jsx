import { useState, useEffect } from "react";

// Point to your live Render backend
const API_URL = import.meta.env.VITE_API_URL || "https://nexus-api-q4u2.onrender.com";

export default function Network() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  // Function to fetch real users from your MongoDB database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build the URL with search filters if they exist
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (searchState) params.append("state", searchState);
      if (searchCountry) params.append("country", searchCountry);

      const response = await fetch(`${API_URL}/api/network/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users the moment the page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Trigger search when user clicks the Search button
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 max-w-7xl mx-auto flex flex-col">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Student Network</h1>
          <p className="text-slate-400">Find classmates and build your study groups.</p>
        </div>
        
        {/* Real-time Stats Header */}
        <div className="flex bg-slate-900/50 border border-white/5 rounded-xl p-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{users.length}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Connections</div>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">Real</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Database</div>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search by username or display name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <input 
            type="text" 
            placeholder="State (e.g. Karnataka)" 
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
            className="w-full md:w-48 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <input 
            type="text" 
            placeholder="Country" 
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            className="w-full md:w-40 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Real Users Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading real network data...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-slate-900/30 rounded-xl border border-white/5">
          No users found. Try adjusting your search!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-slate-900/80 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:border-indigo-500/30 transition-all shadow-xl">
              
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-indigo-500 p-1 mb-4 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl">🎓</span>
                )}
              </div>

              {/* User Info */}
              <h3 className="text-lg font-bold text-white">{user.displayName || "Anonymous Student"}</h3>
              <p className="text-indigo-400 text-sm mb-3">{user.username}</p>
              
              <div className="bg-white/5 rounded-full px-3 py-1 text-xs text-slate-300 mb-6 flex items-center gap-1.5">
                📍 {user.state || "Earth"}, {user.country || ""}
              </div>

              {/* Stats */}
              <div className="w-full flex justify-between bg-black/40 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-white font-bold">0</div>
                  <div className="text-slate-500 text-xs mt-1">Friends</div>
                </div>
                <div className="text-center">
                  {/* Calculate hours from total minutes stored in DB */}
                  <div className="text-white font-bold">{Math.floor((user.totalMinutesStudied || 0) / 60)}h</div>
                  <div className="text-slate-500 text-xs mt-1">Web Time</div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full py-2.5 rounded-lg border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-colors font-medium">
                + Connect
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}