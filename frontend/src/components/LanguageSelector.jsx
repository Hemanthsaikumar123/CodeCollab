import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiCplusplus, 
  SiPhp, 
  SiGo, 
  SiRust, 
  SiHtml5, 
  SiCss3, 
  SiMarkdown 
} from 'react-icons/si';
import { VscJson, VscFileCode } from 'react-icons/vsc';
import { FaDatabase, FaJava } from 'react-icons/fa';
import { TbBrandCSharp } from 'react-icons/tb';
import { AiOutlineFile } from 'react-icons/ai';

const LanguageSelector = ({ currentLanguage, onLanguageChange, className = "" }) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const languages = [
    { id: 'javascript', name: 'JavaScript', Icon: SiJavascript, extension: '.js', color: 'text-yellow-400' },
    { id: 'typescript', name: 'TypeScript', Icon: SiTypescript, extension: '.ts', color: 'text-blue-500' },
    { id: 'python', name: 'Python', Icon: SiPython, extension: '.py', color: 'text-yellow-300' },
    { id: 'java', name: 'Java', Icon: FaJava, extension: '.java', color: 'text-red-500' },
    { id: 'cpp', name: 'C++', Icon: SiCplusplus, extension: '.cpp', color: 'text-indigo-400' },
    { id: 'csharp', name: 'C#', Icon: TbBrandCSharp, extension: '.cs', color: 'text-green-500' },
    { id: 'php', name: 'PHP', Icon: SiPhp, extension: '.php', color: 'text-indigo-500' },
    { id: 'go', name: 'Go', Icon: SiGo, extension: '.go', color: 'text-cyan-500' },
    { id: 'rust', name: 'Rust', Icon: SiRust, extension: '.rs', color: 'text-orange-600' },
    { id: 'html', name: 'HTML', Icon: SiHtml5, extension: '.html', color: 'text-orange-500' },
    { id: 'css', name: 'CSS', Icon: SiCss3, extension: '.css', color: 'text-blue-400' },
    { id: 'json', name: 'JSON', Icon: VscJson, extension: '.json', color: 'text-emerald-400' },
    { id: 'xml', name: 'XML', Icon: VscFileCode, extension: '.xml', color: 'text-emerald-500' },
    { id: 'markdown', name: 'Markdown', Icon: SiMarkdown, extension: '.md', color: 'text-gray-300' },
    { id: 'sql', name: 'SQL', Icon: FaDatabase, extension: '.sql', color: 'text-pink-400' },
    { id: 'yaml', name: 'YAML', Icon: AiOutlineFile, extension: '.yml', color: 'text-yellow-300' },
  ];

  const currentLang = languages.find(lang => lang.id === currentLanguage) || languages[0];
  const CurrentIcon = currentLang.Icon;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black border-2 border-gray-700 hover:border-cyan-500 text-white px-3 py-1.5 text-xs font-bold font-mono focus:outline-none focus:border-cyan-400 transition-colors w-40 justify-between"
      >
        <div className="flex items-center gap-2">
          <CurrentIcon className={`w-4 h-4 ${currentLang.color}`} />
          <span className="uppercase">{currentLang.name}</span>
        </div>
        {/* Arrow */}
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul className="absolute mt-1 w-56 bg-gray-900 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 z-20 max-h-60 overflow-auto">
          {languages.map(lang => (
            <li
              key={lang.id}
              onClick={() => { onLanguageChange(lang.id); setIsOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 cursor-pointer text-gray-300 hover:text-white transition-colors border-b border-gray-800 last:border-b-0"
            >
              <lang.Icon className={`w-4 h-4 ${lang.color}`} />
              <span className="font-mono text-xs font-bold uppercase">{lang.name}</span>
              <span className="ml-auto text-gray-600 text-xs font-mono">{lang.extension}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
