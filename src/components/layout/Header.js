// src/components/layout/Header.js

import React from 'react';
import { BookOpen, Feather, Library, Mic, Voicemail, History, Search, BookMarked, User, Heart, Target } from 'lucide-react';
import StellarSpeakLogo from '../StellarSpeakLogo';
import { useAppContext } from '../../context/AppContext';

// --- (بداية التعديل) ---
const desktopNavItems = [
    { id: 'dashboard', label: 'المجرة', icon: BookOpen },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'pronunciation', label: 'نطق', icon: Voicemail },
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'vocabulary', label: 'قاموسي', icon: BookMarked },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'review', label: 'مراجعة', icon: History },
    { id: 'weakPoints', label: 'نقاط ضعفي', icon: Target }, // <-- تمت إضافة الزر هنا
    { id: 'search', label: 'بحث', icon: Search },
];
// --- (نهاية التعديل) ---

const Header = () => {
    const { page, handlePageChange, isDarkMode, setIsProfileModalOpen } = useAppContext();

    return (
        <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handlePageChange('dashboard')}>
                        <StellarSpeakLogo />
                        <span className={`hidden sm:block text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {desktopNavItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handlePageChange(item.id)}
                                title={item.label}
                                className={`flex items-center gap-2 font-semibold transition-colors ${
                                    page === item.id
                                    ? 'text-sky-500 dark:text-sky-400'
                                    : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="text-sm">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <a
                           href="https://paypal.me/ABDELOUAHABELKOUCH"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                            <Heart size={16} />
                            <span className="hidden sm:inline">ادعمنا</span>
                        </a>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
                        >
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
