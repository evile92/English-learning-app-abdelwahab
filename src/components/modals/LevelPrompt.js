import React from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function LevelPrompt() {
    const { userLevel, page, setPage } = useAppContext();

    if (userLevel || (page === 'welcome' || page === 'test' || page === 'nameEntry')) {
        return null;
    }

    return (
        <div className="fixed bottom-24 md:bottom-10 right-10 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg mb-2 text-center border border-slate-200 dark:border-slate-700 max-w-xs">
                <p className="font-semibold text-slate-800 dark:text-white">حدد مستواك للبدء!</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">أجرِ اختبار تحديد المستوى لفتح الدروس.</p>
            </div>
            <button
                onClick={() => setPage('test')}
                className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
                <FileText size={20} />
                <span>ابدأ الاختبار</span>
            </button>
        </div>
    );
}
