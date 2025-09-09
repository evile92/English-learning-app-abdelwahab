// src/hooks/useUserData.js

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { initialLessonsData } from '../data/lessons';

export const useUserData = (user) => {
    const [userData, setUserData] = useState(null);
    // --- (بداية الحذف): تم حذف isSyncing ---
    // const [isSyncing, setIsSyncing] = useState(true);
    // --- (نهاية الحذف) ---

    const fetchUserData = useCallback(async () => {
        if (!user) {
            setUserData(null);
            // --- (بداية الحذف): تم حذف isSyncing ---
            // setIsSyncing(false);
            // --- (نهاية الحذف) ---
            return;
        }
        
        const userDocRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                console.warn("User document does not exist for UID:", user.uid);
                setUserData(null); // Keep it null if not found
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserData(null); // Set to null on error
        } 
        // --- (بداية الحذف): تم حذف finally block ---
        // finally {
        //     setIsSyncing(false);
        // }
        // --- (نهاية الحذف) ---
    }, [user]);

    useEffect(() => {
        // --- (بداية التعديل): لا حاجة لإعادة ضبط isSyncing ---
        fetchUserData();
        // --- (نهاية التعديل) ---
    }, [fetchUserData]);
    
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
        // isSyncing, <-- تم الحذف
        fetchUserData,
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
