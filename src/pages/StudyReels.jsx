import { API } from "../services/api";
import { useState, useEffect } from "react";

export default function StudyReels() {

  const [topic, setTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(35);

  /* TIMER */

  useEffect(() => {

    if (!loading) return;

    setTimeLeft(35);

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [loading]);

  /* GENERATE VIDEO */

  const generateVideo = async () => {

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setVideoUrl(null);
    setError("");

    try {

      const res = await fetch(API.generateVideo, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      });

      if (!res.ok) {
        throw new Error("Server response error");
      }

      const data = await res.json();

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

  /* LOAD NEXT VIDEO */

  const loadNext = async () => {

    setLoading(true);
    setError("");

    try {

      const res = await fetch(API.reels);

      if (!res.ok) {
        throw new Error("Failed to fetch reels");
      }

      const data = await res.json();

      if (data.reels && data.reels.length > 0) {
        setVideoUrl(data.reels[0].videoUrl);
      } else {
        setError("Next video is still rendering...");
      }

    } catch (err) {

      console.error(err);
      setError("Failed to load next reel.");

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

          <p style={{
            marginTop: "10px",
            color: "#22c55e"
          }}>
            ⏳ Estimated time: {timeLeft}s
          </p>

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div style={{
          marginTop: "20px",
          color: "#ef4444"
        }}>
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