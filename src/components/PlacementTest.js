import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { placementTestQuestionsByLevel } from '../data/lessons';

const PlacementTest = ({ onTestComplete, initialLevels }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    const allQuestions = [];
    Object.values(placementTestQuestionsByLevel).forEach(levelQuestions => {
        allQuestions.push(...shuffleArray([...levelQuestions]).slice(0, 5));
    });

    setQuestions(shuffleArray(allQuestions));
  }, []);


  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    let level;
    if (score <= 5) level = 'A1';
    else if (score <= 10) level = 'A2';
    else if (score <= 15) level = 'B1';
    else if (score <= 20) level = 'B2';
    else level = 'C1';

    return (
      <div className="text-center animate-fade-in p-6 z-10 relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">اكتمل الاختبار!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">نتيجتك: {score} من {questions.length}</p>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6">
          تم تحديد كوكبك المبدئي: <span className="text-sky-500 dark:text-sky-400 font-bold">{level} - {initialLevels[level].name}</span>
        </p>
        <button onClick={() => onTestComplete(level)} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all">الخطوة التالية</button>
      </div>
    );
  }
  
  if (questions.length === 0) {
      return <div className="flex justify-center items-center"><LoaderCircle className="animate-spin text-sky-500" size={48} /></div>
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQData = questions[currentQuestion];

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto animate-fade-in z-10 relative">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">اختبار تحديد المستوى الذكي</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-6">السؤال {currentQuestion + 1} من {questions.length}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6"> <div className="bg-sky-500 dark:bg-sky-400 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div> </div>
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
        <p dir="ltr" className="text-xl text-slate-800 dark:text-slate-200 mb-6 min-h-[60px] text-left">{currentQData.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQData.options.map((option, index) => ( <button key={index} dir="ltr" onClick={() => handleAnswer(option)} className="w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-sky-500 dark:hover:border-sky-400 transition-all duration-200"> {option} </button> ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementTest;
