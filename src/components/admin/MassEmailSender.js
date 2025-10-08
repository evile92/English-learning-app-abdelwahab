// src/components/admin/MassEmailSender.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, getDocs, writeBatch, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, LoaderCircle, Send, Users, User } from 'lucide-react';

const BATCH_LIMIT = 499; // الحد الأقصى لعمليات الكتابة في الدفعة الواحدة هو 500

const MassEmailSender = () => {
    // حالات الواجهة الرئيسية
    const [sendMode, setSendMode] = useState('all'); // 'all' or 'specific'
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSending, setIsSending] = useState(false);

    // حالات لاختيار المستخدمين
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [userSearch, setUserSearch] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    
    // جلب كل المستخدمين عند الحاجة
    useEffect(() => {
        if (sendMode === 'specific' && allUsers.length === 0) {
            const fetchUsers = async () => {
                setIsLoadingUsers(true);
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    email: doc.data().email,
                    username: doc.data().username,
                })).filter(u => !!u.email);
                setAllUsers(usersList);
                setIsLoadingUsers(false);
            };
            fetchUsers();
        }
    }, [sendMode, allUsers.length]);

    const handleUserSelection = (userId) => {
        setSelectedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const filteredUsers = useMemo(() => {
        if (!userSearch) return allUsers;
        return allUsers.filter(u => 
            u.username?.toLowerCase().includes(userSearch.toLowerCase()) || 
            u.email?.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [userSearch, allUsers]);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        
        if (isSending) return;

        const trimmedSubject = subject.trim();
        const trimmedContent = htmlContent.trim();

        if (!trimmedSubject || !trimmedContent) {
            setStatus({ type: 'error', message: 'الرجاء ملء حقل الموضوع والمحتوى.' });
            return;
        }

        let targetUsers = [];
        if (sendMode === 'all') {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            targetUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => !!u.email);
        } else {
            if (selectedUsers.size === 0) {
                setStatus({ type: 'error', message: 'الرجاء اختيار مستخدم واحد على الأقل.' });
                return;
            }
            targetUsers = allUsers.filter(u => selectedUsers.has(u.id));
        }

        if (targetUsers.length === 0) {
            setStatus({ type: 'error', message: 'لم يتم العثور على مستخدمين مستهدفين.' });
            return;
        }

        const confirmSend = window.confirm(`أنت على وشك إرسال بريد إلكتروني إلى ${targetUsers.length} مستخدم. هل أنت متأكد؟`);
        if (!confirmSend) return;

        setIsSending(true);
        setStatus({ type: 'info', message: `جارٍ تحضير الرسائل لـ ${targetUsers.length} مستخدم...` });

        try {
            const userChunks = [];
            for (let i = 0; i < targetUsers.length; i += BATCH_LIMIT) {
                userChunks.push(targetUsers.slice(i, i + BATCH_LIMIT));
            }
            
            for (const chunk of userChunks) {
                const batch = writeBatch(db);
                const mailCollectionRef = collection(db, 'mail');
                chunk.forEach(user => {
                    const personalizedHtml = trimmedContent.replace(/\[اسم المستخدم\]/g, user.username || 'طالبنا العزيز');
                    batch.set(doc(mailCollectionRef), {
                        to: [user.email],
                        message: { subject: trimmedSubject, html: personalizedHtml },
                    });
                });
                await batch.commit();
            }

            await addDoc(collection(db, 'email_campaigns'), {
                subject: trimmedSubject,
                content: trimmedContent,
                recipientCount: targetUsers.length,
                sentAt: serverTimestamp(),
                mode: sendMode,
                recipients: sendMode === 'specific' ? targetUsers.map(u => ({ id: u.id, email: u.email })) : []
            });

            setStatus({ type: 'success', message: `تمت جدولة ${targetUsers.length} رسالة للإرسال بنجاح.` });
            setSubject('');
            setHtmlContent('');
            setSelectedUsers(new Set());

        } catch (err) {
            setStatus({ type: 'error', message: "حدث خطأ أثناء الإرسال. الرجاء مراجعة الـ console." });
            console.error('Mass email error:', err);
        } finally {
            setIsSending(false);
        }
    };
    
    // واجهة الإرسال الرئيسية
    return (
        <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Mail /> إرسال بريد إلكتروني</h2>

                <form onSubmit={handleSendEmail} dir="rtl">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">إرسال إلى:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name="sendMode" value="all" checked={sendMode === 'all'} onChange={() => setSendMode('all')} /> <Users size={16}/> جميع المستخدمين</label>
                            <label className="flex items-center gap-2"><input type="radio" name="sendMode" value="specific" checked={sendMode === 'specific'} onChange={() => setSendMode('specific')} /> <User size={16}/> مستخدمين محددين</label>
                        </div>
                    </div>
                    
                    {sendMode === 'specific' && (
                        <div className="mb-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                            <input type="text" placeholder="ابحث بالاسم أو البريد..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full p-2 mb-2 border rounded-md bg-white dark:bg-slate-800"/>
                            {isLoadingUsers ? <LoaderCircle className="animate-spin"/> : (
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                                    {filteredUsers.map(user => (
                                        <label key={user.id} className="flex items-center gap-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                                            <input type="checkbox" checked={selectedUsers.has(user.id)} onChange={() => handleUserSelection(user.id)} />
                                            <span>{user.username} ({user.email})</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs mt-2 text-slate-500">{selectedUsers.size} مستخدم محدد</p>
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">عنوان البريد (Subject)</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="مثال: تحديثات جديدة في StellarSpeak!" required disabled={isSending} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"/>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">محتوى البريد (HTML)</label>
                        <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} placeholder="مرحباً يا [اسم المستخدم]، نود تذكيرك بـ..." required rows="8" disabled={isSending} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 font-mono"/>
                    </div>
                    
                    <button type="submit" disabled={isSending} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                        {isSending ? <LoaderCircle className="animate-spin" /> : <Send size={18} />}
                        {isSending ? 'جارٍ الإرسال...' : 'إرسال'}
                    </button>
                    
                    {status.message && <p className={`mt-4 text-sm font-semibold ${status.type === 'error' ? 'text-red-500' : status.type === 'success' ? 'text-green-500' : 'text-sky-500'}`}>{status.message}</p>}
                </form>
            </div>
        </div>
    );
};

export default MassEmailSender;
