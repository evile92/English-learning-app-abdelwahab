// src/components/layout/UserNotifications.js

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../firebase';
import { collection, query, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { Bell } from 'lucide-react';

const UserNotifications = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!user) return;
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(newMessages);
        });

        return () => unsubscribe();
    }, [user]);

    const handleToggle = async () => {
        const nextState = !isOpen;
        setIsOpen(nextState);

        // Mark as read only when opening
        if (nextState) {
            const unread = notifications.filter(n => !n.read);
            for (const notif of unread) {
                const notifRef = doc(db, `users/${user.uid}/messages`, notif.id);
                // We don't need to await this, let it happen in the background
                updateDoc(notifRef, { read: true });
            }
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div ref={notificationRef} className="relative">
            <button
                onClick={handleToggle}
                className="relative flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {/* --- هنا تم تعديل التنسيق بشكل كامل --- */}
            <div
                className={`
                    absolute top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 z-50
                    transition-all duration-200 ease-in-out
                    md:left-0 md:right-auto  /* For Desktop: align to the left */
                    right-0 /* For Mobile: align to the right */
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
                `}
            >
                <div className="p-3 font-bold border-b dark:border-slate-700 text-slate-800 dark:text-white">
                    الإشعارات
                </div>
                {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-slate-500">لا توجد إشعارات جديدة.</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notif => (
                            <div key={notif.id} className="p-3 border-b dark:border-slate-700 last:border-b-0">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{notif.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{notif.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotifications;
