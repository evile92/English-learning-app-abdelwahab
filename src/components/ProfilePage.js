// src/components/ProfilePage.js

import React from 'react';
import { User, Award, Star, BarChart3, DownloadCloud, Edit } from 'lucide-react';
import { achievementsList } from '../data/achievements';
import { useAppContext } from '../context/AppContext'; // <-- استيراد

const ProfilePage = ({ onViewCertificate, onEditProfile }) => { // <-- لم نعد نستقبل كل الخصائص
    const { userData, lessonsDataState, initialLevels } = useAppContext(); // <-- سحب البيانات من هنا

    if (!userData) {
        return <div className="text-center p-8">جارِ تحميل الملف الشخصي...</div>;
    }

    const completedLessons = Object.values(lessonsDataState).flat().filter(l => l.completed);
    const totalStars = completedLessons.reduce((sum, lesson) => sum + lesson.stars, 0);
    const currentLevelName = initialLevels[userData.level]?.name || 'غير محدد';
    const earnedCertificates = userData.earnedCertificates || [];
    const unlockedAchievements = userData.unlockedAchievements || [];

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="max-w-4xl mx-auto">
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
                    <button 
                        onClick={onEditProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Edit size={18} />
                        <span>تعديل</span>
                    </button>
                </div>

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

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">الشارات المكتسبة</h2>
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                        {unlockedAchievements.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {unlockedAchievements.map(achId => {
                                    const ach = achievementsList[achId];
                                    if (!ach) return null;
                                    return (
                                        <div key={ach.id} className="text-center" title={ach.description}>
                                            <div className="text-6xl">{ach.emoji}</div>
                                            <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200 text-sm">{ach.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-slate-500 dark:text-slate-400">لم تكتسب أي شارات بعد. استمر في التعلم!</p>
                        )}
                    </div>
                </div>

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
