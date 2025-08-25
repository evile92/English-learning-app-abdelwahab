// src/components/QuizView.js

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const QuizView = ({ quiz, onQuizComplete }) => {
    const { logError, currentLesson } = useAppContext();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleAnswer = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === quiz[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        } else {
            // سجل الخطأ باستخدام معرف الدرس الحالي كموضوع
            if (currentLesson && currentLesson.id) {
                logError(currentLesson.id);
            }
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            onQuizComplete(score, quiz.length);
        }
    };

    const getButtonClass = (option) => {
        if (!isAnswered) return 'bg-white/10 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-700';
        if (option === quiz[currentQuestionIndex].correctAnswer) return 'bg-green-500/50 border-green-400';
        if (option === selectedOption) return 'bg-red-500/50 border-red-400';
        return 'bg-slate-800/50 opacity-60';
    };

    const currentQuestion = quiz[currentQuestionIndex];

    return (
        <div className="animate-fade-in">
            <p className="text-center font-semibold text-slate-600 dark:text-slate-300 mb-2">السؤال {currentQuestionIndex + 1} من {quiz.length}</p>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                {/* --- (بداية التعديل النهائي) --- */}
                {/* تم إزالة flex-col و justify-between لضمان تدفق طبيعي */}
                <div>
                    <h3 dir="ltr" className="text-xl text-slate-800 dark:text-slate-100 mb-6 min-h-[56px] text-left">{currentQuestion.question}</h3>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, i) => (
                            <button key={i} dir="ltr" onClick={() => handleAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 ${getButtonClass(option)}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* الزر الآن موجود دائمًا ولكن يتم التحكم في ظهوره عبر opcaity */}
                <div className="mt-6">
                    <button 
                        onClick={handleNext} 
                        className={`w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all duration-300
                            ${isAnswered ? 'opacity-100 visible' : 'opacity-0 invisible'}`
                        }
                        // يتم تعطيل الزر إذا كان غير مرئي لضمان عدم النقر عليه عن طريق الخطأ
                        disabled={!isAnswered}
                    >
                        {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                    </button>
                </div>
                {/* --- (نهاية التعديل النهائي) --- */}
            </div>
        </div>
    );
};

export default QuizView;
