import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import StarsBackground from "./StarsBackground";

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
    }
  catch (error) {
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
    <div className="flex h-screen w-screen bg-gradient-to-b from-purple-900 via-purple-800  text-white relative overflow-hidden">
      <StarsBackground />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        switchToChat={switchToChat}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        editingChatId={editingChatId}
        startEditingTitle={startEditingTitle}
        saveTitle={saveTitle}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
      />

      <div className="flex flex-col flex-1  bg-gradient-to-b from-purple-900 via-purple-800">
        <ChatHeader
          currentChat={currentChat}
          chatSessions={chatSessions}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <ChatMessages messages={messages} loading={loading} />

        <ChatInput
          model={model}
          setModel={setModel}
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          handleSubmit={handleSubmit}
          availableModels={availableModels}
        />
      </div>
    </div>
  );
}
