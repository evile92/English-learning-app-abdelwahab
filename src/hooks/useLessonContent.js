// src/hooks/useLessonContent.js
import { useState, useEffect, useCallback } from 'react';
import { manualLessonsContent } from '../data/manualLessons';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { runGemini } from '../helpers/geminiHelper';

export const useLessonContent = (currentLesson, user) => {
    const [lessonContent, setLessonContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const generateLessonContent = useCallback(async () => {
        if (!currentLesson) return;
        
        setLessonContent(null);
        setIsLoading(true);
        setError('');

        // الخطوة 1: التحقق من المحتوى اليدوي المحلي أولاً
        const manualContent = manualLessonsContent[currentLesson.id];
        if (manualContent) {
            setLessonContent(manualContent);
            setIsLoading(false);
            return;
        }
        
        const generateWithGemini = async () => {
            console.log("Generating lesson with Gemini...");
            const level = currentLesson.id.substring(0, 2);
            const prompt = `You are an expert English teacher. For the lesson titled "${currentLesson.title}" for a ${level}-level student, generate a comprehensive lesson. Provide a JSON object with two keys: "explanation" (an object with "en" for a detailed English explanation and "ar" for a simple Arabic explanation) and "examples" (an array of 5 illustrative example sentences, each formatted as "English sentence - Arabic translation").`;

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

        // إذا كان المستخدم زائراً (غير مسجل)
        if (!user) {
            try {
                const result = await generateWithGemini();
                setLessonContent(result);
            } catch (e) {
                setError('عذراً، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // إذا كان المستخدم مسجلاً
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
            setError('عذراً، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
        } finally {
            setIsLoading(false);
        }
    }, [currentLesson, user]);

    useEffect(() => {
        if (currentLesson) {
            generateLessonContent();
        }
    }, [currentLesson, generateLessonContent]);

    return { 
        lessonContent, 
        isLoading, 
        error, 
        generateLessonContent 
    };
};
