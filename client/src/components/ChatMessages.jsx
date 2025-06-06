import React from "react";

export default function ChatMessages({ messages, loading }) {
  return (
    <main className="flex-1 overflow-y-auto scrollbar-custom px-3 sm:px-6 py-4 sm:py-6 space-y-4">
      {messages.length === 0 && !loading && (
        <div className="text-gray-400 italic text-center mt-10">
          Start the conversation by typing a message below.
        </div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex gap-3 max-w-3xl mx-auto ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.role === "assistant" && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-700 text-white select-none"
              aria-label="Assistant"
            >
              🤖
            </div>
          )}
          <div
            className={`rounded-lg p-3 whitespace-pre-wrap break-words max-w-[80%] ${
              msg.role === "user"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-100"
            }`}
          >
            {msg.content}
          </div>
          {msg.role === "user" && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-600 text-white select-none"
              aria-label="User"
            >
              🧑
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-600 h-8 w-8"></div>
        </div>
      )}
    </main>
  );
}
