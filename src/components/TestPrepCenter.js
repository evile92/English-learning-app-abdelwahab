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
        // --- (بداية قسم التشخيص الجديد) ---
        console.log("DEBUG STEP 1: Test object received on click ->", test);
        console.log("DEBUG STEP 1: Does it have a 'questions' property? ->", test.questions);
        console.log("DEBUG STEP 1: Number of questions ->", test.questions ? test.questions.length : "N/A");
        // --- (نهاية قسم التشخيص الجديد) ---

        if (test.questions && test.questions.length > 0) {
            console.log("DEBUG STEP 2: Condition PASSED. Setting state now.");
            setSelectedTest(test);
            setCurrentQuestionIndex(0);
            setUserAnswers(new Array(test.questions.length).fill(null));
            setShowResults(false);
        } else {
            console.error("DEBUG STEP 2: Condition FAILED. The selected test has no questions.");
        }
    };
    
    const resetTest = () => {
        setSelectedTest(null);
        setShowResults(false);
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
    };

    // --- عرض سؤال الاختبار ---
    if (selectedTest && !showResults) {
        console.log("DEBUG STEP 3: Rendering quiz view. The selectedTest state is ->", selectedTest);
        const question = selectedTest.questions[currentQuestionIndex];

        console.log("DEBUG STEP 4: Full Question Object ->", question);
        if (!question) {
            console.error("DEBUG STEP 4: Question object is missing!");
            return <div>Error: Question data is missing. Please go back and try again.</div>;
        }

        const options = [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean);

        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl w-full mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedTest.name}</h2>
                    <p className="text-slate-500">سؤال {currentQuestionIndex + 1} من {selectedTest.questions.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-lg text-slate-700 dark:text-slate-200 mb-6 text-center min-h-[60px]">{question.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {console.log("DEBUG STEP 5: Options Array to be rendered ->", options)}
                        {options.length === 0 && <p className="text-red-500 col-span-2 text-center">DEBUG: No options were found for this question!</p>}

                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full text-center p-4 rounded-lg transition-all duration-200 text-base md:text-lg border-2 ${userAnswers[currentQuestionIndex] === option 
                                    ? 'bg-sky-500 text-white border-sky-500 scale-105 shadow-md' 
                                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border-transparent'}`}
                            >
                                <LtrText text={option} />
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-center items-center mt-8">
                        <button 
                            onClick={handleNextQuestion} 
                            disabled={!userAnswers[currentQuestionIndex]} 
                            className="bg-sky-600 text-white px-10 py-3 rounded-full hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                        >
                            {currentQuestionIndex < selectedTest.questions.length - 1 ? 'التالي' : 'إنهاء وإظهار النتيجة'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- عرض النتائج (مع تعديل بسيط) ---
    if (selectedTest && showResults) {
        const score = userAnswers.reduce((acc, answer, index) => {
            return answer === selectedTest.questions[index].correctAnswer ? acc + 1 : acc;
        }, 0);
        
        return(
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl w-full mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">نتائج اختبار {selectedTest.name}</h2>
                    <p className="text-xl mb-6 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold p-3 rounded-lg inline-block">
                        نتيجتك: {score} من {selectedTest.questions.length}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    {selectedTest.questions.map((q, index) => (
                        <div key={index} className="border-b pb-3 dark:border-slate-700 last:border-b-0">
                            <p className="font-semibold mb-1 text-slate-800 dark:text-slate-200">{index + 1}. {q.questionText}</p>
                            <p className={`flex items-center gap-2 ${userAnswers[index] === q.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                {userAnswers[index] === q.correctAnswer ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                <span className='font-semibold'>إجابتك:</span> {userAnswers[index] || "لم تجب"}
                            </p>
                            {userAnswers[index] !== q.correctAnswer && <p className="text-sm text-slate-500 dark:text-slate-400 ml-8"><span className='font-semibold'>الإجابة الصحيحة:</span> {q.correctAnswer}</p>}
                        </div>
                    ))}
                </div>
                <button onClick={resetTest} className="mt-8 w-full bg-slate-600 text-white px-6 py-3 rounded-full hover:bg-slate-700 transition-colors text-lg">
                    العودة إلى قائمة الاختبارات
                </button>
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
