// src/components/layout/Footer.js

import React from 'react';
import { BookOpen, Library, BookText, History, Grid } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

// ✅ التحديث الجديد للأزرار الرئيسية
const mobileBottomNavItems = [
    { id: 'dashboard', label: 'المجرة', icon: BookOpen },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'grammar', label: 'دليل القواعد', icon: BookText },
    { id: 'review', label: 'المراجعة', icon: History },
    { id: 'more', label: 'المزيد', icon: Grid },
];

const Footer = () => {
    const { page, handlePageChange, isMoreMenuOpen, setIsMoreMenuOpen, isDarkMode } = useAppContext();

    return (
        <footer className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-around items-center h-16">
                {mobileBottomNavItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => item.id === 'more' ? setIsMoreMenuOpen(true) : handlePageChange(item.id)}
                        className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                            page === item.id || (item.id === 'more' && isMoreMenuOpen)
                            ? (isDarkMode ? 'text-sky-400' : 'text-sky-600')
                            : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                        }`}
                    >
                        <div className={`p-2 rounded-full ${(page === item.id || (item.id === 'more' && isMoreMenuOpen)) ? (isDarkMode ? 'bg-sky-400/10' : 'bg-sky-100') : ''}`}>
                            <item.icon size={20} />
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </footer>
    );
};

export default Footer;
