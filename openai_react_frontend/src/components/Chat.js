import React, { useState, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import "./Chat.css";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("sessionId") || "");

  useEffect(() => {
    if (!sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      localStorage.setItem("sessionId", newSessionId);
    }
  }, [sessionId]);

  // Dynamically inject AI-generated CSS
  useEffect(() => {
    if (generatedCSS) {
      const existingStyleTag = document.getElementById("dynamic-ai-style");
      if (existingStyleTag) {
        existingStyleTag.remove();
      }

      const styleTag = document.createElement("style");
      styleTag.id = "dynamic-ai-style";
      styleTag.innerHTML = generatedCSS;
      document.head.appendChild(styleTag);
    }
  }, [generatedCSS]);

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

      const botMessageContent = data.content || "Error retrieving response";
      const botMessage = { role: "assistant", content: botMessageContent };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Check if AI response contains valid HTML and CSS
      if (data.html && data.css) {
        setGeneratedHTML(data.html);
        console.log(data.html);
        setGeneratedCSS(data.css);
      } else {
        setGeneratedHTML(""); // Clear box if no valid HTML is found
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  return (
    <div className="main-container">
      {/* Left Side: Chat Messages */}
      <div className="chat-container">
        <h1 className="chat-title">Chat with OpenAI</h1>
        <ChatMessages messages={messages} />
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
      </div>

      {/* Right Side: AI-Generated UI Preview */}
      <div className="side-box">
        <h2>Generated UI</h2>
        <div className="preview-container">
          {generatedHTML ? (
            <div dangerouslySetInnerHTML={{ __html: generatedHTML }} />
          ) : (
            <p>No component generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
