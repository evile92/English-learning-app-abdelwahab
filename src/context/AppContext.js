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
    const weakPoints = useWeakPoints(auth.user, userData.errorLog, userData.updateUserData, ui.setPage);
    const lessons = useLessons(auth.user, userData.lessonsDataState, userData.updateUserData, ui.setPage, ui.setCertificateToShow, weakPoints.logError);
    const vocabulary = useVocabulary(auth.user, userData.updateUserData, ui.setShowRegisterPrompt);
    const review = useReview(userData.userData, userData.updateUserData);
    const gamification = useGamification(auth.user, userData.userData, userData.updateUserData);

    // --- ✅ منطق جديد لتحديد ما إذا كان المستخدم الحالي هو زائر ---
    const isVisitor = !auth.user && !!ui.tempUserLevel;

    // --- ✅ دالة إكمال الدرس، تتصرف بشكل مختلف للزائر والمستخدم ---
    const handleCompleteLesson = isVisitor
        ? ui.handleCompleteLessonForVisitor
        : lessons.handleCompleteLesson;
        
    // --- ✅ دالة لمحاولة بدء الاختبار النهائي ---
    const handleAttemptFinalExam = useCallback((levelId) => {
        if (auth.user) {
            lessons.startFinalExam(levelId);
        } else {
            // إذا كان زائراً، اطلب منه التسجيل
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
        
        // --- ✅ توفير البيانات الصحيحة بناءً على حالة المستخدم (زائر أم مسجل) ---
        userLevel: isVisitor ? ui.tempUserLevel : userData.userLevel,
        userName: isVisitor ? ui.tempUserName : userData.userName,
        lessonsDataState: isVisitor ? ui.visitorLessonsData : userData.lessonsDataState,
        
        // --- ✅ توفير الدوال المحدثة ---
        handleCompleteLesson,
        startFinalExam: handleAttemptFinalExam, // استبدال الدالة الأصلية بالدالة الجديدة
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
