import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { colors, isDarkMode } = useTheme();
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className={`h-screen w-screen ${colors.bg.primary} flex items-center justify-center overflow-hidden`}>
      <div className="w-full h-full flex items-center justify-center px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl h-full">
          
          {/* Left Side - Hero Content */}
          <div className="flex flex-col justify-center h-full space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className={`text-6xl lg:text-7xl xl:text-8xl font-bold ${colors.text.primary} leading-tight`}>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeCollab
                </span>
              </h1>
              <p className={`text-xl lg:text-2xl xl:text-3xl ${colors.text.secondary} max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
                Real-time collaborative code editor. Write code together, anywhere in the world.
              </p>
            </div>
            
            <div className={`space-y-6 ${colors.text.tertiary}`}>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg lg:text-xl">Real-time synchronization</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-lg lg:text-xl">Multiple users support</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-lg lg:text-xl">Monaco editor powered</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-lg lg:text-xl">Instant room sharing</span>
              </div>
            </div>

            {/* Additional visual elements */}
            <div className="hidden lg:block pt-8">
              <div className={`text-sm ${colors.text.tertiary} space-y-2`}>
                <p>✨ No registration required</p>
                <p>🚀 Start coding in seconds</p>
                <p>🔒 Secure by default</p>
              </div>
            </div>
          </div>

          {/* Right Side - Action Panel */}
          <div className="flex justify-center lg:justify-end h-full items-center">
            <div className={`${colors.bg.secondary} rounded-3xl shadow-2xl p-10 w-full max-w-lg ${colors.border.primary} border backdrop-blur-sm`}>
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">⚡</span>
                </div>
                <h2 className={`text-3xl font-bold ${colors.text.primary} mb-3`}>Get Started</h2>
                <p className={colors.text.secondary}>Create or join a collaborative coding session</p>
              </div>

              <div className="space-y-8">
                {/* Create Room */}
                <div>
                  <button
                    onClick={createRoom}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                  >
                    <span className="mr-4 text-xl">🚀</span>
                    Create New Room
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${colors.border.primary}`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-6 ${colors.bg.secondary} ${colors.text.tertiary} font-medium text-base`}>or</span>
                  </div>
                </div>

                {/* Join Room */}
                <form onSubmit={joinRoom} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter room code (e.g., abc123)"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className={`w-full px-6 py-5 ${colors.border.primary} border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-mono text-xl tracking-wider ${colors.input.bg} ${colors.input.text} ${colors.input.placeholder} hover:${colors.bg.secondary} transition-colors`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!roomId.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg active:translate-y-0"
                  >
                    <span className="mr-4 text-xl">🔗</span>
                    Join Room
                  </button>
                </form>
              </div>

              <div className="mt-10 text-center">
                <p className={`text-sm ${colors.text.tertiary} leading-relaxed`}>
                  🔒 Secure sessions • 👥 Invite teammates • 💾 Auto-save
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;