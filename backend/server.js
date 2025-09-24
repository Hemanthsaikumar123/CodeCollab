const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// Store room code state and language in memory (use Redis or DB for production)
const roomCodeState = new Map();
const roomLanguages = new Map();
const roomUsers = new Map(); // Track users per room

// Sample REST API route
app.get('/api', (req, res) => {
  res.json({ message: 'CodeCollab API running' });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    
    // Track user in room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(socket.id);
    
    // Send current code state and language to the new user if they exist
    const currentCode = roomCodeState.get(roomId);
    const currentLanguage = roomLanguages.get(roomId) || 'javascript';
    
    if (currentCode || currentLanguage !== 'javascript') {
      socket.emit('current-code', { 
        code: currentCode || '',
        language: currentLanguage 
      });
    }
    
    // Broadcast user count to all users in room
    const userCount = roomUsers.get(roomId).size;
    io.to(roomId).emit('user-count', userCount);
  });

  socket.on('request-current-code', (roomId) => {
    const currentCode = roomCodeState.get(roomId);
    const currentLanguage = roomLanguages.get(roomId) || 'javascript';
    
    socket.emit('current-code', { 
      code: currentCode || '',
      language: currentLanguage 
    });
  });

  socket.on('code-change', ({ roomId, code, language }) => {
    // Store the latest code state for the room
    roomCodeState.set(roomId, code);
    
    // Store language if provided
    if (language) {
      roomLanguages.set(roomId, language);
    }
    
    // Broadcast to all other users in the room
    socket.to(roomId).emit('code-update', { 
      code, 
      language: language || roomLanguages.get(roomId) || 'javascript'
    });
  });

  socket.on('language-change', ({ roomId, language, code }) => {
    console.log(`Language changed in room ${roomId} to ${language}`);
    
    // Store the new language and code
    roomLanguages.set(roomId, language);
    if (code !== undefined) {
      roomCodeState.set(roomId, code);
    }
    
    // Broadcast language change to all other users in the room
    socket.to(roomId).emit('language-update', { 
      language, 
      code: code || roomCodeState.get(roomId) || ''
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms and update counts
    for (const [roomId, users] of roomUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        const userCount = users.size;
        io.to(roomId).emit('user-count', userCount);
        
        // Clean up empty rooms
        if (users.size === 0) {
          roomUsers.delete(roomId);
          roomCodeState.delete(roomId);
          roomLanguages.delete(roomId);
          console.log(`Cleaned up empty room: ${roomId}`);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
