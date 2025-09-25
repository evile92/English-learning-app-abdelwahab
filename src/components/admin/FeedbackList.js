import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageSquare, Loader, AlertCircle, Send, Trash2, X, CheckCircle, AlertTriangle } from 'lucide-react';

// --- (إضافة 1): نافذة الرد المنبثقة (تبقى كما هي) ---
const ReplyModal = ({ feedbackItem, onClose, onReplySent }) => {
    const [reply, setReply] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendReply = async () => {
        if (!reply.trim()) return;
        setIsSending(true);
        try {
            const messagesRef = collection(db, `users/${feedbackItem.userId}/messages`);
            await addDoc(messagesRef, {
                title: 'رد على رسالتك',
                content: `بخصوص رسالتك:\n"${feedbackItem.message}"\n\nردنا:\n${reply}`,
                read: false,
                createdAt: serverTimestamp()
            });
            const feedbackRef = doc(db, 'feedback', feedbackItem.id);
            await updateDoc(feedbackRef, { status: 'replied' });
            onReplySent(feedbackItem.id, 'replied');
            alert('تم إرسال الرد بنجاح!');
            onClose();
        } catch (error) {
            console.error("Error sending reply:", error);
            alert('فشل إرسال الرد.');
        } finally {
            setIsSending(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold">الرد على {feedbackItem.username}</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className="p-6">
                    <p className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-sm"><strong>رسالة المستخدم:</strong> "{feedbackItem.message}"</p>
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="اكتب ردك هنا..." rows="5" className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600"/>
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleSendReply} disabled={isSending} className="bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-slate-400">
                            {isSending ? <Loader className="animate-spin" size={18} /> : <Send size={18} />} إرسال الرد
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- (إضافة 2): مكون جديد لنافذة تأكيد الحذف ---
const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-lg font-bold">هل أنت متأكد؟</h3>
                <p className="text-sm text-slate-500 my-2">لا يمكنك التراجع عن هذا الإجراء.</p>
                <div className="flex justify-center gap-4 mt-6">
                    <button onClick={onCancel} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">إلغاء</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-500 text-white rounded-lg">نعم، احذف</button>
                </div>
            </div>
        </div>
    );
};

const FeedbackList = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    // --- (إضافة 3): حالة جديدة لتتبع الرسالة التي سيتم حذفها ---
    const [deletingId, setDeletingId] = useState(null);

    const fetchFeedback = async () => {
        // ... (هذه الدالة تبقى كما هي)
        setLoading(true);
        try {
            const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const feedbackList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFeedback(feedbackList);
        } catch (err) {
            setError('Failed to fetch feedback. Check console for an index creation link.');
            console.error("Firebase error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    // --- (إضافة 4): تعديل دالة الحذف ---
    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteDoc(doc(db, 'feedback', deletingId));
            setFeedback(prev => prev.filter(item => item.id !== deletingId));
        } catch (err) {
            alert('فشل حذف الرسالة.');
        } finally {
            setDeletingId(null); // إغلاق نافذة التأكيد
        }
    };

    const handleReplySent = (id, newStatus) => {
        setFeedback(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    const getStatusChip = (status) => {
        // ... (هذه الدالة تبقى كما هي)
        switch (status) {
            case 'replied':
                return <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full flex items-center gap-1"><CheckCircle size={12}/> تم الرد</span>;
            case 'new':
            default:
                return <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">جديدة</span>;
        }
    };

    if (loading) { /* ... */ }
    if (error) { /* ... */ }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><MessageSquare /> User Feedback</h2>
            <div className="space-y-4">
                {feedback.length > 0 ? feedback.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start gap-4">
                           <div>
                                <p className="text-slate-800 dark:text-slate-200 mb-2">{item.message}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span><strong>From:</strong> {item.username || item.email || 'Anonymous'}</span>
                                    <span><strong>Sent:</strong> {item.createdAt?.toDate().toLocaleString() || 'N/A'}</span>
                                    {getStatusChip(item.status)}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {item.userId !== 'guest' && item.status !== 'replied' && (
                                    <button onClick={() => setReplyingTo(item)} className="p-2 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-md" title="Reply to user">
                                        <Send size={18} />
                                    </button>
                                )}
                                {/* --- (إضافة 5): تغيير سلوك زر الحذف --- */}
                                <button onClick={() => setDeletingId(item.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="Delete message">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-slate-600 dark:text-slate-400">No feedback messages yet.</p>
                )}
            </div>

            {replyingTo && (
                <ReplyModal 
                    feedbackItem={replyingTo} 
                    onClose={() => setReplyingTo(null)}
                    onReplySent={handleReplySent}
                />
            )}
            {/* --- (إضافة 6): عرض نافذة التأكيد --- */}
            {deletingId && (
                <ConfirmDeleteModal
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingId(null)}
                />
            )}
        </div>
    );
};

export default FeedbackList;

