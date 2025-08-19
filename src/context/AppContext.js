// src/context/AppContext.js

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";

// Import Data
import { initialLevels, initialLessonsData } from '../data/lessons';
import { achievementsList } from '../data/achievements';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // كل الـ State والدوال التي كانت في App.js تنتقل إلى هنا
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

    // --- كل الدوال تنتقل إلى هنا أيضاً ---

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

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
    
    // ... (بقية الدوال مثل handleCompleteLesson, handleSaveWord, etc.)
    // (للاختصار، لم أضع كل الدوال هنا، لكن يجب نقلها كلها من App.js)

    const value = {
        user, setUser, userData, setUserData, authStatus, setAuthStatus, isSyncing, setIsSyncing,
        page, setPage, handlePageChange, userLevel, setUserLevel, userName, setUserName,
        lessonsDataState, setLessonsDataState, streakData, setStreakData, isDarkMode, setIsDarkMode,
        selectedLevelId, setSelectedLevelId, currentLesson, setCurrentLesson, certificateToShow, setCertificateToShow,
        searchQuery, setSearchQuery, searchResults, setSearchResults, allLessons,
        isProfileModalOpen, setIsProfileModalOpen, isMoreMenuOpen, setIsMoreMenuOpen,
        newlyUnlockedAchievement, setNewlyUnlockedAchievement, reviewItems, setReviewItems,
        fetchUserData, handleLogout,
        //... أضف بقية الدوال هنا
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// هذا هو الـ Hook الذي سنستخدمه في المكونات الأخرى للوصول إلى البيانات
export const useAppContext = () => {
    return useContext(AppContext);
};
