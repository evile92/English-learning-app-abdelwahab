// src/components/NotificationsPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { Check, Reply, Trash2, Star, AlertTriangle, LoaderCircle, X, ShieldCheck, Square, CheckSquare } from 'lucide-react';

// Modal للتفاصيل
const NotificationDetailModal = ({ notification, onClose }) => {
    if (!notification) return null;
    const formatDate = (timestamp) => timestamp ? new Date(timestamp.seconds * 1000).toLocaleString('ar', { dateStyle: 'full', timeStyle: 'short' }) : '...';
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{notification.title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p className="text-slate-700 dark:text-slate-300" style={{ whiteSpace: 'pre-wrap' }}>{notification.content}</p>
                </div>
                <div className="p-3 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 text-center">{formatDate(notification.createdAt)}</div>
            </div>
        </div>
    );
};

// Modal تأكيد الحذف
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isDeleting, messageCount }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm">
                <div className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">تأكيد الحذف</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {messageCount > 1 ? `حذف ${messageCount} رسائل؟` : 'حذف هذه الرسالة؟'}
                    </p>
                </div>
                <div className="flex border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} disabled={isDeleting} className="flex-1 p-3 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">إلغاء</button>
                    <button onClick={onConfirm} disabled={isDeleting} className="flex-1 p-3 font-medium text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2">
                        {isDeleting ? <LoaderCircle className="animate-spin" size={16} /> : 'حذف'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// صندوق الرسالة المُحسن
const NotificationBox = ({ notification, isSelected, onSelect, onDelete, onView }) => {
    const navigate = useNavigate();
    const isRead = notification.read;

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('ar', { hour: 'numeric', minute: '2-digit' });
        }
        return date.toLocaleDateString('ar', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-all group ${isSelected ? 'bg-sky-50 dark:bg-sky-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'} ${!isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`} onClick={() => onView(notification)}>
            
            {/* الهيدر */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); onSelect(notification.id); }} className="p-1">
                        {isSelected ? <CheckSquare size={18} className="text-sky-500" /> : <Square size={18} className="text-slate-400" />}
                    </button>
                    <ShieldCheck size={20} className={isRead ? 'text-slate-400' : 'text-blue-500'} />
                    <span className={`font-medium ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        رسالة من الإدارة
                    </span>
                </div>
                <span className={`text-xs ${isRead ? 'text-slate-400' : 'text-sky-600'}`}>{formatDate(notification.createdAt)}</span>
            </div>

            {/* المحتوى */}
            <div className="mr-7">
                <h4 className={`font-semibold mb-1 ${isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                    {notification.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {notification.content}
                </p>
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-1 mt-3 mr-7 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); navigate('/contact'); }} className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-600" title="رد">
                    <Reply size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete([notification.id]); }} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600" title="حذف">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

// المكون الرئيسي
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
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = () => {
        setSelectedIds(selectedIds.size === notifications.length ? new Set() : new Set(notifications.map(n => n.id)));
    };
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const markAllAsRead = async () => {
        if (!user || unreadCount === 0) return;
        const batch = writeBatch(db);
        notifications.forEach(notification => {
            if (!notification.read) {
                batch.update(doc(db, `users/${user.uid}/messages`, notification.id), { read: true });
            }
        });
        await batch.commit();
    };

    const handleDeleteRequest = (ids) => {
        setNotificationIdsToDelete(ids);
        setConfirmModalOpen(true);
    };

    const handleViewRequest = async (notification) => {
        setViewingNotification(notification);
        if (!notification.read) {
            try {
                await updateDoc(doc(db, `users/${user.uid}/messages`, notification.id), { read: true });
            } catch (error) { console.error("Error marking as read: ", error); }
        }
    };

    const confirmDelete = async () => {
        if (!user || notificationIdsToDelete.length === 0) return;
        setIsDeleting(true);
        const batch = writeBatch(db);
        notificationIdsToDelete.forEach(id => batch.delete(doc(db, `users/${user.uid}/messages`, id)));
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

    if (loading) { 
        return <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-sky-500" size={32} /></div>; 
    }

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
                    
                    {/* شريط الأدوات */}
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <button onClick={handleSelectAll} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                                {selectedIds.size === notifications.length && notifications.length > 0 ? 
                                    <CheckSquare className="text-sky-500" size={20} /> : <Square size={20} className="text-slate-400" />}
                            </button>
                            {selectedIds.size > 0 && (
                                <button onClick={() => handleDeleteRequest(Array.from(selectedIds))} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={markAllAsRead} 
                            disabled={unreadCount === 0}
                            className="px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/50 disabled:opacity-50"
                        >
                            تحديد الكل كمقروء ({unreadCount})
                        </button>
                    </div>

                    {/* قائمة الرسائل */}
                    {notifications.length === 0 ? (
                        <div className="text-center p-16 text-slate-500">
                            <Star size={48} className="mx-auto text-yellow-400 opacity-50 mb-4" />
                            <p className="font-medium mb-2">لا توجد رسائل</p>
                            <p className="text-sm">ستظهر الرسائل الجديدة هنا</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {notifications.map(notification => (
                                <NotificationBox 
                                    key={notification.id} 
                                    notification={notification} 
                                    isSelected={selectedIds.has(notification.id)}
                                    onSelect={handleSelect}
                                    onDelete={handleDeleteRequest}
                                    onView={handleViewRequest}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* المودالز */}
            <NotificationDetailModal notification={viewingNotification} onClose={() => setViewingNotification(null)} />
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
