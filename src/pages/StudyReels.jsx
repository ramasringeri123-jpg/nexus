import { useState } from "react";

export default function StudyReels() {

  const [topic, setTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  /* GENERATE VIDEO */

  const generateVideo = async () => {

    if (!topic) return;

    setLoading(true);
    setVideoUrl(null);

    const res = await fetch("http://localhost:5000/generate-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();

    if (data.videoUrl) {
      setVideoUrl(data.videoUrl);
    }

    setLoading(false);

  };

  /* NEXT VIDEO */

  const loadNext = async () => {

    setLoading(true);

    const res = await fetch("http://localhost:5000/reels");
    const data = await res.json();

    if (data.reels.length > 0) {
      setVideoUrl(data.reels[0].videoUrl);
    }

    setLoading(false);

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1 style={{
        fontSize: "34px",
        marginBottom: "20px",
        color: "white"
      }}>
        AI Study Reels
      </h1>

      {/* INPUT + BUTTON */}

      <div style={{
        display: "flex",
        gap: "15px",
        alignItems: "center"
      }}>

        <input
          type="text"
          placeholder="Enter topic (example: Quantum Physics)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: "420px",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#0f172a",
            color: "white",
            outline: "none",
            fontSize: "16px"
          }}
        />

        <button
          onClick={generateVideo}
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

        <div style={{
          marginTop: "30px",
          background: "#111827",
          padding: "20px",
          borderRadius: "10px",
          width: "420px",
          color: "#d1d5db"
        }}>

          <p>🎬 Rendering video...</p>
          <p>🧠 Writing script...</p>
          <p>🖼 Generating images...</p>
          <p>🎞 Building final reel...</p>

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