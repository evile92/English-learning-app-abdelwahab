// src/components/NotificationsPage.js (الإصدار النهائي مع دمج العنوان والمحتوى)

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, writeBatch, deleteDoc, updateDoc } from 'firebase/firestore';
import { Bell, Check, CheckCircle, Reply, Trash2, Star, AlertTriangle, LoaderCircle, X, Maximize2, ShieldCheck, Square, CheckSquare } from 'lucide-react';

// --- مكونات الـ Modal (بدون تغيير، تعمل بشكل ممتاز) ---
const NotificationDetailModal = ({ notification, onClose }) => {
    if (!notification) return null;
    const formatDate = (timestamp) => timestamp ? new Date(timestamp.seconds * 1000).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) : '...';
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-700 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{notification.title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto prose dark:prose-invert max-w-none">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{notification.content}</p>
                </div>
                <div className="p-3 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 text-center font-mono">{formatDate(notification.createdAt)}</div>
            </div>
        </div>
    );
};
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isDeleting, messageCount }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-slate-900 border border-slate-700 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4"><AlertTriangle className="text-red-500" size={32} /></div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">تأكيد الحذف</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        {messageCount > 1 ? `هل أنت متأكد أنك تريد حذف ${messageCount} رسائل؟` : 'هل أنت متأكد أنك تريد حذف هذه الرسالة؟'} لا يمكن التراجع عن هذا الإجراء.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 rounded-b-2xl overflow-hidden">
                    <button onClick={onClose} disabled={isDeleting} className="p-3 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50">إلغاء</button>
                    <button onClick={onConfirm} disabled={isDeleting} className="p-3 font-semibold text-red-600 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">{isDeleting ? <LoaderCircle className="animate-spin" /> : 'حذف'}</button>
                </div>
            </div>
        </div>
    );
};


