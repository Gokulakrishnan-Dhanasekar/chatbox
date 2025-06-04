import React, { useState, useEffect } from "react";
import axios from "axios";


export default function ChatBox() {
  const [model, setModel] = useState("mistralai/mistral-7b-instruct");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const availableModels = [
    "mistralai/mistral-7b-instruct",
    "openai/gpt-3.5-turbo",
    "openai/gpt-4o-mini",
    "meta-llama/llama-2-70b-chat",
    "google/gemini-2.0-flash-001",
  ];

  // Initialize with first chat session
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewChat();
    }
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newTitle = `New Chat ${chatSessions.length + 1}`;
    const newChat = {
      id: newChatId,
      title: newTitle,
      messages: [],
      createdAt: new Date(),
      model: model
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setSidebarOpen(false);
  };

  const switchToChat = (chatId) => {
    const chat = chatSessions.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setModel(chat.model);
      setSidebarOpen(false);
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(c => c.id !== chatId));
    
    if (currentChatId === chatId) {
      const remaining = chatSessions.filter(c => c.id !== chatId);
      if (remaining.length > 0) {
        switchToChat(remaining[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const startEditingTitle = (chatId, currentTitle, e) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = (chatId) => {
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: editingTitle.trim() || chat.title }
          : chat
      )
    );
    setEditingChatId(null);
    setEditingTitle("");
  };

  const updateCurrentChat = (newMessages) => {
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: newMessages, model: model }
          : chat
      )
    );
  };

  const generateChatTitle = (firstMessage) => {
    // Generate a title from the first message
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  const userMessage = { role: "user", content: prompt };
  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setPrompt("");
  setLoading(true);

  // Update title for first message
  if (messages.length === 0) {
    const newTitle = generateChatTitle(prompt);
    setChatSessions(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, title: newTitle }
          : chat
      )
    );
  }

  try {
    // Send request to your actual backend
    const res = await axios.post("http://localhost:3000/api/chat", {
      model,
      prompt,
    });

    const assistantMessage = {
      role: "assistant",
      content: res.data.content || "⚠️ No response from model.",
    };

    const updatedMessages = [...newMessages, assistantMessage];
    setMessages(updatedMessages);
    updateCurrentChat(updatedMessages);

  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = {
      role: "assistant",
      content: "⚠️ Error fetching response. Please try again.",
    };
    const updatedMessages = [...newMessages, errorMessage];
    setMessages(updatedMessages);
    updateCurrentChat(updatedMessages);
  } finally {
    setLoading(false);
  }
};

  const currentChat = chatSessions.find(c => c.id === currentChatId);

  return (
    <>
      {/* Minimal star CSS */}
      <style>{`
        .stars::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          background: transparent;
          box-shadow:
            10vw 15vh white,
            30vw 25vh white,
            50vw 10vh white,
            70vw 35vh white,
            20vw 70vh white,
            60vw 80vh white,
            85vw 60vh white;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          animation: twinkle 3s infinite ease-in-out alternate;
          z-index: 0;
        }

        @keyframes twinkle {
          0%, 100% {opacity: 1;}
          50% {opacity: 0.6;}
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #6b46c1;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>

      {/* Stars overlay */}
      <div className="stars"></div>

      <div className="h-screen w-screen flex relative z-10 bg-gradient-to-b from-[#0b1d38] to-[#000010] text-white">
        
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed inset-y-0 left-0 z-50 w-64 bg-black bg-opacity-90 backdrop-blur-sm 
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 border-r border-gray-700`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 
                rounded-lg text-sm font-medium transition-colors duration-200 flex-1"
            >
              <span className="text-lg">+</span>
              New Chat
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden ml-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="text-lg">×</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto scrollbar-custom p-2">
            <div className="space-y-1">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => switchToChat(chat.id)}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer 
                    transition-colors duration-200 hover:bg-gray-800 ${
                    currentChatId === chat.id ? 'bg-gray-800 border-l-2 border-purple-500' : ''
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
                          if (e.key === 'Enter') saveTitle(chat.id);
                          if (e.key === 'Escape') {
                            setEditingChatId(null);
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
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm truncate text-gray-200">
                        {chat.title}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={(e) => startEditingTitle(chat.id, chat.title, e)}
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

          {/* Model Selector */}
          <div className="p-4 border-t border-gray-700">
            <label className="block text-xs text-gray-400 mb-2">Current Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full border border-gray-600 rounded px-3 py-2 bg-black text-white text-xs 
                focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {availableModels.map((m) => (
                <option key={m} value={m} className="text-black">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-black bg-opacity-70 shadow px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-lg">☰</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-purple-400">
                🧠 {currentChat?.title || 'CHATBOT'}
              </h1>
            </div>
            <div className="text-xs text-gray-400">
              {chatSessions.length} chat{chatSessions.length !== 1 ? 's' : ''}
            </div>
          </header>

          {/* Chat Messages */}
          <main className="flex-1 overflow-y-auto scrollbar-custom px-3 sm:px-6 py-4 sm:py-6 space-y-4 flex flex-col items-center">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <span className="text-6xl opacity-30 mb-4">💬</span>
                  <p className="text-lg font-medium mb-2">Start a new conversation</p>
                  <p className="text-sm">Send a message to begin chatting with AI</p>
                </div>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-full sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-lg break-words ${
                  msg.role === "user"
                    ? "bg-purple-900 bg-opacity-80 text-white self-end ml-auto"
                    : "bg-black bg-opacity-70 self-start mr-auto border border-gray-700 text-purple-300"
                }`}
              >
                <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
            
            {loading && (
              <div className="text-xs sm:text-sm text-gray-400 bg-black bg-opacity-70 border border-gray-700 px-4 py-2 rounded-lg w-max animate-pulse">
                Thinking...
              </div>
            )}
          </main>
          

          {/* Input Form */}
          <div className="bg-black bg-opacity-70 border-t border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full max-w-full sm:max-w-xl border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm bg-black bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-200 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}