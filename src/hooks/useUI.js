// src/hooks/useUI.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { initialLessonsData } from '../data/lessons';

export const useUI = () => {
    // --- ✅ التعديل الأول: قراءة الرابط عند تحميل الصفحة لأول مرة ---
    const [page, setPage] = usePersistentState('stellarSpeakPage', () => {
        const params = new URLSearchParams(window.location.search);
        const pageFromUrl = params.get('page');
        return pageFromUrl || 'welcome';
    });
    const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- ✅ تمت الإضافة: حالات لتخزين بيانات الزائر في المتصفح ---
    const [tempUserLevel, setTempUserLevel] = usePersistentState('stellarSpeakTempLevel', null);
    const [tempUserName, setTempUserName] = usePersistentState('stellarSpeakTempName', '');
    const [visitorLessonsData, setVisitorLessonsData] = usePersistentState('stellarSpeakVisitorLessons', null);

    const [selectedLevelId, setSelectedLevelId] = usePersistentState('stellarSpeakSelectedLevelId', null);
    const [currentLesson, setCurrentLesson] = usePersistentState('stellarSpeakCurrentLesson', null);
    const [certificateToShow, setCertificateToShow] = useState(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    // --- ✅ التعديل الثاني: تحديث الرابط عند تغيير الصفحة ---
    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        const url = new URL(window.location);
        if (newPage === 'dashboard') {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', newPage);
        }
        window.history.pushState({}, '', url);
        setIsMoreMenuOpen(false);
    }, [setPage]);
    
    // --- ✅ تم التعديل: منطق التهيئة للزائر ---
    const handleTestComplete = useCallback((level) => {
        setTempUserLevel(level);
        setVisitorLessonsData(initialLessonsData); // إعطاء الزائر نسخة جديدة من الدروس
        setPage('nameEntry');
    }, [setPage, setTempUserLevel, setVisitorLessonsData]);

    const handleNameSubmit = useCallback((name) => {
        setTempUserName(name);
        setSelectedLevelId(tempUserLevel); // تحديد مستوى الزائر ليبدأ مباشرة
        handlePageChange('dashboard'); // ✅ الانتقال مباشرة إلى لوحة التحكم وتحديث الرابط
    }, [handlePageChange, setTempUserName, tempUserLevel, setSelectedLevelId]);

    // --- ✅ تمت الإضافة: دالة لإكمال الدروس للزائر ---
    const handleCompleteLessonForVisitor = useCallback((lessonId, score, total) => {
        const levelId = lessonId.substring(0, 2);
        const stars = Math.max(1, Math.round((score / total) * 3));
        
        setVisitorLessonsData(prevData => {
            const updatedData = JSON.parse(JSON.stringify(prevData));
            updatedData[levelId] = updatedData[levelId].map(lesson =>
                lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
            );
            return updatedData;
        });
        
        handlePageChange('lessons'); // العودة لقائمة الدروس وتحديث الرابط
    }, [setVisitorLessonsData, handlePageChange]);
    
    // --- ✅ تمت الإضافة: دالة لتنظيف بيانات الزائر بعد التسجيل ---
    const clearVisitorData = useCallback(() => {
        setTempUserLevel(null);
        setTempUserName('');
        setVisitorLessonsData(null);
        localStorage.removeItem('stellarSpeakTempLevel');
        localStorage.removeItem('stellarSpeakTempName');
        localStorage.removeItem('stellarSpeakVisitorLessons');
    }, [setTempUserLevel, setTempUserName, setVisitorLessonsData]);

    const handleCertificateDownload = useCallback(() => {
        setCertificateToShow(null);
        handlePageChange('dashboard');
    }, [handlePageChange]);

    const searchResults = useMemo(() => {
        if (searchQuery.trim() === '') return [];
        const allLessons = Object.values(initialLessonsData).flat();
        return allLessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleSearchSelect = useCallback((lesson) => {
        setCurrentLesson(lesson);
        handlePageChange('lessonContent');
        setSearchQuery('');
    }, [handlePageChange, setCurrentLesson]);

    const handleLevelSelect = useCallback((levelId) => {
        setSelectedLevelId(levelId);
        handlePageChange('lessons');
    }, [setSelectedLevelId, handlePageChange]);

    const handleSelectLesson = useCallback((lesson) => {
        setCurrentLesson(lesson);
        handlePageChange('lessonContent');
    }, [setCurrentLesson, handlePageChange]);
    
    const handleBackToDashboard = useCallback(() => handlePageChange('dashboard'), [handlePageChange]);
    const handleBackToLessons = useCallback(() => handlePageChange('lessons'), [handlePageChange]);
    const handleBackToProfile = useCallback(() => handlePageChange('profile'), [handlePageChange]);

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
        handleCertificateDownload,
        // --- ✅ تصدير كل ما يخص الزائر ---
        tempUserLevel, tempUserName, visitorLessonsData,
        handleTestComplete, handleNameSubmit, 
        handleCompleteLessonForVisitor, clearVisitorData
    };
};
