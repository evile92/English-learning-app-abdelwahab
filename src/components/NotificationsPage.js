import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, writeBatch } from 'firebase/firestore';
import { Bell, Mail, CheckCheck } from 'lucide-react';

// مكون صغير لعرض كل إشعار على حدة
const NotificationItem = ({ notification }) => {
    const { handlePageChange } = useAppContext();
    const isRead = notification.read;

    // دالة لتنسيق التاريخ
    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Date(timestamp.seconds * 1000).toLocaleString('ar-EG');
    };

    const handleClick = () => {
        // مستقبلاً، يمكن أن ينقلك هذا إلى صفحة المحادثة مباشرة
        // حالياً، سنبقيها بسيطة
        console.log("Notification clicked:", notification.id);
    };

    return (
        <div 
            onClick={handleClick}
            className={`flex items-start gap-4 p-4 border-b dark:border-slate-700 transition-colors ${isRead ? 'bg-transparent' : 'bg-sky-50 dark:bg-sky-900/20'}`}
        >
            <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isRead ? 'bg-slate-200 dark:bg-slate-700' : 'bg-sky-100 dark:bg-sky-800'}`}>
                <Mail className={`${isRead ? 'text-slate-500' : 'text-sky-500'}`} />
            </div>
            <div className="flex-grow">
                <p className={`font-bold ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {notification.title || 'رسالة جديدة'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {notification.content}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {formatDate(notification.createdAt)}
                </p>
            </div>
        </div>
    );
};

// مكون الصفحة الرئيسي
const NotificationsPage = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedNotifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(fetchedNotifications);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notifications: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return;

        const batch = writeBatch(db);
        notifications.forEach(notification => {
            if (!notification.read) {
                const notifRef = doc(db, `users/${user.uid}/messages`, notification.id);
                batch.update(notifRef, { read: true });
            }
        });
        await batch.commit();
    };

    if (loading) {
        return <div className="text-center p-10">جارِ تحميل الإشعارات...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 flex justify-between items-center border-b dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <Bell className="text-sky-500" size={28} />
                        <h1 className="text-2xl font-bold">الإشعارات</h1>
                    </div>
                    <button 
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:opacity-80 transition-opacity"
                    >
                        <CheckCheck size={18} />
                        <span>تحديد الكل كمقروء</span>
                    </button>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center p-16 text-slate-500">
                        <p>صندوق الوارد فارغ.</p>
                        <p className="text-sm">ستظهر الرسائل الجديدة من الإدارة هنا.</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
