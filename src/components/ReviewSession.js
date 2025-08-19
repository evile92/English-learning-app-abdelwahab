// src/components/ReviewSession.js

import React, { useState } from 'react';
import { LoaderCircle, Check, X, ArrowLeft } from 'lucide-react';

const ReviewSession = ({ items, onSessionComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionFinished, setSessionFinished] = useState(false);

    if (sessionFinished) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative text-center">
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">🎉 أحسنت!</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">لقد أكملت جلسة المراجعة لهذا اليوم. العقل السليم في المراجعة المنتظمة!</p>
                    <button onClick={onSessionComplete} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600">العودة إلى المجرة</button>
                </div>
            </div>
        );
    }
    
    const handleNext = (knewIt) => {
        // هنا يمكنك لاحقاً إضافة منطق لتحديث مستوى المراجعة في Firestore
        // بناءً على ما إذا كان المستخدم يعرف الإجابة أم لا (knewIt)
        
        setIsFlipped(false);
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setSessionFinished(true);
        }
    };

    const currentItem = items[currentIndex];

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative flex flex-col items-center">
             <button onClick={onSessionComplete} className="self-start text-sky-500 dark:text-sky-400 font-semibold mb-6 flex items-center gap-2"><ArrowLeft size={16}/> إنهاء الجلسة</button>
            <p className="text-slate-600 dark:text-slate-300 mb-6">العنصر {currentIndex + 1} من {items.length}</p>

            <div className="w-full max-w-md h-64 perspective-1000">
                <div 
                    className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer text-center">
                        <p className="text-4xl font-bold text-slate-800 dark:text-white">
                            {currentItem.type === 'lesson' ? currentItem.title : currentItem.en}
                        </p>
                    </div>
                    <div className="absolute w-full h-full backface-hidden bg-sky-400 dark:bg-sky-600 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer rotate-y-180">
                        <p dir="rtl" className="text-4xl font-bold text-white">
                           {currentItem.type === 'lesson' ? 'هل تتذكر هذا الدرس؟' : currentItem.ar}
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-slate-600 dark:text-slate-400">هل تذكرت الإجابة؟</p>
            <div className="flex items-center justify-center gap-6 mt-4">
                <button onClick={() => handleNext(false)} className="p-4 bg-red-500/20 text-red-600 rounded-full hover:bg-red-500/30"><X size={32}/></button>
                <button onClick={() => handleNext(true)} className="p-4 bg-green-500/20 text-green-600 rounded-full hover:bg-green-500/30"><Check size={32}/></button>
            </div>
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
