// src/components/GrammarGuide.js

import React, { useState, useMemo } from 'react';
import { BookText, Search, ChevronDown } from 'lucide-react';
import { grammarRules } from '../data/grammarRules'; // استيراد البيانات

const GrammarGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRule, setSelectedRule] = useState(null);

  const filteredRules = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return grammarRules.filter(rule => 
      rule.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleRule = (rule) => {
    setSelectedRule(selectedRule?.id === rule.id ? null : rule);
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <BookText className="mx-auto text-sky-500 mb-4" size={48} />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">دليل القواعد النحوية</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">مرجعك السريع لكل قواعد اللغة الإنجليزية.</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن أي قاعدة نحوية (مثال: Present Simple)"
          className="w-full p-3 pl-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="space-y-4">
        {searchTerm.trim() === '' && (
          <div className="text-center text-slate-500 pt-8">
            <p>ابدأ بالكتابة في شريط البحث أعلاه لعرض القواعد.</p>
          </div>
        )}

        {searchTerm.trim() !== '' && filteredRules.length > 0 && filteredRules.map(rule => (
          <div key={rule.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden animate-fade-in">
            <button 
              onClick={() => toggleRule(rule)}
              className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-slate-800 dark:text-white"
            >
              {/* ✅  تم حذف مؤشر المستوى من هنا */}
              <span>{rule.title}</span>
              <ChevronDown className={`transition-transform duration-300 ${selectedRule?.id === rule.id ? 'rotate-180' : ''}`} />
            </button>
            {selectedRule?.id === rule.id && (
              <div className="px-5 pb-5 animate-fade-in">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-left" dir="ltr">{rule.explanation.en}</p>
                  <p className="text-right text-slate-500 dark:text-slate-400 border-r-4 border-sky-500 pr-4" dir="rtl">{rule.explanation.ar}</p>
                  <h4 className="text-left" dir="ltr">Usage Examples:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left" dir="ltr">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="p-2">Subject/Type</th>
                          <th className="p-2">Form</th>
                          <th className="p-2">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rule.usage.map((use, index) => (
                          <tr key={index} className="border-t border-slate-200 dark:border-slate-600">
                            <td className="p-2 font-semibold">{use.pronoun}</td>
                            <td className="p-2">{use.form}</td>
                            <td className="p-2 font-mono">{use.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {searchTerm.trim() !== '' && filteredRules.length === 0 && (
           <div className="text-center text-slate-500 pt-8">
            <p>لا توجد نتائج مطابقة لبحثك عن: "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarGuide;
