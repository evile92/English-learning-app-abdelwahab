// src/components/LessonContent.js (محدث)
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import QuizView from './QuizView';
import { manualLessonsContent } from '../data/manualLessons';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import SEO from './SEO';
import { runGemini } from '../helpers/geminiHelper';
import ErrorBoundary from './ErrorBoundary';

// ✅ استيراد المكونات الجديدة
import LessonExplanation from './lesson/LessonExplanation';
import LessonQuizButton from './lesson/LessonQuizButton';
import ReviewPrompt from './lesson/ReviewPrompt';
import LessonResult from './lesson/LessonResult';
import LessonLoading from './lesson/LessonLoading';

const LessonContent = () => {
    const { currentLesson, handleBackToLessons, handleCompleteLesson, user } = useAppContext();

    // جميع الـ states تبقى كما هي
    const [lessonContent, setLessonContent] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [view, setView] = useState('lesson');
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    const PASSING_SCORE = 5;

    // ✅ جميع الـ functions تبقى كما هي (لا نغير شيء)
    const generateLessonContent = useCallback(async () => {
        // ... نفس الكود الموجود
    }, [currentLesson, user]);

    useEffect(() => {
        // ... نفس الكود الموجود
    }, [currentLesson]);

    const handleStartQuiz = async () => {
        // ... نفس الكود الموجود
    };

    const handleMultipleChoiceComplete = (score, total) => {
        // ... نفس الكود الموجود
    };

    const handleLessonCompletion = async () => {
        // ... نفس الكود الموجود
    };

    if (!currentLesson) {
        return null;
    }

    // ✅ تبسيط renderLessonView
    const renderLessonView = () => (
        <div>
            <LessonExplanation lessonContent={lessonContent} />
            <LessonQuizButton onStartQuiz={handleStartQuiz} isLoading={isLoading.quiz} />
        </div>
    );

    // ✅ تبسيط renderContent
    const renderContent = () => {
        switch (view) {
            case 'lesson':
                return lessonContent ? renderLessonView() : null;
            case 'multipleChoiceQuiz':
                return quizData ? (
                    <QuizView 
                        key={currentLesson.id} 
                        quiz={quizData.multipleChoice} 
                        onQuizComplete={handleMultipleChoiceComplete} 
                    />
                ) : null;
            case 'reviewPrompt':
                return (
                    <ReviewPrompt 
                        quizResult={quizResult} 
                        onRetry={() => setView('lesson')} 
                    />
                );
            case 'result':
                return (
                    <LessonResult 
                        quizResult={quizResult} 
                        onComplete={handleLessonCompletion} 
                        isCompleting={isCompleting} 
                    />
                );
            default:
                return lessonContent ? renderLessonView() : null;
        }
    };

    return (
        <ErrorBoundary
            isDarkMode={true}
            showHomeButton={true}
            title="خطأ في تحميل الدرس"
            message="حدث خطأ أثناء تحميل محتوى الدرس. يمكنك المحاولة مرة أخرى أو العودة للرئيسية."
            onGoHome={handleBackToLessons}
        >
            <SEO 
                title={`درس ${currentLesson?.title || 'تعلم الإنجليزية'} - StellarSpeak`}
                description={`تعلم ${currentLesson?.title || 'اللغة الإنجليزية'} مع دروس تفاعلية وتمارين عملية لتحسين مستواك`}
                keywords={`${currentLesson?.title || 'درس إنجليزية'}, تعلم الإنجليزية, دروس تفاعلية`}
                url={`https://www.stellarspeak.online/?page=lesson/${currentLesson?.id || ''}`}
                type="article"
            />
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <button 
                    onClick={handleBackToLessons} 
                    className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"
                >
                    <ArrowLeft size={20} /> العودة إلى قائمة الدروس
                </button>
                
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 break-words" dir="ltr">
                    {currentLesson.title}
                </h1>
                
                {/* ✅ استخدام مكون التحميل الجديد */}
                {isLoading.lesson && <LessonLoading />}
                
                {error && !isLoading.lesson && (
                    <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert">
                        <p className="font-bold">حدث خطأ</p>
                        <p>{error}</p>
                        <button 
                            onClick={generateLessonContent} 
                            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                )}
                
                {!isLoading.lesson && !error && renderContent()}
            </div>
        </ErrorBoundary>
    );
};

export default LessonContent;
