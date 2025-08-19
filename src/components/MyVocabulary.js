// src/components/MyVocabulary.js

import React, { useState } from 'react';
import { BookMarked, BrainCircuit, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MyVocabulary = () => {
    const { userData } = useAppContext();
    const [view, setView] = useState('list');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const vocabulary = userData?.myVocabulary || [];

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
                <button onClick={() => setView('list')} className="self-start text-sky-500 dark:text-sky-400 font-semibold mb-6">→ العودة إلى القائمة</button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">مراجعة البطاقات</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-6">البطاقة {currentCardIndex + 1} من {vocabulary.length}</p>
                <div className="w-full max-w-md h-64 perspective-1000">
                    <div 
                        className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer">
                            <p className="text-4xl font-bold text-slate-800 dark:text-white">{currentCard.en}</p>
                        </div>
                        <div className="absolute w-full h-full backface-hidden bg-sky-400 dark:bg-sky-600 rounded-2xl shadow-lg flex items-center justify-center p-6 cursor-pointer rotate-y-180">
                            <p dir="rtl" className="text-4xl font-bold text-white">{currentCard.ar}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button onClick={handlePrevCard} className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full"><ChevronLeft /></button>
                    <button onClick={() => setIsFlipped(!isFlipped)} className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full"><Repeat /></button>
                    <button onClick={handleNextCard} className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full"><ChevronRight /></button>
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
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg space-y-3">
                {vocabulary.map((word, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                        <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{word.en}</p>
                        <p dir="rtl" className="text-slate-600 dark:text-slate-300">{word.ar}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyVocabulary;
