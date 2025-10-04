// src/components/admin/MassEmailSender.js

import React, { useState, useRef } from 'react';
import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, LoaderCircle, Send, AlertTriangle } from 'lucide-react';

const BATCH_LIMIT = 500;

const MassEmailSender = () => {
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [recentBatches, setRecentBatches] = useState([]);
    const isProcessingRef = useRef(false);
    const lastSubmissionRef = useRef('');

    // جلب كل المستخدمين (يمكنك التحسين لأخذ المستخدمين النشطين فقط إذا أردت)
    const fetchAllUsers = async () => {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        return usersSnapshot.docs
            .map(doc => ({
                email: doc.data().email,
                username: doc.data().username,
                id: doc.id
            }))
            .filter(u => !!u.email); // استبعاد من ليس لديه بريد
    };

    // تقطيع مصفوفة المستخدمين إلى دفعات
    const chunkArray = (arr, size) => {
        const res = [];
        for (let i = 0; i < arr.length; i += size) {
            res.push(arr.slice(i, i + size));
        }
        return res;
    };

    // منطق الإرسال
    const handleSendMassEmail = async (e) => {
        e.preventDefault();

        const trimmedSubject = subject.trim();
        const trimmedContent = htmlContent.trim();

        // التحقق من الحقول
        if (!trimmedSubject || !trimmedContent) {
            setStatus({ type: 'error', message: 'الرجاء ملء حقل الموضوع والمحتوى.' });
            return;
        }

        // فحص رسائل الإرسال المكررة بناءً على المحتوى والعنوان
        const submissionHash = btoa(trimmedSubject + '_' + trimmedContent);
        if (lastSubmissionRef.current === submissionHash) {
            setStatus({ type: 'error', message: 'تم إرسال هذه الرسالة مسبقاً أو قيد الإرسال.' });
            return;
        }

        // حماية من تنفيذ متعدد (navigations/strict mode/re-render)
        if (isProcessingRef.current) {
            setStatus({ type: 'info', message: 'تم بدء عملية الإرسال بالفعل، الرجاء الانتظار.' });
            return;
        }

        setIsSending(true);
        isProcessingRef.current = true;
        lastSubmissionRef.current = submissionHash;

        setStatus({ type: 'info', message: 'جاري جلب قائمة المستخدمين...' });

        try {
            const users = await fetchAllUsers();
            setUserCount(users.length);

            if (!users.length) {
                setStatus({ type: 'error', message: 'لم يتم العثور على أي مستخدمين.' });
                isProcessingRef.current = false;
                setIsSending(false);
                return;
            }

            // تقسيم المستخدمين إلى دفعات (كل دفعة <= 500)
            const userChunks = chunkArray(users, BATCH_LIMIT);

            for (let i = 0; i < userChunks.length; i++) {
                const batch = writeBatch(db);
                const mailCollectionRef = collection(db, 'mail');
                const batchId = `batch_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

                userChunks[i].forEach((user, idx) => {
                    const personalizedHtml = trimmedContent.replace(/[اسم المستخدم]/g, user.username || 'طالبنا العزيز');
                    const docRef = doc(mailCollectionRef);
                    batch.set(docRef, {
                        to: [user.email],
                        message: {
                            subject: trimmedSubject,
                            html: personalizedHtml,
                        },
                        sentBy: 'admin',
                        batchId,
                        userId: user.id,
                        createdAt: serverTimestamp(),
                        sequence: idx + 1 + (i * BATCH_LIMIT)
                    });
                });

                await batch.commit();

                // إضافة السجل للعرض لاحقاً
                setRecentBatches(prev => [
                    { batchId, count: userChunks[i].length, time: new Date().toLocaleString() },
                    ...prev.slice(0, 4)
                ]);
            }

            setStatus({
                type: 'success',
                message: `تم إرسال ${users.length} رسالة بنجاح (مقسمة إلى ${userChunks.length} دفعة). ستُنقل الرسائل تلقائياً للبريد الإلكتروني لدى المستخدمين.`
            });

            // إعادة تعيين الحقول بعد النجاح
            setSubject('');
            setHtmlContent('');
            lastSubmissionRef.current = '';
        } catch (err) {
            setStatus({ type: 'error', message: "حدث خطأ أثناء الإرسال. الرجاء مراجعة الـ console." });
            console.error('Mass email error:', err);
        } finally {
            setIsSending(false);
            isProcessingRef.current = false;
        }
    };

    return (
        <div className="animate-fade-in space-y-8 max-w-2xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Mail /> إرسال بريد إلكتروني جماعي
                </h2>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">

                    <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-md flex items-start gap-2 text-sm">
                        <AlertTriangle size={20} className="flex-shrink-0" />
                        <div>
                            <strong>ملاحظة:</strong> تأكد من تثبيت إضافة <span className="font-mono font-bold">Trigger Email</span>{" "}
                            في Firebase بشكل صحيح. جميع الرسائل ستذهب عبر البريد الخاص بكل مستخدم كما هو محفوظ في قاعدة البيانات.
                        </div>
                    </div>

                    <form onSubmit={handleSendMassEmail} dir="rtl">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                عنوان البريد (Subject)
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="مثال: تحديثات جديدة في StellarSpeak!"
                                required
                                disabled={isSending}
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
                                rows="8"
                                disabled={isSending}
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
                        <span className="block mt-1 text-xs text-slate-400">
                            {userCount > 0 ? `سيتم الإرسال إلى ${userCount} مستخدم.` : ''}
                        </span>
                        {status.message && (
                            <p className={`mt-4 text-sm font-semibold ${
                                status.type === 'error' ? 'text-red-500' :
                                    status.type === 'success' ? 'text-green-500' :
                                        'text-sky-500'
                            }`}>{status.message}</p>
                        )}
                    </form>

                    {/* عرض سجل آخر العمليات */}
                    {recentBatches.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-bold text-sm mb-2">سجل آخر دفعات البريد الجماعي:</h3>
                            <ol className="space-y-1 text-xs list-decimal pl-4">
                                {recentBatches.map((b, idx) => (
                                    <li key={b.batchId + idx}>
                                        <span className="font-mono">Batch: {b.batchId}</span>{" "}
                                        <span> (عدد: {b.count}) </span>
                                        <span className="text-slate-400">— {b.time}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MassEmailSender;
