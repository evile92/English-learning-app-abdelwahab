// src/components/admin/Announcements.js

import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Send, Trash2, LoaderCircle } from 'lucide-react';

const Announcements = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        setLoading(true);
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(list);
        setLoading(false);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            setStatus('الرجاء ملء جميع الحقول.');
            return;
        }
        setStatus('جارٍ الإرسال...');
        try {
            await addDoc(collection(db, "announcements"), {
                title: title,
                message: message,
                createdAt: serverTimestamp(),
            });
            setStatus('تم الإرسال بنجاح!');
            setTitle('');
            setMessage('');
            setTimeout(() => setStatus(''), 3000);
            fetchAnnouncements(); // إعادة تحميل القائمة بعد الإرسال
        } catch (error) {
            setStatus('فشل الإرسال. الرجاء المحاولة مرة أخرى.');
            console.error("Error sending announcement: ", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.')) {
            try {
                await deleteDoc(doc(db, "announcements", id));
                setAnnouncements(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                alert('فشل حذف الرسالة.');
                console.error("Error deleting announcement:", error);
            }
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Send /> إرسال رسالة جماعية جديدة
                </h2>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendAnnouncement}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                عنوان الرسالة
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="مثال: تحديث جديد قادم!"
                                required
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                محتوى الرسالة
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="اكتب رسالتك لجميع المستخدمين هنا..."
                                required
                                rows="4"
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'جارٍ الإرسال...'}
                            className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-sky-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <Send size={18} /> إرسال
                        </button>
                        {status && <p className="mt-4 text-sm font-semibold">{status}</p>}
                    </form>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">الرسائل المرسلة</h2>
                {loading ? (
                    <div className="flex justify-center p-8"><LoaderCircle className="animate-spin" /></div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{item.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{item.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">{item.createdAt?.toDate().toLocaleString() || '...'}</p>
                                </div>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
