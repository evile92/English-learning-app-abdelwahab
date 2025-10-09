import React from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LevelPrompt() {
    const { userLevel } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const nonPromptPaths = ['/welcome', '/test', '/nameEntry'];
    if (userLevel || nonPromptPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <div className="fixed bottom-24 md:bottom-10 right-10 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg mb-2 text-center border border-slate-200 dark:border-slate-700 max-w-xs">
                <p className="font-semibold text-slate-800 dark:text-white">حدد مستواك للبدء!</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">أجرِ اختبار تحديد المستوى لفتح الدروس.</p>
            </div>
            {/* الزر الجديد المحسن */}
            <button
                onClick={() => navigate('/test')}
                className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 group"
            >
                <FileText 
                    size={18} 
                    className="mr-2 transition-transform group-hover:scale-110" 
                />
                <span>ابدأ الاختبار</span>
                <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </button>
        </div>
    );
}
