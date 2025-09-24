import React from 'react';

const LanguageSelector = ({ currentLanguage, onLanguageChange, className = "" }) => {
  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨', extension: '.js' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷', extension: '.ts' },
    { id: 'python', name: 'Python', icon: '🐍', extension: '.py' },
    { id: 'java', name: 'Java', icon: '☕', extension: '.java' },
    { id: 'cpp', name: 'C++', icon: '⚡', extension: '.cpp' },
    { id: 'csharp', name: 'C#', icon: '🔸', extension: '.cs' },
    { id: 'php', name: 'PHP', icon: '🐘', extension: '.php' },
    { id: 'go', name: 'Go', icon: '🐹', extension: '.go' },
    { id: 'rust', name: 'Rust', icon: '🦀', extension: '.rs' },
    { id: 'html', name: 'HTML', icon: '🌐', extension: '.html' },
    { id: 'css', name: 'CSS', icon: '🎨', extension: '.css' },
    { id: 'json', name: 'JSON', icon: '📄', extension: '.json' },
    { id: 'xml', name: 'XML', icon: '📋', extension: '.xml' },
    { id: 'markdown', name: 'Markdown', icon: '📝', extension: '.md' },
    { id: 'sql', name: 'SQL', icon: '🗃️', extension: '.sql' },
    { id: 'yaml', name: 'YAML', icon: '⚙️', extension: '.yml' },
  ];

  const currentLang = languages.find(lang => lang.id === currentLanguage) || languages[0];

  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded-lg text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id} className="bg-gray-700">
            {lang.icon} {lang.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Language info tooltip */}
      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
        {currentLang.name} ({currentLang.extension})
      </div>
    </div>
  );
};

export default LanguageSelector;