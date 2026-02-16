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
    <div className={`h-full flex flex-col ${colors.bg.secondary} rounded-lg shadow-sm ${colors.border.primary} border overflow-hidden`}>
      {/* Chat Header */}
      <div className={`${colors.bg.accent} ${colors.border.primary} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaComments className={`${colors.text.accent} w-5 h-5`} />
            <h3 className={`font-semibold ${colors.text.primary}`}>Chat</h3>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${colors.text.secondary}`}>
            <FaUsers className="w-4 h-4" />
            <span>{userCount}</span>
          </div>
        </div>
        <div className={`mt-1 text-xs ${colors.text.tertiary}`}>
          {isConnected ? (
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Connected
            </span>
          ) : (
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className={`text-center ${colors.text.tertiary} mt-8`}>
            <FaComments className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
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
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    isOwnMessage
                      ? `${colors.button.primary} text-white`
                      : `${colors.bg.accent} ${colors.text.primary}`
                  }`}
                >
                  {/* Always show username/label */}
                  <div className={`text-xs font-semibold mb-1 ${
                    isOwnMessage ? 'text-blue-100' : colors.text.secondary
                  }`}>
                    {isOwnMessage ? 'You' : msg.user}
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {msg.message}
                  </div>
                  {msg.timestamp && (
                    <div
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-blue-100' : colors.text.tertiary
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
      <div className={`${colors.border.primary} border-t p-4`}>
        <div className="flex space-x-2">
          <input
            type="text"
            className={`flex-1 px-3 py-2 ${colors.border.primary} border rounded-lg text-sm ${colors.input.bg} ${colors.input.text} ${colors.input.placeholder} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className={`${colors.button.primary} text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1`}
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>
        <div className={`mt-2 text-xs ${colors.text.tertiary}`}>
          Press Enter to send • {input.length}/500
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
