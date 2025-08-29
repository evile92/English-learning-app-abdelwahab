// src/context/AppContext.js

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, arrayRemove, deleteField, serverTimestamp } from "firebase/firestore";
import { initialLevels, initialLessonsData, lessonTitles } from '../data/lessons';
import { achievementsList } from '../data/achievements';

async function runGemini(prompt, schema) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) { throw new Error("API key is missing."); }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { 
            const errorBody = await response.text(); console.error("API Error Body:", errorBody);
            throw new Error(`API request failed with status ${response.status}`); 
        }
        const result = await response.json();
        if (!result.candidates || result.candidates.length === 0) { throw new Error("No candidates returned from API."); }
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) { console.error("Error calling Gemini API:", error); throw error; }
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [authStatus, setAuthStatus] = useState('loading');
    const [isSyncing, setIsSyncing] = useState(true);
    const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
    const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', null);
    const [userName, setUserName] = usePersistentState('stellarSpeakUserName', '');
    const [lessonsDataState, setLessonsDataState] = usePersistentState('stellarSpeakLessonsData', () => initialLessonsData);
    const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
    const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);
    const [selectedLevelId, setSelectedLevelId] = usePersistentState('stellarSpeakSelectedLevelId', null);
    const [currentLesson, setCurrentLesson] = usePersistentState('stellarSpeakCurrentLesson', null);
    const [certificateToShow, setCertificateToShow] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const allLessons = useRef(Object.values(initialLessonsData).flat());
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);
    const [reviewItems, setReviewItems] = useState([]);
    const [examPromptForLevel, setExamPromptForLevel] = useState(null);
    const [currentExamLevel, setCurrentExamLevel] = useState(null);
    const [finalExamQuestions, setFinalExamQuestions] = useState(null);
    const [weakPoints, setWeakPoints] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [weakPointsQuiz, setWeakPointsQuiz] = useState(null);
    const [lastTrainingDate, setLastTrainingDate] = usePersistentState('stellarSpeakLastTraining', null);
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [dailyGoal, setDailyGoal] = usePersistentState('stellarSpeakDailyGoal', 10);
    const [timeSpent, setTimeSpent] = usePersistentState('stellarSpeakTimeSpent', { time: 0, date: new Date().toDateString() });
    
    const canTrainAgain = !lastTrainingDate || new Date().toDateString() !== new Date(lastTrainingDate).toDateString();

    // --- ✅ بداية التعديل: دالة مركزية ومحسّنة لمنح الشارات ---
    const checkAndAwardAchievements = useCallback(async (currentUser) => {
        if (!currentUser) return;
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) return;
        
        const currentData = userDoc.data();
        const unlockedAchievements = currentData.unlockedAchievements || [];
        const lessonsData = currentData.lessonsData || initialLessonsData;
        const streakCount = streakData.count;
        const vocabularyCount = (currentData.myVocabulary || []).length;

        let newAchievements = [];

        // Helper function to add a new achievement if not already unlocked
        const addAchievement = (id) => {
            if (!unlockedAchievements.includes(id) && !newAchievements.includes(id)) {
                newAchievements.push(id);
            }
        };

        const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed);
        
        // 1. أكملت أول درس
        if (completedLessons.length >= 1) addAchievement('FIRST_LESSON');
        
        // 2. سلسلة 7 أيام
        if (streakCount >= 7) addAchievement('STREAK_7_DAYS');

        // 3. سلسلة 30 يوماً (جديد)
        if (streakCount >= 30) addAchievement('STREAK_30_DAYS');

        // 4. أتقنت مستوى A1
        if ((lessonsData['A1'] || []).every(l => l.completed)) addAchievement('LEVEL_A1_COMPLETE');

        // 5. حصلت على 3 نجوم في 10 دروس
        if (completedLessons.filter(l => l.stars === 3).length >= 10) addAchievement('TEN_PERFECT_LESSONS');
        
        // 6. أكملت 5 دروس في مستوى واحد (جديد)
        for (const level in lessonsData) {
            if (lessonsData[level].filter(l => l.completed).length >= 5) {
                addAchievement('FIVE_LESSONS_IN_LEVEL');
                break; // نمنحها مرة واحدة فقط
            }
        }
        
        // 7. نجحت في أول امتحان (جديد)
        if (currentData.earnedCertificates && currentData.earnedCertificates.length > 0) {
            addAchievement('FIRST_EXAM_PASSED');
        }
        
        // 8. وصلت إلى المستوى B1 (جديد)
        if (currentData.level === 'B1' || currentData.level === 'B2' || currentData.level === 'C1') {
            addAchievement('LEVEL_B1_REACHED');
        }
        
        // 9. أضفت 10 كلمات للقاموس (جديد)
        if (vocabularyCount >= 10) {
            addAchievement('SAVE_10_WORDS');
        }

        // منح الشارات الجديدة
        if (newAchievements.length > 0) {
            await updateDoc(userDocRef, { unlockedAchievements: arrayUnion(...newAchievements) });
            setNewlyUnlockedAchievement(achievementsList[newAchievements[0]]); // عرض أول شارة جديدة
            // تحديث بيانات المستخدم محلياً لتجنب استدعاء آخر
            setUserData(prev => ({...prev, unlockedAchievements: [...unlockedAchievements, ...newAchievements]}));
        }
    }, [streakData.count]);
    // --- 🛑 نهاية التعديل ---

    const fetchUserData = useCallback(async (currentUser) => {
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                if (data.lessonsData) setLessonsDataState(data.lessonsData);
                if (data.level) setUserLevel(data.level);
                if (data.dailyGoal) setDailyGoal(data.dailyGoal);
            } else {
                setUserLevel(null); 
            }
        } else {
            setUserData(null);
        }
    }, [setLessonsDataState, setUserLevel, setDailyGoal]);

    const handleSetDailyGoal = useCallback(async (minutes) => {
        setDailyGoal(minutes);
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { dailyGoal: minutes });
        }
    }, [user, setDailyGoal]);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchUserData(currentUser);
            }
            setAuthStatus('idle');
            setIsSyncing(false);
        });
        return () => unsubscribe();
    }, [fetchUserData]);

    useEffect(() => {
        const today = new Date().toDateString();
        if (streakData.lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (streakData.lastVisit === yesterday.toDateString()) {
                setStreakData(prev => ({ count: prev.count + 1, lastVisit: today }));
            } else {
                setStreakData({ count: 1, lastVisit: today });
            }
        }
    }, [streakData, setStreakData]);

    // ✅ تحديث استدعاء دالة الشارات
    useEffect(() => {
        if (user && streakData.lastVisit) {
            checkAndAwardAchievements(user);
        }
    }, [streakData, user, lessonsDataState, checkAndAwardAchievements]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filteredLessons = allLessons.current.filter(lesson =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredLessons);
    }, [searchQuery]);

    // ✅ تحديث دالة التسجيل لإضافة الحقول الجديدة المطلوبة للشارات
    const handleGoogleSignIn = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    username: user.displayName,
                    email: user.email,
                    createdAt: serverTimestamp(),
                    points: 0,
                    level: 'A1',
                    earnedCertificates: [],
                    lessonsData: initialLessonsData,
                    unlockedAchievements: [],
                    myVocabulary: [],
                    reviewSchedule: { lessons: {}, vocabulary: {} },
                    // حقول جديدة لتتبع الشارات
                    usageStats: {
                        writingPracticeCount: 0,
                        readStoriesCount: 0,
                        roleplaysCompleted: 0,
                        pronunciationPracticeCount: 0,
                        reviewSessionsCompleted: 0,
                        visitedTools: [],
                    }
                });
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
        }
    }, []);
    
    const handleLogout = useCallback(async () => {
        await signOut(auth);
        window.localStorage.clear();
        setPage('welcome');
        setUser(null);
        setUserData(null);
        setUserLevel(null);
        setLessonsDataState(initialLessonsData);
        setUserName('');
        setSelectedLevelId(null);
        setCurrentLesson(null);
    }, [setPage, setUserLevel, setLessonsDataState, setUserName, setSelectedLevelId, setCurrentLesson]);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, [setPage]);

    const handleSearchSelect = useCallback((lesson) => {
        setCurrentLesson(lesson);
        setPage('lessonContent');
        setSearchQuery('');
    }, [setPage, setCurrentLesson]);

    const getNextReviewDate = (currentLevel) => {
        const intervals = [1, 3, 7, 14, 30, 60, 120];
        const nextLevel = Math.min(currentLevel, intervals.length - 1);
        const date = new Date();
        date.setDate(date.getDate() + intervals[nextLevel]);
        return date.toISOString().split('T')[0];
    };

    // ✅ تحديث دالة حفظ الكلمات للتحقق من الشارة
    const handleSaveWord = useCallback(async (englishWord, arabicTranslation) => {
        if (!user) {
            setShowRegisterPrompt(true);
            return;
        }
        const newWord = { en: englishWord.toLowerCase(), ar: arabicTranslation };
        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, {
                myVocabulary: arrayUnion(newWord),
                [`reviewSchedule.vocabulary.${newWord.en}`]: { level: 0, nextReviewDate: getNextReviewDate(0) }
            });
            alert(`تم حفظ "${englishWord}" في قاموسك وجدولتها للمراجعة!`);
            await fetchUserData(user); // جلب البيانات المحدثة
            checkAndAwardAchievements(user); // التحقق من الشارات
        } catch (error) {
            console.error("Error saving word:", error);
            alert("حدث خطأ أثناء حفظ الكلمة.");
        }
    }, [user, fetchUserData, checkAndAwardAchievements]);

    const handleDeleteWord = useCallback(async (wordToDelete) => {
        if (!user) {
            alert("يجب أن تكون مسجلاً لحذف الكلمات.");
            return;
        }

        const confirmDelete = window.confirm(`هل أنت متأكد من أنك تريد حذف كلمة "${wordToDelete.en}" من قاموسك؟`);
        if (!confirmDelete) {
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, {
                myVocabulary: arrayRemove(wordToDelete),
                [`reviewSchedule.vocabulary.${wordToDelete.en}`]: deleteField()
            });

            alert(`تم حذف "${wordToDelete.en}" بنجاح.`);
            await fetchUserData(user);
        } catch (error) {
            console.error("Error deleting word:", error);
            alert("حدث خطأ أثناء حذف الكلمة.");
        }
    }, [user, fetchUserData]);

    const handleUpdateReviewItem = useCallback(async (item, wasCorrect) => {
        if (!user) return;
        const itemType = item.type === 'lesson' ? 'lessons' : 'vocabulary';
        const itemId = item.type === 'lesson' ? item.id : item.en;
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            const schedule = userDoc.data()?.reviewSchedule;
            if (!schedule || !schedule[itemType] || !schedule[itemType][itemId]) return;
            const currentLevel = schedule[itemType][itemId].level || 0;
            const newLevel = wasCorrect ? currentLevel + 1 : 0;
            const nextDate = getNextReviewDate(newLevel);
            const reviewKey = `reviewSchedule.${itemType}.${itemId}`;
            await updateDoc(userDocRef, { [reviewKey]: { level: newLevel, nextReviewDate: nextDate } });
        } catch (error) {
            console.error("Error updating review item:", error);
        }
    }, [user]);

    // ✅ تحديث دالة إكمال الدرس للتحقق من الشارات
    const handleCompleteLesson = useCallback((lessonId, score, total) => {
        const levelId = lessonId.substring(0, 2);
        const pointsEarned = score * 10;
        const stars = Math.max(1, Math.round((score / total) * 3));
        
        const updateLogic = (currentLessonsData) => {
            const updatedLessonsData = { ...currentLessonsData };
            updatedLessonsData[levelId] = currentLessonsData[levelId].map(lesson =>
                lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
            );
            return updatedLessonsData;
        };

        if (!user) {
            setLessonsDataState(updateLogic);
            setShowRegisterPrompt(true);
        } else {
            const updatedLessonsData = updateLogic(lessonsDataState);
            const userDocRef = doc(db, "users", user.uid);
            const updates = {
                points: increment(pointsEarned),
                lessonsData: updatedLessonsData,
                [`reviewSchedule.lessons.${lessonId}`]: { level: 0, nextReviewDate: getNextReviewDate(0) }
            };
            
            updateDoc(userDocRef, updates)
                .then(() => {
                    setLessonsDataState(updatedLessonsData); // تحديث الحالة المحلية بعد النجاح
                    checkAndAwardAchievements(user); // التحقق من الشارات
                    const isLevelComplete = updatedLessonsData[levelId].every(lesson => lesson.completed);
                    if (isLevelComplete) {
                        setExamPromptForLevel(levelId);
                    }
                })
                .catch(error => console.error("Error saving progress:", error));
        }
        setSelectedLevelId(levelId);
        setPage('lessons');
    }, [user, lessonsDataState, checkAndAwardAchievements, setLessonsDataState, setSelectedLevelId, setPage]);


    const startFinalExam = useCallback(async (levelId) => {
        if (!user) {
            setShowRegisterPrompt(true);
            return;
        }

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
                    if (questions.length > 15) {
                        questions = questions.slice(0, 15);
                    }
                    await setDoc(examDocRef, { questions: questions });
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

    // ✅ تحديث دالة إكمال الامتحان للتحقق من الشارات
    const handleFinalExamComplete = useCallback(async (levelId, score, total) => {
        const passMark = 0.8;
        const hasPassed = (score / total) >= passMark;
        if (hasPassed) {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const updates = { earnedCertificates: arrayUnion(levelId) };
                    const levelKeys = Object.keys(initialLevels);
                    const currentLevelIndex = levelKeys.indexOf(levelId);
                    if (currentLevelIndex < levelKeys.length - 1) {
                        updates.level = levelKeys[currentLevelIndex + 1];
                        setUserLevel(updates.level);
                    }
                    await updateDoc(userDocRef, updates);
                    checkAndAwardAchievements(user); // التحقق من الشارات
                } catch (error) { console.error("Error updating user data after exam:", error); }
            }
            alert(`🎉 تهانينا! لقد نجحت في الامتحان بدرجة ${score}/${total}.`);
            setCertificateToShow(levelId);
        } else {
            alert(`👍 مجهود جيد! نتيجتك هي ${score}/${total}. تحتاج إلى ${passMark * 100}% للنجاح. راجع دروسك وحاول مرة أخرى!`);
            setPage('lessons');
        }
        setCurrentExamLevel(null);
        setFinalExamQuestions(null);
    }, [user, setUserLevel, setPage, checkAndAwardAchievements]);

    const handleStartReview = useCallback((items) => {
        setReviewItems(items);
        setPage('reviewSession');
    }, [setPage]);

    const handleCertificateDownload = useCallback(() => {
        setCertificateToShow(null);
        handlePageChange('dashboard');
    }, [handlePageChange]);

    const viewCertificate = useCallback((levelId) => {
        setCertificateToShow(levelId);
    }, []);

    const handleTestComplete = useCallback((level) => {
        setUserLevel(level);
        setPage('nameEntry');
    }, [setUserLevel, setPage]);

    const handleNameSubmit = useCallback((name) => {
        setUserName(name);
        setPage('dashboard');
    }, [setUserName, setPage]);

    const handleLevelSelect = useCallback((levelId) => {
        setSelectedLevelId(levelId);
        setPage('lessons');
    }, [setSelectedLevelId, setPage]);
    
    const handleSelectLesson = useCallback((lesson) => {
        setCurrentLesson(lesson);
        setPage('lessonContent');
    }, [setCurrentLesson, setPage]);
    
    const logError = useCallback(async (questionTopic) => {
        if (!user || !questionTopic) return;
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                errorLog: arrayUnion({ topic: questionTopic, date: new Date().toISOString() })
            });
        } catch (error) {
            console.error("Error logging mistake:", error);
        }
    }, [user]);

    const analyzeWeakPoints = useCallback(async () => {
        if (!user) {
            setWeakPoints([]);
            return;
        };
        setIsAnalyzing(true);
        setWeakPoints(null);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const errorLog = userDoc.data()?.errorLog || [];
        if (errorLog.length === 0) {
            setWeakPoints([]);
            setIsAnalyzing(false);
            return;
        }
        const errorCounts = errorLog.reduce((acc, error) => {
            acc[error.topic] = (acc[error.topic] || 0) + 1;
            return acc;
        }, {});
        const identifiedWeakPoints = Object.entries(errorCounts)
            .filter(([, count]) => count >= 3)
            .map(([topicId, errorCount]) => {
                const lesson = allLessons.current.find(l => l.id === topicId);
                return {
                    topicId,
                    title: lesson ? lesson.title : "درس غير معروف",
                    errorCount
                };
            })
            .sort((a, b) => b.errorCount - a.errorCount);
        setWeakPoints(identifiedWeakPoints);
        setIsAnalyzing(false);
    }, [user]);

    const startWeakPointsTraining = useCallback(async () => {
        if (!user || !weakPoints || weakPoints.length === 0 || !canTrainAgain) return;
        setPage('weakPointsQuiz');
        setWeakPointsQuiz(null);
        const weakPointsKey = weakPoints.map(p => p.topicId).sort().join(',');
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            const cachedQuizzes = userDoc.data()?.weakPointsCache || {};
            if (cachedQuizzes[weakPointsKey]) {
                setWeakPointsQuiz(cachedQuizzes[weakPointsKey]);
            } else {
                const topicsString = weakPoints.map(p => p.title).join(', ');
                const prompt = `This user is weak in the following topics: ${topicsString}. Create a focused training session of 5 multiple-choice questions (2-3 per topic) targeting common mistakes. Return a JSON object with a "quiz" key containing the array of questions. Each question must have "question", "options", "correctAnswer", and "topic" (the original lesson ID).`;
                const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" }, topic: { type: "STRING" } }, required: ["question", "options", "correctAnswer", "topic"] } } }, required: ["quiz"] };
                const result = await runGemini(prompt, schema);
                if (result.quiz && result.quiz.length > 0) {
                    setWeakPointsQuiz(result.quiz);
                    await updateDoc(userDocRef, {
                        [`weakPointsCache.${weakPointsKey}`]: result.quiz
                    });
                } else {
                    throw new Error("Generated quiz is empty.");
                }
            }
            setLastTrainingDate(new Date().toISOString());
        } catch (error) {
            console.error("Failed to start weak points training:", error);
            alert("حدث خطأ أثناء تحضير جلسة التدريب.");
            setPage('weakPoints');
        }
    }, [user, weakPoints, canTrainAgain, setPage]);

    const handleWeakPointsQuizComplete = useCallback((answers) => {
        let score = 0;
        weakPointsQuiz.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score++;
            }
        });
        alert(`أحسنت! لقد أكملت الجلسة بنتيجة ${score}/${weakPointsQuiz.length}. استمر في الممارسة!`);
        setPage('dashboard');
    }, [weakPointsQuiz, setPage]);

    const handleBackToDashboard = useCallback(() => setPage('dashboard'), [setPage]);
    const handleBackToLessons = useCallback(() => setPage('lessons'), [setPage]);
    const handleBackToProfile = useCallback(() => setPage('profile'), [setPage]);

    const value = {
        user, setUser, userData, setUserData, authStatus, setAuthStatus, isSyncing, setIsSyncing,
        page, setPage, handlePageChange, userLevel, setUserLevel, userName, setUserName,
        lessonsDataState, setLessonsDataState, streakData, setStreakData, isDarkMode, setIsDarkMode,
        selectedLevelId, setSelectedLevelId, currentLesson, setCurrentLesson, certificateToShow, setCertificateToShow,
        searchQuery, setSearchQuery, searchResults, setSearchResults, allLessons,
        isProfileModalOpen, setIsProfileModalOpen, isMoreMenuOpen, setIsMoreMenuOpen,
        newlyUnlockedAchievement, setNewlyUnlockedAchievement, reviewItems, setReviewItems,
        fetchUserData, handleLogout, handleSearchSelect, handleSaveWord, handleCompleteLesson,
        handleStartReview, handleCertificateDownload, viewCertificate, handleTestComplete,
        handleNameSubmit, handleLevelSelect, handleSelectLesson, handleBackToDashboard,
        handleBackToLessons, handleBackToProfile, initialLevels,
        handleUpdateReviewItem,
        examPromptForLevel, setExamPromptForLevel,
        startFinalExam, handleFinalExamComplete,
        currentExamLevel, finalExamQuestions,
        weakPoints, isAnalyzing, analyzeWeakPoints, startWeakPointsTraining,
        weakPointsQuiz, handleWeakPointsQuizComplete, logError,
        lastTrainingDate, canTrainAgain,
        showRegisterPrompt, setShowRegisterPrompt,
        dailyGoal, setDailyGoal: handleSetDailyGoal,
        timeSpent, setTimeSpent,
        handleDeleteWord,
        handleGoogleSignIn
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
