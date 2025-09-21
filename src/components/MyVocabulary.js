// src/components/MyVocabulary.js

import React, { useState } from 'react';
import { BookMarked, BrainCircuit, Repeat, BookOpen, LoaderCircle, ChevronLeft, ChevronRight, Trash2, Volume2, Search, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ✅ دالة للتواصل مع Gemini
import { runGemini } from '../helpers/geminiHelper';

const MyVocabulary = () => {
    const { userData, handleDeleteWord, handleSaveWord } = useAppContext();
    const [view, setView] = useState('list');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [examplesCache, setExamplesCache] = useState({});
    const [isLoadingExamples, setIsLoadingExamples] = useState(false);
    const [selectedWordForExamples, setSelectedWordForExamples] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const vocabulary = userData?.myVocabulary || [];

    const handleSpeak = (textToSpeak) => {
        if (typeof window.speechSynthesis === 'undefined') {
            alert("عذرًا، متصفحك لا يدعم هذه الميزة.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleShowExamples = async (word) => {
        setSelectedWordForExamples(word);
        if (examplesCache[word.en]) {
            return;
        }
        
        setIsLoadingExamples(true);
        const prompt = `You are an English teacher. For the word \"${word.en}\", create three simple example sentences. Return a JSON object with a key \"examples\" which is an array of 3 objects. Each object must have two keys: \"en\" (the English sentence) and \"ar\" (the simple Arabic translation).`;
        const schema = {
            type: "OBJECT",
            properties: {
                examples: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            en: { type: "STRING" },
                            ar: { type: "STRING" }
                        },
                        required: ["en", "ar"]
                    }
                }
            },
            required: ["examples"]
        };
        try {
            const result = await runGemini(prompt, schema);
            setExamplesCache(prev => ({ ...prev, [word.en]: result.examples }));
        } catch (error) {
            console.error("Failed to generate examples:", error);
            setExamplesCache(prev => ({ ...prev, [word.en]: [{ en: "Failed to load examples. Please try again.", ar: "فشل في تحميل الأمثلة. يرجى المحاولة مرة أخرى." }] }));
        } finally {
            setIsLoadingExamples(false);
        }
    };
    
    const handleSearchWord = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResult(null);
            return;
        }

        setIsSearching(true);
        setSearchResult(null);
        
        // --- 🟢 الخطوة 1: تم تحديث الـ Prompt ---
        const prompt = `You are an expert lexicographer. For the English word \"${searchTerm.trim()}\", provide a detailed JSON object with the following keys:
            1. \"word\": The word itself.
            2. \"translation\": A simple, one or two-word Arabic translation for flashcard use.
            3. \"definition\": An object with \"en\" for the English definition and \"ar\" for the detailed Arabic definition.
            4. \"examples\": An array of 3 example sentences. Each object should have \"en\" for the English sentence and \"ar\" for the Arabic translation.`;

        // --- 🟢 الخطوة 2: تم تحديث الـ Schema ---
        const schema = {
            type: "OBJECT",
            properties: {
                word: { type: "STRING" },
                translation: { type: "STRING" },
                definition: {
                    type: "OBJECT",
                    properties: {
                        en: { type: "STRING" },
                        ar: { type: "STRING" }
                    }
                },
                examples: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            en: { type: "STRING" },
                            ar: { type: "STRING" }
                        }
                    }
                }
            },
            required: ["word", "translation", "definition", "examples"]
        };
        
        try {
            const result = await runGemini(prompt, schema);
            setSearchResult(result);
        } catch (error) {
            console.error("Failed to search for word:", error);
            setSearchResult({ error: "فشل البحث. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى." });
        } finally {
            setIsSearching(false);
        }
    };

    if (vocabulary.length === 0 && !searchTerm && !isSearching) {
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
    
    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % vocabulary.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex - 1 + vocabulary.length) % vocabulary.length);
    };
    
    if (view === 'flashcards') {
        const currentCard = vocabulary[currentCardIndex];
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative flex flex-col items-center">
                <button onClick={() => setView('list')} className="self-start text-sky-500 dark:text-sky-400 font-semibold mb-6 flex items-center gap-2"><X size={16}/> إغلاق البطاقات</button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">مراجعة البطاقات</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-6">البطاقة {currentCardIndex + 1} من {vocabulary.length}</p>
                <div className="w-full max-w-md h-64 perspective-1000">
                    <div 
                        className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer text-center">
                            <p className="text-4xl font-bold text-slate-800 dark:text-white">{currentCard.en}</p>
                        </div>
                        <div className="absolute w-full h-full backface-hidden bg-sky-400 dark:bg-sky-600 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer rotate-y-180 text-center">
                            <p dir="rtl" className="text-4xl font-bold text-white">{currentCard.ar}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button onClick={handlePrevCard} className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600"><ChevronLeft /></button>
                    <button onClick={() => setIsFlipped(!isFlipped)} className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600"><Repeat /></button>
                    <button onClick={handleNextCard} className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600"><ChevronRight /></button>
                </div>
                <style jsx>{`
                    .perspective-1000 { perspective: 1000px; }
                    .transform-style-3d { transform-style: preserve-3d; }
                    .rotate-y-180 { transform: rotateY(180deg); }
                    .backface-hidden { backface-visibility: hidden; }
                `}</style>
            </div>
        );
    }

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResult(null);
    };

    return (
        <>
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><BookMarked /> قاموسي الخاص</h1>
                        <p className="text-slate-600 dark:text-slate-300">لديك {vocabulary.length} كلمة محفوظة. راجعها بانتظام لترسيخها.</p>
                    </div>
                    {vocabulary.length > 0 && (
                        <button onClick={() => setView('flashcards')} className="bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center gap-2">
                            <BrainCircuit size={20} /> ابدأ المراجعة (بطاقات)
                        </button>
                    )}
                </div>

                <form onSubmit={handleSearchWord} className="relative mb-8">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث عن كلمة جديدة..."
                        className="w-full p-3 pr-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                        dir="ltr"
                    />
                </form>
                
                {isSearching ? (
                    <div className="flex justify-center items-center p-8">
                        <LoaderCircle className="animate-spin text-sky-500" size={48} />
                    </div>
                ) : searchResult ? (
                    <div>
                        <button 
                            onClick={handleClearSearch} 
                            className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                            <ChevronLeft size={20} /> العودة إلى قاموسي
                        </button>
                        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg animate-fade-in">
                            {searchResult.error ? (
                                <p className="text-red-500 text-center">{searchResult.error}</p>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2" dir="ltr">{searchResult.word}</h3>
                                    <p className="text-slate-600 dark:text-slate-300" dir="ltr">**{searchResult.definition.en}**</p>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1" dir="rtl">{searchResult.definition.ar}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">أمثلة:</h4>
                                        <ul className="space-y-2">
                                            {searchResult.examples.map((ex, i) => (
                                                <li key={i}>
                                                    <p dir="ltr" className="text-left text-slate-800 dark:text-slate-200">{ex.en}</p>
                                                    <p dir="rtl" className="text-right text-sm text-slate-500 dark:text-slate-400">{ex.ar}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        // --- 🟢 الخطوة 3: تم تحديث دالة الحفظ ---
                                        onClick={() => {
                                            handleSaveWord(searchResult.word, searchResult.translation);
                                            handleClearSearch();
                                        }}
                                        className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <BookMarked size={20} /> أضف إلى قاموسي
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vocabulary.map((word, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-bold text-2xl text-slate-800 dark:text-slate-100">{word.en}</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSpeak(word.en); }}
                                            className="p-2 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-full transition-colors flex-shrink-0"
                                            title={`استمع إلى نطق ${word.en}`}
                                        >
                                            <Volume2 size={22} />
                                        </button>
                                    </div>
                                    <p dir="rtl" className="text-slate-600 dark:text-slate-300 mt-1">{word.ar}</p>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleShowExamples(word)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
                                        >
                                            <BookOpen size={16} />
                                            عرض الأمثلة
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWord(word)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                            title={`حذف كلمة ${word.en}`}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedWordForExamples && (
                <div 
                    onClick={() => setSelectedWordForExamples(null)} 
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
                    >
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">أمثلة على كلمة "{selectedWordForExamples.en}"</h3>
                            <button onClick={() => setSelectedWordForExamples(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {isLoadingExamples || !examplesCache[selectedWordForExamples.en] ? (
                                <div className="flex justify-center items-center p-8">
                                    <LoaderCircle className="animate-spin text-sky-500" />
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {examplesCache[selectedWordForExamples.en]?.map((ex, i) => (
                                        <li key={i} className="border-b border-slate-100 dark:border-slate-700 pb-3 last:border-b-0">
                                            <p dir="ltr" className="text-left text-lg text-slate-800 dark:text-slate-200">{ex.en}</p>
                                            <p dir="rtl" className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{ex.ar}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyVocabulary;
