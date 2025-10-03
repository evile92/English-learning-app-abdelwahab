// src/components/LessonContent.js

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, LoaderCircle, Sparkles, RefreshCw } from 'lucide-react';
import QuizView from './QuizView';
import DragDropQuiz from './DragDropQuiz'; // ✅ التعديل 1: تغيير الاستيراد
import { manualLessonsContent } from '../data/manualLessons';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import SEO from './SEO';
import { runGemini } from '../helpers/geminiHelper';
import ErrorBoundary from './ErrorBoundary';

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
        
        // --- (هنا تم إضافة الحل) ---
        const generateWithGemini = async () => {
            console.log("Generating lesson with Gemini...");
            const level = currentLesson.id.substring(0, 2);
            const prompt = `You are an expert English teacher. For the lesson titled "${currentLesson.title}" for a ${level}-level student, generate a comprehensive lesson. Provide a JSON object with two keys: "explanation" (an object with "en" for a detailed English explanation and "ar" for a simple Arabic explanation) and "examples" (an array of 5 illustrative example sentences, each formatted as "English sentence - Arabic translation").`;

            // التعديل المطلوب فقط: JSON Schema قياسي وتمرير mode='lesson'
            const schema = {
                type: "object",
                properties: {
                    explanation: {
                        type: "object",
                        properties: {
                            en: { type: "string" },
                            ar: { type: "string" }
                        },
                        required: ["en", "ar"]
                    },
                    examples: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["explanation", "examples"]
            };

            return await runGemini(prompt, 'lesson', schema);
        };

        // إذا كان المستخدم زائراً (غير مسجل)، قم بالتوليد مباشرة بدون استخدام Firebase
        if (!user) {
            try {
                const result = await generateWithGemini();
                setLessonContent(result);
            } catch (e) {
                setError('عذرًا، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
            } finally {
                setIsLoading(prev => ({ ...prev, lesson: false }));
            }
            return; // إنهاء الدالة للزوار
        }
        // --- (نهاية الحل) ---

        // إذا كان المستخدم مسجلاً، اتبع المنطق الحالي مع Firebase
        try {
            const lessonDocRef = doc(db, "lessonContents", currentLesson.id);
            const lessonDoc = await getDoc(lessonDocRef);

            if (lessonDoc.exists()) {
                console.log("Fetching lesson from Firestore cache...");
                const data = lessonDoc.data();
                const isValid = data.explanation && 
                               typeof data.explanation.en === 'string' && 
                               typeof data.explanation.ar === 'string' && 
                               Array.isArray(data.examples) && 
                               data.examples.every(ex => typeof ex === 'string');
                
                if (isValid) {
                    setLessonContent(data);
                } else {
                    console.warn('بيانات Firebase تالفة، إعادة التوليد');
                    const result = await generateWithGemini();
                    await setDoc(lessonDocRef, result);
                    setLessonContent(result);
                }
            } else {
                const result = await generateWithGemini();
                await setDoc(lessonDocRef, result);
                setLessonContent(result);
            }
        } catch (e) {
            setError('عذرًا، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
        } finally {
            setIsLoading(prev => ({ ...prev, lesson: false }));
        }
    }, [currentLesson, user]); // <-- تمت إضافة `user` هنا

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
            
            try {
                // ✅ التعديل 2: تحديث prompt لإضافة dragDrop
                const prompt = `Based on this lesson content: "${lessonTextContent}", create a JSON quiz object. It must have two keys: 
1. "multipleChoice": an array of 8 multiple-choice questions (with "question", "options", "correctAnswer")
2. "dragDrop": an array of 3 drag-and-drop exercises (with "question", "words" array, "correctOrder" array, "emoji")`;
                
                // ✅ التعديل 3: تحديث schema لإضافة dragDrop
                const schema = {
                    type: "object",
                    properties: {
                        multipleChoice: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    options: { type: "array", items: { type: "string" } },
                                    correctAnswer: { type: "string" }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        },
                        dragDrop: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    words: { type: "array", items: { type: "string" } },
                                    correctOrder: { type: "array", items: { type: "number" } },
                                    emoji: { type: "string" }
                                },
                                required: ["question", "words", "correctOrder"]
                            }
                        }
                    },
                    required: ["multipleChoice", "dragDrop"]
                };
                return await runGemini(prompt, 'lesson', schema);
            } catch (error) {
                console.error('فشل في إنشاء الاختبار بالذكاء الاصطناعي:', error);
                
                // ✅ التحسين 1: Fallback quiz افتراضي
                return {
                    multipleChoice: [
                        {
                            question: "What does 'A' stand for in the alphabet?",
                            options: ["Apple", "Ant", "All", "Always"],
                            correctAnswer: "Apple"
                        },
                        {
                            question: "Which word starts with 'A'?",
                            options: ["Book", "Apple", "Car", "Dog"],
                            correctAnswer: "Apple"
                        },
                        {
                            question: "Complete: A is for ___",
                            options: ["Apple", "Banana", "Cat", "Door"],
                            correctAnswer: "Apple"
                        },
                        {
                            question: "What letter comes first?",
                            options: ["B", "C", "A", "D"],
                            correctAnswer: "A"
                        },
                        {
                            question: "Which is correct?",
                            options: ["a apple", "An apple", "The apple", "Apple a"],
                            correctAnswer: "An apple"
                        },
                        {
                            question: "How many letters in 'Apple'?",
                            options: ["4", "5", "6", "3"],
                            correctAnswer: "5"
                        },
                        {
                            question: "What color is an apple usually?",
                            options: ["Blue", "Red", "Purple", "Black"],
                            correctAnswer: "Red"
                        },
                        {
                            question: "Apple is a ___",
                            options: ["Animal", "Fruit", "Color", "Number"],
                            correctAnswer: "Fruit"
                        }
                    ],
                    dragDrop: [
                        {
                            question: "Arrange to form: A is for Apple",
                            words: ["A", "is", "for", "Apple"],
                            correctOrder: [0, 1, 2, 3],
                            emoji: "🍎"
                        },
                        {
                            question: "Arrange to form: An Apple is red",
                            words: ["An", "Apple", "is", "red"],
                            correctOrder: [0, 1, 2, 3],
                            emoji: "🔴"
                        },
                        {
                            question: "Arrange to form: I eat Apple",
                            words: ["I", "eat", "Apple"],
                            correctOrder: [0, 1, 2],
                            emoji: "😋"
                        }
                    ]
                };
            }
        };

        // ✅ التحسين 2: معالجة أخطاء محسنة
        try {
            let result;
            
            if (user) {
                const quizDocRef = doc(db, "lessonQuizzes", currentLesson.id);
                try {
                    const quizDoc = await getDoc(quizDocRef);
                    if (quizDoc.exists()) {
                        result = quizDoc.data();
                    } else {
                        result = await generateQuizFromAI();
                        // محاولة حفظ في Firebase مع معالجة الخطأ
                        try {
                            await setDoc(quizDocRef, result);
                        } catch (saveError) {
                            console.warn('فشل حفظ الاختبار في Firebase:', saveError);
                            // المتابعة بدون حفظ
                        }
                    }
                } catch (firebaseError) {
                    console.warn('فشل الوصول لـ Firebase:', firebaseError);
                    // إنشاء اختبار جديد
                    result = await generateQuizFromAI();
                }
            } else {
                result = await generateQuizFromAI();
            }
            
            setQuizData(result);
            setView('multipleChoiceQuiz');
        } catch (e) {
            console.error('خطأ عام في إنشاء الاختبار:', e);
            setError('عذرًا، فشل إنشاء الاختبار. سيتم استخدام اختبار افتراضي.');
            
            // ✅ استخدام اختبار افتراضي كحل أخير
            try {
                const fallbackQuiz = await generateQuizFromAI(); // يحتوي على fallback داخلي
                setQuizData(fallbackQuiz);
                setView('multipleChoiceQuiz');
            } catch (finalError) {
                setError('عذرًا، حدث خطأ تقني. يرجى إعادة تحديث الصفحة.');
            }
        } finally {
            setIsLoading(prev => ({ ...prev, quiz: false }));
        }
    };

    const handleMultipleChoiceComplete = (score, total) => {
        setQuizResult({ score, total });
        if (score < PASSING_SCORE) {
            setView('reviewPrompt');
        } else {
            setView('dragDropQuiz'); // ✅ التعديل 4: تغيير إلى dragDropQuiz
        }
    };

    // ✅ التعديل 5: تغيير اسم الدالة والوظيفة
    const handleDragDropComplete = () => {
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
                
                {/* ✅ التحسين 3: عرض خطأ الشبكة إذا وُجد */}
                {error && (error.includes('Network') || error.includes('الاتصال') || error.includes('افتراضي')) && (
                    <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            ⚠️ مشكلة في الاتصال. سيتم استخدام اختبار افتراضي.
                        </p>
                    </div>
                )}
                
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
                className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-
