import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
//   const [selectedLang, setSelectedLang] = useState<'VI' | 'EN' | 'SK'>('EN');
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t.nav.lessons, path: '/chao/levels' },
    { name: t.nav.chat, path: '/chao/chat' },
    { name: t.nav.profile, path: '/chao/me' },
  ];

  const languages = [
    { code: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'SK', name: 'Slovenčina', flag: '🇸🇰' },
  ];

  return (
    <header className="w-full bg-emerald-800 dark:bg-emerald-600 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand / Logo */}
            <Link to="/chao/about" className="flex items-center gap-0.5 group">
                {/* <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    🌱
                </span> */}
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xl font-bold border border-white/50 group-hover:scale-110 transition-transform duration-200">
                    🌱
                </span>
                <span className="font-extrabold text-xl tracking-wide text-white">
                    Chao
                </span>
            </Link>

            {/* Desktop Navigation Options with Vertical Dividers */}
            <nav className="flex items-center">
            {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                <div key={link.path} className="flex items-center">
                    {index > 0 && (
                    <div className="h-5 w-0.5 bg-neutral-200 md:mx-2" />
                    )}

                    <Link
                    to={link.path}
                    className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                        isActive
                        ? 'text-emerald-500 dark:text-emerald-500'
                        : 'text-white  hover:bg-neutral-400/50 dark:hover:bg-neutral-700/50'
                    }`}
                    >
                    {link.name}
                    </Link>
                </div>
                );
            })}
            </nav>

            {/* Right Section: Language Selector Dropdown */}
            <div className="relative">
            <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 p-1.5 rounded border border-neutral-200 dark:border-neutral-900 bg-emerald-800 dark:bg-emerald-600 text-white font-semibold text-sm transition-colors"
            >
                <span>{languages.find((l) => l.code === language)?.flag}</span>
                <span>{language}</span>
                <span className={`text-xs transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}>
                ▼
                </span>
            </button>

            {/* Dropdown Menu */}
            {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 text-zinc-800 dark:text-white bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-900 rounded shadow-lg py-1 z-50">
                {languages.map((lang) => (
                    <button
                    key={lang.code}
                    onClick={() => {
                        setLanguage(lang.code as 'VI' | 'EN' | 'SK');
                        setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors ${
                        language === lang.code
                        ? 'text-tree-600 dark:text-tree-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                    >
                    <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                    </span>
                    {language === lang.code && <span>✓</span>}
                    </button>
                ))}
                </div>
            )}
            </div>
        </div>
    </header>
  );
}