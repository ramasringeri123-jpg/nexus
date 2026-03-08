import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      alert("Signup successful ✅");

      // ✅ GO TO DASHBOARD
      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

 return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "radial-gradient(circle at 20% -10%, rgba(99,102,241,0.15), transparent 50%), #020617",
      color: "white"
    }}
  >
    <div
      style={{
        width: "420px",
        padding: "40px",
        borderRadius: "14px",
        background: "#0f172a",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}
    >
      <h2
        style={{
          marginBottom: "25px",
          fontSize: "26px",
          fontWeight: "600"
        }}
      >
        Create Account
      </h2>

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: "#020617",
            color: "white"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: "#020617",
            color: "white"
          }}
        />

        <button
          type="submit"
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
          Sign Up
        </button>

      </form>

      <p style={{ marginTop: "18px", fontSize: "14px" }}>
        Already have an account?{" "}
        <span
          style={{ color: "#6366f1", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  </div>
)};