// src/components/ContactPage.js

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Send, LoaderCircle, CheckCircle, MessageSquare, Bug, Lightbulb } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactPage = () => {
    const { user, userName } = useAppContext();
    const [message, setMessage] = useState('');
    // --- ✅ 1. إضافة حقول جديدة للنموذج ---
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState(user?.email || '');

    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || !subject) {
            setError('يرجى اختيار الموضوع وكتابة رسالتك.');
            return;
        }
        
        setStatus('sending');
        setError('');

        try {
            await addDoc(collection(db, "feedback"), {
                message: message,
                // --- ✅ 2. حفظ البيانات الجديدة ---
                subject: subject,
                contactEmail: email, // بريد إلكتروني للتواصل
                // --- (باقي البيانات كما هي) ---
                userId: user ? user.uid : 'guest',
                username: user ? userName || user.displayName : 'Guest User',
                email: user ? user.email : 'N/A', // بريد الحساب
                createdAt: serverTimestamp(),
                status: 'new'
            });
            setStatus('sent');
            setMessage('');
            setSubject('');
        } catch (err) {
            console.error("Error submitting feedback: ", err);
            setError('حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.');
            setStatus('idle');
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-5xl mx-auto">
            {status === 'sent' ? (
                // --- ✅ 3. تصميم جديد لرسالة النجاح ---
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center min-h-[400px]">
                    <CheckCircle className="text-green-500 mb-4" size={64} />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">شكرًا لك!</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-md">
                        تم استلام رسالتك بنجاح. نحن نقدر ملاحظاتك وسننظر فيها في أقرب وقت ممكن.
                    </p>
                </div>
            ) : (
                // --- ✅ 4. التصميم الجديد للصفحة المكون من قسمين ---
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden md:grid md:grid-cols-2">
                    {/* --- القسم الأيسر: النموذج --- */}
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">أرسل لنا رسالة</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">بريدك الإلكتروني (اختياري)</label>
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="حتى نتمكن من الرد عليك"
                                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">الموضوع</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="" disabled>اختر نوع الرسالة...</option>
                                    <option value="suggestion">اقتراح لتطوير الموقع</option>
                                    <option value="bug_report">الإبلاغ عن مشكلة تقنية</option>
                                    <option value="general_question">سؤال عام</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">رسالتك</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="اكتب تفاصيل اقتراحك أو المشكلة هنا..."
                                    rows="5"
                                    required
                                    className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                ></textarea>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button 
                                type="submit" 
                                disabled={status === 'sending'}
                                className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                            >
                                {status === 'sending' ? <LoaderCircle className="animate-spin" /> : <Send />}
                                <span>{status === 'sending' ? 'جارِ الإرسال...' : 'إرسال'}</span>
                            </button>
                        </form>
                    </div>
                    
                    {/* --- القسم الأيمن: معلومات إضافية --- */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 text-right">
                        <Mail className="text-sky-500 mb-4" size={40} />
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">لماذا تتواصل معنا؟</h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">
                            ملاحظاتك هي الوقود الذي يدفع صاروخنا نحو الأفضل! نحن نقرأ كل رسالة بعناية لمساعدتنا في تحسين رحلتك التعليمية.
                        </p>
                        <div className="space-y-4">
                            <InfoCard 
                                icon={Lightbulb} 
                                title="لديك فكرة رائعة؟"
                                description="نحب الأفكار الجديدة التي تجعل التعلم أكثر متعة وفعالية."
                            />
                            <InfoCard 
                                icon={Bug} 
                                title="وجدت خطأ تقنياً؟"
                                description="ساعدنا في إصلاح المشاكل لضمان تجربة سلسة للجميع."
                            />
                             <InfoCard 
                                icon={MessageSquare} 
                                title="مجرد سؤال؟"
                                description="لا تتردد في طرح أي سؤال يخطر ببالك حول الموقع."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- مكون صغير مساعد للبطاقات المعلوماتية ---
const InfoCard = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full mt-1">
            <Icon className="text-sky-600 dark:text-sky-400" size={20} />
        </div>
        <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

export default ContactPage;
