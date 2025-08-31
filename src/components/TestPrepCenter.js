// src/components/TestPrepCenter.js

import React, { useState } from 'react';
import { tests } from '../data/testPrepData';
import { Award, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import LtrText from './LtrText';

const TestPrepCenter = () => {
    // State to manage the current view: 'list', 'quiz', or 'results'
    const [view, setView] = useState('list'); 
    
    // State for the current quiz
    const [selectedTest, setSelectedTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);

    // --- Test Control Functions ---

    // Function to start a new test
    const startTest = (test) => {
        if (test.questions && test.questions.length > 0) {
            setSelectedTest(test);
            setCurrentQuestionIndex(0);
            setUserAnswers(new Array(test.questions.length).fill(null));
            setView('quiz'); // Switch to the quiz view
        }
    };

    // Function to save the user's selected answer
    const handleAnswerSelect = (option) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = option;
        setUserAnswers(newAnswers);
    };

    // Function to move to the next question or view results
    const handleNextQuestion = () => {
        if (currentQuestionIndex < selectedTest.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setView('results'); // Switch to the results view
        }
    };
    
    // Function to go back to the main list and reset everything
    const restart = () => {
        setView('list');
        setSelectedTest(null);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
    };

    // --- Render based on the current view ---

    // --- View 1: Test List (Default View) ---
    if (view === 'list') {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <Award className="mx-auto text-sky-500 mb-2" size={48} />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Test Preparation</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        Prepare for the world's most popular English proficiency tests.
                    </p>
                </div>
                <div className="space-y-4">
                    {tests.map((test, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{test.name}</h2>
                                    {test.questions && test.questions.length > 0 && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{test.questions.length} questions</p>
                                    )}
                                </div>
                                {test.questions && test.questions.length > 0 ? (
                                    <button onClick={() => startTest(test)} className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold px-4 py-2 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900 transition-colors">
                                        Start Test <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <span className="text-sm text-slate-400 dark:text-slate-500">Coming Soon...</span>
                                )}
                            </div>
                            {test.description && <p className="text-slate-600 dark:text-slate-300 mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">{test.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- View 2: Quiz Question View ---
    if (view === 'quiz') {
        if (!selectedTest) return null; // Safety check
        const question = selectedTest.questions[currentQuestionIndex];
        const options = [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean);

        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl w-full mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedTest.name}</h2>
                    <p className="text-slate-500">Question {currentQuestionIndex + 1} of {selectedTest.questions.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-lg text-slate-700 dark:text-slate-200 mb-6 text-center min-h-[60px]">
                        <LtrText text={question.question} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            {currentQuestionIndex < selectedTest.questions.length - 1 ? 'Next' : 'Finish & View Results'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- View 3: Results View ---
    if (view === 'results') {
        const score = userAnswers.reduce((acc, answer, index) => {
            return answer === selectedTest.questions[index].correct ? acc + 1 : acc;
        }, 0);
        
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl w-full mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Results for {selectedTest.name}</h2>
                    <p className="text-xl mb-6 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold p-3 rounded-lg inline-block">
                        Your Score: {score} out of {selectedTest.questions.length}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                    {selectedTest.questions.map((q, index) => (
                        <div key={index} className="border-b pb-3 dark:border-slate-700 last:border-b-0 text-left" dir="ltr">
                            <p className="font-semibold mb-1 text-slate-800 dark:text-slate-200">{index + 1}. {q.question}</p>
                            <p className={`flex items-center gap-2 ${userAnswers[index] === q.correct ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                {userAnswers[index] === q.correct ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                <span className='font-semibold'>Your Answer:</span> {userAnswers[index] || "Not Answered"}
                            </p>
                            {userAnswers[index] !== q.correct && <p className="text-sm text-slate-500 dark:text-slate-400 ml-8"><span className='font-semibold'>Correct Answer:</span> {q.correct}</p>}
                        </div>
                    ))}
                </div>
                <button onClick={restart} className="mt-8 w-full bg-slate-600 text-white px-6 py-3 rounded-full hover:bg-slate-700 transition-colors text-lg">
                    Back to Test List
                </button>
            </div>
        );
    }
};

export default TestPrepCenter;
