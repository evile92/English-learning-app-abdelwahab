// src/context/AppContext.js

import React, { createContext, useContext, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useUserData } from '../hooks/useUserData';
import { useLessons } from '../hooks/useLessons';
import { useVocabulary } from '../hooks/useVocabulary';
import { useReview } from '../hooks/useReview';
import { useWeakPoints } from '../hooks/useWeakPoints';
import { useGamification } from '../hooks/useGamification';
import { initialLevels } from '../data/lessons';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const auth = useAuth();
    const ui = useUI();
    const userData = useUserData(auth.user);
    
    // ✨ === هنا تم الإصلاح الجذري === ✨
    // دمج حالتي التحميل في متغير واحد فقط لتجنب أي وميض
    const isLoading = auth.authStatus === 'loading' || (auth.user && userData.isSyncing);

    // نعرض شاشة تحميل فارغة إذا لم تكن البيانات جاهزة بعد
    if (isLoading) {
        // يمكنك وضع مكون شاشة تحميل مخصص هنا إذا أردت، لكن هذا يمنع أي وميض
        return null; 
    }
    
    const weakPoints = useWeakPoints(auth.user, userData.errorLog, userData.updateUserDoc, ui.setPage);
    const lessons = useLessons(auth.user, userData.lessonsDataState, userData.updateUserDoc, ui.setPage, ui.setCertificateToShow, weakPoints.logError);
    const vocabulary = useVocabulary(auth.user, userData.userData, userData.setUserData, userData.updateUserDoc, ui.setShowRegisterPrompt);
    const review = useReview(userData.userData, userData.updateUserDoc);
    const gamification = useGamification(auth.user, userData.userData, userData.updateUserDoc);

    const isVisitor = !auth.user && !!ui.tempUserLevel;

    const handleCompleteLesson = isVisitor
        ? ui.handleCompleteLessonForVisitor
        : lessons.handleCompleteLesson;
        
    const handleAttemptFinalExam = useCallback((levelId) => {
        if (auth.user) {
            lessons.startFinalExam(levelId);
        } else {
            ui.setShowRegisterPrompt(true);
        }
    }, [auth.user, lessons, ui]);


    const value = {
        ...auth,
        ...ui,
        ...userData,
        ...lessons,
        ...vocabulary,
        ...review,
        ...weakPoints,
        ...gamification,
        initialLevels,
        isLoading, // تمرير الحالة الجديدة
        
        userLevel: isVisitor ? ui.tempUserLevel : userData.userLevel,
        userName: isVisitor ? ui.tempUserName : userData.userName,
        lessonsDataState: isVisitor ? ui.visitorLessonsData : userData.lessonsDataState,
        
        handleCompleteLesson,
        startFinalExam: handleAttemptFinalExam,
        
        handleSaveWord: vocabulary.handleSaveWord,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
