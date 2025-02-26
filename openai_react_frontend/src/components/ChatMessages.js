import React from "react";

const ChatMessages = ({ messages }) => {
    return (
        <div className="chat-messages">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`chat-bubble ${msg.role === "user" ? "chat-user" : "chat-bot"}`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} // Format message content
                ></div>
            ))}
        </div>
    );
};

// Function to format text into HTML-friendly format
const formatMessage = (content) => {
    // Convert **bold** text
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert numbered lists
    formattedContent = formattedContent.replace(
        /(\d+)\. (.*?)(?=\n\d+\.|\n*$)/g,
        '<div class="list-item"><span class="list-number">$1.</span> $2</div>'
    );

    // Convert new lines to proper line breaks
    formattedContent = formattedContent.replace(/\n/g, "<br>");

    return formattedContent;
};

export default ChatMessages;
