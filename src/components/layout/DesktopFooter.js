// src/components/layout/DesktopFooter.js
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import StellarSpeakLogo from '../StellarSpeakLogo';

const DesktopFooter = () => {
    const { handlePageChange, isDarkMode } = useAppContext();

    // دالة للضغط على الروابط
    const onLinkClick = (page) => {
        handlePageChange(page);
        window.scrollTo(0, 0); // للذهاب لأعلى الصفحة عند التنقل
    };

    return (
        // هذا الكود يخفي الـ Footer على الشاشات الصغيرة (أصغر من md)
        <footer className={`hidden md:block w-full py-8 mt-12 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-right gap-6">
                
                {/* الجزء الأيسر: الشعار والنص */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-3">
                        <StellarSpeakLogo />
                        <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Stellar Speak
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                        انطلق في رحلة كونية لتعلم الإنجليزية، من كوكب المبتدئين إلى سديم الحكمة.
                    </p>
                </div>

                {/* الجزء الأيمن: الروابط */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <button onClick={() => onLinkClick('blog')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                        المدونة
                    </button>
                    <button onClick={() => onLinkClick('about')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                        عن الموقع
                    </button>
                    <button onClick={() => onLinkClick('privacy')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                        سياسة الخصوصية
                    </button>
                    <button onClick={() => onLinkClick('contact')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                        اتصل بنا
                    </button>
                </div>
            </div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
                © {new Date().getFullYear()} Stellar Speak. جميع الحقوق محفوظة.
            </div>
        </footer>
    );
};

export default DesktopFooter;
