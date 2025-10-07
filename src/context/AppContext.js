// src/context/AppContext.js

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
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
    const navigate = useNavigate();
    
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    // ✅ إصلاح 1: إزالة setPage parameter من useLessons لأنه لا يستخدمه بعد الآن
    const weakPoints = useWeakPoints(auth.user, userData.errorLog, userData.updateUserDoc);
    const lessons = useLessons(auth.user, userData.lessonsDataState, userData.userData, userData.setUserData, userData.updateUserDoc, ui.setCertificateToShow, weakPoints.logError);
    
    const vocabulary = useVocabulary(auth.user, userData.userData, userData.setUserData, userData.updateUserDoc, ui.setShowRegisterPrompt);
    const review = useReview(userData.userData, userData.updateUserDoc);
    const gamification = useGamification(auth.user, userData.userData, userData.updateUserDoc);

    // ✅ إصلاح 2: إضافة دالة startLevelAssessment المفقودة
    const startLevelAssessment = useCallback(() => {
        navigate('/level-assessment');
    }, [navigate]);

    useEffect(() => {
        const settingsRef = doc(db, 'app_config', 'settings');
        const unsubscribe = onSnapshot(settingsRef, (doc) => {
            if (doc.exists()) {
                setIsMaintenanceMode(doc.data().isMaintenanceMode);
            }
        });
        return () => unsubscribe();
    }, []);

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
        navigate(`/certificate/${levelId}`);
    }, [navigate]);

    const handleStartReview = useCallback((items) => {
        navigate('/review');
    }, [navigate]);

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
        
        handleCompleteLesson,
        startFinalExam: handleAttemptFinalExam,
        startLevelAssessment, // ✅ إصلاح 3: إضافة الدالة للـ context value
        viewCertificate,
        handleStartReview,
        handleSaveWord: vocabulary.handleSaveWord,
        handleDeleteWord: vocabulary.handleDeleteWord,
        handleUpdateReviewItem: review.handleUpdateReviewItem,
        isMaintenanceMode,
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
