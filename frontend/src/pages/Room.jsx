import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      // Create a temporary toast notification
      const toast = document.createElement('div');
      toast.textContent = '📋 Room link copied to clipboard!';
      toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    });
  };

  const leaveRoom = () => {
    navigate('/');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">⚡</span>
              CodeCollab
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Room:</span>
                <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg border">{roomId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={copyRoomLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">📋</span>
              Copy Link
            </button>
            <button
              onClick={leaveRoom}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center"
            >
              <span className="mr-2">🚪</span>
              Leave Room
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 p-6">
        <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <Editor roomId={roomId} />
        </div>
      </main>
    </div>
  );
};

export default Room;