import React, { useState, useEffect, useMemo } from 'react';
import { LoaderCircle } from 'lucide-react';
import { placementTestQuestionsByLevel } from '../data/lessons';

const TOTAL_TEST_QUESTIONS = 15;
// --- (بداية الإضافة الجديدة: عتبة النجاح) ---
const PROFICIENCY_THRESHOLD = 3; // يجب الإجابة على 3 أسئلة صحيحة لإثبات الكفاءة
// --- (نهاية الإضافة) ---

const PlacementTest = ({ onTestComplete, initialLevels }) => {
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('A2');
  const [correctAnswersCount, setCorrectAnswersCount] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalLevel, setFinalLevel] = useState(null);

  const levelOrder = useMemo(() => ['A1', 'A2', 'B1', 'B2', 'C1'], []);

  // دالة لاختيار سؤال جديد (تبقى كما هي)
  const selectNewQuestion = (level) => {
    const questionsForLevel = placementTestQuestionsByLevel[level];
    if (questionsForLevel && questionsForLevel.length > 0) {
      const randomIndex = Math.floor(Math.random() * questionsForLevel.length);
      return questionsForLevel[randomIndex];
    }
    // في حال عدم وجود أسئلة للمستوى المطلوب، اختر من مستوى مجاور
    const fallbackLevel = level === 'C1' ? 'B2' : 'A2';
    return selectNewQuestion(fallbackLevel);
  };

  useEffect(() => {
    setCurrentQuestion(selectNewQuestion('A2'));
    // إعداد عداد الإجابات الصحيحة لكل المستويات
    const initialCounts = levelOrder.reduce((acc, level) => {
      acc[level] = 0;
      return acc;
    }, {});
    setCorrectAnswersCount(initialCounts);
  }, [levelOrder]);

  // دالة التعامل مع الإجابة (تبقى كما هي)
  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.answer;
    const currentLevelIndex = levelOrder.indexOf(currentLevel);

    let nextLevel = currentLevel;

    if (isCorrect) {
      setCorrectAnswersCount(prev => ({ ...prev, [currentLevel]: prev[currentLevel] + 1 }));
      if (currentLevelIndex < levelOrder.length - 1) {
        nextLevel = levelOrder[currentLevelIndex + 1];
      }
    } else {
      if (currentLevelIndex > 0) {
        nextLevel = levelOrder[currentLevelIndex - 1];
      }
    }

    if (questionsAnswered + 1 >= TOTAL_TEST_QUESTIONS) {
      // استدعاء دالة حساب النتيجة الجديدة عند انتهاء الأسئلة
      calculateResult();
    } else {
      setCurrentLevel(nextLevel);
      setCurrentQuestion(selectNewQuestion(nextLevel));
      setQuestionsAnswered(prev => prev + 1);
    }
  };

  // --- (بداية التعديل: دالة حساب النتيجة الجديدة والاحترافية) ---
  const calculateResult = () => {
    let determinedLevel = 'A1'; // ابدأ بافتراض أن المستخدم في أدنى مستوى

    // تحقق من كل مستوى بالتسلسل
    for (const level of levelOrder) {
      // هل أثبت المستخدم كفاءته في هذا المستوى؟
      if (correctAnswersCount[level] >= PROFICIENCY_THRESHOLD) {
        // نعم، إذاً هذا هو مستواه الحالي المؤقت
        determinedLevel = level;
      } else {
        // لا، لم يثبت كفاءته، إذاً يتوقف تقييمه هنا
        break; // الخروج من الحلقة
      }
    }
    
    setFinalLevel(determinedLevel);
    setShowResult(true);
  };
  // --- (نهاية التعديل) ---
  
  if (showResult) {
    return (
      <div className="text-center animate-fade-in p-6 z-10 relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">اكتمل الاختبار!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">تم تحليل إجاباتك بدقة.</p>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6">
          تم تحديد كوكبك المبدئي: <span className="text-sky-500 dark:text-sky-400 font-bold">{finalLevel} - {initialLevels[finalLevel].name}</span>
        </p>
        <button onClick={() => onTestComplete(finalLevel)} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all">الخطوة التالية</button>
      </div>
    );
  }
  
  if (!currentQuestion) {
      return <div className="flex justify-center items-center"><LoaderCircle className="animate-spin text-sky-500" size={48} /></div>
  }

  const progress = ((questionsAnswered + 1) / TOTAL_TEST_QUESTIONS) * 100;

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto animate-fade-in z-10 relative">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">اختبار تحديد المستوى الذكي</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-6">السؤال {questionsAnswered + 1} من {TOTAL_TEST_QUESTIONS}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6"> <div className="bg-sky-500 dark:bg-sky-400 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div> </div>
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
        <p dir="ltr" className="text-xl text-slate-800 dark:text-slate-200 mb-6 min-h-[60px] text-left">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => ( <button key={index} dir="ltr" onClick={() => handleAnswer(option)} className="w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-sky-500 dark:hover:border-sky-400 transition-all duration-200"> {option} </button> ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementTest;
