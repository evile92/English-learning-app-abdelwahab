import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { Bell, BellRing, CheckCircle, Reply, Trash2, Star, AlertTriangle, LoaderCircle } from 'lucide-react';

// --- مكون نافذة تأكيد الحذف (Modal) ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-slate-900 border border-slate-700 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4"><AlertTriangle className="text-red-500" size={32} /></div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">تأكيد الحذف</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">هل أنت متأكد أنك تريد حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                </div>
                <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 rounded-b-2xl overflow-hidden">
                    <button onClick={onClose} disabled={isDeleting} className="p-3 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50">إلغاء</button>
                    <button onClick={onConfirm} disabled={isDeleting} className="p-3 font-semibold text-red-600 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        {isDeleting ? <LoaderCircle className="animate-spin" /> : 'حذف'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- مكون بطاقة الإشعار (Notification Card) بتصميم جديد ---
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
        <div className={`relative bg-white/5 dark:bg-slate-800/30 border-b border-slate-200/10 dark:border-slate-700/50 p-5 overflow-hidden transition-all duration-300 group ${isRead ? 'opacity-60' : ''}`}>
            {/* الشريط الجانبي للإشعارات الجديدة */}
            {!isRead && <div className="absolute top-0 right-0 h-full w-1.5 bg-gradient-to-b from-sky-400 to-indigo-500"></div>}
            
            <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isRead ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-br from-sky-400 to-cyan-500 text-white'}`}>
                    {isRead ? <CheckCircle size={20} className="text-slate-400" /> : <BellRing size={20} />}
                </div>
                <div className="flex-grow">
                    <p className={`font-bold text-slate-800 dark:text-slate-100`}>{notification.title || 'رسالة جديدة'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{notification.content}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-mono tracking-wider">{formatDate(notification.createdAt)}</p>
                </div>
            </div>
            
            {/* أزرار الرد والحذف تظهر عند مرور الماوس */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={handleDeleteClick} title="حذف" className="p-2 rounded-full text-red-500 bg-red-500/10 hover:bg-red-500/20"><Trash2 size={16} /></button>
                <button onClick={handleReply} title="رد" className="p-2 rounded-full text-sky-500 bg-sky-500/10 hover:bg-sky-500/20"><Reply size={16} /></button>
            </div>
        </div>
    );
};

// --- المكون الرئيسي للصفحة بتصميم حيوي ---
const NotificationsPage = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [notificationIdToDelete, setNotificationIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const markAllAsRead = async () => { /* ... الكود لا يتغير ... */ };
    const handleDeleteRequest = (id) => { setNotificationIdToDelete(id); setConfirmModalOpen(true); };

    const confirmDelete = async () => {
        if (!user || !notificationIdToDelete) return;
        setIsDeleting(true);
        setNotifications(current => current.filter(n => n.id !== notificationIdToDelete));
        const notifRef = doc(db, `users/${user.uid}/messages`, notificationIdToDelete);
        try { await deleteDoc(notifRef); } catch (error) { console.error("Delete failed: ", error); }
        finally { setIsDeleting(false); setConfirmModalOpen(false); setNotificationIdToDelete(null); }
    };

    if (loading) { return <div className="text-center p-10">جارِ تحميل الإشعارات...</div>; }

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in p-4 sm:p-0">
                <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 sm:p-6 flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"><Bell className="text-white" size={24} /></div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">صندوق الوارد</h1>
                        </div>
                        <button onClick={markAllAsRead} className="px-4 py-2 text-sm font-semibold text-sky-600 dark:text-sky-300 bg-sky-100/50 dark:bg-sky-500/10 rounded-full hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors">تحديد الكل كمقروء</button>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="text-center p-20 text-slate-500 flex flex-col items-center gap-4">
                            <Star size={48} className="text-yellow-400 opacity-50" />
                            <p className="font-bold text-lg">كل شيء هادئ هنا!</p>
                            <p className="text-sm max-w-xs">ستظهر الرسائل والإشعارات الجديدة في هذا الفضاء عندما تصلك.</p>
                        </div>
                    ) : (
                        <div>
                            {notifications.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} onDeleteRequest={handleDeleteRequest} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmDeleteModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} isDeleting={isDeleting} />
        </>
    );
};

export default NotificationsPage;
