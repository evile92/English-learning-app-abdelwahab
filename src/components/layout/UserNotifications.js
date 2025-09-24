// src/components/layout/UserNotifications.js

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../firebase';
// (هنا تم التصحيح): تمت إضافة 'limit'
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
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
        }, (error) => {
            console.error("Error fetching notifications:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="p-2 font-bold border-b dark:border-slate-700">الإشعارات</div>
                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-slate-500">لا توجد إشعارات جديدة.</p>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map(notif => (
                                <div key={notif.id} className={`p-3 border-b dark:border-slate-700 last:border-b-0 ${!notif.read ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}>
                                    <p className="font-semibold text-sm">{notif.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{notif.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserNotifications;
