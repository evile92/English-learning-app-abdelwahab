// src/components/ShareArticle.js
import React from 'react';
import { Share2 } from 'lucide-react';

const ShareArticle = ({ title, url }) => {
    const handleShare = async () => {
        const shareData = {
            title: title,
            text: `لقد وجدت مقالًا رائعًا بعنوان "${title}" على Stellar Speak!`,
            url: url,
        };
        
        // التحقق مما إذا كان المتصفح يدعم واجهة المشاركة
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Article shared successfully');
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // حل بديل للمتصفحات التي لا تدعم الميزة (مثل Firefox على سطح المكتب)
            alert('متصفحك لا يدعم المشاركة المباشرة. يمكنك نسخ الرابط يدويًا.');
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
        >
            <Share2 size={18} />
            <span>مشاركة</span>
        </button>
    );
};

export default ShareArticle;
