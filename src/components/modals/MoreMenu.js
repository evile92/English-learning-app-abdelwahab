// src/components/modals/MoreMenu.js
import React from 'react';
import { Link } from 'react-router-dom'; // (إضافة)
import { X, Feather, Mic, Headphones, BookMarked, Target, Search, User, Voicemail } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

// (تعديل) تغيير id إلى path
const moreMenuItems = [
    { path: '/writing', label: 'كتابة', icon: Feather },
    { path: '/roleplay', label: 'محادثة', icon: Mic },
    { path: '/pronunciation', label: 'نطق', icon: Voicemail },
    { path: '/listening', label: 'استماع', icon: Headphones },
    { path: '/vocabulary', label: 'قاموسي', icon: BookMarked },
    { path: '/smart-focus', label: 'التركيز الذكي', icon: Target },
    { path: '/search', label: 'بحث', icon: Search },
    { path: '/profile', label: 'ملفي الشخصي', icon: User },
];

export default function MoreMenu() {
    // (إزالة) handlePageChange
    const { isMoreMenuOpen, setIsMoreMenuOpen, isDarkMode } = useAppContext();

    if (!isMoreMenuOpen) return null;

    return (
        <div 
            onClick={() => setIsMoreMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/40 z-40 animate-fade-in-fast"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`fixed bottom-0 left-0 right-0 p-4 pb-20 rounded-t-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">جميع الميزات</h3>
                    <button onClick={() => setIsMoreMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {moreMenuItems.map(item => (
                        // (تعديل) استخدام Link بدلاً من button
                        <Link 
                            key={item.path} 
                            to={item.path}
                            onClick={() => setIsMoreMenuOpen(false)}
                            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl 
                                        ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} 
                                        transition-colors duration-200 h-24 sm:h-28`}
                        >
                            <item.icon 
                                size={30} 
                                className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} 
                            />
                            <span className={`text-xs font-semibold text-center mt-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
