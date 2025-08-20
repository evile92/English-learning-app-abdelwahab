// src/components/FinalExam.js

import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FinalExam = () => {
    const { 
        finalExamQuestions, 
        handleFinalExamComplete,
        currentExamLevel,
        initialLevels
    } = useAppContext();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // تأثير بسيط لإعادة تعيين الحالة عند بدء امتحان جديد
    useEffect(() => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
    }, [finalExamQuestions]);

    if (!finalExamQuestions || finalExamQuestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <LoaderCircle className="animate-spin text-sky-500" size={64} />
                <h1 className="text-2xl font-bold mt-6 text-slate-800 dark:text-white">
                    جارِ تحضير امتحان المستوى {currentExamLevel}...
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                    قد يستغرق هذا بضع لحظات في المرة الأولى.
                </p>
            </div>
        );
    }

    const handleAnswer = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === finalExamQuestions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < finalExamQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            handleFinalExamComplete(currentExamLevel, score, finalExamQuestions.length);
        }
    };
    
    const getButtonClass = (option) => {
        if (!isAnswered) return 'bg-white/10 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-700';
        const correctAnswer = finalExamQuestions[currentQuestionIndex].correctAnswer;
        if (option === correctAnswer) return 'bg-green-500/50 border-green-400';
        if (option === selectedOption) return 'bg-red-500/50 border-red-400';
        return 'bg-slate-800/50 opacity-60';
    };

    const currentQuestion = finalExamQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / finalExamQuestions.length) * 100;
    const levelName = initialLevels[currentExamLevel]?.name || '';

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
                الامتحان النهائي: {levelName} ({currentExamLevel})
            </h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                السؤال {currentQuestionIndex + 1} من {finalExamQuestions.length}
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
                <div 
                    className="bg-sky-500 dark:bg-sky-400 h-2.5 rounded-full" 
                    style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                ></div>
            </div>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <h3 dir="ltr" className="text-xl text-slate-800 dark:text-slate-100 mb-6 min-h-[56px] text-left">
                    {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => (
                        <button 
                            key={i} 
                            dir="ltr" 
                            onClick={() => handleAnswer(option)} 
                            disabled={isAnswered} 
                            className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {isAnswered && (
                    <button onClick={handleNext} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all">
                        {currentQuestionIndex < finalExamQuestions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FinalExam;
