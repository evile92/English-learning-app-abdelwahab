// src/hooks/useUI.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { initialLessonsData } from '../data/lessons';

export const useUI = () => {
    const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
    const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- ✅ تمت الإضافة: حالات مؤقتة لتخزين بيانات المستخدم الجديد ---
    const [tempUserLevel, setTempUserLevel] = usePersistentState('stellarSpeakTempLevel', null);
    const [tempUserName, setTempUserName] = usePersistentState('stellarSpeakTempName', '');
    
    // إدارة حالة التنقل والدرس الحالي
    const [selectedLevelId, setSelectedLevelId] = usePersistentState('stellarSpeakSelectedLevelId', null);
    const [currentLesson, setCurrentLesson] = usePersistentState('stellarSpeakCurrentLesson', null);
    const [certificateToShow, setCertificateToShow] = useState(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        setIsMoreMenuOpen(false);
    }, [setPage]);

    // --- ✅ تمت الإضافة: تعريف الدوال المفقودة لمنطق التهيئة ---
    const handleTestComplete = useCallback((level) => {
        setTempUserLevel(level); // حفظ المستوى مؤقتاً
        setPage('nameEntry');     // الانتقال لصفحة الاسم
    }, [setPage, setTempUserLevel]);

    const handleNameSubmit = useCallback((name) => {
        setTempUserName(name);  // حفظ الاسم مؤقتاً
        setPage('register');    // الانتقال لصفحة التسجيل
    }, [setPage, setTempUserName]);

    const handleCertificateDownload = useCallback(() => {
        setCertificateToShow(null);
        setPage('dashboard');
    }, [setPage]);
    // --- نهاية الإضافة ---

    const searchResults = useMemo(() => {
        if (searchQuery.trim() === '') return [];
        const allLessons = Object.values(initialLessonsData).flat();
        return allLessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleSearchSelect = useCallback((lesson) => {
        setCurrentLesson(lesson);
        setPage('lessonContent');
        setSearchQuery('');
    }, [setPage, setCurrentLesson]);

    const handleLevelSelect = useCallback((levelId) => {
        setSelectedLevelId(levelId);
        setPage('lessons');
    }, [setSelectedLevelId, setPage]);

    const handleSelectLesson = useCallback((lesson) => {
        setCurrentLesson(lesson);
        setPage('lessonContent');
    }, [setCurrentLesson, setPage]);
    
    const handleBackToDashboard = useCallback(() => setPage('dashboard'), [setPage]);
    const handleBackToLessons = useCallback(() => setPage('lessons'), [setPage]);
    const handleBackToProfile = useCallback(() => setPage('profile'), [setPage]);

    return {
        page, setPage, handlePageChange,
        isDarkMode, setIsDarkMode,
        isProfileModalOpen, setIsProfileModalOpen,
        isMoreMenuOpen, setIsMoreMenuOpen,
        showRegisterPrompt, setShowRegisterPrompt,
        searchQuery, setSearchQuery, searchResults, handleSearchSelect,
        selectedLevelId, setSelectedLevelId,
        currentLesson, setCurrentLesson,
        certificateToShow, setCertificateToShow,
        handleLevelSelect, handleSelectLesson,
        handleBackToDashboard, handleBackToLessons, handleBackToProfile,
        // --- ✅ تصدير الدوال والحالات الجديدة ---
        tempUserLevel, tempUserName,
        handleTestComplete, handleNameSubmit, handleCertificateDownload
    };
};
