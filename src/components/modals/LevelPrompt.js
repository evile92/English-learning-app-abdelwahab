import React from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. استيراد الأدوات الجديدة

export default function LevelPrompt() {
    const { userLevel } = useAppContext();
    const navigate = useNavigate(); // 2. تهيئة دالة التنقل
    const location = useLocation(); // 3. جلب المسار الحالي

    // 4. تحديث شرط الإظهار ليعتمد على المسار (URL)
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
            <button
                onClick={() => navigate('/test')} // 5. تحديث حدث النقر
                className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
                <FileText size={20} />
                <span>ابدأ الاختبار</span>
            </button>
        </div>
    );
}
