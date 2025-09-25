// src/components/ContactPage.js

import React, { useState } from 'react';
import { Mail, Send, LoaderCircle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactPage = () => {
    const { user, userName } = useAppContext();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'sent'
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('يرجى كتابة رسالتك قبل الإرسال.');
            return;
        }

        setStatus('sending');
        setError('');

        try {
            await addDoc(collection(db, "feedback"), {
                message: message,
                userId: user ? user.uid : 'guest',
                username: user ? userName || user.displayName : 'Guest User',
                email: user ? user.email : 'N/A',
                createdAt: serverTimestamp(),
                status: 'new'
            });
            setStatus('sent');
            setMessage('');
        } catch (err) {
            console.error("Error submitting feedback: ", err);
            setError('حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.');
            setStatus('idle');
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg text-center">
                <Mail className="mx-auto text-sky-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">تواصل معنا</h1>

                {status === 'sent' ? (
                    <div className="text-center p-6 bg-green-100 dark:bg-green-900/50 rounded-lg animate-fade-in">
                        <CheckCircle className="mx-auto text-green-500 mb-3" size={40} />
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-200">تم إرسال رسالتك بنجاح!</h3>
                        <p className="text-green-700 dark:text-green-300 mt-1">شكرًا لك على ملاحظاتك، سنقوم بمراجعتها قريبًا.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                            هل لديك اقتراح لتطوير الموقع أو واجهت مشكلة تقنية؟ يسعدنا سماع ذلك منك!
                        </p>
                        <form onSubmit={handleSubmit} className="mt-6 text-left">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="اكتب تفاصيل المشكلة أو اقتراحك هنا..."
                                rows="5"
                                required
                                className="w-full p-3 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                            ></textarea>

                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                            <button 
                                type="submit" 
                                disabled={status === 'sending'}
                                className="mt-4 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                            >
                                {status === 'sending' ? (
                                    <LoaderCircle className="animate-spin" size={20} />
                                ) : (
                                    <Send size={18} />
                                )}
                                <span>{status === 'sending' ? 'جارِ الإرسال...' : 'إرسال'}</span>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactPage;
