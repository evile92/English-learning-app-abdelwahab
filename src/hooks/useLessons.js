// src/hooks/useLessons.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ الإضافة الوحيدة
import { doc, updateDoc, increment, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { initialLevels, lessonTitles } from '../data/lessons';
import { runGemini } from '../helpers/geminiHelper';
import { logError } from '../utils/errorHandler'; // تم حذف AppError و ErrorCodes لأنها غير مستخدمة هنا

export const useLessons = (user, lessonsDataState, userData, setUserData, updateUserData, setPage, setCertificateToShow, logError) => {
    const navigate = useNavigate(); // ✅ الإضافة الوحيدة
    const [examPromptForLevel, setExamPromptForLevel] = useState(null);
    const [currentExamLevel, setCurrentExamLevel] = useState(null);
    const [finalExamQuestions, setFinalExamQuestions] = useState(null);

    // ... (دالة handleCompleteLesson تبقى كما هي بدون تغيير)
    const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
        if (!user) return;

        const levelId = lessonId.substring(0, 2);
        const pointsEarned = score * 10;
        const stars = Math.max(1, Math.round((score / total) * 3));
        
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
        
        const previousUserData = {
            points: userData.points,
            lessonsData: userData.lessonsData,
            reviewSchedule: userData.reviewSchedule
        };
        
        setUserData(prevData => ({
            ...prevData,
            points: (prevData.points || 0) + pointsEarned,
            lessonsData: updatedLessonsData,
            reviewSchedule: {
                ...prevData.reviewSchedule,
                lessons: {
                    ...prevData.reviewSchedule.lessons,
                    [lessonId]: { level: 0, nextReviewDate: getNextReviewDate(0) }
                }
            }
        }));

        try {
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
            
            navigate('/lessons'); // ✅ التغيير الوحيد
            
        } catch (error) {
            setUserData(prevData => ({
                ...prevData,
                points: previousUserData.points,
                lessonsData: previousUserData.lessonsData,
                reviewSchedule: previousUserData.reviewSchedule
            }));
            
            await logError(error, 'Complete Lesson Failed', {
                userId: user.uid,
                lessonId,
                pointsEarned,
                levelId
            });
            
            alert('❌ حدث خطأ في حفظ تقدم الدرس. يرجى المحاولة مرة أخرى.');
            console.error("Error completing lesson:", error);
        }
    }, [user, lessonsDataState, userData, updateUserData, navigate, setUserData, logError]); // ✅ إضافة navigate


    const startFinalExam = useCallback(async (levelId) => {
        if (!user) return;

        setCurrentExamLevel(levelId);
        setFinalExamQuestions(null);
        navigate('/final-exam'); // ✅ التغيير الوحيد
        setExamPromptForLevel(null);
        try {
            const examDocRef = doc(db, "levelExams", levelId);
            const examDoc = await getDoc(examDocRef);

            if (examDoc.exists() && examDoc.data().questions?.length >= 15) { // التأكد من وجود أسئلة كافية
                setFinalExamQuestions(examDoc.data().questions);
            } else {
                const levelLessonTitles = lessonTitles[levelId].join(', ');
                const prompt = `You are an expert English teacher. Create a comprehensive final exam for an ${levelId}-level student, covering these topics: ${levelLessonTitles}. Generate a JSON object with a key "quiz" containing an array of exactly 15 unique multiple-choice questions. CRITICAL: For each question, the "correctAnswer" string MUST be one of the strings in the "options" array. Each question object must have keys: "question", "options" (an array of 4 strings), "correctAnswer", and "topic" (the lesson ID like 'A1-1', 'A2-5', etc.).`;
                
                // --- ✅ الخطوة 1: تصحيح الـ Schema إلى الصيغة الصحيحة ---
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
                                    correctAnswer: { type: "string" }, 
                                    topic: { type: "string" } 
                                }, 
                                required: ["question", "options", "correctAnswer", "topic"] 
                            } 
                        } 
                    }, 
                    required: ["quiz"] 
                };
                
                // --- ✅ الخطوة 2: تصحيح الاستدعاء بإضافة 'lesson' كـ "mode" ---
                const result = await runGemini(prompt, 'lesson', schema);
                
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
            await logError(error, 'Start Final Exam Failed', {
                userId: user.uid,
                levelId
            });
            alert("حدث خطأ أثناء تحضير الامتحان. يرجى المحاولة مرة أخرى.");
            navigate('/lessons'); // ✅ التغيير الوحيد
        }
    }, [user, navigate, logError]); // ✅ إضافة navigate

    // ... (دالة handleFinalExamComplete تبقى كما هي بدون تغيير)
    const handleFinalExamComplete = useCallback(async (levelId, score, total) => {
        if (!user) return;
        const passMark = 0.8;
        const hasPassed = (score / total) >= passMark;
        if (hasPassed) {
            const previousCertificates = userData.earnedCertificates;
            const previousLevel = userData.level;
            try {
                const updates = { earnedCertificates: arrayUnion(levelId) };
                const levelKeys = Object.keys(initialLevels);
                const currentLevelIndex = levelKeys.indexOf(levelId);
                if (currentLevelIndex < levelKeys.length - 1) {
                    updates.level = levelKeys[currentLevelIndex + 1];
                }
                await updateUserData(updates);
                setUserData(prevData => {
                     const newCertificates = prevData.earnedCertificates.includes(levelId)
                        ? prevData.earnedCertificates
                        : [...prevData.earnedCertificates, levelId];
                    
                    return {
                        ...prevData,
                        earnedCertificates: newCertificates,
                        level: updates.level || prevData.level
                    };
                });
                alert(`🎉 تهانينا! لقد نجحت في الامتحان بدرجة ${score}/${total}.`);
                setCertificateToShow(levelId);
                
            } catch (error) {
                setUserData(prevData => ({
                    ...prevData,
                    earnedCertificates: previousCertificates,
                    level: previousLevel
                }));
                
                await logError(error, 'Final Exam Complete Failed', {
                    userId: user.uid,
                    levelId,
                    score,
                    total
                });
                
                alert('❌ نجحت في الامتحان لكن حدث خطأ في حفظ الشهادة. يرجى المحاولة مرة أخرى.');
                console.error("Error completing final exam:", error);
            }
        } else {
            alert(`👍 مجهود جيد! نتيجتك هي ${score}/${total}. تحتاج إلى ${passMark * 100}% للنجاح. راجع دروسك وحاول مرة أخرى!`);
            navigate('/lessons'); // ✅ التغيير الوحيد
        }
        setCurrentExamLevel(null);
        setFinalExamQuestions(null);
    }, [user, userData, updateUserData, navigate, setCertificateToShow, setUserData, logError]); // ✅ إضافة navigate


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
