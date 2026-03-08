import { useState } from "react";

export default function StudyReels() {

  const [topic, setTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eta, setEta] = useState(0);

  /* ===============================
  GENERATE VIDEO
  =============================== */

  const generateVideo = async () => {

    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setVideoUrl(null);

    /* estimated timer for user */

    let seconds = 35;
    setEta(seconds);

    const timer = setInterval(() => {
      seconds--;
      setEta(seconds);

      if (seconds <= 0) clearInterval(timer);
    }, 1000);

    try {

      const res = await fetch(
        "https://nexus-api-q4u2.onrender.com/generate-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ topic })
        }
      );

      const data = await res.json();

      clearInterval(timer);
      setEta(0);

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        setError("Video generation failed.");
      }

    } catch (err) {

      console.error(err);
      setError("Server error. Please try again.");

    }

    setLoading(false);

  };

  /* ===============================
  LOAD NEXT VIDEO
  =============================== */

  const loadNext = async () => {

    setLoading(true);
    setError("");

    try {

      const res = await fetch(
        "https://nexus-api-q4u2.onrender.com/reels"
      );

      const data = await res.json();

      if (data.reels && data.reels.length > 0) {
        setVideoUrl(data.reels[0].videoUrl);
      } else {
        setError("Next reel still rendering...");
      }

    } catch (err) {

      console.error(err);
      setError("Failed to load next reel.");

    }

    setLoading(false);

  };

  /* ===============================
  UI
  =============================== */

  return (

    <div
      style={{
        padding: "40px",
        color: "white"
      }}
    >

      <h1
        style={{
          fontSize: "34px",
          marginBottom: "20px"
        }}
      >
        AI Study Reels
      </h1>

      {/* INPUT */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px"
        }}
      >

        <input
          type="text"
          placeholder="Enter topic (example: Neural Network)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: "420px",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#0f172a",
            color: "white",
            fontSize: "16px"
          }}
        />

        <button
          onClick={generateVideo}
          disabled={loading}
          style={{
            padding: "14px 28px",
            borderRadius: "10px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Generate Reel
        </button>

      </div>

      {/* LOADING */}

      {loading && (

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "10px",
            width: "420px"
          }}
        >

          <p>🎬 Rendering video...</p>
          <p>🧠 Writing script...</p>
          <p>🖼 Generating images...</p>
          <p>🎞 Building final reel...</p>

          {eta > 0 && (
            <p style={{ marginTop: "10px", color: "#9ca3af" }}>
              Estimated time: {eta}s
            </p>
          )}

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div
          style={{
            marginTop: "20px",
            color: "#ef4444"
          }}
        >
          {error}
        </div>

      )}

      {/* VIDEO */}

      {videoUrl && (

        <div style={{ marginTop: "30px" }}>

          <video
            src={videoUrl}
            controls
            width="360"
            style={{
              borderRadius: "10px"
            }}
          />

          <div style={{ marginTop: "15px" }}>

            <button
              onClick={loadNext}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: "#10b981",
                color: "white",
                cursor: "pointer"
              }}
            >
              Next Video
            </button>

          </div>

        </div>

      )}

    </div>

  );

}