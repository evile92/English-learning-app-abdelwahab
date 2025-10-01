// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore"; // تم إضافة onSnapshot
import { initialLessonsData } from '../data/lessons';
// 🆕 إضافة جديدة - استيراد Error Handler
import { errorHandler, logError } from '../utils/errorHandler';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState('loading');
    // 🆕 إضافة جديدة - متغير لحفظ الأخطاء
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthStatus('idle');
            // 🆕 إضافة جديدة - مسح الأخطاء عند النجاح
            setError(null);
            
            // --- ✅ بداية التعديل ---
            if (!currentUser) {
                // مسح كل المعلومات عند تسجيل الخروج
                localStorage.removeItem('currentUserId');
                localStorage.removeItem('currentUserEmail');
                localStorage.removeItem('currentUserName');
                localStorage.removeItem('currentUserLevel');
            }
            // --- 🛑 نهاية التعديل ---
        });
        return () => unsubscribeAuth();
    }, []);

    // ✨ إضافة جديدة: useEffect لمراقبة بيانات المستخدم وتحديث localStorage
    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    // تحديث localStorage بالبيانات الجديدة من قاعدة البيانات
                    localStorage.setItem('currentUserId', user.uid);
                    localStorage.setItem('currentUserEmail', userData.email || '');
                    localStorage.setItem('currentUserName', userData.username || '');
                    localStorage.setItem('currentUserLevel', userData.level || '');
                }
            });
            return () => unsubscribeFirestore();
        }
    }, [user]);


    const handleGoogleSignIn = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        // 🆕 إضافة جديدة - مسح الأخطاء قبل البدء
        setError(null);
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                const tempLevel = JSON.parse(localStorage.getItem('stellarSpeakTempLevel')) || 'A1';
                const visitorLessons = JSON.parse(localStorage.getItem('stellarSpeakVisitorLessons')) || initialLessonsData;
                
                await setDoc(userDocRef, {
                    username: user.displayName,
                    email: user.email,
                    createdAt: serverTimestamp(),
                    points: 0,
                    level: tempLevel,
                    dailyGoal: 10,
                    earnedCertificates: [],
                    lessonsData: visitorLessons, 
                    unlockedAchievements: [],
                    myVocabulary: [],
                    reviewSchedule: { lessons: {}, vocabulary: {} },
                    errorLog: [],
                    streakData: { count: 1, lastVisit: new Date().toDateString() },
                    lastTrainingDate: null,
                    avatarId: 'avatar1'
                });
                
                localStorage.removeItem('stellarSpeakTempLevel');
                localStorage.removeItem('stellarSpeakTempName');
                localStorage.removeItem('stellarSpeakVisitorLessons');
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            
            // 🆕 التعديل الجديد - معالجة متقدمة للأخطاء
            let handledError;
            if (error.code && error.code.startsWith('auth/')) {
                handledError = errorHandler.firebase(error);
            } else {
                handledError = await logError(error, 'Google Sign-in');
            }
            
            // 🆕 إضافة جديدة - حفظ الخطأ في المتغير
            setError(handledError);
            
            // 🆕 تحسين الرسالة للمستخدم
            alert(handledError.message || "فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            window.localStorage.clear();
            window.location.href = '/';
        } catch (error) {
            console.error("Error signing out: ", error);
            
            // 🆕 إضافة جديدة - معالجة أخطاء تسجيل الخروج
            const handledError = await logError(error, 'Logout');
            setError(handledError);
            
            // حتى لو فشل الخروج، قم بالتنظيف المحلي
            setUser(null);
            setAuthStatus('idle');
        }
    }, []);

    // 🆕 إضافة جديدة - دالة لمسح الأخطاء
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { 
        user, 
        authStatus, 
        handleGoogleSignIn, 
        handleLogout,
        // 🆕 إضافة جديدة - إرجاع الأخطاء ودالة المسح
        error,
        clearError
    };
};
