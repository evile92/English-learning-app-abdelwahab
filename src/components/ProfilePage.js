// src/components/ProfilePage.js

import React from 'react';
import { User, Award, Star, BarChart3, DownloadCloud, Edit } from 'lucide-react';

const ProfilePage = ({ userData, lessonsData, initialLevels, onViewCertificate, onEditProfile }) => {
    // إذا لم يتم تحميل البيانات بعد، اعرض رسالة تحميل
    if (!userData) {
        return <div className="text-center p-8">جارِ تحميل الملف الشخصي...</div>;
    }

    const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed);
    const totalStars = completedLessons.reduce((sum, lesson) => sum + lesson.stars, 0);
    const currentLevelName = initialLevels[userData.level]?.name || 'غير محدد';
    const earnedCertificates = userData.earnedCertificates || [];

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="max-w-4xl mx-auto">
                {/* بطاقة معلومات المستخدم */}
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                            <User className="text-white" size={64} />
                        </div>
                    </div>
                    <div className="text-center md:text-right flex-1">
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{userData.username}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">{userData.email}</p>
                        <p className="mt-2 text-md font-semibold text-sky-500 dark:text-sky-400">
                            المستوى الحالي: {currentLevelName} ({userData.level})
                        </p>
                    </div>
                    {/* --- (بداية الإضافة): زر تعديل الملف الشخصي --- */}
                    <button 
                        onClick={onEditProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Edit size={18} />
                        <span>تعديل</span>
                    </button>
                    {/* --- (نهاية الإضافة) --- */}
                </div>

                {/* قسم الإحصائيات */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg text-center">
                        <Award className="mx-auto text-amber-500 mb-2" size={40} />
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{userData.points}</p>
                        <p className="text-slate-500 dark:text-slate-400">نقطة</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg text-center">
                        <BarChart3 className="mx-auto text-green-500 mb-2" size={40} />
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{completedLessons.length}</p>
                        <p className="text-slate-500 dark:text-slate-400">درس مكتمل</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg text-center">
                        <Star className="mx-auto text-yellow-500 mb-2" size={40} />
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalStars}</p>
                        <p className="text-slate-500 dark:text-slate-400">نجمة مكتسبة</p>
                    </div>
                </div>

                {/* قسم الشهادات */}
                {earnedCertificates.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">الشهادات المكتسبة</h2>
                        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg space-y-4">
                            {earnedCertificates.map(levelId => (
                                <div key={levelId} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">شهادة إتمام مستوى: {initialLevels[levelId]?.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400"> المستوى ({levelId})</p>
                                    </div>
                                    <button 
                                        onClick={() => onViewCertificate(levelId)}
                                        className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors"
                                    >
                                        <DownloadCloud size={18} />
                                        <span>عرض</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
