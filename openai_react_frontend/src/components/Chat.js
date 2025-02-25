import React, { useState, useEffect } from "react";
import "./Chat.css"; // Import external CSS for styling

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    const response = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sessionId": sessionId
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    const botMessage = { role: "assistant", content: data.choices?.[0]?.message?.content || "No response from AI" };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h1>Chat with OpenAI</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "user-message" : "bot-message"}>
            <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