// --- مكون صف الإشعار (Notification Row) - مع دمج العنوان والمحتوى ---
const NotificationItemRow = ({ notification, isSelected, onSelect, onDeleteRequest, onViewRequest }) => {
    const { handlePageChange } = useAppContext();
    const isRead = notification.read;

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // إيقاف الانتشار عند النقر على الأزرار الداخلية
    const stopPropagation = (e) => e.stopPropagation();

    const handleReply = (e) => { stopPropagation(e); handlePageChange('contact'); };
    const handleDeleteClick = (e) => { stopPropagation(e); onDeleteRequest([notification.id]); };
    const handleCheckboxClick = (e) => { stopPropagation(e); onSelect(notification.id); };
    
    return (
        <div 
            onClick={() => onViewRequest(notification)} 
            className={`flex items-center gap-1 sm:gap-4 p-3 border-b border-slate-200/10 dark:border-slate-800/80 cursor-pointer transition-all duration-200 group relative ${isSelected ? 'bg-sky-500/10 dark:bg-sky-500/20' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/60'}`}
        >
            {/* Checkbox and Icon */}
            <div className="flex-shrink-0 flex items-center gap-1 sm:gap-3" onClick={stopPropagation}>
                <div onClick={handleCheckboxClick} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    {isSelected ? <CheckSquare size={20} className="text-sky-500" /> : <Square size={20} className="text-slate-400 dark:text-slate-500" />}
                </div>
                <ShieldCheck size={24} className={`hidden sm:block flex-shrink-0 ${isRead ? 'text-slate-400 dark:text-slate-600' : 'text-blue-500'}`} />
            </div>

            {/*  ====== التعديل هنا ====== */}
            {/* Sender and Combined Title/Content */}
            <div className="flex-grow flex items-center gap-4 overflow-hidden">
                {/* اسم المرسل */}
                <p className={`w-24 sm:w-32 flex-shrink-0 truncate font-semibold ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    الإدارة
                </p>
                {/* العنوان والمقتطف */}
                <p className={`flex-grow truncate ${isRead ? 'font-normal text-slate-500 dark:text-slate-400' : 'font-bold text-slate-800 dark:text-slate-200'}`}>
                    <span className="font-semibold">{notification.title}</span>
                    <span className="ml-2 font-normal text-slate-500">- {notification.content}</span>
                </p>
            </div>
            {/* ====== نهاية التعديل ====== */}

            {/* Date (for Desktop, hidden on hover) and Actions (for Mobile, always visible) */}
            <div className="flex-shrink-0 w-24 text-right">
                {/* التاريخ: يظهر على الكمبيوتر ويختفي عند التمرير */}
                <p className={`text-xs font-semibold tracking-wider hidden sm:block transition-opacity duration-200 sm:group-hover:opacity-0 ${isRead ? 'text-slate-400' : 'text-slate-700 dark:text-sky-400'}`}>
                    {formatDate(notification.createdAt)}
                </p>
                
                {/* الأزرار: تظهر دائما على الهاتف */}
                <div onClick={stopPropagation} className="flex sm:hidden items-center justify-end gap-0">
                    <button onClick={handleDeleteClick} title="حذف" className="p-2 rounded-full text-slate-500"><Trash2 size={18} /></button>
                    <button onClick={handleReply} title="رد" className="p-2 rounded-full text-slate-500"><Reply size={18} /></button>
                </div>
            </div>
            
            {/* Hover Actions (for Desktop only) */}
            <div 
                onClick={stopPropagation} 
                className="absolute right-auto left-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
                <button onClick={handleDeleteClick} title="حذف" className="p-2 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-500"><Trash2 size={18} /></button>
                <button onClick={handleReply} title="رد" className="p-2 rounded-full hover:bg-sky-500/10 text-slate-500 hover:text-sky-500"><Reply size={18} /></button>
            </div>
        </div>
    );
};


// --- المكون الرئيسي للصفحة (التصميم الجديد) ---
const NotificationsPage = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [notificationIdsToDelete, setNotificationIdsToDelete] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewingNotification, setViewingNotification] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const messagesRef = collection(db, `users/${user.uid}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const handleSelect = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.size === notifications.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(notifications.map(n => n.id)));
        }
    };
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const markAllAsRead = async () => {
        if (!user || unreadCount === 0) return;
        const batch = writeBatch(db);
        notifications.forEach(notification => {
            if (!notification.read) {
                const notifRef = doc(db, `users/${user.uid}/messages`, notification.id);
                batch.update(notifRef, { read: true });
            }
        });
        await batch.commit();
    };
    
    const markSelectedAsRead = async () => {
        if (!user || selectedIds.size === 0) return;
        const batch = writeBatch(db);
        selectedIds.forEach(id => {
            const notifRef = doc(db, `users/${user.uid}/messages`, id);
            batch.update(notifRef, { read: true });
        });
        await batch.commit();
        setSelectedIds(new Set());
    };

    const handleDeleteRequest = (ids) => {
        setNotificationIdsToDelete(ids);
        setConfirmModalOpen(true);
    };

    const handleViewRequest = async (notification) => {
        setViewingNotification(notification);
        if (!notification.read) {
            const notifRef = doc(db, `users/${user.uid}/messages`, notification.id);
            try {
                await updateDoc(notifRef, { read: true });
            } catch (error) { console.error("Error marking as read: ", error); }
        }
    };

    const confirmDelete = async () => {
        if (!user || notificationIdsToDelete.length === 0) return;
        setIsDeleting(true);
        const batch = writeBatch(db);
        notificationIdsToDelete.forEach(id => {
            const notifRef = doc(db, `users/${user.uid}/messages`, id);
            batch.delete(notifRef);
        });
        try {
            await batch.commit();
        } catch (error) {
            console.error("Delete failed: ", error);
        } finally {
            setIsDeleting(false);
            setConfirmModalOpen(false);
            setNotificationIdsToDelete([]);
            setSelectedIds(new Set());
        }
    };

    const isAllSelected = notifications.length > 0 && selectedIds.size === notifications.length;

    if (loading) { return <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-sky-500" size={32} /></div>; }

    return (
        <>
            <div className="max-w-7xl mx-auto animate-fade-in">
                <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-lg sm:rounded-2xl shadow-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-2 sm:p-3 flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button onClick={handleSelectAll} title={isAllSelected ? "إلغاء تحديد الكل" : "تحديد الكل"} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                                {isAllSelected ? <CheckSquare className="text-sky-500" size={20} /> : <Square size={20} />}
                            </button>
                            {selectedIds.size > 0 && (
                                <button onClick={() => handleDeleteRequest(Array.from(selectedIds))} title="حذف المحدد" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={markAllAsRead} 
                            disabled={unreadCount === 0}
                            className="px-3 py-2 text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-300 bg-sky-100/50 dark:bg-sky-500/10 rounded-full hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            تحديد الكل كمقروء ({unreadCount})
                        </button>
                    </div>

                    {/* Notifications List */}
                    {notifications.length === 0 ? (
                        <div className="text-center p-12 sm:p-20 text-slate-500 flex flex-col items-center gap-4">
                            <Star size={48} className="text-yellow-400 opacity-50" />
                            <p className="font-bold text-lg">كل شيء هادئ هنا!</p>
                            <p className="text-sm max-w-xs">ستظهر الرسائل والإشعارات الجديدة في هذا الفضاء عندما تصلك.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                            {notifications.map(notification => (
                                <NotificationItemRow 
                                    key={notification.id} 
                                    notification={notification} 
                                    isSelected={selectedIds.has(notification.id)}
                                    onSelect={handleSelect}
                                    onDeleteRequest={handleDeleteRequest}
                                    onViewRequest={handleViewRequest}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <NotificationDetailModal 
                notification={viewingNotification} 
                onClose={() => setViewingNotification(null)} 
            />
            <ConfirmDeleteModal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setConfirmModalOpen(false)} 
                onConfirm={confirmDelete} 
                isDeleting={isDeleting}
                messageCount={notificationIdsToDelete.length}
            />
        </>
    );
};

export default NotificationsPage;
