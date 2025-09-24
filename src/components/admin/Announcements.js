import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Send } from 'lucide-react';

const Announcements = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        // التحقق من أن الحقول ليست فارغة
        if (!title.trim() || !message.trim()) {
            setStatus('الرجاء ملء جميع الحقول.');
            return;
        }
        setStatus('جارٍ الإرسال...');
        try {
            // إضافة مستند جديد إلى مجموعة "announcements"
            await addDoc(collection(db, "announcements"), {
                title: title,
                message: message,
                createdAt: serverTimestamp(), // إضافة تاريخ ووقت الإرسال
            });
            setStatus('تم الإرسال بنجاح!');
            // تفريغ الحقول بعد الإرسال
            setTitle('');
            setMessage('');
            // إخفاء رسالة الحالة بعد 3 ثوانٍ
            setTimeout(() => setStatus(''), 3000); 
        } catch (error) {
            setStatus('فشل الإرسال. الرجاء المحاولة مرة أخرى.');
            console.error("Error sending announcement: ", error);
        }
    };

    return (
        <div className="animate-fade-in">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Send /> إرسال رسالة جماعية
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
    );
};

export default Announcements;

