// src/components/FillInTheBlankQuiz.js

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const FillInTheBlankQuiz = ({ quiz, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'

    const currentQuestion = quiz[currentIndex];

    const handleCheckAnswer = () => {
        if (!userAnswer.trim()) return;

        const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
        setFeedback(isCorrect ? 'correct' : 'incorrect');
    };

    const handleNext = () => {
        if (currentIndex < quiz.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer('');
            setFeedback(null);
        } else {
            onComplete();
        }
    };

    const getInputBorderColor = () => {
        if (feedback === 'correct') return 'border-green-500 ring-green-500';
        if (feedback === 'incorrect') return 'border-red-500 ring-red-500';
        return 'border-slate-300 dark:border-slate-600 focus:ring-sky-500';
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
                ✍️ تمرين تطبيقي: املأ الفراغ
            </h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                السؤال {currentIndex + 1} من {quiz.length}
            </p>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                {/* عرض السؤال */}
                <div className="mb-6 text-center">
                    <p dir="ltr" className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-loose">
                        {currentQuestion.question.split('___')[0]}
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={!!feedback}
                            placeholder="..."
                            className={`inline-block w-32 md:w-40 mx-2 p-1 text-center text-xl font-semibold bg-slate-100 dark:bg-slate-800 rounded-md border-2 transition-all focus:outline-none focus:ring-2 ${getInputBorderColor()}`}
                        />
                        {currentQuestion.question.split('___')[1]}
                    </p>
                </div>

                {/* عرض النتيجة والتعليق */}
                {feedback && (
                    <div className={`p-4 rounded-lg text-center animate-fade-in mb-4 ${feedback === 'correct' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                        {feedback === 'correct' ? (
                            <div className="flex items-center justify-center gap-2">
                                <Check size={20} /> <span className="font-semibold">إجابة صحيحة!</span>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-center gap-2">
                                    <X size={20} /> <span className="font-semibold">إجابة غير صحيحة.</span>
                                </div>
                                <p className="mt-1 text-sm">الإجابة الصحيحة هي: <strong dir="ltr" className="font-mono">{currentQuestion.correctAnswer}</strong></p>
                            </div>
                        )}
                    </div>
                )}

                {/* الأزرار */}
                {!feedback ? (
                    <button
                        onClick={handleCheckAnswer}
                        disabled={!userAnswer.trim()}
                        className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all disabled:bg-slate-400"
                    >
                        تحقق من الإجابة
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all"
                    >
                        {currentIndex < quiz.length - 1 ? 'السؤال التالي' : 'إنهاء التمرين'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FillInTheBlankQuiz;
