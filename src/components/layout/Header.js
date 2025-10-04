// src/components/layout/Header.js

import React from 'react';
import { BookOpen, Library, Feather, Mic, Heart, User, Sun, Moon } from 'lucide-react'; // ❌ حذفت Download
import StellarSpeakLogo from '../StellarSpeakLogo';
import OtherToolsDropdown from '../OtherToolsDropdown';
import { useAppContext } from '../../context/AppContext';
import UserNotifications from './UserNotifications'; 

const mainNavItems = [
    { id: 'dashboard', label: 'المجرة', icon: BookOpen },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
];

const Header = () => {
    const { user, page, handlePageChange, isDarkMode, setIsDarkMode, setIsProfileModalOpen } = useAppContext();
    
    // ❌ حذفت المتغير القديم
    // ❌ حذفت useEffect القديم  
    // ❌ حذفت handleInstallClick القديم
    
    return (
        <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* --- قسم الشعار --- */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handlePageChange('dashboard')}>
                        <StellarSpeakLogo />
                        <span className={`hidden sm:block text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span>
                    </div>

                    {/* --- القائمة الرئيسية للكمبيوتر --- */}
                    <div className="hidden lg:flex items-center gap-8">
                        {mainNavItems.map(item => (
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
                        
                        <OtherToolsDropdown />
                    </div>

                    {/* --- قسم الأزرار الجانبية --- */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        
                        {/* ❌ حذفت الزر القديم بالكامل */}
                        
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
                            title={isDarkMode ? 'التحويل للوضع المضيء' : 'التحويل للوضع الداكن'}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <a
                           href="https://paypal.me/ABDELOUAHABELKOUCH"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                            <Heart size={16} />
                            <span className="hidden sm:inline">ادعمنا</span>
                        </a>

                        {user && <UserNotifications />}

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
