// src/components/VerbListComponent.js

import React, { useState, useMemo } from 'react';
import { Search, BookCopy, ArrowLeft } from 'lucide-react';
import { regularVerbs, irregularVerbs } from '../data/verbList';
import { useAppContext } from '../context/AppContext';
import SEO from './SEO';

const VerbListComponent = () => {
    const { handlePageChange } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [verbType, setVerbType] = useState('all'); // 'all', 'regular', 'irregular'

    const filteredVerbs = useMemo(() => {
        const term = searchTerm.toLowerCase();
        const allVerbs = {
            regular: regularVerbs.filter(v => v.base.toLowerCase().includes(term) || v.ar.includes(term)),
            irregular: irregularVerbs.filter(v => v.base.toLowerCase().includes(term) || v.ar.includes(term)),
        };

        if (verbType === 'regular') return { regular: allVerbs.regular, irregular: [] };
        if (verbType === 'irregular') return { regular: [], irregular: allVerbs.irregular };
        return allVerbs;

    }, [searchTerm, verbType]);

    // --- بداية الكود الجديد ---
    const VerbList = ({ verbs, title }) => (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white p-5 border-b border-slate-200 dark:border-slate-700">{title}</h2>

            {/* عرض الجدول على الشاشات الكبيرة فقط */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left" dir="ltr">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th className="p-3 font-semibold">Base Form</th>
                            <th className="p-3 font-semibold">Past Simple</th>
                            <th className="p-3 font-semibold">Past Participle</th>
                            <th className="p-3 font-semibold text-right" dir="rtl">المعنى</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                        {verbs.map((verb, index) => (
                            <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                <td className="p-3 font-mono">{verb.base}</td>
                                <td className="p-3 font-mono">{verb.pastSimple}</td>
                                <td className="p-3 font-mono">{verb.pastParticiple}</td>
                                <td className="p-3 text-right" dir="rtl">{verb.ar}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* عرض البطاقات على شاشات الهاتف فقط */}
            <div className="md:hidden">
                <ul className="divide-y divide-slate-200 dark:divide-slate-600">
                    {verbs.map((verb, index) => (
                        <li key={index} className="p-4">
                            <div className="flex justify-between items-center mb-2" dir="ltr">
                                <p className="font-bold text-lg text-sky-600 dark:text-sky-400 font-mono" dir="ltr">{verb.base}</p>
                                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200" dir="rtl">{verb.ar}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
                                    <p className="text-slate-500 dark:text-slate-400">Past Simple</p>
                                    <p className="font-semibold font-mono" dir="ltr">{verb.pastSimple}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md">
                                    <p className="text-slate-500 dark:text-slate-400">Past Participle</p>
                                    <p className="font-semibold font-mono" dir="ltr">{verb.pastParticiple}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {verbs.length === 0 && <p className="p-5 text-center text-slate-500">لا توجد أفعال مطابقة لبحثك.</p>}
        </div>
    );
    // --- نهاية الكود الجديد ---

    return (
        <>
            <SEO 
                title="قائمة الأفعال الإنجليزية - StellarSpeak | أفعال منتظمة وغير منتظمة"
                description="مرجعك الكامل للأفعال الإنجليزية المنتظمة وغير المنتظمة مع معانيها باللغة العربية وجميع التصريفات"
                keywords="أفعال إنجليزية, أفعال منتظمة, أفعال غير منتظمة, تصريف الأفعال, قواعد الإنجليزية"
                url="https://www.stellarspeak.online/?page=verbs"
            />
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-5xl mx-auto">
                <button onClick={() => handlePageChange('grammar')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                    <ArrowLeft size={20} /> العودة إلى دليل القواعد
                </button>
                <div className="text-center mb-8">
                    <BookCopy className="mx-auto text-sky-500 mb-4" size={48} />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">قائمة الأفعال الإنجليزية</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">مرجعك الكامل للأفعال المنتظمة وغير المنتظمة.</p>
                </div>

                <div className="sticky top-20 z-20 bg-sky-50/80 dark:bg-slate-900/80 backdrop-blur-lg p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن فعل بالإنجليزية أو العربية..."
                            className="w-full p-3 pl-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-3 gap-2 bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                        <button onClick={() => setVerbType('all')} className={`px-4 py-2 text-sm font-semibold rounded-full ${verbType === 'all' ? 'bg-white dark:bg-slate-800 text-sky-500' : 'text-slate-600 dark:text-slate-300'}`}>الكل</button>
                        <button onClick={() => setVerbType('irregular')} className={`px-4 py-2 text-sm font-semibold rounded-full ${verbType === 'irregular' ? 'bg-white dark:bg-slate-800 text-sky-500' : 'text-slate-600 dark:text-slate-300'}`}>غير المنتظمة</button>
                        <button onClick={() => setVerbType('regular')} className={`px-4 py-2 text-sm font-semibold rounded-full ${verbType === 'regular' ? 'bg-white dark:bg-slate-800 text-sky-500' : 'text-slate-600 dark:text-slate-300'}`}>المنتظمة</button>
                    </div>
                </div>

                <div className="space-y-8">
                    {filteredVerbs.irregular.length > 0 && (
                        <VerbList verbs={filteredVerbs.irregular} title="Irregular Verbs (الأفعال غير المنتظمة)" />
                    )}
                    {filteredVerbs.regular.length > 0 && (
                        <VerbList verbs={filteredVerbs.regular} title="Regular Verbs (الأفعال المنتظمة)" />
                    )}
                </div>
            </div>
        </>
    );
};

export default VerbListComponent;
