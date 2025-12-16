import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white" />
  </svg>
);

function formatMessage(text) {
  if (!text) return "";

  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br/>")
    .replace(/\|\|/g, "<br/>")
    .replace(/\*\s/g, "• ");
}

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // const response = await fetch("https://mohitpal20.pythonanywhere.com/chat",
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: formatMessage(data.reply)
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error: Unable to reach server." }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI Assistant</h2>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}

        {loading && (
          <div className="chat-bubble bot typing">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
