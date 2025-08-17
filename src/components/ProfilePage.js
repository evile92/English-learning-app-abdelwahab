import React from 'react';
import { User, Award, Star, BarChart3 } from 'lucide-react';

const ProfilePage = ({ userData, lessonsData, initialLevels }) => {
    // إذا لم يتم تحميل البيانات بعد، اعرض رسالة تحميل
    if (!userData) {
        return <div className="text-center p-8">جارِ تحميل الملف الشخصي...</div>;
    }

    const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed);
    const totalStars = completedLessons.reduce((sum, lesson) => sum + lesson.stars, 0);
    const currentLevelName = initialLevels[userData.level]?.name || 'غير محدد';

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
                    <div className="text-center md:text-right">
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{userData.username}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">{userData.email}</p>
                        <p className="mt-2 text-md font-semibold text-sky-500 dark:text-sky-400">
                            المستوى الحالي: {currentLevelName} ({userData.level})
                        </p>
                    </div>
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
            </div>
        </div>
    );
};

export default ProfilePage;
