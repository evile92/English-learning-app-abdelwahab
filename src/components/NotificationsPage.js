import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { Bell, BellRing, Check, Reply, Trash2, Star } from 'lucide-react';

// مكون صغير ومحسن لعرض كل إشعار
const NotificationItem = ({ notification, onDelete }) => {
    const { handlePageChange } = useAppContext();
    const isRead = notification.read;

    // دالة لتنسيق التاريخ مع استخدام الأرقام الإنجليزية
    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        // استخدام 'en-US' يضمن ظهور الأرقام والصباح/المساء بالإنجليزية
        return new Date(timestamp.seconds * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    
    // دالة للانتقال لصفحة "اتصل بنا"
    const handleReply = () => {
        handlePageChange('contact');
    };

    // دالة الحذف مع رسالة تأكيد
    const handleDelete = () => {
        if (window.confirm('هل أنت متأكد أنك تريد حذف هذه الرسالة نهائياً؟')) {
            onDelete(notification.id);
        }
    };

    return (
        // إضافة تأثيرات حركة وتغيير في المؤشر
        <div className={`p-4 border-b dark:border-slate-800 transition-all duration-300 ${isRead ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-4">
                {/* أيقونة ديناميكية وملونة */}
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isRead ? 'bg-slate-200 dark:bg-slate-700' : 'bg-sky-100 dark:bg-sky-900'}`}>
                    {isRead ? <Check className="text-slate-500" /> : <BellRing className="text-sky-500" />}
                </div>
                <div className="flex-grow">
                    <p className={`font-bold ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {notification.title || 'رسالة جديدة'}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                        {notification.content}
                    </p>
                    {/* تحسين شكل عرض التاريخ */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                        {formatDate(notification.createdAt)}
                    </p>
                </div>
            </div>
            {/* قسم الأزرار الجديد */}
            <div className="flex items-center justify-end gap-2 mt-3">
                <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-full hover:bg-red-200 dark:hover:bg-red-900">
                    <Trash2 size={14} />
                    حذف
                </button>
                <button onClick={handleReply} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900">
                    <Reply size={14} />
                    رد
                </button>
            </div>
        </div>
    );
};

// مكون الصفحة الرئيسي بتصميم محدث
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
    
    // دالة لحذف إشعار معين من قاعدة البيانات
    const deleteNotification = async (id) => {
        if (!user) return;
        const notifRef = doc(db, `users/${user.uid}/messages`, id);
        try {
            await deleteDoc(notifRef);
            // سيقوم onSnapshot بتحديث الواجهة تلقائياً
        } catch (error) {
            console.error("Error deleting notification: ", error);
        }
    };

    if (loading) {
        return <div className="text-center p-10">جارِ تحميل الإشعارات...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in p-4 sm:p-0">
             {/* استخدام تصميم البطاقة الزجاجية "Glassmorphism" */}
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 sm:p-6 flex justify-between items-center border-b dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                           <Bell className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">صندوق الوارد</h1>
                    </div>
                    <button 
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-white transition-colors"
                    >
                        <span>تحديد الكل كمقروء</span>
                    </button>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center p-16 text-slate-500 flex flex-col items-center">
                        <Star size={48} className="text-yellow-400 mb-4" />
                        <p className="font-bold text-lg">كل شيء هادئ!</p>
                        <p className="text-sm">لا توجد إشعارات جديدة في الوقت الحالي.</p>
                    </div>
                ) : (
                    // تقسيم الإشعارات إلى جديدة وقديمة
                    <div>
                        {notifications.filter(n => !n.read).length > 0 && 
                         notifications.filter(n => !n.read).map(notification => (
                            <NotificationItem key={notification.id} notification={notification} onDelete={deleteNotification} />
                        ))}
                        
                        {notifications.filter(n => n.read).length > 0 && (
                            <>
                                <h2 className="p-2 px-4 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/50">الإشعارات السابقة</h2>
                                {notifications.filter(n => n.read).map(notification => (
                                    <NotificationItem key={notification.id} notification={notification} onDelete={deleteNotification} />
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
