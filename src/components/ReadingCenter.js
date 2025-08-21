import React, { useState } from 'react';
// --- (بداية الإضافة): استيراد أيقونات جديدة للزر ---
import { Sparkles, Newspaper, ArrowLeft, LoaderCircle, Star, Volume2, Square } from 'lucide-react';
// --- (نهاية الإضافة) ---
import { initialReadingMaterials } from '../data/lessons';

// Gemini API Helper (يبقى كما هو للترجمة وتوليد القصص)
async function runGemini(prompt, schema) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Gemini API key is not set!");
        throw new Error("API key is missing.");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
            const errorBody = await response.text(); console.error("API Error Body:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        if (!result.candidates || result.candidates.length === 0) { throw new Error("No candidates returned from API."); }
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

const ReadingCenter = ({ onSaveWord }) => {
    const [materials, setMaterials] = useState(initialReadingMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generationType, setGenerationType] = useState('story');
    const [translation, setTranslation] = useState({ word: '', meaning: '', show: false, loading: false });

    // --- (بداية الإضافة): حالة جديدة لتتبع ما إذا كان النص يُقرأ بصوت عالٍ ---
    const [isSpeaking, setIsSpeaking] = useState(false);
    // --- (نهاية الإضافة) ---

    // ... (كود توليد القصة والمقالات يبقى كما هو) ...
    
    // --- (بداية الإضافة): دالة جديدة للاستماع إلى القصة باستخدام Web Speech API ---
    const handleListenToStory = (textToSpeak) => {
        // التحقق مما إذا كان المتصفح يدعم الميزة
        if (typeof window.speechSynthesis === 'undefined') {
            alert("عذرًا، متصفحك لا يدعم هذه الميزة.");
            return;
        }

        // إذا كان يقرأ بالفعل، قم بإيقافه
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        // إنشاء كائن النطق الجديد
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US'; // تحديد اللغة الإنجليزية

        // عند انتهاء القراءة، قم بتحديث الحالة
        utterance.onend = () => {
            setIsSpeaking(false);
        };
        
        // عند حدوث خطأ، قم بتحديث الحالة
        utterance.onerror = () => {
            setIsSpeaking(false);
            alert("حدث خطأ أثناء محاولة قراءة النص.");
        };

        // بدء القراءة
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };
    // --- (نهاية الإضافة) ---

    if (selectedMaterial) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <button onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); setSelectedMaterial(null); }} className="mb-6 text-sky-500 dark:text-sky-400 hover:underline flex items-center"><ArrowLeft size={16} className="mr-1" /> العودة إلى المكتبة</button>
                
                {/* --- (بداية التعديل): إضافة الزر بجانب العنوان --- */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{selectedMaterial.title}</h2>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${selectedMaterial.type === 'Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{selectedMaterial.type}</span>
                    </div>
                    <button
                        onClick={() => handleListenToStory(selectedMaterial.content)}
                        className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-all shadow-md"
                    >
                        {isSpeaking ? (
                            <>
                                <Square size={16} /> إيقاف
                            </>
                        ) : (
                            <>
                                <Volume2 size={16} /> استمع للقصة
                            </>
                        )}
                    </button>
                </div>
                {/* --- (نهاية التعديل) --- */}

                <div className="prose dark:prose-invert max-w-none mt-6 text-lg text-left leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    {/* ... (باقي الكود لعرض النص والترجمة يبقى كما هو) ... */}
                </div>
                {/* ... (باقي الكود يبقى كما هو) ... */}
            </div>
        );
    }

    // ... (باقي كود عرض قائمة القصص والمقالات يبقى كما هو) ...
    return ( 
        <div className="p-4 md:p-8 animate-fade-in z-10 relative"> 
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8"> 
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">📖 مركز القراءة والتأمل</h1>
                    <p className="text-slate-600 dark:text-slate-300">اقرأ محتوى متنوعًا، أو قم بتوليد محتوى جديد بنفسك.</p>
                </div> 
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-sm"> 
                    <button onClick={() => handleGenerate('story')} disabled={isGenerating} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"> 
                        {isGenerating && generationType === 'story' ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={16} /> توليد قصة</>} 
                    </button> 
                    <button onClick={() => handleGenerate('article')} disabled={isGenerating} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"> 
                        {isGenerating && generationType === 'article' ? <LoaderCircle className="animate-spin" /> : <><Newspaper size={16} /> توليد مقال</>} 
                    </button> 
                </div> 
            </div> 
            {error && <p className="text-red-500 mb-4">{error}</p>} 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                {materials.map(material => (
                    <div key={material.id} onClick={() => setSelectedMaterial(material)} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"> 
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${material.type === 'Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{material.type}</span> 
                        <h3 className="text-xl font-bold mt-3 text-slate-800 dark:text-white">{material.title}</h3> 
                        <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{material.content}</p> 
                    </div>
                ))} 
            </div> 
        </div> 
    );
};

export default ReadingCenter;
