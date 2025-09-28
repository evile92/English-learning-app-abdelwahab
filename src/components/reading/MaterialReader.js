// src/components/reading/MaterialReader.js

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Newspaper, ArrowLeft, LoaderCircle, Star, Volume2, Square, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { runGemini } from '../../helpers/geminiHelper';

const MaterialReader = ({ material, onBack }) => {
    const { handleSaveWord } = useAppContext();
    const [translation, setTranslation] = useState({ word: '', meaning: '', show: false, loading: false });
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechRate, setSpeechRate] = useState(1);
    const isCancelledByUser = useRef(false);

    // State for interactive story
    const [storySegments, setStorySegments] = useState([material.content]);
    const [choices, setChoices] = useState(material.choices || []);
    const [isLoadingNext, setIsLoadingNext] = useState(false);
    const [storyTurn, setStoryTurn] = useState(0);
    const [storyError, setStoryError] = useState('');

    useEffect(() => {
        // Stop speech when component unmounts or material changes
        return () => {
            // First, check if the browser supports the speech feature
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [material]);
    
    const handleWordClick = async (word) => {
        const cleanedWord = word.replace(/[.,!?]/g, '').trim();
        if (!cleanedWord) return;
        setTranslation({ word: cleanedWord, meaning: '', show: true, loading: true });
        const prompt = `Translate the English word "${cleanedWord}" to Arabic. Return a JSON object with one key: "translation".`;
        const schema = { type: "object", properties: { translation: { type: "string" } }, required: ["translation"] };
        try {
            const result = await runGemini(prompt, 'story', schema);
            setTranslation({ word: cleanedWord, meaning: result.translation, show: true, loading: false });
        } catch (e) {
            setTranslation({ word: cleanedWord, meaning: 'فشلت الترجمة', show: true, loading: false });
        }
    };

    const handleListenToStory = (textToSpeak) => {
        if (typeof window.speechSynthesis === 'undefined') {
            alert("عذرًا، متصفحك لا يدعم هذه الميزة.");
            return;
        }
        if (isSpeaking) {
            isCancelledByUser.current = true;
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        isCancelledByUser.current = false;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = speechRate;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            if (!isCancelledByUser.current) alert("حدث خطأ أثناء محاولة قراءة النص.");
            setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const handleUserChoice = async (choice) => {
        setIsLoadingNext(true);
        setStoryError('');
        
        const newTurn = storyTurn + 1;
        setStoryTurn(newTurn);

        const fullStoryContext = storySegments.join(' ');
        let prompt = newTurn >= 2
            ? `The story so far is: "${fullStoryContext}". The user chose to "${choice}". Write a final, concluding part for the story (about 50-70 words). You MUST end the story now. Return a JSON object with "content" for the final text and "choices" as an array with only one string: "The End".`
            : `The story so far is: "${fullStoryContext}". The user chose to "${choice}". Continue the story for another 50-70 words and end with a new choice. Return a JSON object with "content" for the next part and "choices" as an array of 2-3 short strings.`;
        
        // تعديل المخطط فقط: السماح بصفر اختيارات عند النهاية
        const schema = { 
            type: "object", 
            properties: { 
                content: { type: "string" }, 
                choices: { 
                    type: "array",
                    minItems: 0,
                    maxItems: 3,
                    items: { type: "string" } 
                } 
            }, 
            required: ["content", "choices"] 
        };
        
        try {
            // تمرير mode لضمان إخراج JSON مضبوط من الخادم
            const result = await runGemini(prompt, 'story', schema);
            const nextContent = typeof result?.content === 'string' ? result.content : '';
            const nextChoices = Array.isArray(result?.choices) ? result.choices : [];
            setStorySegments(prev => [...prev, nextContent]);
            setChoices(nextChoices);
        } catch (e) {
            setStoryError("عذراً، حدث خطأ في توليد الجزء التالي من القصة.");
        } finally {
            setIsLoadingNext(false);
        }
    };

    const contentToRender = material.type === 'Interactive Story' ? storySegments.join(' \n\n') : material.content;

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={onBack} className="mb-6 text-sky-500 dark:text-sky-400 hover:underline flex items-center"><ArrowLeft size={16} className="mr-1" /> العودة إلى المكتبة</button>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 dir="ltr" className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{material.title}</h2>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${material.type.includes('Story') ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{material.type}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-full">
                    {[0.75, 1, 1.5].map(rate => (
                        <button key={rate} onClick={() => setSpeechRate(rate)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${speechRate === rate ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{rate}x</button>
                    ))}
                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button onClick={() => handleListenToStory(contentToRender)} className="flex items-center gap-2 pl-3 pr-4 py-1 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-all">
                        {isSpeaking ? <><Square size={16} /> إيقاف</> : <><Volume2 size={16} /> استمع</>}
                    </button>
                </div>
            </div>
            <div dir="ltr" className="prose dark:prose-invert max-w-none mt-6 text-lg text-left leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <p>
                    {contentToRender.split(/(\s+)/).map((segment, index) => (
                       segment.trim() ? <span key={index} onClick={() => handleWordClick(segment)} className="cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-md p-0.5 -m-0.5 transition-colors">{segment}</span> : <span key={index}>{segment}</span>
                    ))}
                </p>
                {material.type === 'Interactive Story' && (
                    <>
                       {isLoadingNext && <div className="text-center p-4"><LoaderCircle className="animate-spin text-sky-500" size={32} /></div>}
                       {storyError && <p className="text-red-500 text-center">{storyError}</p>}
                       {choices.length > 0 && choices[0] !== "The End" && !isLoadingNext && (
                           <div className="mt-6 border-t pt-4 border-slate-200 dark:border-slate-700 animate-fade-in">
                               <p className="font-semibold text-slate-800 dark:text-white mb-3">ماذا ستفعل؟</p>
                               <div className="flex flex-col sm:flex-row gap-3">
                                   {choices.map((choice, index) => (
                                       <button key={index} onClick={() => handleUserChoice(choice)} className="flex-1 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition-all">{choice}</button>
                                   ))}
                               </div>
                           </div>
                       )}
                       {choices.length > 0 && choices[0] === "The End" && (
                           <div className="mt-6 p-4 text-center bg-green-100 dark:bg-green-900/50 rounded-lg animate-fade-in">
                               <p className="text-lg font-bold text-green-800 dark:text-green-200">لقد انتهت القصة. شكراً لقراءتك!</p>
                           </div>
                       )}
                    </>
                )}
            </div>
            {translation.show && (
                <div onClick={() => setTranslation({ show: false })} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">{translation.word}</h3>
                        <div className="mt-4 min-h-[40px] flex items-center">
                            {translation.loading ? <LoaderCircle className="animate-spin text-sky-500" /> : <p className="text-xl text-slate-600 dark:text-slate-300" dir="rtl">{translation.meaning}</p>}
                        </div>
                        {!translation.loading && translation.meaning !== 'فشلت الترجمة' && (
                            <button onClick={() => handleSaveWord(translation.word, translation.meaning)} className="mt-6 w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2"><Star size={18} /> أضف إلى قاموسي</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialReader;

