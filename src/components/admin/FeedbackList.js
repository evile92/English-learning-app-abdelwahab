// src/components/admin/FeedbackList.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageSquare, Loader, AlertCircle } from 'lucide-react';

const FeedbackList = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                // (التصحيح 1): تم تغيير 'timestamp' إلى 'createdAt'
                const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const feedbackList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeedback(feedbackList);
            } catch (err) {
                setError('Failed to fetch feedback. Check console for an index creation link.');
                console.error("Firebase error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader className="animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                    <AlertCircle /> {error}
                </div>
                <p className="text-xs text-center">
                    This usually happens because a Firestore Index is required. Open your browser's developer console (F12), find the error message, and click the link to create the index automatically.
                </p>
            </div>
        );
    }


    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><MessageSquare /> User Feedback</h2>
            <div className="space-y-4">
                {feedback.length > 0 ? feedback.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-800 dark:text-slate-200">{item.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                             {/* (التصحيح 2): تم تغيير 'timestamp' إلى 'createdAt' */}
                            From: {item.username || item.email || 'Anonymous'} | Sent on: {item.createdAt?.toDate().toLocaleString() || 'N/A'}
                        </p>
                    </div>
                )) : (
                    <p className="text-slate-600 dark:text-slate-400">No feedback messages yet.</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
