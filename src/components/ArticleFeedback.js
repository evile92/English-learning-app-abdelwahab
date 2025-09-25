// src/components/ArticleFeedback.js
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';

const ArticleFeedback = ({ articleId }) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    // 'liked', 'disliked', or null
    const [voteStatus, setVoteStatus] = useState(null); 

    // جلب عدد الإعجابات الحالي من قاعدة البيانات
    useEffect(() => {
        const fetchFeedback = async () => {
            const docRef = doc(db, 'articles', articleId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLikes(docSnap.data().likes || 0);
                setDislikes(docSnap.data().dislikes || 0);
            }
        };
        fetchFeedback();
        
        // التحقق من التصويت السابق في التخزين المحلي
        const localVote = localStorage.getItem(`vote_${articleId}`);
        if (localVote) {
            setVoteStatus(localVote);
        }
    }, [articleId]);

    const handleVote = async (type) => {
        if (voteStatus) return; // منع التصويت المكرر

        const articleRef = doc(db, 'articles', articleId);
        const updateField = type === 'like' ? 'likes' : 'dislikes';

        // تحديث الواجهة فورًا
        if (type === 'like') setLikes(l => l + 1);
        if (type === 'dislike') setDislikes(d => d + 1);
        setVoteStatus(type);
        localStorage.setItem(`vote_${articleId}`, type);

        // تحديث قاعدة البيانات
        await updateDoc(articleRef, {
            [updateField]: increment(1)
        });
    };

    const isLiked = voteStatus === 'like';
    const isDisliked = voteStatus === 'dislike';

    return (
        <div className="flex items-center gap-4">
            <button 
                onClick={() => handleVote('like')} 
                disabled={!!voteStatus}
                className={`flex items-center gap-2 text-sm transition-colors ${
                    isLiked ? 'text-green-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-green-500 disabled:hover:text-slate-500'
                }`}
            >
                <ThumbsUp size={18} />
                <span>{likes}</span>
            </button>
            <button 
                onClick={() => handleVote('dislike')} 
                disabled={!!voteStatus}
                className={`flex items-center gap-2 text-sm transition-colors ${
                    isDisliked ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-red-500 disabled:hover:text-slate-500'
                }`}
            >
                <ThumbsDown size={18} />
                <span>{dislikes}</span>
            </button>
        </div>
    );
};

export default ArticleFeedback;
