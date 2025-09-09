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
                // --- ✅ قراءة كل بيانات الزائر المؤقتة من التخزين المحلي ---
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
                    lessonsData: visitorLessons, // --- ✅ استخدام بيانات دروس الزائر
                    unlockedAchievements: [],
                    myVocabulary: [],
                    reviewSchedule: { lessons: {}, vocabulary: {} },
                    errorLog: [],
                    streakData: { count: 1, lastVisit: new Date().toDateString() },
                    lastTrainingDate: null
                });
                
                // --- ✅ تنظيف التخزين المحلي بعد نقل البيانات ---
                localStorage.removeItem('stellarSpeakTempLevel');
                localStorage.removeItem('stellarSpeakTempName');
                localStorage.removeItem('stellarSpeakVisitorLessons');
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            window.localStorage.clear();
            window.location.href = '/';
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }, []);

    return { user, authStatus, handleGoogleSignIn, handleLogout };
};
