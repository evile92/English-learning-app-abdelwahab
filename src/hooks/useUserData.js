// src/hooks/useUserData.js

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { initialLessonsData } from '../data/lessons';

export const useUserData = (user) => {
    const [userData, setUserData] = useState(null);
    const [isSyncing, setIsSyncing] = useState(true);

    const fetchUserData = useCallback(async () => {
        if (!user) {
            setUserData(null);
            setIsSyncing(false);
            return;
        }
        
        setIsSyncing(true);
        const userDocRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                console.warn("User document does not exist for UID:", user.uid);
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserData(null);
        } finally {
            setIsSyncing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    // --- ✅ بداية الإصلاح النهائي ---
    const updateUserData = useCallback(async (updates) => {
        if (!user) return;
        
        const userDocRef = doc(db, "users", user.uid);
        try {
            // الخطوة 1: تحديث البيانات في قاعدة البيانات أولاً
            await updateDoc(userDocRef, updates);
            
            // الخطوة 2: بعد نجاح التحديث، أعد جلب البيانات المحدثة من قاعدة البيانات
            // هذا يضمن أن الحالة المحلية للتطبيق متطابقة تمامًا مع قاعدة البيانات
            // ويمنع حدوث أخطاء بسبب كائنات Firestore الخاصة مثل arrayUnion
            await fetchUserData();

        } catch (error) {
            console.error("Error updating user data:", error);
            // يمكنك هنا إضافة منطق لإعلام المستخدم بفشل الحفظ إذا أردت
        }
    // ✅ تم تحديث مصفوفة الاعتماديات لتشمل fetchUserData
    }, [user, fetchUserData]);
    // --- 🛑 نهاية الإصلاح النهائي ---

    const lessonsDataState = userData?.lessonsData || initialLessonsData;
    const userLevel = userData?.level || null;
    const userName = userData?.username || '';
    const myVocabulary = userData?.myVocabulary || [];
    const errorLog = userData?.errorLog || [];
    const reviewSchedule = userData?.reviewSchedule || { lessons: {}, vocabulary: {} };

    return { 
        userData, 
        isSyncing, 
        fetchUserData,
        updateUserData,
        lessonsDataState,
        userLevel,
        userName,
        myVocabulary,
        errorLog,
        reviewSchedule
    };
};
