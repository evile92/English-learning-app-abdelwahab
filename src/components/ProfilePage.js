// src/components/ProfilePage.js

import React from 'react';
import { User, Award, Star, BarChart3, DownloadCloud, Edit, ShieldCheck, LogIn } from 'lucide-react';
import { achievementsList } from '../data/achievements';
import { useAppContext } from '../context/AppContext';
import { getAvatarById } from '../data/avatars';

const ProfilePage = () => {
    const { 
        user,
        userData, lessonsDataState, initialLevels, 
        viewCertificate, setPage 
    } = useAppContext();

    // منطق عرض صفحة الزائر (يبقى كما هو)
    if (!user) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative text-center">
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
                    <User className="mx-auto text-sky-500 mb-4" size={48} />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">ملفك الشخصي في انتظارك!</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">
                        سجل الدخول أو أنشئ حسابًا جديدًا لعرض إنجازاتك، وتتبع تقدمك، والحصول على شهاداتك.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setPage('login')} className="bg-sky-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2">
                            <LogIn size={20} /> تسجيل الدخول
                        </button>
                        <button onClick={() => setPage('register')} className="bg-slate-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-slate-700 transition-all">
                            إنشاء حساب جديد
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // منطق التحميل (يبقى كما هو)
    if (!userData) {
        return <div className="text-center p-8">جارِ تحميل الملف الشخصي...</div>;
    }

    // حساب الإحصائيات (يبقى كما هو)
    const completedLessons = Object.values(lessonsDataState).flat().filter(l => l.completed);
    const totalStars = completedLessons.reduce((sum, lesson) => sum + lesson.stars, 0);
    const currentLevelId = userData.level;
    const currentLevel = initialLevels[currentLevelId] || { name: 'غير محدد' };
    const currentLevelLessons = lessonsDataState[currentLevelId] || [];
    const completedInCurrentLevel = currentLevelLessons.filter(l => l.completed).length;
    const totalInCurrentLevel = currentLevelLessons.length;
    const levelProgress = totalInCurrentLevel > 0 ? (completedInCurrentLevel / totalInCurrentLevel) * 100 : 0;
    const earnedCertificates = userData.earnedCertificates || [];
    const unlockedAchievements = userData.unlockedAchievements || [];

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="max-w-6xl mx-auto">
                
                {/* --- [الإصلاح 1: إعادة بناء بطاقة الملف الشخصي] --- */}
                <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-sky-500/20 dark:from-sky-500/10 to-transparent opacity-50 z-0"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                        <div 
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 ring-4 ring-white dark:ring-slate-800 bg-cover bg-center"
                            style={{ backgroundImage: `url(${getAvatarById(userData.avatarId)})` }}
                        />
                        <div className="text-center sm:text-left flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="flex-1">
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white truncate">{userData.username}</h1>
                                    <p className="text-md text-slate-500 dark:text-slate-400 mt-1 truncate">{userData.email}</p>
                                </div>
                                <button 
                                    onClick={() => setPage('editProfile')}
                                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
                                >
                                    <Edit size={16} />
                                    <span>تعديل</span>
                                </button>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                                    <span className="text-sky-600 dark:text-sky-400">التقدم في {currentLevel.name}</span>
                                    <span className="text-slate-500">{Math.round(levelProgress)}%</span>
                                </div>
                                <div className="w-full bg-slate-200/70 dark:bg-slate-700/70 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- [الإصلاح 2: التأكد من بنية الشبكة الرئيسية] --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إحصائياتك</h2>
                        <div className="space-y-4">
                            <StatCard icon={Award} value={userData.points} label="نقطة مكتسبة" color="amber" />
                            <StatCard icon={BarChart3} value={completedLessons.length} label="درس مكتمل" color="green" />
                            <StatCard icon={Star} value={totalStars} label="نجمة مكتسبة" color="yellow" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">الشارات المكتسبة</h2>
                            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                                {unlockedAchievements.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                                        {unlockedAchievements.map(achId => {
                                            const ach = achievementsList[achId];
                                            if (!ach) return null;
                                            return (
                                                <div key={ach.id} className="flex flex-col items-center text-center group" title={ach.description}>
                                                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                                                        {ach.emoji}
                                                    </div>
                                                    <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200 text-sm">{ach.name}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">لم تكتسب أي شارات بعد. استمر في التعلم!</p>
                                )}
                            </div>
                        </div>

                        {earnedCertificates.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">الشهادات المكتسبة</h2>
                                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg space-y-4">
                                    {earnedCertificates.map(levelId => (
                                        <div key={levelId} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="text-green-500" size={24} />
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">شهادة إتمام: {initialLevels[levelId]?.name}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400"> المستوى ({levelId})</p>
                                                </div>
                                            </div>
                                            <button onClick={() => viewCertificate(levelId)} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors text-sm">
                                                <DownloadCloud size={16} />
                                                <span>عرض</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... المكون StatCard يبقى كما هو ...
const StatCard = ({ icon: Icon, value, label, color }) => {
    const colors = {
        amber: 'text-amber-500 bg-amber-100 dark:bg-amber-900/50',
        green: 'text-green-500 bg-green-100 dark:bg-green-900/50',
        yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50',
    };
    return (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-lg flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
        </div>
    );
};

export default ProfilePage;

