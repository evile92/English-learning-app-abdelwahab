// src/context/AppContext.js

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'; // (إضافة 1): استيراد ما يلزم
import { db } from '../firebase'; // (إضافة 2): استيراد قاعدة البيانات
import { doc, onSnapshot } from 'firebase/firestore'; // (إضافة 3): استيراد دوال Firestore
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
    
    // (إضافة 4): حالة لتتبع وضع الصيانة
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    const weakPoints = useWeakPoints(auth.user, userData.errorLog, userData.updateUserDoc, ui.setPage);
    const lessons = useLessons(auth.user, userData.lessonsDataState, userData.userData, userData.setUserData, userData.updateUserDoc, ui.setPage, ui.setCertificateToShow, weakPoints.logError);
    const vocabulary = useVocabulary(auth.user, userData.userData, userData.setUserData, userData.updateUserDoc, ui.setShowRegisterPrompt);
    const review = useReview(userData.userData, userData.updateUserDoc);
    const gamification = useGamification(auth.user, userData.userData, userData.updateUserDoc);

    // (إضافة 5): useEffect للاستماع لتغيرات وضع الصيانة في قاعدة البيانات
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
        ui.setCertificateToShow(levelId);
    }, [ui]);

    // ✅ بداية الإصلاح: تعريف دالة بدء المراجعة
    const handleStartReview = useCallback((items) => {
        if (items && items.length > 0) {
            ui.setPage('reviewSession');
        } else {
            alert("لا توجد عناصر للمراجعة حاليًا.");
        }
    }, [ui]);
    // 🛑 نهاية الإصلاح

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
        
        // ✅ إضافة الدالة الجديدة هنا لتصبح متاحة للتطبيق
        handleStartReview,

        handleSaveWord: vocabulary.handleSaveWord,
        handleDeleteWord: vocabulary.handleDeleteWord,
        handleUpdateReviewItem: review.handleUpdateReviewItem,

        // (إضافة 6): إضافة متغير وضع الصيانة إلى الـ Context
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
