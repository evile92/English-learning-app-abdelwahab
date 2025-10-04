// src/hooks/useLessonQuiz.js
import { useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { runGemini } from '../helpers/geminiHelper';

export const useLessonQuiz = (lessonContent, currentLesson, user) => {
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStartQuiz = useCallback(async () => {
        if (!lessonContent || !currentLesson) return;

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
        } catch (e) {
            setError('عذراً، فشل إنشاء الاختبار. يرجى المحاولة مرة أخرى.');
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
