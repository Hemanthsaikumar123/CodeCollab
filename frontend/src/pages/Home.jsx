import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useSocket } from '../contexts/SocketContext';

const Home = () => {
  const { colors } = useTheme();
  const { socket } = useSocket();
  const [roomId, setRoomId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    
    // Emit create-room event to backend
    if (socket) {
      socket.emit('create-room', newRoomId);
    }
    
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      setErrorMessage('');
      
      // Check if room exists before navigating
      if (socket) {
        socket.emit('check-room', roomId.trim());
      } else {
        navigate(`/room/${roomId.trim()}`);
      }
    }
  };

  // Listen for room-exists response
  useEffect(() => {
    if (socket) {
      const handleRoomExists = ({ roomId: checkedRoomId, exists }) => {
        if (exists) {
          navigate(`/room/${checkedRoomId}`);
        } else {
          setErrorMessage('Room does not exist. Please check the room code or create a new room.');
        }
      };

      socket.on('room-exists', handleRoomExists);

      return () => {
        socket.off('room-exists', handleRoomExists);
      };
    }
  }, [socket, navigate]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Grid background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 157, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 157, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="w-full h-full flex items-center justify-center px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl">
          
          {/* Left Side - Hero Content */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-block">
                <div className="border-l-4 border-green-400 pl-4 mb-4">
                  <span className="text-green-400 font-mono text-sm tracking-wider">$ initialize_session</span>
                </div>
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight font-mono">
                  <span className="text-green-400">&lt;</span>
                  Code
                  <span className="text-cyan-400">Collab</span>
                  <span className="text-green-400">/&gt;</span>
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-mono">
                <span className="text-green-400">//</span> Real-time collaborative coding
                <br />
                <span className="text-green-400">//</span> Write code together, anywhere
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="border border-green-500/30 bg-gray-900/50 p-4 hover:border-green-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 animate-pulse"></div>
                  <span className="text-gray-300 font-mono text-sm">Real-time sync</span>
                </div>
              </div>
              <div className="border border-cyan-500/30 bg-gray-900/50 p-4 hover:border-cyan-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
                  <span className="text-gray-300 font-mono text-sm">Multi-user support</span>
                </div>
              </div>
              <div className="border border-green-500/30 bg-gray-900/50 p-4 hover:border-green-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 animate-pulse"></div>
                  <span className="text-gray-300 font-mono text-sm">Monaco powered</span>
                </div>
              </div>
              <div className="border border-cyan-500/30 bg-gray-900/50 p-4 hover:border-cyan-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
                  <span className="text-gray-300 font-mono text-sm">Instant sharing</span>
                </div>
              </div>
            </div>

            {/* Terminal-like info */}
            <div className="hidden lg:block border-l-2 border-green-400/50 pl-4">
              <div className="text-sm text-gray-500 space-y-1 font-mono">
                <p><span className="text-green-400">$</span> npm install collaboration</p>
                <p><span className="text-green-400">$</span> no registration required</p>
                <p><span className="text-green-400">$</span> secure by default</p>
              </div>
            </div>
          </div>

          {/* Right Side - Action Panel */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="border-2 border-green-500/30 bg-gray-900/90 backdrop-blur-sm p-8 w-full max-w-lg relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
              
              <div className="text-center mb-8">
                <div className="inline-block border-2 border-cyan-400 p-4 mb-6">
                  <span className="text-cyan-400 text-4xl font-mono">&gt;_</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 font-mono">
                  <span className="text-green-400">$</span> Get Started
                </h2>
                <p className="text-gray-400 font-mono text-sm">Initialize your coding session</p>
              </div>

              <div className="space-y-6">
                {/* Create Room */}
                <div>
                  <button
                    onClick={createRoom}
                    className="w-full bg-green-500 hover:bg-green-600 text-black py-4 px-6 font-bold text-lg transition-all duration-200 flex items-center justify-center border-2 border-green-400 hover:shadow-lg hover:shadow-green-500/50 font-mono relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-green-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative flex items-center">
                      <span className="mr-3 text-xl">+</span>
                      CREATE_NEW_ROOM
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900 text-gray-500 font-mono">OR</span>
                  </div>
                </div>

                {/* Join Room */}
                <form onSubmit={joinRoom} className="space-y-4">
                  {errorMessage && (
                    <div className="border border-red-500 bg-red-900/20 text-red-400 px-4 py-3 text-sm flex items-center font-mono">
                      <span className="mr-2">[ERROR]</span>
                      {errorMessage}
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 font-mono text-sm">
                      &gt;
                    </div>
                    <input
                      type="text"
                      placeholder="ENTER_ROOM_CODE"
                      value={roomId}
                      onChange={(e) => {
                        setRoomId(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full pl-10 pr-4 py-4 bg-black border-2 border-gray-700 focus:border-cyan-400 focus:outline-none text-center font-mono text-lg tracking-widest text-white placeholder-gray-600 uppercase transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!roomId.trim()}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-4 px-6 font-bold text-lg transition-all duration-200 flex items-center justify-center border-2 border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-mono relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative flex items-center">
                      <span className="mr-3 text-xl">&gt;&gt;</span>
                      JOIN_ROOM
                    </span>
                  </button>
                </form>
              </div>

              <div className="mt-8 text-center border-t border-gray-800 pt-6">
                <p className="text-xs text-gray-600 font-mono leading-relaxed">
                  [SECURE] • [COLLABORATIVE] • [REAL-TIME]
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