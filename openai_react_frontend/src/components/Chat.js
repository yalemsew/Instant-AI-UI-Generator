import React, { useState } from "react";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    const response = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    const botMessage = { role: "assistant", content: data.choices[0].message.content };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat with OpenAI</h1>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid black", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10, color: msg.role === "user" ? "blue" : "green" }}>
            <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
