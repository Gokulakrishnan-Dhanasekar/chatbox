import React from "react";

export default function ChatHeader({ currentChat, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-black bg-opacity-70 shadow px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
        >
          <span className="text-lg">☰</span>
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-purple-400">
          🧠 {currentChat?.title || "CHATBOT"}
        </h1>
      </div>
    </header>
  );
}
