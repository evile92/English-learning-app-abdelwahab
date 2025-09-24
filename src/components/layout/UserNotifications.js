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

        if (nextState) {
            const unread = notifications.filter(n => !n.read);
            for (const notif of unread) {
                const notifRef = doc(db, `users/${user.uid}/messages`, notif.id);
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
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            
            {/* الإشعارات على الهاتف - Modal بملء الشاشة */}
            <div className={`
                md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                transition-opacity duration-200
            `}>
                <div className={`
                    fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-800
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    shadow-2xl
                `}>
                    <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">الإشعارات</h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="h-full overflow-y-auto pb-20">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-4 border-b dark:border-slate-700 last:border-b-0">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-2">
                                        {notif.title}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                        {notif.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64">
                                <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-center text-slate-500 dark:text-slate-400">لا توجد إشعارات جديدة</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* الإشعارات على الكمبيوتر - Dropdown */}
            <div className={`
                hidden md:block absolute top-full mt-2 right-0
                w-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 z-50
                transition-all duration-200 ease-in-out
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
            `}>
                <div className="p-3 font-bold border-b dark:border-slate-700 text-slate-800 dark:text-white">
                    الإشعارات
                </div>
                {notifications.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notif => (
                            <div key={notif.id} className="p-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">
                                    {notif.title}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                    {notif.content}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <Bell size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">لا توجد إشعارات جديدة</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotifications;
