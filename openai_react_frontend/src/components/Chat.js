import React, { useState, useEffect } from "react";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("sessionId") || "");

  useEffect(() => {
    if (!sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      localStorage.setItem("sessionId", newSessionId);
    }
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "sessionId": sessionId,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Extract the assistant's response correctly from JSON
      const botMessageContent = data.content || "Error retrieving response";

      const botMessage = { role: "assistant", content: botMessageContent };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4">Chat with OpenAI</h1>
      <div className="flex-1 overflow-y-auto bg-gray-800 p-4 rounded-lg h-96">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 my-2 rounded-lg max-w-xs ${msg.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-green-500 text-white mr-auto"}`}
          >
            <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg text-black"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
