import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "40px"
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h1>NEXUS.</h1>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="#">Features</a>
          <a href="#">About</a>

          <Link to="/login">
            <button
              style={{
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px"
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button
              style={{
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px"
              }}
            >
              Signup
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ marginTop: "80px", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Learn anything <br /> with Nexus AI
        </h2>

        <p style={{ marginBottom: "30px" }}>
          Study faster with AI powered learning tools. Generate study reels,
          ask TechBot questions, and explore concepts from basic to advanced.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/signup">
            <button
              style={{
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px"
              }}
            >
              Start Learning
            </button>
          </Link>

          <Link to="/login">
            <button
              style={{
                background: "#1e293b",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px"
              }}
            >
              Explore Platform
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}