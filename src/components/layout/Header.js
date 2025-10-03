// src/components/layout/Header.js

import React from 'react';
import { BookOpen, Library, Feather, Mic, Heart, User, Sun, Moon, Download } from 'lucide-react';
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
    // (إضافة 2): إضافة متغير `user` من الـ context
    const { user, page, handlePageChange, isDarkMode, setIsDarkMode, setIsProfileModalOpen } = useAppContext();
    
    // يمكنك استخدام متغير حالة لتتبع ما إذا كان يجب إظهار الزر
    const [showInstallPrompt, setShowInstallPrompt] = React.useState(null);
    
    // إضافة useEffect للتحقق من دعم المتصفح لميزة التثبيت
    React.useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            // Store the event so we can use it later
            setShowInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // دالة لتشغيل عملية التثبيت
    const handleInstallClick = () => {
        if (showInstallPrompt) {
            showInstallPrompt.prompt();
            showInstallPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome);
                if (choiceResult.outcome === 'accepted') {
                    console.log('User installed the PWA');
                    setShowInstallPrompt(null);
                } else {
                    console.log('User dismissed the PWA install prompt');
                }
            });
        }
    };
    
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
                        
                        {/* --- الزر الجديد لتحميل التطبيق --- */}
                        {showInstallPrompt && (
                           <button 
                               onClick={handleInstallClick}
                               className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                           >
                               <Download size={16} />
                               <span className="hidden sm:inline">تثبيت التطبيق</span>
                           </button>
                        )}
                        {/* --- نهاية الزر الجديد --- */}
                        
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

                        {/* (إضافة 3): عرض أيقونة الإشعارات إذا كان المستخدم مسجلاً */}
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
