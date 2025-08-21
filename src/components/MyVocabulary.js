// src/components/MyVocabulary.js

import React, { useState } from 'react';
import { BookMarked, BrainCircuit, Repeat, BookOpen, LoaderCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// --- (بداية الإضافة): دالة مساعد Gemini API ---
// تم إضافتها هنا لتوليد الأمثلة بشكل مستقل داخل المكون
async function runGemini(prompt, schema) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) { throw new Error("API key is missing."); }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { throw new Error(`API request failed with status ${response.status}`); }
        const result = await response.json();
        if (!result.candidates || result.candidates.length === 0) { throw new Error("No candidates returned from API."); }
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) { console.error("Error calling Gemini API:", error); throw error; }
}
// --- (نهاية الإضافة) ---


const MyVocabulary = () => {
    const { userData } = useAppContext();
    const [view, setView] = useState('list');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // --- (بداية التعديلات): حالات جديدة لإدارة الأمثلة ---
    const [examplesCache, setExamplesCache] = useState({});
    const [activeWord, setActiveWord] = useState(null); // الكلمة التي يتم عرض أمثلتها
    const [isLoadingExamples, setIsLoadingExamples] = useState(false);
    // --- (نهاية التعديلات) ---

    const vocabulary = userData?.myVocabulary || [];

    // --- (بداية التعديلات): دالة جديدة لجلب الأمثلة ---
    const handleShowExamples = async (wordEn) => {
        // إذا كانت الأمثلة موجودة بالفعل في الذاكرة المؤقتة، اعرضها مباشرة
        if (examplesCache[wordEn]) {
            setActiveWord(wordEn);
            return;
        }

        // إذا لم تكن موجودة، اطلبها من Gemini API
        setActiveWord(wordEn);
        setIsLoadingExamples(true);
        const prompt = `You are an English teacher. Create three simple and clear example sentences for the word "${wordEn}" for an A2-level student. Return a JSON object with a key "examples" which is an array of 3 strings.`;
        const schema = { type: "OBJECT", properties: { examples: { type: "ARRAY", items: { type: "STRING" } } }, required: ["examples"] };

        try {
            const result = await runGemini(prompt, schema);
            setExamplesCache(prev => ({ ...prev, [wordEn]: result.examples }));
        } catch (error) {
            console.error("Failed to generate examples:", error);
            setExamplesCache(prev => ({ ...prev, [wordEn]: ["فشل في تحميل الأمثلة. حاول مرة أخرى."] }));
        } finally {
            setIsLoadingExamples(false);
        }
    };
    // --- (نهاية التعديلات) ---

    if (vocabulary.length === 0) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative text-center">
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
                    <BookMarked className="mx-auto text-sky-500 mb-4" size={48} />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">قاموسك الخاص فارغ</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">اذهب إلى "مركز القراءة"، وعندما تجد كلمة جديدة، اضغط عليها ثم أضفها إلى قاموسك لتبدأ في بناء حصيلتك اللغوية!</p>
                </div>
            </div>
        );
    }
    
    // ... (كود البطاقات التعليمية يبقى كما هو بدون تغيير) ...
    // ... (Flashcards view code remains unchanged) ...

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><BookMarked /> قاموسي الخاص</h1>
                    <p className="text-slate-600 dark:text-slate-300">لديك {vocabulary.length} كلمة محفوظة. راجعها بانتظام لترسيخها.</p>
                </div>
                <button onClick={() => setView('flashcards')} className="bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center gap-2">
                    <BrainCircuit size={20} /> ابدأ المراجعة (بطاقات)
                </button>
            </div>
            
            {/* --- (بداية التعديلات): عرض الكلمات على شكل شبكة بطاقات --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vocabulary.map((word, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
                        <div>
                            <p className="font-bold text-2xl text-slate-800 dark:text-slate-100">{word.en}</p>
                            <p dir="rtl" className="text-slate-600 dark:text-slate-300 mt-1">{word.ar}</p>
                        </div>

                        <div className="mt-4">
                             {/* زر عرض الأمثلة */}
                            <button 
                                onClick={() => activeWord === word.en ? setActiveWord(null) : handleShowExamples(word.en)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
                            >
                                <BookOpen size={16} />
                                {activeWord === word.en ? 'إخفاء الأمثلة' : 'عرض الأمثلة'}
                            </button>

                            {/* قسم عرض الأمثلة */}
                            {activeWord === word.en && (
                                <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-3 animate-fade-in">
                                    {isLoadingExamples ? (
                                        <div className="flex justify-center items-center p-4">
                                            <LoaderCircle className="animate-spin text-sky-500" />
                                        </div>
                                    ) : (
                                        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                                            {examplesCache[word.en]?.map((ex, i) => (
                                                <li key={i} dir="ltr" className="text-left">{ex}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* --- (نهاية التعديلات) --- */}
        </div>
    );
};

export default MyVocabulary;
