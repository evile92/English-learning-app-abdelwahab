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
    
    const weakPoints = useWeakPoints(auth.user, userData.errorLog, userData.updateUserDoc, ui.setPage);
    const lessons = useLessons(auth.user, userData.lessonsDataState, userData.userData, userData.setUserData, userData.updateUserDoc, ui.setPage, ui.setCertificateToShow, weakPoints.logError);
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

    const viewCertificate = useCallback((levelId) => {
        ui.setCertificateToShow(levelId);
    }, [ui]);

    // ✅ هذا هو الكود الكامل والصحيح الذي يحتوي على كل شيء
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
        
        userLevel: isVisitor ? ui.tempUserLevel : userData.userLevel,
        userName: isVisitor ? ui.tempUserName : userData.userName,
        lessonsDataState: isVisitor ? ui.visitorLessonsData : userData.lessonsDataState,
        
        // الدوال المخصصة
        handleCompleteLesson,
        startFinalExam: handleAttemptFinalExam,
        viewCertificate,
        
        // ✅ السطور التي تمت إعادتها
        handleSaveWord: vocabulary.handleSaveWord,
        handleDeleteWord: vocabulary.handleDeleteWord,
        handleUpdateReviewItem: review.handleUpdateReviewItem,
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
