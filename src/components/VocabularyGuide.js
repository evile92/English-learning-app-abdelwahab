// src/components/VocabularyGuide.js

import React, { useState } from 'react';
// --- إضافة أيقونة الصوت ---
import { ArrowLeft, Tag, ChevronRight, Volume2 } from 'lucide-react'; 
import { vocabularyCategories } from '../data/vocabularyLists';
import { useAppContext } from '../context/AppContext';

const VocabularyGuide = () => {
    const { handlePageChange } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // --- دالة النطق ---
    const speak = (text, event) => {
        event.stopPropagation(); // لمنع إغلاق القائمة عند الضغط على الزر
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            alert('عذراً، متصفحك لا يدعم ميزة النطق.');
        }
    };

    // دالة لعرض قائمة الكلمات عند اختيار فئة
    const renderTermsList = (category) => (
        <div className="animate-fade-in">
            <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة إلى الفئات
            </button>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span> {category.title}
                </h2>
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                    {category.terms.map((term, index) => (
                        <li key={index} className="p-4 flex justify-between items-center" dir="ltr">
                            <div className="flex items-center gap-3">
                                {/* --- زر النطق --- */}
                                <button onClick={(e) => speak(term.en, e)} className="text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300">
                                    <Volume2 size={22} />
                                </button>
                                <span className="font-semibold text-lg text-slate-800 dark:text-slate-200" dir="ltr">{term.en}</span>
                            </div>
                            <span className="text-lg text-slate-600 dark:text-slate-300" dir="rtl">{term.ar}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    // دالة لعرض قائمة الفئات
    const renderCategoryList = () => (
        <div className="animate-fade-in">
            <button onClick={() => handlePageChange('grammar')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة إلى دليل القواعد
            </button>
            <div className="text-center mb-8">
                <Tag className="mx-auto text-sky-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">دليل المفردات الأساسية</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">اختر فئة لتصفح الكلمات الشائعة.</p>
            </div>
            <div className="space-y-4">
                {vocabularyCategories.map((category) => (
                    <button 
                        key={category.title} 
                        onClick={() => setSelectedCategory(category)}
                        className="w-full bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-lg flex justify-between items-center text-left hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{category.emoji}</span>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{category.title}</h2>
                        </div>
                        <ChevronRight className="text-slate-400" />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 z-10 relative max-w-4xl mx-auto">
            {selectedCategory ? renderTermsList(selectedCategory) : renderCategoryList()}
        </div>
    );
};

export default VocabularyGuide;
