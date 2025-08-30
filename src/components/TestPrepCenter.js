// src/components/TestPrepCenter.js

import React, { useState } from 'react';
import { tests } from '../data/testPrepData';
import { Award, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import LtrText from './LtrText';

const TestPrepCenter = () => {
    const [selectedTest, setSelectedTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleTestSelect = (test) => {
        setSelectedTest(test);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
    };

    const handleAnswerSelect = (option) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = option;
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < selectedTest.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };
    
    const resetTest = () => {
        setSelectedTest(null);
    }

    if (selectedTest && !showResults) {
        const question = selectedTest.questions[currentQuestionIndex];
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{selectedTest.name}</h2>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg text-slate-700 dark:text-slate-200 mb-4">{question.question}</p>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${userAnswers[currentQuestionIndex] === option ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                <LtrText text={option} />
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-slate-500">سؤال {currentQuestionIndex + 1} من {selectedTest.questions.length}</span>
                        <button onClick={handleNextQuestion} disabled={!userAnswers[currentQuestionIndex]} className="bg-sky-600 text-white px-6 py-2 rounded-full hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            {currentQuestionIndex < selectedTest.questions.length - 1 ? 'التالي' : 'إنهاء'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if(showResults){
        const score = userAnswers.reduce((acc, answer, index) => {
            return answer === selectedTest.questions[index].correct ? acc + 1 : acc;
        }, 0);
        
        return(
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">نتائج اختبار {selectedTest.name}</h2>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg">
                    <p className="text-center text-xl mb-4">نتيجتك: {score} من {selectedTest.questions.length}</p>
                    <div className="space-y-4">
                        {selectedTest.questions.map((q, index) => (
                            <div key={index} className="border-b pb-2 dark:border-slate-700">
                                <p className="font-semibold">{q.question}</p>
                                <p className={`flex items-center gap-2 ${userAnswers[index] === q.correct ? 'text-green-500' : 'text-red-500'}`}>
                                    {userAnswers[index] === q.correct ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                    إجابتك: {userAnswers[index]}
                                </p>
                                {userAnswers[index] !== q.correct && <p className="text-green-600 dark:text-green-400">الإجابة الصحيحة: {q.correct}</p>}
                            </div>
                        ))}
                    </div>
                    <button onClick={resetTest} className="mt-6 w-full bg-sky-600 text-white px-6 py-2 rounded-full hover:bg-sky-700 transition-colors">
                        العودة إلى قائمة الاختبارات
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <Award className="mx-auto text-sky-500 mb-2" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">التحضير للاختبارات</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                    استعد لأشهر اختبارات اللغة الإنجليزية العالمية.
                </p>
            </div>

            <div className="space-y-4">
                {tests.map((test, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{test.name}</h2>
                                {test.questions && test.questions.length > 0 && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{test.questions.length} سؤال</p>
                                )}
                            </div>
                            {test.questions && test.questions.length > 0 ? (
                                <button onClick={() => handleTestSelect(test)} className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold px-4 py-2 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900 transition-colors">
                                    ابدأ الاختبار <ChevronRight size={16} />
                                </button>
                            ) : (
                                <span className="text-sm text-slate-400 dark:text-slate-500">قريباً...</span>
                            )}
                        </div>
                        {test.description && <p className="text-slate-600 dark:text-slate-300 mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">{test.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestPrepCenter;
