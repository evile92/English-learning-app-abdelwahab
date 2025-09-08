// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { initialLessonsData } from '../data/lessons';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState('loading');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthStatus('idle');
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    username: user.displayName,
                    email: user.email,
                    createdAt: serverTimestamp(),
                    points: 0,
                    level: 'A1',
                    dailyGoal: 10,
                    earnedCertificates: [],
                    lessonsData: initialLessonsData,
                    unlockedAchievements: [],
                    myVocabulary: [],
                    reviewSchedule: { lessons: {}, vocabulary: {} },
                    errorLog: [],
                    streakData: { count: 1, lastVisit: new Date().toDateString() },
                    lastTrainingDate: null
                });
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            // مسح LocalStorage وإعادة تحميل الصفحة لضمان إعادة تعيين كاملة
            window.localStorage.clear();
            window.location.href = '/'; // العودة للصفحة الرئيسية
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }, []);

    return { user, authStatus, handleGoogleSignIn, handleLogout };
};
