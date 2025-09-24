// src/components/admin/UserDetailsModal.js

import React, { useState } from 'react';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, User, BarChart3, Star, Award, Send, LoaderCircle } from 'lucide-react';

const UserDetailsModal = ({ user, onClose }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const completedLessons = Object.values(user.lessonsData || {}).flat().filter(l => l.completed).length;
    const totalStars = Object.values(user.lessonsData || {}).flat().reduce((sum, lesson) => sum + (lesson.stars || 0), 0);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        try {
            const messagesRef = collection(db, `users/${user.id}/messages`);
            await addDoc(messagesRef, {
                title: 'رسالة من الإدارة',
                content: message,
                read: false,
                createdAt: serverTimestamp()
            });
            setMessage('');
            alert('Message sent successfully!');
        } catch (error) {
            console.error("Error sending message:", error);
            alert('Failed to send message.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2"><User /> {user.username}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-2xl font-bold text-sky-500">{user.level}</p>
                            <p className="text-sm text-slate-500">Level</p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-2xl font-bold text-amber-500">{user.points}</p>
                            <p className="text-sm text-slate-500">Points</p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-2xl font-bold text-green-500">{completedLessons}</p>
                            <p className="text-sm text-slate-500">Lessons</p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-500">{totalStars}</p>
                            <p className="text-sm text-slate-500">Stars</p>
                        </div>
                    </div>

                    {/* Send Message */}
                    <div>
                        <h4 className="font-bold mb-2">Send Direct Message</h4>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={`Message to ${user.username}...`}
                                className="flex-grow p-2 border rounded bg-slate-50 dark:bg-slate-700 dark:border-slate-600"
                            />
                            <button onClick={handleSendMessage} disabled={isSending} className="bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-slate-400">
                                {isSending ? <LoaderCircle className="animate-spin" /> : <Send size={16} />} Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
