// src/components/layout/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. تم التأكد من استيراد Link
import { BookOpen, Library, Feather, Mic, Heart, User, Sun, Moon, Menu, X } from 'lucide-react';
import { FaBook, FaListAlt, FaComments, FaCheckCircle, FaBullseye } from 'react-icons/fa'; // أيقونات القائمة الجديدة
import StellarSpeakLogo from '../StellarSpeakLogo';
import OtherToolsDropdown from '../OtherToolsDropdown';
import { useAppContext } from '../../context/AppContext';

// 2. تعديل القائمة الرئيسية لإضافة مسارات الروابط 'to'
const mainNavItems = [
    { id: 'dashboard', to: '/', label: 'المجرة', icon: BookOpen },
    { id: 'reading', to: '/reading', label: 'قراءة', icon: Library },
    { id: 'writing', to: '/writing', label: 'كتابة', icon: Feather },
    { id: 'roleplay', to: '/roleplay', label: 'محادثة', icon: Mic },
];

// 3. إنشاء قائمة جديدة للأدوات الإضافية مع مساراتها
const moreToolsLinks = [
    { id: 'grammar', to: '/grammar', label: 'Grammar Guide', icon: FaBook },
    { id: 'vocabulary', to: '/vocabulary', label: 'Vocabulary Lists', icon: FaListAlt },
    { id: 'idioms', to: '/idioms', label: 'Idioms and Phrases', icon: FaComments },
    { id: 'verbs', to: '/verbs', label: 'Irregular Verbs', icon: FaCheckCircle },
    { id: 'test-prep', to: '/test-prep', label: 'Test-Prep Center', icon: FaBullseye }
];

const Header = () => {
    const { page, handlePageChange, isDarkMode, setIsDarkMode, setIsProfileModalOpen } = useAppContext();
    // 4. إضافة حالة لفتح وإغلاق قائمة الهاتف
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 5. دالة موحدة للضغط على الروابط (تغير الرابط والحالة وتغلق القائمة)
    const handleNavClick = (pageId) => {
        handlePageChange(pageId);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* --- قسم الشعار: تم تحويله إلى Link --- */}
                    <Link to="/" className="flex items-center gap-3 cursor-pointer" onClick={() => handlePageChange('dashboard')}>
                        <StellarSpeakLogo />
                        <span className={`hidden sm:block text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span>
                    </Link>

                    {/* --- القائمة الرئيسية للكمبيوتر: تم تحويلها إلى Link --- */}
                    <nav className="hidden md:flex items-center gap-8">
                        {mainNavItems.map(item => (
                             <Link
                                key={item.id}
                                to={item.to}
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
                            </Link>
                        ))}
                        
                        <OtherToolsDropdown />
                    </nav>

                    {/* --- قسم الأزرار الجانبية --- */}
                    <div className="flex items-center gap-2 sm:gap-4">
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
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
                        >
                            <User size={20} />
                        </button>
                        {/* --- 6. زر قائمة الهاتف --- */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-slate-700 dark:text-slate-300">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* --- 7. القائمة المنسدلة للهاتف --- */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
                    <nav className="flex flex-col gap-1">
                         {mainNavItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.to}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`flex items-center w-full text-left gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${ page === item.id ? 'bg-sky-500 text-white' : 'dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700' }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <hr className="my-2 border-slate-200 dark:border-slate-700"/>
                        <h3 className="px-3 text-sm font-semibold text-slate-500 dark:text-slate-400">More Tools</h3>
                        {moreToolsLinks.map(item => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.to}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`flex items-center w-full text-left gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${ page === item.id ? 'bg-sky-500 text-white' : 'dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700' }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
