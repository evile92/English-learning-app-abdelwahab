// src/components/layout/UserNotifications.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // (إضافة)
import { useAppContext } from '../../context/AppContext';
import { db } from '../../firebase';
import { collection, query, onSnapshot, getDocs, writeBatch, where } from 'firebase/firestore';
import { Bell } from 'lucide-react';

const UserNotifications = () => {
    const { user } = useAppContext(); // (إزالة) handlePageChange
    const navigate = useNavigate(); // (إضافة)
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, where("read", "==", false));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setUnreadCount(querySnapshot.size);
        });
        
        return () => unsubscribe();
    }, [user]);

    const goToNotificationsPage = async () => {
        if (user && unreadCount > 0) {
            const messagesRef = collection(db, `users/${user.uid}/messages`);
            const q = query(messagesRef, where("read", "==", false));
            const querySnapshot = await getDocs(q);
            
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, { read: true });
            });
            await batch.commit();
        }
        
        // (تعديل) الانتقال باستخدام navigate
        navigate('/notifications');
    };

    return (
        <button
            onClick={goToNotificationsPage}
            className="relative flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
            title="الإشعارات"
        >
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default UserNotifications;
