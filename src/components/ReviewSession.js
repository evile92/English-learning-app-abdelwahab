// src/components/ReviewSession.js

import React, { useState, useEffect, useCallback } from 'react';
import { LoaderCircle, Check, X, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { manualLessonsContent } from '../data/manualLessons';

// Gemini API Helper (مكرر هنا لسهولة الاستخدام)
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

const ReviewSession = () => {
    const { reviewItems, handlePageChange, handleUpdateReviewItem } = useAppContext();
    const items = reviewItems;
    const onSessionComplete = () => handlePageChange('review');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionFinished, setSessionFinished] = useState(false);
    
    // حالات خاصة بكل بطاقة
    const [isFlipped, setIsFlipped] = useState(false); // للكلمات
    const [lessonQuestion, setLessonQuestion] = useState(null); // لسؤال الدرس
    const [isQuestionLoading, setIsQuestionLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const generateLessonReviewQuestion = useCallback(async (item) => {
        if (!item || item.type !== 'lesson') return;
        setIsQuestionLoading(true);
        setLessonQuestion(null);
        const manualContent = manualLessonsContent[item.id];
        if (!manualContent) {
            console.error("No manual content for this lesson review.");
            setIsQuestionLoading(false);
            return;
        }
        const prompt = `Based on the English explanation for the lesson "${item.title}": "${manualContent.explanation.en}", generate a single, direct multiple-choice question that tests the core concept. The question should be in English. Provide a JSON object with keys: "question", "options" (an array of 4 strings), and "correctAnswer".`;
        const schema = { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" } }, required: ["question", "options", "correctAnswer"] };
        try {
            const result = await runGemini(prompt, schema);
            setLessonQuestion(result);
        } catch (e) {
            // في حال فشل التوليد، انتقل للسؤال التالي كحل بديل
            handleNext(false); 
        } finally {
            setIsQuestionLoading(false);
        }
    }, []);

    useEffect(() => {
        if (items && items.length > 0) {
            const currentItem = items[currentIndex];
            if (currentItem.type === 'lesson') {
                generateLessonReviewQuestion(currentItem);
            }
        }
    }, [currentIndex, items, generateLessonReviewQuestion]);
    
    if (!items || items.length === 0) {
        return <div className="p-4 md:p-8 text-center"> <p>لا توجد عناصر للمراجعة. جارِ العودة...</p> {setTimeout(() => onSessionComplete(), 1500)} </div>;
    }

    if (sessionFinished) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative text-center">
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">🎉 أحسنت!</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">لقد أكملت جلسة المراجعة لهذا اليوم.</p>
                    <button onClick={onSessionComplete} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600">العودة إلى قسم المراجعة</button>
                </div>
            </div>
        );
    }
    
    const handleNext = (wasCorrect) => {
        handleUpdateReviewItem(items[currentIndex], wasCorrect);
        
        // إعادة تعيين الحالات
        setIsFlipped(false);
        setLessonQuestion(null);
        setSelectedOption(null);
        setIsAnswered(false);

        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setSessionFinished(true);
        }
    };

    const handleAnswerLesson = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
    };
    
    const getButtonClass = (option) => {
        if (!isAnswered) return 'bg-white/10 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-700';
        if (option === lessonQuestion.correctAnswer) return 'bg-green-500/50 border-green-400';
        if (option === selectedOption) return 'bg-red-500/50 border-red-400';
        return 'bg-slate-800/50 opacity-60';
    };

    const currentItem = items[currentIndex];

    const renderCardContent = () => {
        if (currentItem.type === 'vocabulary') {
            return (
                <>
                    <div className="w-full max-w-md h-64 perspective-1000">
                        <div className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer text-center">
                                <p className="text-4xl font-bold text-slate-800 dark:text-white">{currentItem.en}</p>
                            </div>
                            <div className="absolute w-full h-full backface-hidden bg-sky-400 dark:bg-sky-600 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer rotate-y-180">
                                <p dir="rtl" className="text-4xl font-bold text-white">{currentItem.ar}</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-slate-600 dark:text-slate-400">هل تذكرت المعنى؟</p>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <button onClick={() => handleNext(false)} className="p-4 bg-red-500/20 text-red-600 rounded-full hover:bg-red-500/30"><X size={32}/></button>
                        <button onClick={() => handleNext(true)} className="p-4 bg-green-500/20 text-green-600 rounded-full hover:bg-green-500/30"><Check size={32}/></button>
                    </div>
                </>
            );
        }

        if (currentItem.type === 'lesson') {
            return (
                <div className="w-full max-w-2xl">
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-2">مراجعة درس: "{currentItem.title}"</p>
                    {isQuestionLoading && <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-sky-500" size={48} /></div>}
                    {lessonQuestion && !isQuestionLoading && (
                        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg animate-fade-in">
                            <h3 dir="ltr" className="text-xl text-slate-800 dark:text-slate-100 mb-6 min-h-[56px] text-left">{lessonQuestion.question}</h3>
                            <div className="space-y-3">
                                {lessonQuestion.options.map((option, i) => (
                                    <button key={i} dir="ltr" onClick={() => handleAnswerLesson(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 ${getButtonClass(option)}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {isAnswered && (
                                <button onClick={() => handleNext(selectedOption === lessonQuestion.correctAnswer)} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all">
                                    متابعة
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative flex flex-col items-center">
            <button onClick={onSessionComplete} className="self-start text-sky-500 dark:text-sky-400 font-semibold mb-6 flex items-center gap-2"><ArrowLeft size={16}/> إنهاء الجلسة</button>
            <p className="text-slate-600 dark:text-slate-300 mb-6">العنصر {currentIndex + 1} من {items.length}</p>
            {renderCardContent()}
            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

export default ReviewSession;
