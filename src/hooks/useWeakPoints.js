// src/hooks/useWeakPoints.js

import { useState, useCallback } from 'react';
import { arrayUnion } from "firebase/firestore";
import { runGemini } from '../helpers/geminiHelper';
import { usePersistentState } from './usePersistentState';
import { lessonTitles } from '../data/lessons';
import { useNavigate } from 'react-router-dom';

export const useWeakPoints = (user, errorLog, updateUserData) => {
    const navigate = useNavigate();
    const [smartFocusTopics, setSmartFocusTopics] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [topicQuiz, setTopicQuiz] = useState(null);
    const [lastTrainingDate, setLastTrainingDate] = usePersistentState('stellarSpeakLastTraining', null);

    const canTrainAgain = !lastTrainingDate || new Date().toDateString() !== new Date(lastTrainingDate).toDateString();

    const logError = useCallback(async (questionTopic) => {
        if (!user || !questionTopic) return;
        await updateUserData({
            errorLog: arrayUnion({ topic: questionTopic, date: new Date().toISOString() })
        });
    }, [user, updateUserData]);
    
    const analyzeSmartFocusTopics = useCallback(async () => {
        setIsAnalyzing(true);
        try {
            if (!errorLog || errorLog.length < 3) { // خفضنا الحد ليبدأ التحليل أسرع
                setSmartFocusTopics([]);
                return;
            }

            const errorCounts = errorLog.reduce((acc, error) => {
                acc[error.topic] = (acc[error.topic] || 0) + 1;
                return acc;
            }, {});

            // ترتيب المواضيع حسب عدد الأخطاء وتحديد أكثر 4 نقاط ضعف
            const sortedErrors = Object.entries(errorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);
            
            const allLessonsList = Object.entries(lessonTitles).flatMap(([level, titles]) => 
                titles.map((title, i) => ({ id: `${level}-${i + 1}`, title }))
            );

            const identifiedTopics = sortedErrors.map(([topicId, count]) => {
                const lessonInfo = allLessonsList.find(l => l.id === topicId);
                // معادلة بسيطة لحساب الإتقان: كلما زادت الأخطاء قل الإتقان
                const mastery = Math.max(0, 100 - (count * 20)); 
                return {
                    topicId: topicId,
                    errorCount: count,
                    title: lessonInfo ? lessonInfo.title : "موضوع غير محدد",
                    mastery: mastery
                };
            });

            setSmartFocusTopics(identifiedTopics);
        } finally {
            setIsAnalyzing(false);
        }
    }, [errorLog]);

    const startTopicTraining = useCallback(async (topic) => {
        if (!user || !topic || !canTrainAgain) return;

        navigate('/smart-focus-quiz');
        setTopicQuiz(null);
        
        const prompt = `You are an expert English teacher. Create a focused quiz for a student whose weak point is "${topic.title}". Generate a JSON object with a key "quiz" containing an array of exactly 5 multiple-choice questions targeting this specific topic. Each question must have "question", "options" (4 strings), and "correctAnswer".`;

        // التعديل المطلوب فقط: JSON Schema قياسي وتمرير mode مناسب
        const schema = { 
            type: "object", 
            properties: { 
                quiz: { 
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
                } 
            }, 
            required: ["quiz"] 
        };
        
        try {
            const result = await runGemini(prompt, 'lesson', schema);
            if (result.quiz && result.quiz.length > 0) {
                setTopicQuiz({ title: topic.title, questions: result.quiz });
                const today = new Date().toISOString();
                setLastTrainingDate(today);
                await updateUserData({ lastTrainingDate: today });
            }
        } catch (error) {
            console.error("Failed to generate topic quiz:", error);
            alert("فشل في إنشاء جلسة التدريب. يرجى المحاولة مرة أخرى.");
            navigate('/');
        }
    }, [user, canTrainAgain, navigate, updateUserData, setLastTrainingDate]);

    const handleTopicQuizComplete = useCallback(() => {
        alert("أحسنت! لقد أكملت جلسة التدريب. استمر في الممارسة!");
        setTopicQuiz(null);
        navigate('/');
    }, [navigate]);

    return {
        logError,
        smartFocusTopics,
        isAnalyzing,
        analyzeSmartFocusTopics,
        startTopicTraining,
        topicQuiz,
        handleTopicQuizComplete,
        lastTrainingDate,
        canTrainAgain
    };
};
