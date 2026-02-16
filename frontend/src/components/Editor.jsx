import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useSocket } from '../contexts/SocketContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';

const Editor = ({ roomId }) => {
  const { colors } = useTheme();
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const { socket, isConnected, connectionError } = useSocket();
  const [userCount, setUserCount] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const isRemoteUpdateRef = useRef(false);
  const lastEmittedContentRef = useRef('');

  // Debounced emit to reduce socket traffic
  const debouncedEmit = useRef(null);

  useEffect(() => {
    debouncedEmit.current = (code) => {
      clearTimeout(debouncedEmit.current?.timeoutId);
      debouncedEmit.current.timeoutId = setTimeout(() => {
        if (socket && !isRemoteUpdateRef.current) {
          lastEmittedContentRef.current = code;
          socket.emit('code-change', { roomId, code, language: currentLanguage });
        }
      }, 100);
    };
  }, [socket, roomId, currentLanguage]);

  // Language configurations for Monaco
  const getLanguageConfig = (languageId) => {
    const configs = {
      javascript: { language: 'javascript', defaultCode: '// Welcome to CodeCollab!\nconsole.log("Hello, World!");' },
      typescript: { language: 'typescript', defaultCode: '// Welcome to CodeCollab!\nconst message: string = "Hello, World!";\nconsole.log(message);' },
      python: { language: 'python', defaultCode: '# Welcome to CodeCollab!\nprint("Hello, World!")' },
      java: { language: 'java', defaultCode: '// Welcome to CodeCollab!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
      cpp: { language: 'cpp', defaultCode: '// Welcome to CodeCollab!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
      csharp: { language: 'csharp', defaultCode: '// Welcome to CodeCollab!\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' },
      php: { language: 'php', defaultCode: '<?php\n// Welcome to CodeCollab!\necho "Hello, World!";' },
      go: { language: 'go', defaultCode: '// Welcome to CodeCollab!\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
      rust: { language: 'rust', defaultCode: '// Welcome to CodeCollab!\nfn main() {\n    println!("Hello, World!");\n}' },
      html: { language: 'html', defaultCode: '<!-- Welcome to CodeCollab! -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>' },
      css: { language: 'css', defaultCode: '/* Welcome to CodeCollab! */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    margin: 0;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n}' },
      json: { language: 'json', defaultCode: '{\n  "message": "Hello, World!",\n  "welcome": "CodeCollab",\n  "version": "1.0.0"\n}' },
      xml: { language: 'xml', defaultCode: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Welcome to CodeCollab! -->\n<root>\n    <message>Hello, World!</message>\n</root>' },
      markdown: { language: 'markdown', defaultCode: '# Welcome to CodeCollab!\n\n## Hello, World!\n\nThis is a **collaborative** markdown editor.\n\n- Real-time sync\n- Multiple users\n- Awesome features\n\n```javascript\nconsole.log("Happy coding!");\n```' },
      sql: { language: 'sql', defaultCode: '-- Welcome to CodeCollab!\nSELECT \'Hello, World!\' AS message;\n\nCREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100)\n);' },
      yaml: { language: 'yaml', defaultCode: '# Welcome to CodeCollab!\napp:\n  name: "CodeCollab"\n  version: "1.0.0"\n  features:\n    - real-time-sync\n    - multi-language\n    - collaborative-editing\n\nmessage: "Hello, World!"' },
    };
    
    return configs[languageId] || configs.javascript;
  };

  // Simple and reliable content update
  const updateEditorContent = (newContent) => {
    if (!editorRef.current || !newContent) return;

    const editor = editorRef.current;
    const currentContent = editor.getValue();
    
    // Only update if content is actually different
    if (currentContent === newContent) return;

    isRemoteUpdateRef.current = true;
    
    try {
      // Save current cursor position
      const position = editor.getPosition();
      const selection = editor.getSelection();
      
      // Update content
      editor.setValue(newContent);
      
      // Restore cursor position if valid
      if (position) {
        const model = editor.getModel();
        const lineCount = model.getLineCount();
        
        if (position.lineNumber <= lineCount) {
          const lineLength = model.getLineLength(position.lineNumber);
          const safeColumn = Math.min(position.column, lineLength + 1);
          
          editor.setPosition({
            lineNumber: position.lineNumber,
            column: safeColumn
          });
        }
      }
    } catch (error) {
      // Fallback: just set the content
      editor.setValue(newContent);
    }
    
    // Reset the flag after update
    setTimeout(() => {
      isRemoteUpdateRef.current = false;
    }, 10);
  };

  const handleLanguageChange = (newLanguage) => {
    if (editorRef.current && socket) {
      const currentCode = editorRef.current.getValue();
      
      // If editor is empty or has default content, load new language template
      const currentConfig = getLanguageConfig(currentLanguage);
      const newConfig = getLanguageConfig(newLanguage);
      
      if (!currentCode || currentCode.trim() === currentConfig.defaultCode.trim()) {
        updateEditorContent(newConfig.defaultCode);
        
        // Broadcast the language change and new default code
        socket.emit('language-change', { roomId, language: newLanguage, code: newConfig.defaultCode });
      } else {
        // Just change language, keep existing code
        socket.emit('language-change', { roomId, language: newLanguage, code: currentCode });
      }
      
      // Update Monaco editor language
      const model = editorRef.current.getModel();
      monaco.editor.setModelLanguage(model, newConfig.language);
    }
    
    setCurrentLanguage(newLanguage);
  };

  useEffect(() => {
    if (!containerRef.current || !socket || !isConnected) return;

    const config = getLanguageConfig(currentLanguage);
    
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: config.defaultCode,
      language: config.language,
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false },
      wordWrap: 'on',
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      // Simplified settings to reduce conflicts
      cursorBlinking: 'blink',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
    });

    // Join the room when component mounts
    socket.emit('join-room', roomId);
    
    // Request current code state and language
    socket.emit('request-current-code', roomId);

    editorRef.current.onDidChangeModelContent(() => {
      if (!isRemoteUpdateRef.current) {
        const code = editorRef.current.getValue();
        // Only emit if content actually changed from what we last emitted
        if (code !== lastEmittedContentRef.current) {
          debouncedEmit.current(code);
        }
      }
    });

    socket.on('code-update', (data) => {
      const { code, language } = data;
      
      // Update content if different
      if (code && code !== editorRef.current.getValue()) {
        updateEditorContent(code);
      }
      
      // Update language if different
      if (language && language !== currentLanguage) {
        setCurrentLanguage(language);
        const model = editorRef.current.getModel();
        const config = getLanguageConfig(language);
        monaco.editor.setModelLanguage(model, config.language);
      }
    });

    // Handle receiving current code when joining
    socket.on('current-code', (data) => {
      if (data) {
        const { code, language } = data;
        if (code) {
          updateEditorContent(code);
        }
        
        if (language && language !== currentLanguage) {
          setCurrentLanguage(language);
          const model = editorRef.current.getModel();
          const config = getLanguageConfig(language);
          monaco.editor.setModelLanguage(model, config.language);
        }
      }
    });

    // Handle language changes from other users
    socket.on('language-update', (data) => {
      const { language, code } = data;
      if (language !== currentLanguage) {
        setCurrentLanguage(language);
        const model = editorRef.current.getModel();
        const config = getLanguageConfig(language);
        monaco.editor.setModelLanguage(model, config.language);
      }
      
      if (code) {
        updateEditorContent(code);
      }
    });

    // Handle user count updates
    socket.on('user-count', (count) => {
      setUserCount(count);
    });

    // Handle user count updates
    socket.on('user-count', (count) => {
      setUserCount(count);
    });

    return () => {
      // Clear any pending debounced emits
      if (debouncedEmit.current?.timeoutId) {
        clearTimeout(debouncedEmit.current.timeoutId);
      }
      
      socket.off('code-update');
      socket.off('current-code');
      socket.off('language-update');
      socket.off('user-count');
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [socket, roomId, isConnected]);

  if (connectionError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black border-2 border-red-500">
        <div className="text-center border border-red-500/50 bg-red-900/20 p-8">
          <div className="text-red-400 text-xl mb-3 font-mono font-bold">[CONNECTION_ERROR]</div>
          <div className="text-red-300 font-mono text-sm">{connectionError}</div>
          <div className="text-xs text-gray-500 mt-3 font-mono">// Check server status: localhost:5000</div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black border-2 border-yellow-500/50">
        <div className="text-center border border-yellow-500/50 bg-yellow-900/20 p-8">
          <div className="text-yellow-400 text-xl mb-3 font-mono font-bold flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
            [CONNECTING]
          </div>
          <div className="text-yellow-300 font-mono text-sm">Establishing connection...</div>
        </div>
      </div>
    );
  }

  const currentConfig = getLanguageConfig(currentLanguage);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 text-xs flex justify-between items-center border-b-2 border-green-500/30">
        <div className="flex items-center space-x-6">
          <span className="flex items-center font-mono">
            <div className="w-1.5 h-1.5 bg-green-400 mr-2 animate-pulse"></div>
            <span className="text-green-400">[CONNECTED]</span>
          </span>
          <span className="flex items-center font-mono">
            <span className="text-gray-500">ROOM:</span>
            <span className="ml-2 bg-black border border-green-500/50 px-2 py-0.5 text-green-400 tracking-wider">
              {roomId}
            </span>
          </span>
          <span className="flex items-center font-mono">
            <span className="text-gray-500">USERS:</span>
            <span className="ml-2 text-cyan-400 font-bold">{userCount}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector 
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
          <div className="text-gray-500 hidden sm:block font-mono">
            [F11] fullscreen
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
};

export default Editor;
