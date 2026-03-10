import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing">

      {/* NAVBAR */}

      <nav className="navbar">
        <h1 className="logo">NEXUS</h1>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <Link to="/login">
            <button className="btn-secondary">Login</button>
          </Link>

          <Link to="/signup">
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}

      <section className="hero">

        <h1>
          AI Powered Learning <br />
          For The Future
        </h1>

        <p>
          Generate study reels, create AI images, and learn concepts
          faster with Nexus AI tools.
        </p>

        <div className="hero-buttons">
          <Link to="/signup">
            <button className="btn-primary">Start Free</button>
          </Link>

          <Link to="/login">
            <button className="btn-secondary">Explore</button>
          </Link>
        </div>

      </section>

      {/* FEATURES */}

      <section className="features" id="features">

        <div className="feature-card">
          🎬
          <h3>Study Reels</h3>
          <p>Create short AI learning videos instantly.</p>
        </div>

        <div className="feature-card">
          🖼
          <h3>AI Image Generator</h3>
          <p>Generate educational visuals for your learning.</p>
        </div>

        <div className="feature-card">
          🤖
          <h3>TechBot</h3>
          <p>Ask questions and learn concepts instantly.</p>
        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">
        © {new Date().getFullYear()} Nexus AI
      </footer>

    </div>
  );
}