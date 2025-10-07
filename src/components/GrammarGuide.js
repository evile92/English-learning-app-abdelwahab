// src/components/GrammarGuide.js

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookText, Search, ChevronDown, BookCopy, MessagesSquare, Tag, Layers, ArrowLeft } from 'lucide-react';
import { grammarRules } from '../data/grammarRules';
import { useAppContext } from '../context/AppContext';

const GrammarGuide = () => {
  const navigate = useNavigate();
  const { handlePageChange } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRule, setSelectedRule] = useState(null);

  // --- بداية الكود الجديد ---
  const [view, setView] = useState('main'); // 'main', 'byLevel', 'levelRules'
  const [selectedLevel, setSelectedLevel] = useState(null); // 'A1', 'B2', etc.

  const filteredRulesBySearch = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return grammarRules.filter(rule =>
      rule.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredRulesByLevel = useMemo(() => {
    if (!selectedLevel) return [];
    let rules = grammarRules.filter(rule => rule.level === selectedLevel);
    if (searchTerm.trim()) {
        rules = rules.filter(rule => rule.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return rules;
  }, [selectedLevel, searchTerm]);

  const toggleRule = (rule) => {
    setSelectedRule(selectedRule?.id === rule.id ? null : rule);
  };

  // شاشة عرض القواعد (سواء من البحث أو من اختيار المستوى)
  const renderRulesList = (rules, backView) => (
    <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden animate-fade-in">
            <button
              onClick={() => toggleRule(rule)}
              className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-slate-800 dark:text-white"
            >
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
        {rules.length === 0 && (
           <div className="text-center text-slate-500 pt-8">
            <p>لا توجد نتائج مطابقة.</p>
          </div>
        )}
    </div>
  );

  if (view === 'byLevel') {
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-4xl mx-auto">
            <button onClick={() => setView('main')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة إلى دليل القواعد
            </button>
            <div className="text-center mb-8">
                <Layers className="mx-auto text-sky-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">القواعد حسب المستوى</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">اختر مستوى لعرض قواعده النحوية.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
                    <button key={level} onClick={() => { setSelectedLevel(level); setView('levelRules'); }} className="p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl text-center hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300">
                        <h2 className="text-3xl font-bold text-sky-500 dark:text-sky-400">{level}</h2>
                        <p className="font-semibold mt-1">المستوى {level}</p>
                    </button>
                ))}
            </div>
        </div>
    )
  }

  if (view === 'levelRules') {
    return (
         <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-4xl mx-auto">
            <button onClick={() => { setView('byLevel'); setSearchTerm(''); }} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة لاختيار المستوى
            </button>
             <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={`ابحث ضمن قواعد مستوى ${selectedLevel}...`}
                    className="w-full p-3 pl-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>
            {renderRulesList(filteredRulesByLevel)}
        </div>
    )
  }

  // هذه هي الشاشة الرئيسية
  return (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <BookText className="mx-auto text-sky-500 mb-4" size={48} />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">دليل القواعد النحوية</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">مرجعك السريع لكل قواعد اللغة الإنجليزية.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuideButton onClick={() => setView('byLevel')} icon={Layers} title="القواعد حسب المستوى" description="تصفح القواعد لكل مستوى." color="from-purple-500 to-pink-500" />
        <GuideButton onClick={() => navigate('/verb-list')} icon={BookCopy} title="قائمة الأفعال" description="تصفح الأفعال الشاذة والمنتظمة." color="from-sky-500 to-indigo-500" />
        <GuideButton onClick={() => navigate('/idioms')} icon={MessagesSquare} title="العبارات والتعابير" description="اكتشف التعابير الاصطلاحية." color="from-teal-500 to-cyan-500" />
        <GuideButton onClick={() => navigate('/vocabulary-guide')} icon={Tag} title="دليل المفردات" description="كلمات شائعة حسب الفئة." color="from-amber-500 to-orange-500" />
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="أو ابحث عن أي قاعدة نحوية مباشرة (مثال: Present Simple)"
          className="w-full p-3 pl-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {searchTerm.trim() && renderRulesList(filteredRulesBySearch)}
    </div>
  );
};

const GuideButton = ({ onClick, icon: Icon, title, description, color }) => (
    <div onClick={onClick} className={`p-5 bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg flex items-center justify-between cursor-pointer hover:scale-105 transition-transform duration-300`}>
        <div className="flex items-center gap-4">
            <Icon size={32} />
            <div>
                <h2 className="font-bold text-xl">{title}</h2>
                <p className="text-sm opacity-90">{description}</p>
            </div>
        </div>
        <ChevronDown className="-rotate-90" />
    </div>
);
// --- نهاية الكود الجديد ---

export default GrammarGuide;
