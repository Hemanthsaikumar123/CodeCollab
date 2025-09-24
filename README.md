# CodeCollab

A real-time collaborative code editor built with React, Monaco Editor, and Socket.IO.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously
- **Multi-language Support**: 16+ programming languages with syntax highlighting
- **Live Cursors**: See other users' cursor positions and selections
- **Room-based**: Create or join coding rooms
- **Modern UI**: Clean interface built with React and TailwindCSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Monaco Editor** - VS Code editor component
- **Socket.IO Client** - Real-time communication
- **TailwindCSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - WebSocket server
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeCollab
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on `http://localhost:5173`

### Production Build

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```

## 🎯 Usage

1. Open the application in your browser
2. Create a new room or join an existing one with a room ID
3. Start coding collaboratively!
4. Switch between different programming languages using the language selector
5. See real-time changes from other users

## 🗂️ Project Structure

```
CodeCollab/
├── backend/
│   ├── server.js          # Express & Socket.IO server
│   ├── package.json       # Backend dependencies
│   └── .gitignore        # Backend Git ignore rules
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Editor.jsx # Main editor component
│   │   │   └── LanguageSelector.jsx
│   │   ├── contexts/      # React contexts
│   │   │   └── SocketContext.jsx
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── .gitignore       # Frontend Git ignore rules
└── README.md            # Project documentation
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory if needed:

```env
PORT=3001
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🚧 Roadmap

- [x] Multi-language support
- [x] Cursor stability fixes
- [ ] User cursors & selections visualization
- [ ] Real-time chat system
- [ ] User presence indicators
- [ ] Multiple file support with tabs
- [ ] Code execution environment
- [ ] Theme customization

## 🐛 Known Issues

- Cursor position may occasionally jump during rapid collaborative editing
- Language switching requires manual refresh in some cases

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.
