import React from 'react';
// --- (بداية التعديل): تحديث الأيقونات المستوردة ---
import { User, Search, LogOut, LogIn, X, Info, Mail, BookOpen, Shield } from 'lucide-react';
// --- (نهاية التعديل) ---
import { useAppContext } from '../context/AppContext'; // <-- ✅ تمت إضافة هذا السطر


const ProfileModal = ({ user, userName, isDarkMode, setIsDarkMode, handlePageChange, handleLogout, onClose }) => {
    const { userData } = useAppContext(); // <-- ✅ تمت إضافة هذا السطر

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
                            {/* ✅ بداية الجزء الذي تم تعديله */}
                            {userData?.isAdmin && (
                                <button onClick={() => navigateAndClose('admin')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <Shield size={18}/> لوحة التحكم
                                </button>
                            )}
                            {/* 🛑 نهاية الجزء الذي تم تعديله */}
                            <button onClick={() => navigateAndClose('profile')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <User size={18}/> ملفي الشخصي
                            </button>
                            <button onClick={() => navigateAndClose('search')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Search size={18}/> بحث
                            </button>
                        </>
                    )}
                    {/* --- (بداية التعديل) --- */}
                    <button onClick={() => navigateAndClose('about')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Info size={18}/> عن الموقع
                    </button>
                    <button onClick={() => navigateAndClose('contact')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Mail size={18}/> اتصل بنا
                    </button>
                    {/* تمت إضافة الأزرار الجديدة هنا */}
                    <button onClick={() => navigateAndClose('blog')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <BookOpen size={18}/> المدونة
                    </button>
                    <button onClick={() => navigateAndClose('privacy')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Shield size={18}/> سياسة الخصوصية
                    </button>
                    {/* --- (نهاية التعديل) --- */}
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
