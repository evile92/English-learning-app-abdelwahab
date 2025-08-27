// src/components/IdiomsAndPhrases.js

import React, { useState, useMemo } from 'react';
import { Search, MessagesSquare, ArrowLeft } from 'lucide-react';
import { commonPhrases } from '../data/phrases';
import { useAppContext } from '../context/AppContext';

const IdiomsAndPhrases = () => {
    const { handlePageChange } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPhrases = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return commonPhrases;
        return commonPhrases.filter(p =>
            p.phrase.toLowerCase().includes(term) ||
            p.meaning_ar.includes(term) ||
            p.meaning_en.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-4xl mx-auto">
            <button onClick={() => handlePageChange('grammar')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة إلى دليل القواعد
            </button>
            <div className="text-center mb-8">
                <MessagesSquare className="mx-auto text-sky-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">العبارات والتعابير الاصطلاحية</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">مرجعك لفهم واستخدام العبارات الشائعة في اللغة الإنجليزية.</p>
            </div>

            <div className="sticky top-20 z-20 bg-sky-50/80 dark:bg-slate-900/80 backdrop-blur-lg p-4 rounded-xl mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث عن عبارة أو معنى..."
                        className="w-full p-3 pl-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredPhrases.length > 0 ? (
                    filteredPhrases.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                            <h2 className="text-xl font-bold text-sky-600 dark:text-sky-400" dir="ltr">{item.phrase}</h2>
                            <p className="mt-2 text-slate-700 dark:text-slate-300" dir="ltr">{item.meaning_en}</p>
                            <p className="mt-1 text-slate-500 dark:text-slate-400 text-right" dir="rtl">{item.meaning_ar}</p>
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold" dir="ltr">Example:</p>
                                <p className="text-slate-800 dark:text-slate-200" dir="ltr"><em>"{item.example}"</em></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-500 pt-8">
                        <p>لا توجد نتائج مطابقة لبحثك عن: "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdiomsAndPhrases;
