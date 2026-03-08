import { useState, useRef, useEffect } from "react";
import { API } from "../services/api";

export default function AIChat() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  /* AUTO SCROLL */

  useEffect(() => {

    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }

  }, [chat]);

  /* SEND MESSAGE */

  const sendMessage = async () => {

    if (!message.trim() || loading) return;

    const userText = message;

    setChat(prev => [
      ...prev,
      { role: "user", text: userText }
    ]);

    setMessage("");
    setLoading(true);

    try {

      const res = await fetch(API.techbot, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText
        })
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      setChat(prev => [
        ...prev,
        { role: "bot", text: data.reply || "No response." }
      ]);

    } catch (error) {

      console.error(error);

      setChat(prev => [
        ...prev,
        { role: "bot", text: "TechBot server error." }
      ]);

    }

    setLoading(false);

  };

  /* ENTER KEY SUPPORT */

  const handleKey = (e) => {

    if (e.key === "Enter") {
      sendMessage();
    }

  };

  return (
    <div>

      {/* Floating button */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            padding: "14px 18px",
            borderRadius: "50px",
            border: "none",
            background: "linear-gradient(90deg,#6366f1,#9333ea)",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
          }}
        >
          🤖 TechBot
        </button>
      )}

      {/* Chat window */}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "320px",
            height: "420px",
            background: "#0f172a",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
          }}
        >

          {/* Header */}

          <div
            style={{
              padding: "12px",
              background: "#020617",
              color: "white",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            TechBot

            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}

          <div
            ref={chatRef}
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              color: "white",
              fontSize: "14px"
            }}
          >

            {chat.map((c, i) => (

              <div key={i} style={{ marginBottom: "10px" }}>

                {c.role === "user" && (
                  <div>
                    <b>You:</b> {c.text}
                  </div>
                )}

                {c.role === "bot" && (
                  <div style={{ color: "#8b5cf6" }}>
                    <b>TechBot:</b> {c.text}
                  </div>
                )}

              </div>

            ))}

            {loading && (
              <div style={{ color: "#9ca3af" }}>
                TechBot is typing...
              </div>
            )}

          </div>

          {/* Input */}

          <div style={{ display: "flex", borderTop: "1px solid #1e293b" }}>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                background: "#020617",
                color: "white"
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "10px 14px",
                border: "none",
                background: "#6366f1",
                color: "white",
                cursor: "pointer"
              }}
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  );
}