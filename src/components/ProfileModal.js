// src/components/ProfileModal.js

import React from 'react';
import { Link } from 'react-router-dom'; // (إضافة)
import { User, Search, LogOut, LogIn, X, Info, Mail, BookOpen, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';


// (إزالة) handlePageChange من الخصائص
const ProfileModal = ({ user, userName, handleLogout, onClose }) => {
    const { userData } = useAppContext();

    // (إزالة) navigateAndClose

    const logoutAndClose = () => {
        handleLogout();
        onClose();
    };

    // (إزالة) loginAndClose

    return (
        <div 
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700"
            >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    {user ? (
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white truncate">{user.displayName || userName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                    ) : (
                        <p className="font-bold text-slate-800 dark:text-white">أهلاً بك</p>
                    )}
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>

                {/* (تعديل) جسم النافذة (الخيارات) */}
                <div className="py-2">
                    {user && (
                        <>
                            {userData?.isAdmin && (
                                <Link to="/admin" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <Shield size={18}/> لوحة التحكم
                                </Link>
                            )}
                            <Link to="/profile" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <User size={18}/> ملفي الشخصي
                            </Link>
                            <Link to="/search" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Search size={18}/> بحث
                            </Link>
                        </>
                    )}
                    <Link to="/about" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Info size={18}/> عن الموقع
                    </Link>
                    <Link to="/contact" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Mail size={18}/> اتصل بنا
                    </Link>
                    <Link to="/blog" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <BookOpen size={18}/> المدونة
                    </Link>
                    <Link to="/privacy" onClick={onClose} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Shield size={18}/> سياسة الخصوصية
                    </Link>
                </div>

                {/* (تعديل) ذيل النافذة (تسجيل الخروج/الدخول) */}
                <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    {user ? (
                        <button onClick={logoutAndClose} className="w-full text-right flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md">
                            <LogOut size={18}/> تسجيل الخروج
                        </button>
                    ) : (
                        <Link to="/login" onClick={onClose} className="w-full text-right flex items-center gap-3 px-3 py-2 text-green-500 hover:bg-green-500/10 rounded-md">
                            <LogIn size={18}/> تسجيل الدخول
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
