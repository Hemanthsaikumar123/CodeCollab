import React, { useEffect, useState, useRef, useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaPaperPlane, FaComments, FaUsers } from 'react-icons/fa';

const ChatBox = ({ roomId, username }) => {
  const { socket, isConnected } = useContext(SocketContext);
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userCount, setUserCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Listen for chat messages - MATCH BACKEND EVENTS
    const handleReceiveChat = (msg) => {
      console.log('Received message:', msg); // Debug log
      setMessages((prev) => [...prev, msg]);
    };

    // Listen for chat history on join - MATCH BACKEND EVENTS
    const handleChatHistory = (history) => {
      console.log('Received chat history:', history); // Debug log
      setMessages(history || []);
    };

    // Listen for user count updates
    const handleUserCount = (count) => {
      setUserCount(count);
    };

    // Use correct event names that match backend
    socket.on('receive-chat', handleReceiveChat);
    socket.on('chat-history', handleChatHistory);
    socket.on('user-count', handleUserCount);

    return () => {
      socket.off('receive-chat', handleReceiveChat);
      socket.off('chat-history', handleChatHistory);
      socket.off('user-count', handleUserCount);
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !isConnected) return;

    const message = {
      roomId,
      user: username,
      message: input.trim(),
    };

    console.log('Sending message:', message); // Debug log
    // Use correct event name that matches backend
    socket.emit('send-chat', message);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 border-l-2 border-green-500/30">
      {/* Chat Header */}
      <div className="bg-gray-900 border-b-2 border-green-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaComments className="text-cyan-400 w-4 h-4" />
            <h3 className="font-bold text-white font-mono text-sm">CHAT_LOG</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <FaUsers className="text-green-400 w-3 h-3" />
            <span className="text-green-400 font-mono font-bold">{userCount}</span>
          </div>
        </div>
        <div className="mt-2 text-xs">
          {isConnected ? (
            <span className="flex items-center text-green-400 font-mono">
              <div className="w-1.5 h-1.5 bg-green-400 mr-2 animate-pulse"></div>
              [ONLINE]
            </span>
          ) : (
            <span className="flex items-center text-red-400 font-mono">
              <div className="w-1.5 h-1.5 bg-red-400 mr-2"></div>
              [OFFLINE]
            </span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            <FaComments className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-mono">[NO_MESSAGES]</p>
            <p className="text-xs font-mono mt-1">// Start conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.user === username;
            return (
              <div
                key={msg.id || index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 border ${
                    isOwnMessage
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-100'
                      : 'bg-gray-800/50 border-gray-700 text-gray-200'
                  }`}
                >
                  {/* Username */}
                  <div className={`text-xs font-bold mb-1 font-mono ${
                    isOwnMessage ? 'text-cyan-400' : 'text-green-400'
                  }`}>
                    {isOwnMessage ? 'YOU' : `${msg.user.toUpperCase()}`}
                  </div>
                  {/* Message */}
                  <div className="text-sm whitespace-pre-wrap break-words font-mono">
                    {msg.message}
                  </div>
                  {/* Timestamp */}
                  {msg.timestamp && (
                    <div className="text-xs mt-1 text-gray-500 font-mono">
                      [{new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}]
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-green-500/30 p-4 bg-gray-900">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-mono text-xs">
              &gt;
            </div>
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 bg-black border-2 border-gray-700 focus:border-cyan-400 text-white placeholder-gray-600 text-sm font-mono focus:outline-none transition-colors"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "TYPE_MESSAGE" : "CONNECTING..."}
              disabled={!isConnected}
              maxLength={500}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 border-2 border-cyan-400 font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <FaPaperPlane className="w-3 h-3" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-600 font-mono">
          [ENTER] to send • [{input.length}/500]
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
