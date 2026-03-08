import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/dashboard");

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617"
      }}
    >

      <div
        style={{
          width: "420px",
          padding: "40px",
          borderRadius: "12px",
          background: "#0f172a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          color: "white"
        }}
      >

        <h2 style={{ marginBottom: "25px" }}>
          Login
        </h2>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
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
            onChange={(e)=>setPassword(e.target.value)}
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
            disabled={loading}
            style={{
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg,#6366f1,#9333ea)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p style={{ marginTop: "18px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#6366f1" }}>
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}