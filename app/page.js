"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry! Something went wrong. Please try again.",
        },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="chat-container">
      <header className="chat-header">
        <div className="bot-icon">✦🪩</div>
        <div>
          <h2>Chatbot</h2>
          <p>Your AI assistant</p>
        </div>
      </header>

      <section className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome">
            <div className="welcome-icon">✦</div>
            <h1>Hello! How can I help you?</h1>
            <p>Ask me anything. I'm here to help!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user-message" : "bot-message"
            }`}
          >
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message bot-message">
            <div className="message-content typing">
              Gemini is thinking...
            </div>
          </div>
        )}
      </section>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? "..." : "Send ↑"}
        </button>
      </form>

      <p className="footer-text">
        Your personal AI assistant
      </p>
    </main>
  );
}