// src/hooks/useUserData.js

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { initialLessonsData } from '../data/lessons';

export const useUserData = (user) => {
    const [userData, setUserData] = useState(null);
    const [lessonsDataState, setLessonsDataState] = useState(initialLessonsData);
    const [userLevel, setUserLevel] = useState(null);
    const [userName, setUserName] = useState('');
    const [isSyncing, setIsSyncing] = useState(true);

    const fetchUserData = useCallback(async (currentUser) => {
        if (currentUser) {
            setIsSyncing(true);
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                if (data.lessonsData) setLessonsDataState(data.lessonsData);
                if (data.level) setUserLevel(data.level);
                if (data.username) setUserName(data.username);
            } else {
                setUserData(null);
                setUserLevel(null);
                setLessonsDataState(initialLessonsData);
                setUserName('');
            }
            setIsSyncing(false);
        } else {
            setUserData(null);
            setIsSyncing(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData(user);
        }
    }, [user, fetchUserData]);
    
    return { userData, lessonsDataState, userLevel, userName, isSyncing, fetchUserData };
};
