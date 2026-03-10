import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Profile() {
  const auth = getAuth();

  // Your Firebase State
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  
  // New Avatar & Stats State
  const [avatar, setAvatar] = useState(null);
  const [hoursStudied, setHoursStudied] = useState(142); // Mock stat until Phase 3 DB is ready

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setDisplayName(user.displayName || "");
      // Defaulting username to display name for now, update if you have custom logic
      setUsername(user.displayName || ""); 
      // If user has a photo URL in Firebase, set it here
      if (user.photoURL) setAvatar(user.photoURL);
    }

    setLoading(false);
  }, [auth]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      // NOTE: Later in Phase 3, you will upload this 'file' to Firebase Storage here!
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // TODO: Add Firebase update logic here (updateProfile, firestore, etc.)
      
      // Simulate network delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3s

    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-slate-400 text-sm">Customize your public identity.</p>
          </div>
        </div>

        <div className="card !p-8 border border-white/5">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* --- AVATAR UPLOAD --- */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-indigo-500 overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🧑‍🎓</span>
                  )}
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Upload</span>
                </div>
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="text-white font-medium mb-1">Profile Picture</h3>
                <p className="text-xs text-slate-400 mb-2">JPG, GIF or PNG. Max size of 2MB.</p>
                <button type="button" className="text-indigo-400 text-sm font-semibold hover:underline relative">
                  Choose Image
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
                </button>
              </div>
            </div>

            {/* --- FORM FIELDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Display Name</label>
                <input 
                  type="text" 
                  className="input w-full bg-[#020617]" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  className="input w-full bg-[#020617]" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@username"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Bio</label>
                <textarea 
                  className="input w-full bg-[#020617] resize-none" 
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your classmates about yourself..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">State / Province</label>
                <input 
                  type="text" 
                  className="input w-full bg-[#020617]" 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Country</label>
                <input 
                  type="text" 
                  className="input w-full bg-[#020617]" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  className="input w-full bg-[#020617]" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91..."
                />
              </div>

            </div>

            {/* --- STATS DISPLAY (Read Only) --- */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/20 flex items-center justify-between mt-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Platform Activity</h4>
                <p className="text-xs text-slate-400">Exact time spent studying on NEXUS</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-indigo-400">{hoursStudied}</span>
                <span className="text-sm text-slate-500 ml-1">Hours</span>
              </div>
            </div>

            {/* --- SAVE BUTTON --- */}
            <div className="pt-6 flex items-center justify-between border-t border-white/5">
              {success ? (
                <span className="text-emerald-400 text-sm font-medium animate-fade-in flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Profile saved successfully!
                </span>
              ) : <span></span>}

              <button 
                type="submit" 
                disabled={saving}
                className="btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {saving ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
                    Saving...
                  </span>
                ) : "Save Profile"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}