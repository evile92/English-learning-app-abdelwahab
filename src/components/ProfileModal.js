import React from 'react';
import { User, Search, Sun, Moon, LogOut, LogIn, X } from 'lucide-react';

const ProfileModal = ({ user, userName, isDarkMode, setIsDarkMode, handlePageChange, handleLogout, onClose }) => {
    // دالة لإغلاق النافذة عند الضغط على زر معين
    const navigateAndClose = (page) => {
        handlePageChange(page);
        onClose();
    };
    
    // دالة لتسجيل الخروج وإغلاق النافذة
    const logoutAndClose = () => {
        handleLogout();
        onClose();
    };

    // دالة لتسجيل الدخول وإغلاق النافذة
    const loginAndClose = () => {
        navigateAndClose('login');
    };

    return (
        // الخلفية المعتمة
        <div 
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
        >
            {/* حاوية النافذة المنبثقة */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700"
            >
                {/* رأس النافذة مع زر الإغلاق */}
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

                {/* جسم النافذة (الخيارات) */}
                <div className="py-2">
                    {user && (
                        <>
                            <button onClick={() => navigateAndClose('profile')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <User size={18}/> ملفي الشخصي
                            </button>
                            <button onClick={() => navigateAndClose('search')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Search size={18}/> بحث
                            </button>
                        </>
                    )}
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
                        {isDarkMode ? 'الوضع المضيء' : 'الوضع الداكن'}
                    </button>
                </div>

                {/* ذيل النافذة (تسجيل الخروج/الدخول) */}
                <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    {user ? (
                        <button onClick={logoutAndClose} className="w-full text-right flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md">
                            <LogOut size={18}/> تسجيل الخروج
                        </button>
                    ) : (
                        <button onClick={loginAndClose} className="w-full text-right flex items-center gap-3 px-3 py-2 text-green-500 hover:bg-green-500/10 rounded-md">
                            <LogIn size={18}/> تسجيل الدخول
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
