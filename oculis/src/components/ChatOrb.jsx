import React, { useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";

const ChatOrb = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I am Oculis assistant. Ask me about your dream or roadmap.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userId = localStorage.getItem("oculis_user_id");

    // Add user message optimistically
    const newMessages = [
      ...messages,
      { from: "user", text: trimmed },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Convert UI messages -> chat format for backend
      const chatMessages = newMessages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages, userId }),
      });

      const data = await res.json();
      if (!data.ok) {
        console.error("Chat error:", data.error);
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text:
              "Sorry, I had trouble replying. Please try again in a moment.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: data.reply },
        ]);
      }
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Network error. Check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Show orb only when chat is closed */}
      {!open && (
        <OrbWrapper type="button" onClick={handleToggle}>
          <Loader />
        </OrbWrapper>
      )}

      {/* Chat panel when open */}
      {open && (
        <ChatOverlay>
          <ChatPanel>
            <ChatHeader>
              <span>Oculis Assistant</span>
              <button type="button" onClick={handleToggle}>
                ✕
              </button>
            </ChatHeader>

            <ChatBody>
              {messages.map((m, idx) => (
                <ChatMessage key={idx} $from={m.from}>
                  {m.text}
                </ChatMessage>
              ))}
            </ChatBody>

            <ChatInputForm onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type your question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit">Send</button>
            </ChatInputForm>
          </ChatPanel>
        </ChatOverlay>
      )}
    </>
  );
};

export default ChatOrb;

/* styled-components */

const OrbWrapper = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 150;
  border-radius: 50%;
  outline: none;

  transform: translateZ(0);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  &:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

const ChatOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 140;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  pointer-events: none;
`;

const ChatPanel = styled.div`
  width: 340px;
  max-width: 95vw;
  height: 420px;
  margin: 24px;
  border-radius: 18px;
  background: rgba(6, 4, 18, 0.96);
  color: #f7f4ff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;

  @media (max-width: 600px) {
    width: calc(100% - 32px);
    height: 70vh;
  }
`;

const ChatHeader = styled.div`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #034f5e, #6302bd);
  font-size: 0.9rem;
  font-weight: 500;

  button {
    border: none;
    background: transparent;
    color: #f7f4ff;
    cursor: pointer;
    font-size: 0.9rem;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 12px 12px 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
`;

const ChatMessage = styled.div`
  align-self: ${(p) => (p.$from === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
  padding: 7px 10px;
  border-radius: 14px;
  background: ${(p) =>
    p.$from === "user"
      ? "linear-gradient(135deg,#080568,#53238D)"
      : "rgba(255,255,255,0.07)"};
`;

const ChatInputForm = styled.form`
  padding: 8px 10px;
  display: flex;
  gap: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(5, 3, 14, 0.96);

  input {
    flex: 1;
    border-radius: 999px;
    border: none;
    padding: 7px 10px;
    font-size: 0.85rem;
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    color: #f7f4ff;
  }

  input::placeholder {
    color: rgba(240, 235, 255, 0.7);
  }

  button {
    border-radius: 999px;
    border: none;
    padding: 7px 14px;
    font-size: 0.85rem;
    cursor: pointer;
    background: linear-gradient(135deg, #034f5e, #6302bd);
    color: #ffffff;
  }
`;
