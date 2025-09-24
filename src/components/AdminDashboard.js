// src/components/AdminDashboard.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../context/AppContext';
import { Send, Shield } from 'lucide-react';

const AdminDashboard = () => {
    const { userData } = useAppContext();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    // التأكد من أن المستخدم مدير قبل عرض أي شيء
    if (!userData?.isAdmin) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await addDoc(collection(db, "announcements"), {
                title: title,
                message: message,
                createdAt: serverTimestamp(),
            });
            setStatus('Sent successfully!');
            setTitle('');
            setMessage('');
        } catch (error) {
            setStatus('Failed to send.');
            console.error("Error sending announcement: ", error);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield /> Admin Dashboard
            </h1>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Send Announcement</h2>
                <form onSubmit={handleSendAnnouncement}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Announcement Title"
                        required
                        className="w-full p-3 mb-4 bg-slate-100 dark:bg-slate-900 rounded-md"
                    />
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your message to all users..."
                        required
                        rows="4"
                        className="w-full p-3 mb-4 bg-slate-100 dark:bg-slate-900 rounded-md"
                    />
                    <button type="submit" className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                        <Send size={18} /> Send
                    </button>
                    {status && <p className="mt-4 text-sm">{status}</p>}
                </form>
            </div>
            {/* يمكنك إضافة المزيد من المكونات هنا، مثل قائمة بالمستخدمين */}
        </div>
    );
};

export default AdminDashboard;
