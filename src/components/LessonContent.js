// src/components/LessonContent.js
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Custom Hooks
import { useLessonContent } from '../hooks/useLessonContent';
import { useLessonQuiz } from '../hooks/useLessonQuiz';
import { useLessonResult } from '../hooks/useLessonResult';

// Components
import LessonView from './lesson/LessonView';
import QuizView from './QuizView';
import ReviewPrompt from './lesson/ReviewPrompt';
import LessonResult from './lesson/LessonResult';
import LessonLoading from './lesson/LessonLoading';
import ErrorBoundary from './ErrorBoundary';
import SEO from './SEO';

const LessonContent = () => {
    const { currentLesson, handleBackToLessons, handleCompleteLesson, user } = useAppContext();
    const [view, setView] = useState('lesson');

    // استخدام Custom Hooks للمنطق
    const { lessonContent, isLoading: lessonLoading, error, generateLessonContent } = useLessonContent(currentLesson, user);
    const { quizData, isLoading: quizLoading, handleStartQuiz } = useLessonQuiz(lessonContent, currentLesson, user);
    const { quizResult, isCompleting, handleQuizComplete, handleLessonCompletion } = useLessonResult(handleCompleteLesson);

    // معالج إكمال الاختبار
    const onQuizComplete = (score, total) => {
        const nextView = handleQuizComplete(score, total);
        setView(nextView);
    };

    // معالج بدء الاختبار - الإصلاح هنا فقط
    const onStartQuiz = async () => {
        const success = await handleStartQuiz();
        if (success) {
            setView('multipleChoiceQuiz');
        }
    };

    if (!currentLesson) {
        return null;
    }

    const renderContent = () => {
        switch (view) {
            case 'lesson':
                return (
                    <LessonView 
                        lessonContent={lessonContent} 
                        onStartQuiz={onStartQuiz} 
                        isQuizLoading={quizLoading} 
                    />
                );
            case 'multipleChoiceQuiz':
                return quizData ? (
                    <QuizView 
                        key={currentLesson.id} 
                        quiz={quizData.multipleChoice} 
                        onQuizComplete={onQuizComplete} 
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
                        onComplete={() => handleLessonCompletion(currentLesson.id)} 
                        isCompleting={isCompleting} 
                    />
                );
            default:
                return null;
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
                
                {lessonLoading && <LessonLoading />}
                
                {error && !lessonLoading && (
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
                
                {!lessonLoading && !error && renderContent()}
            </div>
        </ErrorBoundary>
    );
};

export default LessonContent;
