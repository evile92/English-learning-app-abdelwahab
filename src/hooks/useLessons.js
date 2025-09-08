// src/hooks/useLessons.js

import { useState, useCallback } from 'react';
import { doc, updateDoc, increment, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { initialLevels, lessonTitles } from '../data/lessons';
import { runGemini } from '../helpers/geminiHelper';

export const useLessons = (user, lessonsDataState, updateUserData, setPage, setCertificateToShow, logError) => {
    const [examPromptForLevel, setExamPromptForLevel] = useState(null);
    const [currentExamLevel, setCurrentExamLevel] = useState(null);
    const [finalExamQuestions, setFinalExamQuestions] = useState(null);

    const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
        if (!user) return;

        const levelId = lessonId.substring(0, 2);
        const pointsEarned = score * 10;
        const stars = Math.max(1, Math.round((score / total) * 3));

        // إنشاء نسخة عميقة لتجنب التعديل المباشر
        const updatedLessonsData = JSON.parse(JSON.stringify(lessonsDataState));
        updatedLessonsData[levelId] = updatedLessonsData[levelId].map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
        );

        const getNextReviewDate = (currentLevel = 0) => {
            const intervals = [1, 3, 7, 14, 30, 60, 120];
            const nextLevel = Math.min(currentLevel, intervals.length - 1);
            const date = new Date();
            date.setDate(date.getDate() + intervals[nextLevel]);
            return date.toISOString().split('T')[0];
        };

        const updates = {
            points: increment(pointsEarned),
            lessonsData: updatedLessonsData,
            [`reviewSchedule.lessons.${lessonId}`]: { level: 0, nextReviewDate: getNextReviewDate(0) }
        };

        await updateUserData(updates);

        const isLevelComplete = updatedLessonsData[levelId].every(lesson => lesson.completed);
        if (isLevelComplete) {
            setExamPromptForLevel(levelId);
        }
        
        setPage('lessons');
    }, [user, lessonsDataState, updateUserData, setPage]);

    const startFinalExam = useCallback(async (levelId) => {
        if (!user) return;

        setCurrentExamLevel(levelId);
        setFinalExamQuestions(null);
        setPage('finalExam');
        setExamPromptForLevel(null);
        try {
            const examDocRef = doc(db, "levelExams", levelId);
            const examDoc = await getDoc(examDocRef);
            if (examDoc.exists()) {
                setFinalExamQuestions(examDoc.data().questions);
            } else {
                const levelLessonTitles = lessonTitles[levelId].join(', ');
                const prompt = `You are an expert English teacher. Create a comprehensive final exam for an ${levelId}-level student, covering these topics: ${levelLessonTitles}. Generate a JSON object with a key "quiz" containing an array of exactly 15 unique multiple-choice questions. CRITICAL: For each question, the "correctAnswer" string MUST be one of the strings in the "options" array. Each question object must have keys: "question", "options" (an array of 4 strings), "correctAnswer", and "topic" (the lesson ID like 'A1-1', 'A2-5', etc.).`;
                const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" }, topic: { type: "STRING" } }, required: ["question", "options", "correctAnswer", "topic"] } } }, required: ["quiz"] };
                const result = await runGemini(prompt, schema);
                
                let questions = result.quiz;
                if (questions && Array.isArray(questions) && questions.length > 0) {
                    if (questions.length > 15) questions = questions.slice(0, 15);
                    await setDoc(examDocRef, { questions });
                    setFinalExamQuestions(questions);
                } else {
                    throw new Error("Generated exam content is not valid or empty.");
                }
            }
        } catch (error) {
            console.error("Failed to get or generate exam:", error);
            alert("حدث خطأ أثناء تحضير الامتحان. يرجى المحاولة مرة أخرى.");
            setPage('lessons');
        }
    }, [user, setPage]);

    const handleFinalExamComplete = useCallback(async (levelId, score, total) => {
        if (!user) return;

        const passMark = 0.8;
        const hasPassed = (score / total) >= passMark;

        // تسجيل الأخطاء في الاختبار
        // (يمكن إضافة هذا المنطق هنا إذا أردت)

        if (hasPassed) {
            const updates = { earnedCertificates: arrayUnion(levelId) };
            const levelKeys = Object.keys(initialLevels);
            const currentLevelIndex = levelKeys.indexOf(levelId);
            if (currentLevelIndex < levelKeys.length - 1) {
                updates.level = levelKeys[currentLevelIndex + 1];
            }
            await updateUserData(updates);
            alert(`🎉 تهانينا! لقد نجحت في الامتحان بدرجة ${score}/${total}.`);
            setCertificateToShow(levelId);
        } else {
            alert(`👍 مجهود جيد! نتيجتك هي ${score}/${total}. تحتاج إلى ${passMark * 100}% للنجاح. راجع دروسك وحاول مرة أخرى!`);
            setPage('lessons');
        }
        setCurrentExamLevel(null);
        setFinalExamQuestions(null);
    }, [user, updateUserData, setPage, setCertificateToShow]);

    return { 
        handleCompleteLesson,
        examPromptForLevel,
        setExamPromptForLevel,
        currentExamLevel,
        finalExamQuestions,
        startFinalExam,
        handleFinalExamComplete
    };
};
