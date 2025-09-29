import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { Bell, BellRing, Check, Reply, Trash2, Star, AlertTriangle, LoaderCircle } from 'lucide-react';

// ✅ --- مكون جديد: نافذة تأكيد الحذف المخصصة ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4">
                        <AlertTriangle className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">تأكيد الحذف</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        هل أنت متأكد أنك تريد حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 rounded-b-2xl overflow-hidden">
                    <button 
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-3 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="p-3 font-semibold text-red-600 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? <LoaderCircle className="animate-spin" /> : 'حذف'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// مكون الإشعار مع تعديل سلوك الحذف
const NotificationItem = ({ notification, onDeleteRequest }) => {
    const { handlePageChange } = useAppContext();
    const isRead = notification.read;

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Date(timestamp.seconds * 1000).toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    };
    
    const handleReply = () => { handlePageChange('contact'); };
    const handleDeleteClick = () => { onDeleteRequest(notification.id); };

    return (
        <div className={`p-4 border-b dark:border-slate-800 transition-all duration-300 ${isRead ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isRead ? 'bg-slate-200 dark:bg-slate-700' : 'bg-sky-100 dark:bg-sky-900'}`}>
                    {isRead ? <Check className="text-slate-500" /> : <BellRing className="text-sky-500" />}
                </div>
                <div className="flex-grow">
                    <p className={`font-bold ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{notification.title || 'رسالة جديدة'}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{notification.content}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">{formatDate(notification.createdAt)}</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-3">
                <button onClick={handleDeleteClick} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-full hover:bg-red-200 dark:hover:bg-red-900">
                    <Trash2 size={14} /> حذف
                </button>
                <button onClick={handleReply} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900">
                    <Reply size={14} /> رد
                </button>
            </div>
        </div>
    );
};

// مكون الصفحة الرئيسي مع منطق نافذة التأكيد
const NotificationsPage = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ --- حالة جديدة لنافذة التأكيد ---
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [notificationIdToDelete, setNotificationIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedNotifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(fetchedNotifications);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const markAllAsRead = async () => { /* نفس الكود السابق */ };

    // ✅ --- دالة لفتح نافذة التأكيد ---
    const handleDeleteRequest = (id) => {
        setNotificationIdToDelete(id);
        setConfirmModalOpen(true);
    };

    // ✅ --- دالة الحذف الفعلية بعد التأكيد ---
    const confirmDelete = async () => {
        if (!user || !notificationIdToDelete) return;
        
        setIsDeleting(true);

        // ✅ حل مشكلة الاختفاء والظهور: نحذف العنصر من الحالة المحلية أولاً
        setNotifications(currentNotifications => 
            currentNotifications.filter(n => n.id !== notificationIdToDelete)
        );

        const notifRef = doc(db, `users/${user.uid}/messages`, notificationIdToDelete);
        try {
            await deleteDoc(notifRef);
        } catch (error) {
            console.error("Error deleting notification: ", error);
            // في حال فشل الحذف، يمكنك إعادة تحميل الإشعارات لإظهار الرسالة مجدداً
        } finally {
            setIsDeleting(false);
            setConfirmModalOpen(false);
            setNotificationIdToDelete(null);
        }
    };

    if (loading) { return <div className="text-center p-10">جارِ تحميل الإشعارات...</div>; }

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in p-4 sm:p-0">
                <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 sm:p-6 flex justify-between items-center border-b dark:border-slate-800">
                        {/* ... كود الهيدر ... */}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="text-center p-16 text-slate-500 flex flex-col items-center">
                            {/* ... كود الحالة الفارغة ... */}
                        </div>
                    ) : (
                        <div>
                            {notifications.map(notification => (
                                <NotificationItem 
                                    key={notification.id} 
                                    notification={notification} 
                                    onDeleteRequest={handleDeleteRequest} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ --- عرض نافذة التأكيد --- */}
            <ConfirmDeleteModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default NotificationsPage;
