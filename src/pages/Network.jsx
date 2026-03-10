import { useState } from "react";

export default function Network() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Mock database results
  const [users, setUsers] = useState([
    { id: 1, name: "Rahul Sharma", username: "@rahuls", state: "Karnataka", country: "India", hours: 142, connections: 45 },
    { id: 2, name: "Priya Patel", username: "@priyap", state: "Maharashtra", country: "India", hours: 89, connections: 112 },
    { id: 3, name: "Alex Johnson", username: "@alexj", state: "California", country: "USA", hours: 210, connections: 8 },
  ]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Network</h1>
          <p className="text-slate-400">Find classmates and build your study groups.</p>
        </div>
        
        {/* Connection Stats */}
        <div className="flex gap-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">24</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Connections</div>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">1.2k</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Hours Studied</div>
          </div>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="card !p-4 mb-8 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search by username or display name..." 
          className="input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="State (e.g. Karnataka)" 
          className="input md:w-48"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Country" 
          className="input md:w-48"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        />
        <button className="btn md:w-32 bg-indigo-600 hover:bg-indigo-500">
          Search
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="card !p-6 flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4 p-1">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-2xl">
                🧑‍🎓
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-sm text-indigo-400 mb-4">{user.username}</p>
            
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/5">
                {user.state}, {user.country}
              </span>
            </div>

            <div className="w-full flex justify-between px-4 py-3 bg-slate-900/50 rounded-xl mb-6 text-sm">
              <div><strong className="text-white block">{user.connections}</strong> <span className="text-slate-500 text-xs">Friends</span></div>
              <div><strong className="text-white block">{user.hours}h</strong> <span className="text-slate-500 text-xs">Web Time</span></div>
            </div>

            <button className="w-full py-2.5 rounded-lg border border-indigo-500 text-indigo-400 font-semibold hover:bg-indigo-500 hover:text-white transition-all">
              + Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}