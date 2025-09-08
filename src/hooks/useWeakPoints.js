// src/hooks/useWeakPoints.js

import { useState, useCallback } from 'react';
import { arrayUnion } from "firebase/firestore";
import { runGemini } from '../helpers/geminiHelper';
import { usePersistentState } from './usePersistentState';
import { lessonTitles } from '../data/lessons';

export const useWeakPoints = (user, errorLog, updateUserData, setPage) => {
    const [weakPoints, setWeakPoints] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [weakPointsQuiz, setWeakPointsQuiz] = useState(null);
    const [lastTrainingDate, setLastTrainingDate] = usePersistentState('stellarSpeakLastTraining', null);

    // التحقق مما إذا كان يمكن للمستخدم التدريب مرة أخرى (مرة واحدة في اليوم)
    const canTrainAgain = !lastTrainingDate || new Date().toDateString() !== new Date(lastTrainingDate).toDateString();

    const logError = useCallback(async (questionTopic) => {
        if (!user || !questionTopic) return;
        // تسجيل موضوع السؤال الذي أخطأ فيه المستخدم
        await updateUserData({
            errorLog: arrayUnion({ topic: questionTopic, date: new Date().toISOString() })
        });
    }, [user, updateUserData]);
    
    // دالة تحليل الأخطاء لتحديد نقاط الضعف
    const analyzeWeakPoints = useCallback(async () => {
        if (!errorLog || errorLog.length < 5) {
            setWeakPoints([]);
            return;
        }

        setIsAnalyzing(true);
        // حساب عدد مرات تكرار الخطأ في كل موضوع
        const errorCounts = errorLog.reduce((acc, error) => {
            acc[error.topic] = (acc[error.topic] || 0) + 1;
            return acc;
        }, {});

        // ترتيب المواضيع حسب عدد الأخطاء وتحديد أكثر 3 نقاط ضعف
        const sortedErrors = Object.entries(errorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        
        const allLessonsList = Object.entries(lessonTitles).flatMap(([level, titles]) => 
            titles.map((title, i) => ({ id: `${level}-${i + 1}`, title }))
        );

        const identifiedWeakPoints = sortedErrors.map(([topicId, count]) => {
            const lessonInfo = allLessonsList.find(l => l.id === topicId);
            return {
                topicId: topicId,
                errorCount: count,
                title: lessonInfo ? lessonInfo.title : "موضوع غير محدد"
            };
        });

        setWeakPoints(identifiedWeakPoints);
        setIsAnalyzing(false);
    // ✅ --- بداية الإصلاح: إضافة الاعتماديات الصحيحة ---
    }, [errorLog]);
    // 🛑 --- نهاية الإصلاح ---

    // دالة بدء جلسة تدريب مخصصة
    const startWeakPointsTraining = useCallback(async () => {
        if (!user || !weakPoints || weakPoints.length === 0 || !canTrainAgain) return;

        setPage('weakPointsQuiz');
        setWeakPointsQuiz(null); // مسح الاختبار القديم
        
        const topics = weakPoints.map(p => `"${p.title}"`).join(', ');
        const prompt = `You are an expert English teacher. Create a focused quiz for a student whose weak points are in these topics: ${topics}. Generate a JSON object with a key "quiz" containing an array of exactly 5 multiple-choice questions targeting these weaknesses. Each question object must have "question", "options" (4 strings), and "correctAnswer".`;
        const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" } }, required: ["question", "options", "correctAnswer"] } } }, required: ["quiz"] };
        
        try {
            const result = await runGemini(prompt, schema);
            if (result.quiz && result.quiz.length > 0) {
                setWeakPointsQuiz(result.quiz);
                // تحديث تاريخ آخر تدريب
                const today = new Date().toISOString();
                setLastTrainingDate(today);
                await updateUserData({ lastTrainingDate: today });
            }
        } catch (error) {
            console.error("Failed to generate weak points quiz:", error);
            alert("فشل في إنشاء جلسة التدريب. يرجى المحاولة مرة أخرى.");
            setPage('dashboard'); // العودة للوحة التحكم في حال الفشل
        }
    // ✅ --- بداية الإصلاح: إضافة الاعتماديات الصحيحة ---
    }, [user, weakPoints, canTrainAgain, setPage, updateUserData, setLastTrainingDate]);
    // 🛑 --- نهاية الإصلاح ---

    // دالة عند إكمال اختبار نقاط الضعف
    const handleWeakPointsQuizComplete = useCallback((answers) => {
        // يمكن هنا عرض النتائج أو رسالة تشجيعية
        alert("أحسنت! لقد أكملت جلسة التدريب. استمر في الممارسة!");
        setWeakPointsQuiz(null); // مسح الاختبار بعد الانتهاء
        setPage('dashboard'); // العودة للوحة التحكم
    // ✅ --- بداية الإصلاح: إضافة الاعتماديات الصحيحة ---
    }, [setPage]);
    // 🛑 --- نهاية الإصلاح ---

    return {
        logError,
        weakPoints,
        isAnalyzing,
        analyzeWeakPoints,
        startWeakPointsTraining,
        weakPointsQuiz,
        handleWeakPointsQuizComplete,
        lastTrainingDate,
        canTrainAgain
    };
};
