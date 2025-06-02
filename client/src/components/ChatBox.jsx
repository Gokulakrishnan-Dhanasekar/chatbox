import React, { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [model, setModel] = useState("mistralai/mistral-7b-instruct");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableModels = [
    "mistralai/mistral-7b-instruct",
    "openai/gpt-3.5-turbo",
    "openai/gpt-4",
    "meta-llama/llama-2-70b-chat",
    "google/gemini-2.0-flash-001"  
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/chat", {
        model,
        prompt,
      });

      const aiMessage = { role: "assistant", content: res.data.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "⚠️ Error fetching response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🧠 Chatbot</h1>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {availableModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 self-end ml-auto"
                : "bg-white self-start mr-auto border"
            }`}
          >
            <p className="whitespace-pre-line text-gray-800 text-sm leading-relaxed">
              {msg.content}
            </p>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 bg-white border px-4 py-3 rounded-lg w-max animate-pulse">
            Thinking...
          </div>
        )}
      </main>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-t px-6 py-4 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
}
