import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
