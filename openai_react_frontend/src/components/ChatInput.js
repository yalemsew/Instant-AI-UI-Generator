import React, { useState, useEffect } from "react";
const ChatInput = ({ input, setInput, sendMessage }) => {
    return (
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
    );
};

export default ChatInput;
