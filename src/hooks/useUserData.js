// src/hooks/useUserData.js

import { useState, useEffect, useCallback } from 'react';
// --- ✅ 1. استيراد onSnapshot للاستماع الفوري للتغييرات ---
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase';
import { initialLessonsData } from '../data/lessons';

export const useUserData = (user) => {
    const [userData, setUserData] = useState(null);

    // --- ✅ 2. استخدام useEffect للاستماع للتغييرات بدلاً من جلبها مرة واحدة ---
    useEffect(() => {
        if (!user) {
            setUserData(null);
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        
        // onSnapshot تستمع لأي تحديثات على المستند بشكل فوري
        // بمجرد إنشاء المستند أو تحديثه، سيتم تحديث الحالة تلقائياً
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            } else {
                console.warn("في انتظار إنشاء ملف المستخدم...", user.uid);
                setUserData(null); 
            }
        }, (error) => {
            console.error("خطأ في الاستماع لبيانات المستخدم:", error);
            setUserData(null);
        });

        // --- ✅ 3. إلغاء الاستماع عند الخروج لتجنب استهلاك الموارد ---
        return () => unsubscribe();
    }, [user]);

    const updateUserDoc = useCallback(async (updates) => {
        if (!user) return;
        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, updates);
        } catch (error) {
            console.error("Error updating user document in Firestore:", error);
        }
    }, [user]);

    const lessonsDataState = userData?.lessonsData || initialLessonsData;
    const userLevel = userData?.level || null;
    const userName = userData?.username || '';
    const myVocabulary = userData?.myVocabulary || [];
    const errorLog = userData?.errorLog || [];
    const reviewSchedule = userData?.reviewSchedule || { lessons: {}, vocabulary: {} };

    return { 
        userData, 
        updateUserDoc,
        setUserData,
        lessonsDataState,
        userLevel,
        userName,
        myVocabulary,
        errorLog,
        reviewSchedule
    };
};
