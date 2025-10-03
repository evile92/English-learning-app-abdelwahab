// src/components/admin/MassEmailSender.js

import React, { useState } from 'react';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, LoaderCircle, Send, AlertTriangle } from 'lucide-react';

const MassEmailSender = () => {
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [userCount, setUserCount] = useState(0);

    const handleSendMassEmail = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !htmlContent.trim()) {
            setStatus({ type: 'error', message: 'الرجاء ملء حقل الموضوع والمحتوى.' });
            return;
        }

        const confirmSend = window.confirm(`أنت على وشك إرسال بريد إلكتروني إلى ${userCount > 0 ? userCount : 'جميع'} مستخدمين. هل أنت متأكد؟`);
        if (!confirmSend) return;

        setIsSending(true);
        setStatus({ type: 'info', message: 'جارٍ جلب قائمة المستخدمين...' });

        try {
            // 1. جلب جميع المستخدمين
            const usersSnapshot = await getDocs(collection(db, "users"));
            const users = usersSnapshot.docs.map(doc => ({ email: doc.data().email, username: doc.data().username }));
            setUserCount(users.length);

            if (users.length === 0) {
                setStatus({ type: 'error', message: 'لم يتم العثور على أي مستخدمين.' });
                setIsSending(false);
                return;
            }

            setStatus({ type: 'info', message: `تم العثور على ${users.length} مستخدم. جارٍ تحضير الرسائل...` });

            // 2. إنشاء دفعة (Batch) لإضافة الرسائل إلى مجموعة "mail"
            const batch = writeBatch(db);
            users.forEach(user => {
                if (user.email) {
                    const personalizedHtml = htmlContent.replace(/\[اسم المستخدم\]/g, user.username || 'طالبنا العزيز');
                    const mailRef = collection(db, 'mail');
                    batch.set(doc(mailRef), {
                        to: [user.email],
                        message: {
                            subject: subject,
                            html: personalizedHtml,
                        },
                    });
                }
            });

            // 3. تنفيذ الدفعة
            await batch.commit();

            setStatus({ type: 'success', message: `تمت إضافة ${users.length} رسالة إلى قائمة الانتظار بنجاح. ستقوم الإضافة بإرسالها في الخلفية.` });
        } catch (error) {
            console.error("Error sending mass email:", error);
            setStatus({ type: 'error', message: 'حدث خطأ فادح. راجع الـ console لمزيد من التفاصيل.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Mail /> إرسال بريد إلكتروني جماعي
                </h2>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-md flex items-start gap-2 text-sm">
                        <AlertTriangle size={20} className="flex-shrink-0" />
                        <div>
                            <strong>ملاحظة هامة:</strong> هذه الميزة تعتمد على إضافة "Trigger Email" في Firebase. تأكد من تثبيتها وإعدادها بشكل صحيح. يمكنك استخدام `[اسم المستخدم]` في المحتوى ليتم استبداله باسم كل مستخدم تلقائيًا.
                        </div>
                    </div>
                    <form onSubmit={handleSendMassEmail}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                عنوان البريد (Subject)
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="مثال: 🚀 تحديثات جديدة في StellarSpeak!"
                                required
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                محتوى البريد (HTML)
                            </label>
                            <textarea
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                                placeholder="مرحباً يا [اسم المستخدم]، نود تذكيرك بـ..."
                                required
                                rows="10"
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSending}
                            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isSending ? <LoaderCircle className="animate-spin" /> : <Send size={18} />}
                            {isSending ? 'جارٍ الإرسال...' : 'إرسال للجميع'}
                        </button>
                        {status.message && (
                            <p className={`mt-4 text-sm font-semibold ${
                                status.type === 'error' ? 'text-red-500' : 
                                status.type === 'success' ? 'text-green-500' : 'text-sky-500'
                            }`}>{status.message}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MassEmailSender;
