// src/components/layout/Footer.js

import React from 'react';
import { NavLink } from 'react-router-dom'; // (إضافة)
import { BookOpen, Library, BookText, History, Grid } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

// (تعديل) تغيير id إلى path
const mobileBottomNavItems = [
    { path: '/dashboard', label: 'المجرة', icon: BookOpen },
    { path: '/reading', label: 'قراءة', icon: Library },
    { path: '/grammar', label: 'دليل القواعد', icon: BookText },
    { path: '/review', label: 'المراجعة', icon: History },
    { path: 'more', label: 'المزيد', icon: Grid }, // هذا ليس مسارًا حقيقيًا، لذا لا نضع "/"
];

const Footer = () => {
    // (إزالة) page, handlePageChange
    const { isMoreMenuOpen, setIsMoreMenuOpen, isDarkMode } = useAppContext();

    return (
        <footer className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-around items-center h-16">
                {mobileBottomNavItems.map(item => {
                    // (تعديل) إذا كان العنصر هو "المزيد"، نعرض زرًا عاديًا. وإلا، نعرض NavLink.
                    if (item.path === 'more') {
                        return (
                            <button
                                key={item.path}
                                onClick={() => setIsMoreMenuOpen(true)}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                                    isMoreMenuOpen
                                    ? (isDarkMode ? 'text-sky-400' : 'text-sky-600')
                                    : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                                }`}
                            >
                                <div className={`p-2 rounded-full ${isMoreMenuOpen ? (isDarkMode ? 'bg-sky-400/10' : 'bg-sky-100') : ''}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    }
                    
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                                    isActive
                                    ? (isDarkMode ? 'text-sky-400' : 'text-sky-600')
                                    : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-full ${isActive ? (isDarkMode ? 'bg-sky-400/10' : 'bg-sky-100') : ''}`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-xs font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </footer>
    );
};

export default Footer;
