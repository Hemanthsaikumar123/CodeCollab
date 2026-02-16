import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBolt, FaClipboard, FaDoorOpen, FaEdit, FaTimes } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import Editor from '../components/Editor';
import ChatBox from '../components/ChatBox';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  // Generate initial username but allow user to change it
  const [username, setUsername] = useState(() => {
    return `User${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
  });
  
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [tempUsername, setTempUsername] = useState(username);
  const [showEditUsername, setShowEditUsername] = useState(false);

  const handleSetUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setShowUsernameModal(false);
      setShowEditUsername(false);
    }
  };

  const handleEditUsername = () => {
    setTempUsername(username);
    setShowEditUsername(true);
  };

  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      const toast = document.createElement('div');
      toast.textContent = '📋 Room link copied to clipboard!';
      toast.className =
        'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    });
  };

  const leaveRoom = () => {
    navigate('/');
  };

  // Username Modal Component
  const UsernameModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colors.bg.secondary} rounded-lg p-6 w-96 mx-4 ${colors.border.primary} border`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${colors.text.primary}`}>
            {isEdit ? 'Change Username' : 'Set Your Username'}
          </h2>
          {isEdit && (
            <button
              onClick={() => setShowEditUsername(false)}
              className={`${colors.text.secondary} hover:${colors.text.primary} transition-colors`}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <p className={`${colors.text.secondary} mb-4`}>
          {isEdit 
            ? 'Enter a new username for the chat:'
            : 'Enter your name to join the collaborative session:'
          }
        </p>
        
        <input
          type="text"
          value={tempUsername}
          onChange={(e) => setTempUsername(e.target.value)}
          placeholder="Enter your username"
          className={`w-full px-4 py-3 ${colors.input.bg} ${colors.input.border} ${colors.input.text} ${colors.input.placeholder} border rounded-lg text-lg ${colors.input.focus} focus:outline-none focus:ring-2`}
          maxLength={20}
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSetUsername();
            }
          }}
        />
        
        <div className="flex justify-between items-center mt-4">
          <div className={`text-sm ${colors.text.tertiary}`}>
            {tempUsername.length}/20 characters
          </div>
          
          <div className="flex space-x-2">
            {isEdit && (
              <button
                onClick={() => setShowEditUsername(false)}
                className={`px-4 py-2 ${colors.text.secondary} hover:${colors.text.primary} transition-colors`}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSetUsername}
              disabled={!tempUsername.trim()}
              className={`${colors.button.primary} text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
            >
              {isEdit ? 'Update' : 'Join Room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-screen w-screen flex flex-col ${colors.bg.primary}`}>
      {/* Username Modals */}
      {showUsernameModal && <UsernameModal />}
      {showEditUsername && <UsernameModal isEdit={true} />}
      
      {/* Header */}
      <header className={`${colors.bg.secondary} ${colors.border.primary} border-b px-6 py-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className={`text-2xl font-bold ${colors.text.primary} flex items-center`}>
              <FaBolt className="mr-2 text-yellow-500" />
              CodeCollab
            </h1>
            <div className={`flex items-center space-x-4 text-sm ${colors.text.secondary}`}>
              <div className="flex items-center">
                <span className={`${colors.text.tertiary} mr-2`}>Room:</span>
                <span className={`font-mono ${colors.bg.accent} px-3 py-1 rounded-lg ${colors.border.primary} border ${colors.text.primary}`}>{roomId}</span>
              </div>
              <div className="flex items-center">
                <span className={`${colors.text.tertiary} mr-2`}>You:</span>
                <span className="font-mono bg-blue-900 border-blue-700 text-blue-200 px-3 py-1 rounded-lg border flex items-center">
                  {username}
                  <button
                    onClick={handleEditUsername}
                    className={`ml-2 ${colors.text.accent} hover:opacity-80 transition-colors`}
                    title="Edit username"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={copyRoomLink}
              className={`${colors.button.primary} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center`}
            >
              <FaClipboard className="mr-2" />
              Copy Link
            </button>
            <button
              onClick={leaveRoom}
              className={`${colors.button.secondary} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center`}
            >
              <FaDoorOpen className="mr-2" />
              Leave Room
            </button>
          </div>
        </div>
      </header>

      {/* Main content: Editor + Chat */}
      <main className="flex-1 flex gap-4 p-6">
        {/* Editor */}
        <div className={`flex-1 h-full ${colors.bg.secondary} rounded-lg shadow-sm overflow-hidden ${colors.border.primary} border`}>
          <Editor roomId={roomId} />
        </div>

        {/* Chat */}
        <div className="w-80 h-full">
          <ChatBox roomId={roomId} username={username} />
        </div>
      </main>
    </div>
  );
};

export default Room;
