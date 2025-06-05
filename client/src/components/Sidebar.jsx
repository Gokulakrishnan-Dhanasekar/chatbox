import React from "react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  chatSessions,
  currentChatId,
  switchToChat,
  createNewChat,
  deleteChat,
  editingChatId,
  startEditingTitle,
  saveTitle,
  editingTitle,
  setEditingTitle,
}) {
  return (
    <div
      className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      fixed inset-y-0 left-0 z-50 w-64 bg-black bg-opacity-90 backdrop-blur-sm 
      transform transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 border-r border-gray-700 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 
            rounded-lg text-sm font-medium transition-colors duration-200 flex-1 text-white"
        >
          <span className="text-lg">+</span>
          New Chat
        </button>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden ml-2 p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
        >
          <span className="text-lg">×</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom p-2 min-h-0">
        <div className="space-y-1">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchToChat(chat.id)}
              className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer 
                transition-colors duration-200 hover:bg-gray-800 ${
                  currentChatId === chat.id ? "bg-gray-800 border-l-2 border-purple-500" : ""
                }`}
            >
              <span className="text-gray-400 flex-shrink-0">💬</span>

              {editingChatId === chat.id ? (
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveTitle(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTitle(chat.id);
                      if (e.key === "Escape") {
                        e.stopPropagation();
                        setEditingTitle("");
                      }
                    }}
                    className="flex-1 bg-gray-700 text-white text-sm px-2 py-1 rounded border-none outline-none"
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveTitle(chat.id);
                    }}
                    className="text-green-400 hover:text-green-300"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-sm truncate text-gray-200">{chat.title}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingTitle(chat.id, chat.title, e);
                      }}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <span className="text-xs">✎</span>
                    </button>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <span className="text-xs">🗑</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
