import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Bell } from 'lucide-react';

const UserNotifications = () => {
    // --- 1. نحتاج فقط إلى دالة تغيير الصفحة ---
    const { user, handlePageChange } = useAppContext(); 
    const [unreadCount, setUnreadCount] = useState(0);

    // --- 2. هذا الكود يبقى كما هو لحساب عدد الإشعارات غير المقروءة ---
    useEffect(() => {
        if (!user) return;
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const count = querySnapshot.docs.filter(doc => !doc.data().read).length;
            setUnreadCount(count);
        });
        
        return () => unsubscribe();
    }, [user]);

    // --- 3. الدالة التي ستنفذ عند الضغط على الجرس ---
    const goToNotificationsPage = () => {
        // ببساطة، نطلب من التطبيق تغيير الصفحة إلى 'notifications'
        handlePageChange('notifications');
    };

    return (
        // --- 4. نربط الدالة بالزر ---
        <button
            onClick={goToNotificationsPage}
            className="relative flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
            title="الإشعارات"
        >
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default UserNotifications;
