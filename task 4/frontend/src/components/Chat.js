

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // 🔹 Load history
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/history/")
      .then(res => setChat(res.data.reverse()))
      .catch(() => {});
  }, []);

  // 🔹 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const res = await axios.post(
      "http://127.0.0.1:8000/api/chat/",
      { message }
    );

    setChat([...chat, res.data]);
    setMessage("");
  };

  // 🔹 Enter key send
  const handleKey = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{
      width: "400px",
      margin: "40px auto",
      border: "1px solid #ccc",
      borderRadius: "12px",
      overflow: "hidden",
      fontFamily: "Arial"
    }}>

      {/* Header */}
      <div style={{
        background: "#007bff",
        color: "#fff",
        padding: "12px",
        textAlign: "center",
        fontWeight: "bold"
      }}>
        🤖 AI Chat
      </div>

      {/* Chat area */}
      <div style={{
        height: "350px",
        overflowY: "auto",
        padding: "10px",
        background: "#f0f2f5"
      }}>
        {chat.map((c, i) => (
          <div key={i}>

            {/* User */}
            <div style={{ textAlign: "right", marginBottom: "5px" }}>
              <span style={{
                background: "#dcf8c6",
                padding: "8px 12px",
                borderRadius: "12px",
                display: "inline-block",
                maxWidth: "70%"
              }}>
                {c.user}
              </span>
            </div>

            {/* Bot */}
            <div style={{ textAlign: "left", marginBottom: "10px" }}>
              <span style={{
                background: "#fff",
                padding: "8px 12px",
                borderRadius: "12px",
                display: "inline-block",
                maxWidth: "70%"
              }}>
                {c.bot}
              </span>
            </div>

          </div>
        ))}

        {/* 🔹 Auto scroll anchor */}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        borderTop: "1px solid #ccc"
      }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            outline: "none"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}