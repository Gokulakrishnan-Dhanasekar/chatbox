import React from "react";

export default function ChatInput({
  model,
  setModel,
  prompt,
  setPrompt,
  loading,
  handleSubmit,
  availableModels,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-10 p-3 border-t border-blue-600 bg-black bg-opacity-70"
    >
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="bg-gray-900 text-white rounded px-3 py-2 text-sm min-w-[180px] cursor-pointer"
        disabled={loading}
        aria-label="Select AI model"
      >
        {availableModels.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded px-3 py-2 bg-gray-900 text-white text-sm outline-none focus:ring-2 focus:ring-purple-600"
        disabled={loading}
        aria-label="Chat input"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
