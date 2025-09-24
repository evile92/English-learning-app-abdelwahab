// src/components/layout/UserNotifications.js

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Bell } from 'lucide-react';

const UserNotifications = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(5));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(newMessages);
        });

        return () => unsubscribe();
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-slate-500">No new notifications.</p>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className="p-3 border-b dark:border-slate-700">
                                <p className="font-bold">{notif.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{notif.content}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserNotifications;
