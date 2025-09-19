// src/components/ReadingCenter.js

import React, { useState, useRef } from 'react';
import { Sparkles, Newspaper, ArrowLeft, LoaderCircle, Star, Volume2, Square, MessageSquare } from 'lucide-react';
import { initialReadingMaterials } from '../data/lessons';
import { useAppContext } from '../context/AppContext';

import { runGemini } from '../helpers/geminiHelper';
const ReadingCenter = () => {
    const { handleSaveWord } = useAppContext();
    const [materials, setMaterials] = useState(initialReadingMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generationType, setGenerationType] = useState('story');
    const [translation, setTranslation] = useState({ word: '', meaning: '', show: false, loading: false });
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechRate, setSpeechRate] = useState(1);
    const isCancelledByUser = useRef(false);

    const [storySegments, setStorySegments] = useState([]);
    const [choices, setChoices] = useState([]);
    const [isLoadingNext, setIsLoadingNext] = useState(false);

    const handleGenerate = async (type) => {
        setIsGenerating(true);
        setGenerationType(type);
        setError('');
        setStorySegments([]);
        setChoices([]);
        
        let topic = '';
        let prompt;
        let schema;
        
        if (type === 'interactive-story') {
             const storyTopics = ["a mysterious old map", "a spaceship adventure", "a lost kingdom"];
             topic = storyTopics[Math.floor(Math.random() * storyTopics.length)];
             prompt = `You are a creative writer and game master. Start a short interactive story for a B1-level English learner about "${topic}". The story should be about 100 words and end with a choice. Return a JSON object with two keys: "content" (the story text) and "choices" (an array of 2-3 short strings, each representing a choice).`;
             schema = { type: "OBJECT", properties: { content: { type: "STRING" }, choices: { type: "ARRAY", items: { type: "STRING" } } }, required: ["content", "choices"] };
       } else {
    // --- بداية الإصلاح ---
    let topics;
if (type === 'article') {
    // قائمة موسعة للمقالات (20 موضوعًا)
    topics = [
        // مواضيع عامة وعلمية
        "the importance of recycling for the planet", 
        "the benefits of regular exercise on the mind", 
        "how technology has changed communication", 
        "the history of coffee and its journey around the world", 
        "the secrets of the deep ocean and its creatures",
        "why bees are essential for our ecosystem",
        "the future of space travel and colonizing Mars",
        "the psychology of colors in marketing",
        "simple techniques for better time management",
        "the story of a famous invention like the light bulb",
        // مواضيع طبية (حسب طلبك)
        "understanding the basics of cancer",
        "the importance of mental health awareness",
        "how vaccines work to protect us",
        "healthy eating habits for a stronger heart",
        // مواضيع سياحية (حسب طلبك)
        "a tourist's guide to the wonders of Egypt",
        "exploring the vibrant culture of Japan",
        "the natural beauty of the Amazon rainforest",
        "a journey through the historical cities of Italy",
        "why Paris is called the city of love",
        "the unique wildlife of Australia"
    ];
} else { // type === 'story'
    // قائمة موسعة للقصص (20 موضوعًا)
    topics = [
        // مغامرة وخيال علمي
        "a message in a bottle from the future", 
        "a secret garden hidden in a big city", 
        "an animal that can talk and needs help", 
        "a magical camera that shows the past", 
        "an adventure to a floating island in the sky",
        "a time traveler who accidentally changes history",
        "a friendship between a human and a robot",
        // ألغاز (حسب طلبك)
        "a detective solving the mystery of a missing painting",
        "a strange coded message found in an old book",
        "the mystery of the ship that disappeared in the fog",
        "a famous chef who must find a secret ingredient",
        // رومانسية (حسب طلبك)
        "two people who meet by chance during a train journey",
        "a love letter that gets delivered 50 years late",
        "a story about finding love in an unexpected place, like a library",
        // رعب وتشويق (حسب طلبك)
        "a house that remembers its previous owners",
        "a strange noise coming from the basement every night",
        "a mysterious phone call with no one on the other end",
        "a forest where the trees whisper secrets",
        // قصص إنسانية
        "a musician who finds a lost and powerful song",
        "a chef who cooks with emotions instead of ingredients"
    ];
}

// 1. أنشئ قائمة جديدة تستبعد الموضوع الأخير الذي تم استخدامه
const availableTopics = topics.filter(t => t !== lastUsedTopic);

// 2. اختر موضوعًا عشوائيًا من القائمة الجديدة المفلترة
topic = availableTopics[Math.floor(Math.random() * availableTopics.length)];

// 3. قم بتحديث "الذاكرة" بالموضوع الجديد الذي اخترته للتو
setLastUsedTopic(topic);
    // --- نهاية الإصلاح ---

    prompt = `You are a creative writer. Generate a short ${type} for a B1-level English language learner about "${topic}". The content should be about 150 words long. Return the result as a JSON object with two keys: "title" and "content".`;
    schema = { type: "OBJECT", properties: { title: { type: "STRING" }, content: { type: "STRING" } }, required: ["title", "content"] };
}
        try {
            const result = await runGemini(prompt, schema);
            if (type === 'interactive-story') {
                 setStorySegments([result.content]);
                 setChoices(result.choices);
                 setSelectedMaterial({ id: Date.now(), type: 'Interactive Story', title: `قصة تفاعلية عن ${topic}`, content: result.content });
            } else {
                 const newMaterial = { id: Date.now(), type: type === 'story' ? 'Story' : 'Article', ...result };
                 setMaterials(prev => [newMaterial, ...prev]);
                 setSelectedMaterial(newMaterial);
            }
        } catch (e) {
            setError("فشلت عملية التوليد. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUserChoice = async (choice) => {
        setIsLoadingNext(true);
        setError('');
        
        const fullStoryContext = storySegments.join(' ');
        const prompt = `The story so far is: "${fullStoryContext}". The user chose to "${choice}". Continue the story for another 50-70 words and end with a new choice. Return a JSON object with two keys: "content" (the next part of the story) and "choices" (an array of 2-3 short strings, each representing a new choice). If the story is over, provide "The End" as the only choice.`;
        const schema = { type: "OBJECT", properties: { content: { type: "STRING" }, choices: { type: "ARRAY", items: { type: "STRING" } } }, required: ["content", "choices"] };
        
        try {
            const result = await runGemini(prompt, schema);
            setStorySegments(prev => [...prev, result.content]);
            setChoices(result.choices);
        } catch (e) {
            setError("عذراً، حدث خطأ في توليد الجزء التالي من القصة.");
        } finally {
            setIsLoadingNext(false);
        }
    };
    
    const handleWordClick = async (word) => {
        const cleanedWord = word.replace(/[.,!?]/g, '').trim();
        if (!cleanedWord) return;
        setTranslation({ word: cleanedWord, meaning: '', show: true, loading: true });
        const prompt = `Translate the English word "${cleanedWord}" to Arabic. Return a JSON object with one key: "translation".`;
        const schema = { type: "OBJECT", properties: { translation: { type: "STRING" } }, required: ["translation"] };
        try {
            const result = await runGemini(prompt, schema);
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
        utterance.onend = () => {
            setIsSpeaking(false);
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            if (!isCancelledByUser.current) {
                alert("حدث خطأ أثناء محاولة قراءة النص.");
            }
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    if (selectedMaterial) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <button onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); setSelectedMaterial(null); }} className="mb-6 text-sky-500 dark:text-sky-400 hover:underline flex items-center"><ArrowLeft size={16} className="mr-1" /> العودة إلى المكتبة</button>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{selectedMaterial.title}</h2>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${selectedMaterial.type === 'Story' || selectedMaterial.type === 'Interactive Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{selectedMaterial.type}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-full">
                        {[0.75, 1, 1.5].map(rate => (
                            <button
                                key={rate}
                                onClick={() => {
                                    setSpeechRate(rate);
                                    if (isSpeaking) {
                                        isCancelledByUser.current = true;
                                        window.speechSynthesis.cancel();
                                    }
                                }}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${speechRate === rate ? 'bg-sky-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                {rate}x
                            </button>
                        ))}
                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        <button
                            onClick={() => handleListenToStory(selectedMaterial.content || storySegments.join(' '))}
                            className="flex items-center gap-2 pl-3 pr-4 py-1 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-all"
                        >
                            {isSpeaking ? ( <><Square size={16} /> إيقاف</> ) : ( <><Volume2 size={16} /> استمع</> )}
                        </button>
                    </div>
                </div>
                <div className="prose dark:prose-invert max-w-none mt-6 text-lg text-left leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    {selectedMaterial.type === 'Interactive Story' ? (
                        <>
                           {storySegments.map((segment, index) => (
                               <p key={index} dir="ltr" className="animate-fade-in">
                                  {segment.split(/(\s+)/).map((word, i) => (
                                    word.trim() ?
                                     <span key={i} onClick={() => handleWordClick(word)} className="cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-md p-0.5 -m-0.5 transition-colors">
                                       {word}
                                     </span> :
                                     <span key={i}>{word}</span>
                                  ))}
                               </p>
                           ))}
                           {isLoadingNext && (
                                <div className="text-center p-4">
                                     <LoaderCircle className="animate-spin text-sky-500" size={32} />
                                </div>
                           )}
                           {choices.length > 0 && choices[0] !== "The End" && (
                               <div className="mt-6 border-t pt-4 border-slate-200 dark:border-slate-700 animate-fade-in">
                                   <p className="font-semibold text-slate-800 dark:text-white mb-3">ماذا ستفعل؟</p>
                                   <div className="flex flex-col sm:flex-row gap-3">
                                       {choices.map((choice, index) => (
                                           <button key={index} onClick={() => handleUserChoice(choice)} disabled={isLoadingNext} className="flex-1 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                               {choice}
                                           </button>
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
                    ) : (
                        <p>
                            {selectedMaterial.content.split(/(\s+)/).map((segment, index) => (
                               segment.trim() ? 
                               <span key={index} onClick={() => handleWordClick(segment)} className="cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-md p-0.5 -m-0.5 transition-colors">
                                   {segment}
                               </span> :
                               <span key={index}>{segment}</span>
                            ))}
                        </p>
                    )}
                </div>
                {translation.show && (
                    <div onClick={() => setTranslation({ word: '', meaning: '', show: false, loading: false })} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
                        <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">{translation.word}</h3>
                            <div className="mt-4 min-h-[40px] flex items-center">
                                {translation.loading ? 
                                 <LoaderCircle className="animate-spin text-sky-500" /> :
                                 <p className="text-xl text-slate-600 dark:text-slate-300" dir="rtl">{translation.meaning}</p>
                                }
                            </div>
                            {!translation.loading && translation.meaning !== 'فشلت الترجمة' && (
                                <button 
                                    onClick={() => handleSaveWord(translation.word, translation.meaning)}
                                    className="mt-6 w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Star size={18} /> أضف إلى قاموسي
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

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
                    <button onClick={() => handleGenerate('interactive-story')} disabled={isGenerating} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"> 
                        {isGenerating && generationType === 'interactive-story' ? <LoaderCircle className="animate-spin" /> : <><MessageSquare size={16} /> قصة تفاعلية</>} 
                    </button>
                </div> 
            </div> 
            {error && <p className="text-red-500 mb-4">{error}</p>} 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                {materials.map(material => (
                    <div key={material.id} onClick={() => setSelectedMaterial(material)} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"> 
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${material.type === 'Story' || material.type === 'Interactive Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{material.type}</span> 
                        <h3 className="text-xl font-bold mt-3 text-slate-800 dark:text-white">{material.title}</h3> 
                        <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{material.content}</p> 
                    </div>
                ))} 
            </div> 
        </div> 
    );
};

export default ReadingCenter;
