// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { initialLessonsData } from '../data/lessons';
import { achievementsList } from '../data/achievements';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState('loading');
    const [isSyncing, setIsSyncing] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setAuthStatus('idle');
            setIsSyncing(false);
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
                    earnedCertificates: [],
                    lessonsData: initialLessonsData,
                    unlockedAchievements: [],
                    myVocabulary: [],
                    reviewSchedule: { lessons: {}, vocabulary: {} },
                    usageStats: {
                        writingPracticeCount: 0,
                        readStoriesCount: 0,
                        roleplaysCompleted: 0,
                        pronunciationPracticeCount: 0,
                        reviewSessionsCompleted: 0,
                        visitedTools: [],
                    }
                });
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
        }
    }, []);
    
    const handleLogout = useCallback(async () => {
        await signOut(auth);
        window.localStorage.clear();
    }, []);

    return { user, authStatus, isSyncing, handleGoogleSignIn, handleLogout };
};
