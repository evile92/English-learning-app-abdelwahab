// src/components/ProfileModal.js

import React, { useState } from 'react';
// --- ✅ 1. استيراد الأيقونات الجديدة ---
import { User, Search, LogOut, LogIn, X, Info, Mail, Download, Share, MoreVertical } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';


// --- ✅ 2. إضافة المكونات الجديدة داخل نفس الملف ---

// أيقونة بسيطة لمتصفح سفاري
const SafariIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#F0F0F0"/>
        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="#38BDF8" strokeWidth="2"/>
        <path d="M8 8L16 16" stroke="#F44336" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 8L8 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// أيقونة بسيطة لمتصفح كروم
const ChromeIcon = () => (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#4A4A4A" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="#4285F4"/>
        <path d="M12 2A10 10 0 0 1 20.66 7.34L12 12V2Z" fill="#EA4335"/>
        <path d="M2 12A10 10 0 0 1 7.34 3.34L12 12H2Z" fill="#FBBC05"/>
        <path d="M12 22A10 10 0 0 1 3.34 16.66L12 12V22Z" fill="#34A853"/>
    </svg>
);

// مكون النافذة المنبثقة للإرشادات
const InstallGuideModal = ({ onClose }) => (
    <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
    >
        <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
        >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">كيفية تثبيت التطبيق</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200"><SafariIcon /> لهواتف آيفون (متصفح سفاري)</h4>
                    <ol className="list-decimal list-inside mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                        <li>افتح الموقع في متصفح **سفاري**.</li>
                        <li>اضغط على أيقونة **"مشاركة"** (مربع مع سهم <Share className="inline-block" size={16} />).</li>
                        <li>مرر للأسفل واختر **"إضافة إلى الشاشة الرئيسية"**.</li>
                        <li>اضغط على **"إضافة"** في الزاوية العلوية.</li>
                    </ol>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200"><ChromeIcon /> لهواتف أندرويد (متصفح كروم)</h4>
                    <ol className="list-decimal list-inside mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                        <li>افتح الموقع في متصفح **جوجل كروم**.</li>
                        <li>اضغط على زر القائمة (ثلاث نقاط <MoreVertical className="inline-block" size={16} />).</li>
                        <li>ابحث عن خيار **"تثبيت التطبيق"** أو **"Install app"**.</li>
                        <li>اتبع التعليمات لتأكيد الإضافة.</li>
                    </ol>
                </div>
            </div>
             <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    بمجرد التثبيت، سيظهر Stellar Speak على شاشتك الرئيسية مثل أي تطبيق آخر!
                </p>
            </div>
        </div>
    </div>
);


const ProfileModal = ({ onClose }) => {
    // --- ✅ 3. إضافة حالة جديدة للتحكم في نافذة الإرشادات ---
    const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
    const { user, userName, handlePageChange, handleLogout } = useAppContext();

    const navigateAndClose = (page) => {
        handlePageChange(page);
        onClose();
    };
    
    const logoutAndClose = () => {
        handleLogout();
        onClose();
    };

    const loginAndClose = () => {
        navigateAndClose('login');
    };

    return (
        <>
            {/* عرض نافذة الإرشادات إذا كانت حالتها true */}
            {isInstallGuideOpen && <InstallGuideModal onClose={() => setIsInstallGuideOpen(false)} />}
            
            {/* النافذة الرئيسية للملف الشخصي */}
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
                        <button onClick={() => navigateAndClose('about')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Info size={18}/> عن الموقع
                        </button>
                        <button onClick={() => navigateAndClose('contact')} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Mail size={18}/> اتصل بنا
                        </button>

                        {/* --- ✅ 4. الزر الجديد الذي يفتح نافذة الإرشادات --- */}
                        <div className="my-1 mx-4 border-t border-slate-200 dark:border-slate-700"></div>
                        <button onClick={() => setIsInstallGuideOpen(true)} className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Download size={18}/> كيفية تثبيت التطبيق
                        </button>
                    </div>

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
        </>
    );
};

export default ProfileModal;
