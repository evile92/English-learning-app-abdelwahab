// src/context/AppContext.js

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { initialLevels, initialLessonsData } from '../data/lessons';
import { achievementsList } from '../data/achievements';

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

    const fetchUserData = useCallback(async (currentUser) => {
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                if (data.lessonsData) setLessonsDataState(data.lessonsData);
                if (data.level) setUserLevel(data.level);
            } else {
                setUserLevel(null);
            }
        } else {
            setUserData(null);
        }
    }, [setLessonsDataState, setUserLevel]);

    const checkAndAwardAchievements = useCallback(async (currentUser, currentLessonsData, currentStreakData) => {
        if (!currentUser) return;
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) return;
        const currentData = userDoc.data();
        const unlockedAchievements = currentData.unlockedAchievements || [];
        let newAchievements = [];
        const completedLessons = Object.values(currentLessonsData).flat().filter(l => l.completed);
        if (completedLessons.length >= 1 && !unlockedAchievements.includes('FIRST_LESSON')) {
            newAchievements.push('FIRST_LESSON');
        }
        if (currentStreakData.count >= 7 && !unlockedAchievements.includes('STREAK_7_DAYS')) {
            newAchievements.push('STREAK_7_DAYS');
        }
        const a1Lessons = currentLessonsData['A1'] || [];
        if (a1Lessons.every(l => l.completed) && !unlockedAchievements.includes('LEVEL_A1_COMPLETE')) {
            newAchievements.push('LEVEL_A1_COMPLETE');
        }
        const perfectLessons = completedLessons.filter(l => l.stars === 3);
        if (perfectLessons.length >= 10 && !unlockedAchievements.includes('TEN_PERFECT_LESSONS')) {
            newAchievements.push('TEN_PERFECT_LESSONS');
        }
        if (newAchievements.length > 0) {
            await updateDoc(userDocRef, {
                unlockedAchievements: arrayUnion(...newAchievements)
            });
            setNewlyUnlockedAchievement(achievementsList[newAchievements[0]]);
            await fetchUserData(currentUser);
        }
    }, [fetchUserData]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchUserData(currentUser);
            } else {
                setUserLevel(null);
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

    useEffect(() => {
        if (user && streakData.lastVisit) {
            checkAndAwardAchievements(user, lessonsDataState, streakData);
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

    const handleLogout = async () => {
        await signOut(auth);
        window.localStorage.removeItem('stellarSpeakPage');
        window.localStorage.removeItem('stellarSpeakUserLevel');
        window.localStorage.removeItem('stellarSpeakUserName');
        window.localStorage.removeItem('stellarSpeakLessonsData');
        window.localStorage.removeItem('stellarSpeakSelectedLevelId');
        window.localStorage.removeItem('stellarSpeakCurrentLesson');
        setPage('welcome');
        setUserLevel(null);
        setLessonsDataState(initialLessonsData);
        setUserName('');
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchSelect = (lesson) => {
        setCurrentLesson(lesson);
        setPage('lessonContent');
        setSearchQuery('');
    };

    const getNextReviewDate = (currentLevel) => {
        const intervals = [1, 3, 7, 14, 30, 60, 120]; // أيام المراجعة
        const nextLevel = Math.min(currentLevel, intervals.length - 1);
        const date = new Date();
        date.setDate(date.getDate() + intervals[nextLevel]);
        return date.toISOString().split('T')[0];
    };

    const handleSaveWord = async (englishWord, arabicTranslation) => {
        if (!user) {
            alert("يرجى تسجيل الدخول أولاً لحفظ الكلمات في قاموسك الدائم.");
            return;
        }
        const newWord = { en: englishWord.toLowerCase(), ar: arabicTranslation };
        const userDocRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            const currentVocabulary = userData.myVocabulary || [];
            const isAlreadySaved = currentVocabulary.some(word => word.en === newWord.en);
            if (isAlreadySaved) {
                alert("هذه الكلمة محفوظة بالفعل في قاموسك.");
                return;
            }
            const reviewKey = `reviewSchedule.vocabulary.${newWord.en}`;
            await updateDoc(userDocRef, {
                myVocabulary: arrayUnion(newWord),
                [reviewKey]: { level: 0, nextReviewDate: getNextReviewDate(0) }
            });
            alert(`تم حفظ "${englishWord}" في قاموسك وجدولتها للمراجعة!`);
            await fetchUserData(user);
        } catch (error) {
            console.error("Error saving word:", error);
            alert("حدث خطأ أثناء حفظ الكلمة.");
        }
    };
    
    // --- (بداية الإضافة الجديدة) ---
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
            await updateDoc(userDocRef, {
                [reviewKey]: { level: newLevel, nextReviewDate: nextDate }
            });

        } catch (error) {
            console.error("Error updating review item:", error);
        }
    }, [user]);
    // --- (نهاية الإضافة) ---

    const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
        const levelId = lessonId.substring(0, 2);
        const pointsEarned = score * 10;
        const stars = Math.max(1, Math.round((score / total) * 3));
        const updatedLessonsData = {
            ...lessonsDataState,
            [levelId]: lessonsDataState[levelId].map(lesson =>
                lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
            )
        };
        setLessonsDataState(updatedLessonsData);
        let shouldShowCertificate = false;
        const isLevelComplete = updatedLessonsData[levelId].every(lesson => lesson.completed);
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const updates = {
                    points: increment(pointsEarned),
                    lessonsData: updatedLessonsData
                };
                const reviewKey = `reviewSchedule.lessons.${lessonId}`;
                updates[reviewKey] = { level: 0, nextReviewDate: getNextReviewDate(0) };
                if (isLevelComplete) {
                    const currentDBData = (await getDoc(userDocRef)).data();
                    const hasCertificate = currentDBData.earnedCertificates?.includes(levelId);
                    if (!hasCertificate) {
                        shouldShowCertificate = true;
                        updates.earnedCertificates = arrayUnion(levelId);
                        const levelKeys = Object.keys(initialLevels);
                        const currentLevelIndex = levelKeys.indexOf(levelId);
                        const nextLevelIndex = currentLevelIndex + 1;
                        if (nextLevelIndex < levelKeys.length) {
                            const nextLevel = levelKeys[nextLevelIndex];
                            updates.level = nextLevel;
                            setUserLevel(nextLevel);
                        }
                    }
                }
                await updateDoc(userDocRef, updates);
                await fetchUserData(user);
                await checkAndAwardAchievements(user, updatedLessonsData, streakData);
            } catch (error) {
                console.error("Error saving progress:", error);
                setLessonsDataState(lessonsDataState);
            }
        } else {
            if(isLevelComplete) {
                shouldShowCertificate = true;
            }
        }
        if (shouldShowCertificate) {
            setCertificateToShow(levelId);
        } else {
            setPage('lessons');
        }
    }, [user, lessonsDataState, fetchUserData, setLessonsDataState, setUserLevel, streakData, checkAndAwardAchievements]);

    const handleStartReview = (items) => {
        setReviewItems(items);
        setPage('reviewSession');
    };

    const handleCertificateDownload = () => { 
        setCertificateToShow(null);
        handlePageChange('dashboard');
    };

    const viewCertificate = (levelId) => {
        setCertificateToShow(levelId);
    };

    const handleTestComplete = (level) => { setUserLevel(level); setPage('nameEntry'); };
    const handleNameSubmit = (name) => { setUserName(name); setPage('dashboard'); };
    const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
    const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
    const handleBackToDashboard = () => { setPage('dashboard'); };
    const handleBackToLessons = () => { setPage('lessons'); };
    const handleBackToProfile = () => { setPage('profile'); };

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
        handleUpdateReviewItem // <-- إضافة الدالة الجديدة للسياق
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
