// src/components/ReviewSection.js

import React, { useMemo } from 'react';
import { History, BrainCircuit } from 'lucide-react';
import { lessonTitles } from '../data/lessons';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ReviewSection = () => {
    const { userData } = useAppContext();
    const navigate = useNavigate();

    const itemsDueForReview = useMemo(() => {
        if (!userData?.reviewSchedule) {
            return [];
        }

        const today = new Date().toISOString().split('T')[0];
        const dueItems = [];
        const allLessonsList = Object.entries(lessonTitles).flatMap(([level, titles]) => 
            titles.map((title, i) => ({ id: `${level}-${i + 1}`, title }))
        );

        for (const lessonId in userData.reviewSchedule.lessons) {
            if (userData.reviewSchedule.lessons[lessonId].nextReviewDate <= today) {
                const lessonInfo = allLessonsList.find(l => l.id === lessonId);
                if (lessonInfo) {
                    dueItems.push({ ...lessonInfo, type: 'lesson' });
                }
            }
        }

        for (const wordEn in userData.reviewSchedule.vocabulary) {
            if (userData.reviewSchedule.vocabulary[wordEn].nextReviewDate <= today) {
                const wordInfo = (userData.myVocabulary || []).find(v => v.en === wordEn);
                if (wordInfo) {
                    dueItems.push({ ...wordInfo, type: 'vocabulary' });
                }
            }
        }

        return dueItems;
    }, [userData]);

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><History/> مراجعتك الذكية</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">يقوم النظام بتحديد الدروس والكلمات التي تحتاج إلى مراجعة لترسيخها في ذاكرتك.</p>
            
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                {itemsDueForReview.length === 0 ? (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">كل شيء تمام!</h3>
                        <p className="text-slate-600 dark:text-slate-300">لا توجد عناصر للمراجعة اليوم. أكمل بعض الدروس الجديدة أو أضف كلمات إلى قاموسك.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">جاهز للمراجعة اليوم ({itemsDueForReview.length} عنصر)</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">لقد جهزنا لك جلسة مراجعة مخصصة بناءً على أدائك.</p>
                        <ul className="list-disc list-inside mb-6 text-slate-500 dark:text-slate-400 space-y-1">
                            {itemsDueForReview.slice(0, 5).map((item, index) => (
                                <li key={index}>
                                    {item.type === 'lesson' ? `مراجعة درس: "${item.title}"` : `مراجعة كلمة: "${item.en}"`}
                                </li>
                            ))}
                            {itemsDueForReview.length > 5 && <li>والمزيد...</li>}
                        </ul>
                        <button 
                            onClick={() => navigate('/review-session')} 
                            className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                        >
                           <BrainCircuit size={20} /> ابدأ جلسة المراجعة الذكية
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
