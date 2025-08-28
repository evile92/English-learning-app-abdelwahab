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
        
        // --- ✅ بداية التعديل: مقارنة موحدة (تجاهل الفراغات وحالة الأحرف) ---
        if (option.trim().toLowerCase() === quiz[currentQuestionIndex].correctAnswer.trim().toLowerCase()) {
            setScore(score + 1);
        } else {
            if (currentLesson && currentLesson.id) {
                logError(currentLesson.id);
            }
        }
        // --- 🛑 نهاية التعديل ---
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
        
        // --- ✅ بداية التعديل: مقارنة موحدة للعرض ---
        const correctAnswer = quiz[currentQuestionIndex].correctAnswer.trim().toLowerCase();
        const formattedOption = option.trim().toLowerCase();
        const formattedSelectedOption = selectedOption ? selectedOption.trim().toLowerCase() : null;

        if (formattedOption === correctAnswer) return 'bg-green-500/50 border-green-400';
        if (formattedOption === formattedSelectedOption) return 'bg-red-500/50 border-red-400';
        // --- 🛑 نهاية التعديل ---
        
        return 'bg-slate-800/50 opacity-60';
    };

    const currentQuestion = quiz[currentQuestionIndex];

    if (!quiz || quiz.length === 0 || !currentQuestion) {
        return (
            <div className="text-center p-8 bg-white dark:bg-slate-800/50 rounded-2xl">
                <p className="font-semibold text-red-500">حدث خطأ أثناء تحميل أسئلة الاختبار.</p>
                <p className="text-slate-600 dark:text-slate-300 mt-2">يرجى العودة والمحاولة مرة أخرى.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <p className="text-center font-semibold text-slate-600 dark:text-slate-300 mb-2">السؤال {currentQuestionIndex + 1} من {quiz.length}</p>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <h3 dir="ltr" className="text-xl text-slate-800 dark:text-slate-100 mb-6 text-left">
                    {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => (
                        <button key={i} dir="ltr" onClick={() => handleAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 ${getButtonClass(option)}`}>
                            {option}
                        </button>
                    ))}
                </div>
                {isAnswered && (
                    <button onClick={handleNext} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all">
                        {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizView;
