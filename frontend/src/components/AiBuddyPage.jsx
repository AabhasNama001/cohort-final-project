import React, { useState, useEffect, useRef } from "react";
// THE FIX 1: Import the new service file, not api.js
import * as aiBuddyService from "../services/aiBuddy.service.js";

export default function AiBuddyPage() {
  const [messages, setMessages] = useState(() => {
    // Load previous chat from localStorage
    const saved = localStorage.getItem("aiBuddyChat");
    return saved ? JSON.parse(saved) : [];
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("aiBuddyChat", JSON.stringify(messages));
    // Auto-scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);
    try {
      // THE FIX 2: Use the new service function
      const data = await aiBuddyService.searchAI(userMsg.text);

      // THE FIX 3: 'data' is already the response data, not the full 'res' object
      let reply =
        data && data.ok
          ? data.reply
          : data?.error || "AI could not respond right now.";

      // 🧠 if backend sent a JSON string, parse it safely
      try {
        const parsed = JSON.parse(reply);
        if (parsed.reply) reply = parsed.reply;
      } catch (err) {
        // ignore if it's not JSON
      }

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Failed to connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-3xl mx-auto bg-[#efefbf] border-gray-200 shadow-xl rounded-3xl overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center font-semibold text-xl tracking-wide">
        🤖 AI Buddy
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center mt-20 text-lg">
            Start chatting with your AI Buddy ✨
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-500 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          rows="1"
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-xl font-medium hover:shadow-md active:scale-95 transition-all disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}
