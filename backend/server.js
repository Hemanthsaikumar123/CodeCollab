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

// In-memory storage for demo (use Redis/DB in production)
const roomCodeState = new Map();
const roomLanguages = new Map();
const roomUsers = new Map(); // track users per room
const roomMessages = new Map(); // store chat messages per room

// Sample REST API route
app.get('/api', (req, res) => {
  res.json({ message: 'CodeCollab API running' });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);

    // Track user
    if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());
    roomUsers.get(roomId).add(socket.id);

    // Send current code & language to new user
    const currentCode = roomCodeState.get(roomId) || '';
    const currentLanguage = roomLanguages.get(roomId) || 'javascript';
    socket.emit('current-code', { code: currentCode, language: currentLanguage });

    // Send chat history to new user
    const messages = roomMessages.get(roomId) || [];
    socket.emit('chat-history', messages);

    // Broadcast updated user count
    const userCount = roomUsers.get(roomId).size;
    io.to(roomId).emit('user-count', userCount);
  });

  // Send code changes to other users
  socket.on('code-change', ({ roomId, code, language }) => {
    roomCodeState.set(roomId, code);
    if (language) roomLanguages.set(roomId, language);

    socket.to(roomId).emit('code-update', { 
      code, 
      language: language || roomLanguages.get(roomId) || 'javascript' 
    });
  });

  // Change language
  socket.on('language-change', ({ roomId, language, code }) => {
    roomLanguages.set(roomId, language);
    if (code !== undefined) roomCodeState.set(roomId, code);

    socket.to(roomId).emit('language-update', { 
      language, 
      code: code || roomCodeState.get(roomId) || ''
    });
  });

  // --- Chat functionality ---
  socket.on('send-chat', ({ roomId, user, message }) => {
    const timestamp = new Date().toISOString();
    const chatMessage = { 
      id: Date.now() + Math.random(),
      user, 
      message, 
      timestamp 
    };

    // Store message in room history
    if (!roomMessages.has(roomId)) roomMessages.set(roomId, []);
    const messages = roomMessages.get(roomId);
    messages.push(chatMessage);
    
    // Keep only last 100 messages per room
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }

    // Broadcast to all users in room
    io.to(roomId).emit('receive-chat', chatMessage);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    for (const [roomId, users] of roomUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);

        // Broadcast updated user count
        const userCount = users.size;
        io.to(roomId).emit('user-count', userCount);

        // Clean up empty rooms
        if (users.size === 0) {
          roomUsers.delete(roomId);
          roomCodeState.delete(roomId);
          roomLanguages.delete(roomId);
          roomMessages.delete(roomId);
          console.log(`Cleaned up empty room: ${roomId}`);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
