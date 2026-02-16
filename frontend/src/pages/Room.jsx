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
      toast.textContent = '[LINK_COPIED]';
      toast.className =
        'fixed top-4 right-4 bg-green-500 text-black px-6 py-3 border-2 border-green-400 shadow-lg shadow-green-500/50 z-50 font-mono font-bold';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);
    });
  };

  const leaveRoom = () => {
    navigate('/');
  };

  // Username Modal Component
  const UsernameModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-green-500/50 p-8 w-96 mx-4 relative">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-mono">
            <span className="text-green-400">$</span> {isEdit ? 'CHANGE_USERNAME' : 'SET_USERNAME'}
          </h2>
          {isEdit && (
            <button
              onClick={() => setShowEditUsername(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <p className="text-gray-400 mb-6 font-mono text-sm">
          <span className="text-green-400">//</span> {isEdit 
            ? 'Enter new username for session'
            : 'Initialize username to join session'
          }
        </p>
        
        <div className="mb-2">
          <div className="text-green-400 text-xs font-mono mb-2">&gt; USERNAME:</div>
          <input
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            placeholder="ENTER_USERNAME"
            className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-cyan-400 text-white placeholder-gray-600 font-mono text-lg focus:outline-none transition-colors uppercase"
            maxLength={20}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSetUsername();
              }
            }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-xs text-gray-600 font-mono">
            [{tempUsername.length}/20] CHARS
          </div>
          
          <div className="flex space-x-3">
            {isEdit && (
              <button
                onClick={() => setShowEditUsername(false)}
                className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors font-mono text-sm"
              >
                CANCEL
              </button>
            )}
            <button
              onClick={handleSetUsername}
              disabled={!tempUsername.trim()}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold border-2 border-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-sm"
            >
              {isEdit ? 'UPDATE' : 'JOIN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-black">
      {/* Username Modals */}
      {showUsernameModal && <UsernameModal />}
      {showEditUsername && <UsernameModal isEdit={true} />}
      
      {/* Header */}
      <header className="bg-gray-900 border-b-2 border-green-500/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <h1 className="text-xl font-bold text-white flex items-center font-mono">
              <span className="text-green-400">&lt;</span>
              <span className="text-white">Code</span>
              <span className="text-cyan-400">Collab</span>
              <span className="text-green-400">/&gt;</span>
            </h1>
            
            {/* Info Bar */}
            <div className="flex items-center space-x-6 text-sm">
              {/* Room ID */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-mono">ROOM:</span>
                <span className="font-mono bg-black border border-green-500/50 px-3 py-1 text-green-400 text-xs tracking-wider">
                  {roomId}
                </span>
              </div>
              
              {/* Username */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-mono">USER:</span>
                <span className="font-mono bg-black border border-cyan-500/50 px-3 py-1 text-cyan-400 text-xs flex items-center">
                  {username}
                  <button
                    onClick={handleEditUsername}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Edit username"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={copyRoomLink}
              className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 border-2 border-cyan-400 font-bold text-xs transition-all flex items-center font-mono hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <FaClipboard className="mr-2" />
              COPY_LINK
            </button>
            <button
              onClick={leaveRoom}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 border-2 border-gray-600 font-bold text-xs transition-all flex items-center font-mono"
            >
              <FaDoorOpen className="mr-2" />
              EXIT
            </button>
          </div>
        </div>
      </header>

      {/* Main content: Editor + Chat */}
      <main className="flex-1 flex gap-0 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 h-full bg-gray-900 border-r-2 border-green-500/30 overflow-hidden">
          <Editor roomId={roomId} />
        </div>

        {/* Chat */}
        <div className="w-80 h-full bg-gray-950">
          <ChatBox roomId={roomId} username={username} />
        </div>
      </main>
    </div>
  );
};

export default Room;
