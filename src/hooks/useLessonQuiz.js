// src/hooks/useLessonQuiz.js - نسخة محسنة
import { useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { runGemini } from '../helpers/geminiHelper';

export const useLessonQuiz = (lessonContent, currentLesson, user) => {
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // ✅ إضافة callback للإشعار عند اكتمال التحميل
    const handleStartQuiz = useCallback(async (onSuccess) => {
        if (!lessonContent || !currentLesson) return false;

        setIsLoading(true);
        setError('');

        const generateQuizFromAI = async () => {
            const lessonTextContent = `Explanation: ${lessonContent.explanation.en}. Examples: ${lessonContent.examples.map(ex => ex.en || ex).join(' ')}`;
            
            const prompt = `Based on this lesson content: "${lessonTextContent}", create a JSON quiz object. It must have two keys: "multipleChoice": an array of 8 multiple-choice questions (with "question", "options", "correctAnswer"), and "fillInTheBlank": an array of 3 fill-in-the-blank exercises (with "question" containing "___" for the blank, and "correctAnswer").`;
            
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
                    fillInTheBlank: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                correctAnswer: { type: "string" }
                            },
                            required: ["question", "correctAnswer"]
                        }
                    }
                },
                required: ["multipleChoice", "fillInTheBlank"]
            };
            return await runGemini(prompt, 'lesson', schema);
        };

        try {
            let result;
            
            if (user) {
                const quizDocRef = doc(db, "lessonQuizzes", currentLesson.id);
                const quizDoc = await getDoc(quizDocRef);
                if (quizDoc.exists()) {
                    result = quizDoc.data();
                } else {
                    result = await generateQuizFromAI();
                    await setDoc(quizDocRef, result);
                }
            } else {
                result = await generateQuizFromAI();
            }
            
            setQuizData(result);
            
            // ✅ استدعاء callback عند النجاح
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(result);
            }
            
            return true; // ✅ إرجاع true عند النجاح
            
        } catch (e) {
            setError('عذراً، فشل إنشاء الاختبار. يرجى المحاولة مرة أخرى.');
            return false; // ✅ إرجاع false عند الفشل
        } finally {
            setIsLoading(false);
        }
    }, [lessonContent, currentLesson, user]);

    return { 
        quizData, 
        isLoading, 
        error,
        handleStartQuiz 
    };
};
