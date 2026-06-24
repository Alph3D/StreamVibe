// components/singlePage/LanguageSelector.jsx
"use client";

import { useState } from "react";

const LanguageSelector = ({ 
    currentLanguage = "fr", 
    onLanguageChange,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

    // Langues disponibles
    const languages = [
        { code: "fr", label: "Français", flag: "🇫🇷" },
        { code: "en", label: "Anglais", flag: "🇬🇧" },
        { code: "es", label: "Espagnol", flag: "🇪🇸" },
        { code: "de", label: "Allemand", flag: "🇩🇪" },
        { code: "it", label: "Italien", flag: "🇮🇹" },
        { code: "pt", label: "Portugais", flag: "🇵🇹" },
        { code: "ja", label: "Japonais", flag: "🇯🇵" },
        { code: "ko", label: "Coréen", flag: "🇰🇷" },
        { code: "ru", label: "Russe", flag: "🇷🇺" },
        { code: "ar", label: "Arabe", flag: "🇸🇦" },
        { code: "hi", label: "Hindi", flag: "🇮🇳" },
        { code: "zh", label: "Chinois", flag: "🇨🇳" },
    ];

    const handleLanguageSelect = (langCode) => {
        setSelectedLanguage(langCode);
        setIsOpen(false);
        if (onLanguageChange) onLanguageChange(langCode);
    };

    const currentLang = languages.find(l => l.code === selectedLanguage) || languages[0];

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 
                           rounded-lg border border-gray-700/50 
                           text-white text-sm font-medium
                           flex items-center justify-between
                           transition-all duration-200
                           hover:border-gray-600
                           min-w-[130px]"
            >
                <span className="flex items-center gap-2">
                    <span className="text-lg">{currentLang.flag}</span>
                    <span className="text-white font-medium">{currentLang.label}</span>
                </span>
                <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full 
                              bg-gray-800/95 backdrop-blur-sm 
                              border border-gray-700/50 
                              rounded-lg shadow-2xl
                              max-h-60 overflow-y-auto
                              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <div className="p-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className={`w-full px-3 py-2.5 text-left text-sm rounded-lg
                                          transition-all duration-150 flex items-center gap-3
                                          ${selectedLanguage === lang.code
                                              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                          }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span className="font-medium">{lang.label}</span>
                                {selectedLanguage === lang.code && (
                                    <svg className="w-4 h-4 text-red-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;