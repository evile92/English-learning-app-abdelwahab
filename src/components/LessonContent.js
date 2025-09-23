// src/components/LessonContent.js

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, LoaderCircle, Sparkles, RefreshCw } from 'lucide-react';
import QuizView from './QuizView';
import FillInTheBlankQuiz from './FillInTheBlankQuiz';
import { manualLessonsContent } from '../data/manualLessons';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

import { runGemini } from '../helpers/geminiHelper';

const LessonContent = () => {
    const {
        currentLesson, handleBackToLessons, handleCompleteLesson,
        user
    } = useAppContext();

    const [lessonContent, setLessonContent] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [view, setView] = useState('lesson');
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    const PASSING_SCORE = 5;

    const generateLessonContent = useCallback(async () => {
        if (!currentLesson) return;
        
        setLessonContent(null);
        setQuizData(null);
        setIsLoading(prev => ({ ...prev, lesson: true }));
        setError('');

        // الخطوة 1: التحقق من المحتوى اليدوي المحلي أولاً
        const manualContent = manualLessonsContent[currentLesson.id];
        if (manualContent) {
            setLessonContent(manualContent);
            setIsLoading(prev => ({ ...prev, lesson: false }));
            return; // تم العثور على الدرس، اخرج من الدالة
        }

        // إذا لم يكن الدرس موجودًا محليًا، ننتقل إلى Firebase
        try {
            // الخطوة 2: التحقق مما إذا كان الدرس مخزنًا في Firestore
            const lessonDocRef = doc(db, "lessonContents", currentLesson.id);
            const lessonDoc = await getDoc(lessonDocRef);

            if (lessonDoc.exists()) {
                // الخطوة 3: إذا كان موجودًا، استخدمه مباشرة
                console.log("Fetching lesson from Firestore cache..."); // رسالة للتجربة
                setLessonContent(lessonDoc.data());
            } else {
                // الخطوة 4: إذا لم يكن موجودًا، قم بتوليده باستخدام Gemini
                console.log("Generating lesson with Gemini for the first time..."); // رسالة للتجربة
                const level = currentLesson.id.substring(0, 2);
                const prompt = `You are an expert English teacher. For the lesson titled "${currentLesson.title}" for a ${level}-level student, generate a comprehensive lesson. Provide a JSON object with two keys: "explanation" (an object with "en" for a detailed English explanation and "ar" for a simple Arabic explanation) and "examples" (an array of 5 illustrative example sentences, each formatted as "English sentence - Arabic translation").`;
                const schema = { /* ... نفس الـ schema السابقة ... */ };

                const result = await runGemini(prompt, schema);

                // الخطوة 5 (الأهم): احفظ النتيجة في Firestore لاستخدامها في المستقبل
                await setDoc(lessonDocRef, result);
                
                setLessonContent(result);
            }
        } catch (e) {
            setError('عذرًا، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
        } finally {
            setIsLoading(prev => ({ ...prev, lesson: false }));
        }
    }, [currentLesson]);

    // --- هذا هو التصحيح المهم: الاعتماد فقط على currentLesson ---
    useEffect(() => {
        if (currentLesson) {
            setView('lesson');
            generateLessonContent();
        } else {
            handleBackToLessons();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLesson]);


    const handleStartQuiz = async () => {
        if (!lessonContent) return;

        setIsLoading(prev => ({ ...prev, quiz: true }));
        setError('');

        const generateQuizFromAI = async () => {
            const lessonTextContent = `Explanation: ${lessonContent.explanation.en}. Examples: ${lessonContent.examples.map(ex => ex.en || ex).join(' ')}`;
            const prompt = `Based on this lesson content: "${lessonTextContent}", create a JSON quiz object. It must have two keys: "multipleChoice": an array of 8 multiple-choice questions (with "question", "options", "correctAnswer"), and "fillInTheBlank": an array of 3 fill-in-the-blank exercises (with "question" containing "___" for the blank, and "correctAnswer").`;
            const schema = {
                type: "OBJECT",
                properties: {
                    multipleChoice: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                question: { type: "STRING" },
                                options: { type: "ARRAY", items: { type: "STRING" } },
                                correctAnswer: { type: "STRING" }
                            },
                            required: ["question", "options", "correctAnswer"]
                        }
                    },
                    fillInTheBlank: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                question: { type: "STRING" },
                                correctAnswer: { type: "STRING" }
                            },
                            required: ["question", "correctAnswer"]
                        }
                    }
                },
                required: ["multipleChoice", "fillInTheBlank"]
            };
            return await runGemini(prompt, schema);
        };

        try {
            if (user) {
                const quizDocRef = doc(db, "lessonQuizzes", currentLesson.id);
                const quizDoc = await getDoc(quizDocRef);
                if (quizDoc.exists()) {
                    setQuizData(quizDoc.data());
                } else {
                    const result = await generateQuizFromAI();
                    await setDoc(quizDocRef, result);
                    setQuizData(result);
                }
            } else {
                const result = await generateQuizFromAI();
                setQuizData(result);
            }
            setView('multipleChoiceQuiz');
        } catch (e) {
            setError('عذرًا، فشل إنشاء الاختبار. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(prev => ({ ...prev, quiz: false }));
        }
    };

    const handleMultipleChoiceComplete = (score, total) => {
        setQuizResult({ score, total });
        if (score < PASSING_SCORE) {
            setView('reviewPrompt');
        } else {
            setView('fillInTheBlankQuiz');
        }
    };

    const handleFillInTheBlankComplete = () => {
        setView('result');
    };

    const handleLessonCompletion = async () => {
        setIsCompleting(true);
        setTimeout(() => {
            handleCompleteLesson(currentLesson.id, quizResult.score, quizResult.total);
        }, 500);
    };

    if (!currentLesson) {
        return null;
    }

    const renderLessonView = () => (
        <div className="animate-fade-in relative">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <h2 dir="ltr" className="text-left text-2xl font-bold text-slate-800 dark:text-white mb-4">Explanation</h2>
                <p dir="ltr" className="text-left text-lg leading-relaxed text-slate-700 dark:text-slate-300" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.en}</p>
                <div dir="rtl" className="mt-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border-r-4 border-sky-500">
                    <p className="text-right text-lg leading-relaxed text-slate-700 dark:text-slate-200" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.ar}</p>
                </div>
            </div>
            <div className="mt-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-left">Examples</h3>
                <div className="space-y-4">
                    {lessonContent.examples.map((ex, i) => {
                        const parts = ex.split(' - ');
                        let englishPart = ex;
                        let arabicPart = '';
                        if (parts.length > 1) {
                            arabicPart = parts.pop();
                            englishPart = parts.join(' - ');
                        }
                        return (
                            <div key={i} dir="ltr" className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                                <span className="font-bold text-slate-500 dark:text-slate-400 pt-1">{i + 1}.</span>
                                <div className="flex-1">
                                    <p dir="ltr" className="text-left text-lg text-slate-800 dark:text-slate-200 m-0" style={{ whiteSpace: 'pre-wrap' }}>{englishPart}</p>
                                    {arabicPart && <p dir="rtl" className="text-left text-sm text-slate-500 dark:text-slate-400 m-0 pt-1" style={{ whiteSpace: 'pre-wrap' }}>{arabicPart}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">🧠 اختبر معلوماتك</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">هل أنت مستعد لاختبار فهمك لهذا الدرس؟</p>
                <button onClick={handleStartQuiz} disabled={isLoading.quiz} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                    {isLoading.quiz ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> ابدأ الاختبار</>}
                </button>
            </div>
        </div>
    );

    const renderReviewPrompt = () => (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center animate-fade-in">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">تحتاج إلى مراجعة!</h3>
            <p className="text-lg text-slate-600 dark:text-slate-300">نتيجتك كانت <span className="font-bold">{quizResult.score} / {quizResult.total}</span>.</p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold mt-2 mb-6">
                لا بأس، التعلم يحتاج إلى تكرار. نوصي بمراجعة الدرس مرة أخرى لترسيخ المعلومات قبل المحاولة مجدداً.
            </p>
            <button
                onClick={() => setView('lesson')}
                className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw size={18} /> العودة للدرس والمحاولة مرة أخرى
            </button>
        </div>
    );

    const renderResultView = () => (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center animate-fade-in">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">اكتمل الدرس!</h3>
            <p className="text-lg text-slate-600 dark:text-slate-300">نتيجتك في الاختبار الأول:</p>
            <p className="text-6xl font-bold my-4 text-sky-500 dark:text-sky-400">{quizResult.score} / {quizResult.total}</p>
            <p className="text-green-600 dark:text-green-400 font-semibold">🎉 رائع! لقد أتقنت هذا الدرس.</p>
            <button
                onClick={handleLessonCompletion}
                disabled={isCompleting}
                className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
                {isCompleting ? <LoaderCircle className="animate-spin" /> : 'إكمال الدرس والعودة'}
            </button>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'lesson':
                return lessonContent ? renderLessonView() : null;
            case 'multipleChoiceQuiz':
                return quizData ? <QuizView key={currentLesson.id} quiz={quizData.multipleChoice} onQuizComplete={handleMultipleChoiceComplete} /> : null;
            case 'fillInTheBlankQuiz':
                return quizData ? <FillInTheBlankQuiz key={`${currentLesson.id}-fill`} quiz={quizData.fillInTheBlank} onComplete={handleFillInTheBlankComplete} /> : null;
            case 'reviewPrompt':
                return renderReviewPrompt();
            case 'result':
                return renderResultView();
            default:
                return lessonContent ? renderLessonView() : null;
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={handleBackToLessons} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى قائمة الدروس</button>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 break-words" dir="ltr">{currentLesson.title}</h1>
            {isLoading.lesson && <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-10 rounded-2xl shadow-lg"><LoaderCircle className="animate-spin text-sky-500 dark:text-sky-400" size={48} /><p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">نقوم بإعداد الدرس لك...</p></div>}
            {error && !isLoading.lesson &&
                <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert">
                    <p className="font-bold">حدث خطأ</p>
                    <p>{error}</p>
                    <button onClick={generateLessonContent} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">إعادة المحاولة</button>
                </div>
            }
            {!isLoading.lesson && !error && renderContent()}
        </div>
    );
};

export default LessonContent;
