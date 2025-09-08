// src/context/AppContext.js

import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { useUserData } from '../hooks/useUserData';
import { useLessons } from '../hooks/useLessons';
import { useVocabulary } from '../hooks/useVocabulary';
import { useReview } from '../hooks/useReview';
import { useWeakPoints } from '../hooks/useWeakPoints';
import { useGamification } from '../hooks/useGamification';
import { initialLevels } from '../data/lessons'; // استيراد البيانات الثابتة

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // 1. استدعاء الخطافات الأساسية
    const auth = useAuth();
    const ui = useUI();
    const userData = useUserData(auth.user);

    // 2. استدعاء الخطافات التي تعتمد على الخطافات الأساسية
    const weakPoints = useWeakPoints(auth.user, userData.errorLog, userData.updateUserData, ui.setPage);
    const lessons = useLessons(auth.user, userData.lessonsDataState, userData.updateUserData, ui.setPage, ui.setCertificateToShow, weakPoints.logError);
    const vocabulary = useVocabulary(auth.user, userData.updateUserData, ui.setShowRegisterPrompt);
    const review = useReview(userData.userData, userData.updateUserData);
    const gamification = useGamification(auth.user, userData.userData, userData.updateUserData);

    // 3. تجميع كل القيم في كائن واحد لتمريره للمزود
    const value = {
        ...auth,
        ...ui,
        ...userData,
        ...lessons,
        ...vocabulary,
        ...review,
        ...weakPoints,
        ...gamification,
        initialLevels // إضافة البيانات الثابتة مباشرة
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
