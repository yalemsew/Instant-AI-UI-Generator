import React, { useState, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import "./Chat.css";

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

            const botMessageContent = data.content || "Error retrieving response";
            const botMessage = { role: "assistant", content: botMessageContent };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setInput("");
    };

    return (
        <div className="main-container">
            <div className="chat-container">
                <h1 className="chat-title">Chat with OpenAI</h1>
                <ChatMessages messages={messages} />
                <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
            </div>
            <div className="side-box"></div>
        </div>
    );
};

export default Chat;