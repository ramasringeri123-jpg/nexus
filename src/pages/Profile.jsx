import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function Profile() {

  const auth = getAuth();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setDisplayName(user.displayName || "");
      setUsername(user.displayName || "");
    }

    setLoading(false);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // here you can add firebase update logic later

      alert("Profile saved successfully");

    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }

    setSaving(false);
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "auto",
        padding: "40px"
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "30px"
        }}
      >
        Your Profile
      </h1>

      <form
        onSubmit={handleSave}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >

        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          style={inputStyle}
        />

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={inputStyle}
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          rows="3"
          style={inputStyle}
        />

        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          style={inputStyle}
        />

        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          style={inputStyle}
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "10px",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(90deg,#6366f1,#9333ea)",
            color: "white",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

      </form>
    </div>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  background: "#020617",
  color: "white"
};