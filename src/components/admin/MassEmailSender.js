// src/components/admin/MassEmailSender.js

import React, { useState, useRef } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, LoaderCircle, Send, AlertTriangle } from 'lucide-react';

const MassEmailSender = () => {
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [userCount, setUserCount] = useState(0);
    
    // ✅ إضافة ref لمنع التشغيل المزدوج
    const isProcessingRef = useRef(false);
    const lastSubmissionRef = useRef(null);

    const handleSendMassEmail = async (e) => {
        e.preventDefault();
        
        // ✅ حماية ضد النقر المزدوج السريع
        if (isProcessingRef.current) {
            console.log('Already processing, ignoring duplicate request');
            return;
        }
        
        // ✅ حماية ضد إرسال نفس المحتوى مرتين
        const currentSubmission = `${subject.trim()}_${htmlContent.trim()}`;
        if (lastSubmissionRef.current === currentSubmission) {
            setStatus({ type: 'error', message: 'تم إرسال هذه الرسالة مؤخراً' });
            return;
        }

        if (!subject.trim() || !htmlContent.trim()) {
            setStatus({ type: 'error', message: 'الرجاء ملء حقل الموضوع والمحتوى.' });
            return;
        }

        const confirmSend = window.confirm(`أنت على وشك إرسال بريد إلكتروني إلى ${userCount > 0 ? userCount : 'جميع'} مستخدمين. هل أنت متأكد؟`);
        if (!confirmSend) return;

        // ✅ تفعيل الحماية
        isProcessingRef.current = true;
        setIsSending(true);
        setStatus({ type: 'info', message: 'جارٍ جلب قائمة المستخدمين...' });

        try {
            // 1. جلب جميع المستخدمين
            const usersSnapshot = await getDocs(collection(db, "users"));
            const users = usersSnapshot.docs.map(doc => ({ 
                email: doc.data().email, 
                username: doc.data().username 
            }));
            setUserCount(users.length);

            if (users.length === 0) {
                setStatus({ type: 'error', message: 'لم يتم العثور على أي مستخدمين.' });
                return;
            }

            setStatus({ type: 'info', message: `تم العثور على ${users.length} مستخدم. جارٍ تحضير الرسائل...` });

            // 2. إنشاء دفعة جديدة (Batch) لكل عملية إرسال
            const batch = writeBatch(db);
            const mailCollectionRef = collection(db, 'mail');
            
            // ✅ إضافة timestamp فريد لتجنب التكرار
            const timestamp = Date.now();
            
            users.forEach((user, index) => {
                if (user.email) {
                    const personalizedHtml = htmlContent.replace(/\[اسم المستخدم\]/g, user.username || 'طالبنا العزيز');
                    const newMailDocRef = doc(mailCollectionRef);
                    batch.set(newMailDocRef, {
                        to: [user.email],
                        message: {
                            subject: subject,
                            html: personalizedHtml,
                        },
                        // ✅ إضافة معرف فريد لتجنب التكرار
                        batchId: `${timestamp}_${index}`,
                        createdAt: new Date(),
                    });
                }
            });

            // 3. تنفيذ الدفعة
            await batch.commit();
            
            // ✅ حفظ هوية الإرسال الأخير
            lastSubmissionRef.current = currentSubmission;

            setStatus({ 
                type: 'success', 
                message: `تمت إضافة ${users.length} رسالة إلى قائمة الانتظار بنجاح. ستقوم الإضافة بإرسالها في الخلفية.` 
            });
            
            // ✅ مسح الحقول بعد الإرسال الناجح
            setSubject('');
            setHtmlContent('');
            
        } catch (error) {
            console.error("Error sending mass email:", error);
            setStatus({ type: 'error', message: 'حدث خطأ فادح. راجع الـ console لمزيد من التفاصيل.' });
        } finally {
            // ✅ إزالة الحماية
            isProcessingRef.current = false;
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
                                disabled={isSending} // ✅ تعطيل الحقل أثناء الإرسال
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-50"
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
                                disabled={isSending} // ✅ تعطيل الحقل أثناء الإرسال
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 font-mono disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSending}
                            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                            style={{ opacity: isSending ? 0.6 : 1 }} // ✅ تأثير بصري إضافي
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
