import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // ✅ إزالة query و orderBy
import { db } from '../../firebase';
import { MessageSquare, Loader, AlertCircle } from 'lucide-react';

const FeedbackList = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                // ✅ تبسيط الاستعلام لإزالة orderBy
                const querySnapshot = await getDocs(collection(db, 'feedback'));
                const feedbackList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // ✅ ترتيب الرسائل هنا في الكود بدلاً من قاعدة البيانات
                feedbackList.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
                setFeedback(feedbackList);
            } catch (err) {
                setError('Failed to fetch feedback. Please check Firestore rules.');
                console.error(err);
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
        return <div className="flex items-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg"><AlertCircle /> {error}</div>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><MessageSquare /> User Feedback</h2>
            <div className="space-y-4">
                {feedback.length > 0 ? feedback.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-800 dark:text-slate-200">{item.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {/* ✅ تغيير اسم الحقل هنا من timestamp إلى createdAt */}
                            From: {item.username || item.email || 'Anonymous'} | Sent on: {item.createdAt?.toDate().toLocaleString() || 'N/A'}
                        </p>
                    </div>
                )) : (
                    <p>No feedback messages yet.</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
