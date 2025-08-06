import React, { useState, useRef, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const Chatbot = ({ bot_text, setBot_text, sendCommand, color, isChatbotOpen, setIsChatbotOpen }) => {
  const [messages, setMessages] = useState([{ text: "Hello! I'm your AI assistant. How can I help you today? 👋", from: "bot" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
    
  // Gradient colors based on the primary color
  const gradientColors = {
    "blue": "from-blue-900 to-indigo-900",
    "purple": "from-purple-900 to-indigo-900",
    "green": "from-green-900 to-emerald-900",
    "red": "from-red-900 to-rose-900",
    "amber": "from-amber-900 to-orange-900"
  };
  
  const accentColors = {
    "blue": {
      light: "bg-blue-500",
      medium: "bg-blue-600",
      dark: "bg-blue-700",
      text: "text-blue-300",
      border: "border-blue-600",
      hover: "hover:bg-blue-500"
    },
    "purple": {
      light: "bg-purple-500",
      medium: "bg-purple-600",
      dark: "bg-purple-700",
      text: "text-purple-300",
      border: "border-purple-600",
      hover: "hover:bg-purple-500"
    },
    "green": {
      light: "bg-green-500",
      medium: "bg-green-600",
      dark: "bg-green-700",
      text: "text-green-300",
      border: "border-green-600",
      hover: "hover:bg-green-500"
    },
    "red": {
      light: "bg-red-500",
      medium: "bg-red-600",
      dark: "bg-red-700",
      text: "text-red-300",
      border: "border-red-600",
      hover: "hover:bg-red-500"
    },
    "amber": {
      light: "bg-amber-500",
      medium: "bg-amber-600",
      dark: "bg-amber-700",
      text: "text-amber-300",
      border: "border-amber-600",
      hover: "hover:bg-amber-500"
    },
    "zinc": {
      light: "bg-zinc-500",
      medium: "bg-zinc-600",
      dark: "bg-zinc-700",
      text: "text-zinc-300",
      border: "border-zinc-600",
      hover: "hover:bg-zinc-500"
    },
    "gray": {
      light: "bg-gray-500",
      medium: "bg-gray-600",
      dark: "bg-gray-700",
      text: "text-gray-300",
      border: "border-gray-600",
      hover: "hover:bg-gray-500"
    }
  };
  
  const accent = accentColors[color] || accentColors["gray"];
  const gradient = gradientColors[color] || gradientColors["amber"];

  const addMessage = (text, from = "user") => {
    setMessages((prevMessages) => [...prevMessages, { text, from }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    addMessage(input, "user");
    setLoading(true);
    setInput("");
    try {
      sendCommand("API_REQUEST:" + input + " give only important response with minimal content.");
    } catch {
      addMessage("Sorry, I couldn't get a response.", "bot");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (bot_text !== "") {
      addMessage(bot_text, "bot");
      setBot_text("");
      setLoading(false);
    }
  }, [bot_text, setBot_text]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show subtle notification
      const notification = document.createElement('div');
      notification.textContent = 'Copied!';
      notification.className = 'fixed bottom-20 right-8 bg-black/80 text-white px-3 py-1 rounded-md text-sm z-60';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 1500);
    }).catch((err) => {
      console.error("Failed to copy:", err);
    });
  }

  const handleClearChat = () => {
    setMessages([{ text: "Hello! I'm your AI assistant. How can I help you today? 👋", from: "bot" }]);
  }

  return (
    <>
      {!isChatbotOpen && (
        <div
          className={`fixed right-2 bottom-2 cursor-pointer ${accent.medium} p-1 rounded-md text-white shadow-lg transition-all duration-300 hover:scale-110 ${accent.hover} active:scale-95 transform-gpu z-50 flex items-center justify-center w-7 h-7`}
          onClick={() => setIsChatbotOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      )}

      {isChatbotOpen && (
        <div className="fixed right-5 bottom-5 z-50">
          <ResizableBox
            width={420}
            height={520}
            minConstraints={[320, 320]}
            maxConstraints={[600, 600]}
            axis="both"
            resizeHandles={['se']}
            className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl rounded-md overflow-hidden border border-gray-700"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className={`flex justify-between items-center p-4 ${accent.dark} text-white`}>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-xs opacity-70">Powered by ESP32</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                    onClick={handleClearChat}
                    title="Clear conversation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsChatbotOpen(false)} 
                    className="hover:bg-red-500/30 p-1.5 rounded-lg transition-colors"
                    title="Close chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-800 to-gray-900 space-y-4"
                ref={chatContainerRef}
              >
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} transition-all duration-300 animate-fadeIn`}
                  >
                    <div 
                      className={`relative max-w-[85%] p-4 rounded-2xl break-words shadow-md ${
                        msg.from === "user" 
                          ? `${accent.medium} text-white rounded-br-none`
                          : `bg-gray-700 text-gray-100 rounded-bl-none`
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          code: ({ node, inline, className, children, ...props }) => {
                            if (inline) {
                              return <code className={`${className} bg-gray-800 px-1.5 py-0.5 rounded font-mono`} {...props}>{children}</code>;
                            }
                            
                            const codeText = String(children).replace(/\n$/, '');
                            return (
                              <div className="relative my-2 bg-gray-800 text-gray-100 p-3 rounded-md overflow-hidden border border-gray-700">
                                <button
                                  className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:text-white text-xs px-2 py-1.5 rounded-md transition-colors flex items-center"
                                  onClick={() => handleCopy(codeText)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy
                                </button>
                                <pre className="overflow-x-auto w-full pr-8 pt-3 pb-2">
                                  <code className={`${className} whitespace-pre block font-mono text-sm`} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            );
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 rounded-2xl rounded-bl-none p-4 w-32">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleSendMessage()}
                    className="flex-1 p-3 outline-none rounded-xl bg-gray-700 placeholder:text-gray-500 text-gray-200 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Type your message..."
                    disabled={loading}
                  />
                  <button 
                    onClick={handleSendMessage} 
                    disabled={loading || !input.trim()}
                    className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center w-12 h-12 ${
                      loading || !input.trim()
                        ? 'bg-gray-600 cursor-not-allowed text-gray-500'
                        : `${accent.medium} hover:${accent.light} text-white shadow-md hover:shadow-lg`
                    }`}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </div>
              </div>
            </div>
          </ResizableBox>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .react-resizable-handle {
          background-image: none;
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 4px 0 0 0;
          width: 16px;
          height: 16px;
          bottom: 2px;
          right: 2px;
        }
        .react-resizable-handle::after {
          content: '';
          position: absolute;
          right: 4px;
          bottom: 4px;
          width: 8px;
          height: 8px;
          border-right: 2px solid rgba(255, 255, 255, 0.7);
          border-bottom: 2px solid rgba(255, 255, 255, 0.7);
        }
        .react-resizable-handle:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </>
  );
};

export default Chatbot;