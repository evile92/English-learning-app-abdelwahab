import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, BookOpen, MessageSquare, Activity, Loader } from 'lucide-react';

// --- مكون لعرض الإحصائيات الرئيسية ---
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const Analytics = () => {
    const [stats, setStats] = useState({ totalUsers: 0, lessonsCompleted: 0, totalFeedback: 0, dailyActiveUsers: 0 });
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // --- ✅  بداية التعديلات ---
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersList = usersSnapshot.docs.map(doc => doc.data());

                // 1. حساب الدروس المكتملة
                let totalLessonsCompleted = 0;
                usersList.forEach(user => {
                    if (user.lessonsData) {
                        const completed = Object.values(user.lessonsData).flat().filter(l => l.completed).length;
                        totalLessonsCompleted += completed;
                    }
                });

                // 2. حساب المستخدمين النشطين اليوم
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of today
                const dailyActiveUsers = usersList.filter(user => {
                    return user.lastActive?.toDate() >= today;
                }).length;
                
                // 3. جلب عدد رسائل الملاحظات
                const feedbackSnapshot = await getDocs(collection(db, "feedback"));
                const feedbackCount = feedbackSnapshot.size;

                // 4. تحديث الحالة بكل البيانات الجديدة
                setUsersData(usersList);
                setStats({
                    totalUsers: usersList.length,
                    lessonsCompleted: totalLessonsCompleted,
                    totalFeedback: feedbackCount,
                    dailyActiveUsers: dailyActiveUsers
                });
                // --- 🛑 نهاية التعديلات ---

            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- معالجة البيانات لعرضها في المخططات ---
    const processedData = useMemo(() => {
        if (usersData.length === 0) return { levelDistribution: [], userGrowth: [] };

        // 1. توزيع المستخدمين حسب المستوى
        const levelCounts = usersData.reduce((acc, user) => {
            const level = user.level || 'N/A';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {});
        const levelDistribution = Object.keys(levelCounts).map(level => ({
            name: level,
            Users: levelCounts[level],
        })).sort((a,b) => a.name.localeCompare(b.name));

        // 2. نمو المستخدمين مع الوقت
        const userGrowth = usersData
            .filter(u => u.createdAt?.toDate) // التأكد من وجود تاريخ تسجيل صالح
            .reduce((acc, user) => {
                const date = user.createdAt.toDate().toLocaleDateString('en-CA'); // YYYY-MM-DD
                const existingEntry = acc.find(entry => entry.date === date);
                if (existingEntry) {
                    existingEntry.newUsers += 1;
                } else {
                    acc.push({ date, newUsers: 1 });
                }
                return acc;
            }, [])
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .reduce((acc, entry, index) => {
                const cumulative = (acc[index - 1]?.cumulative || 0) + entry.newUsers;
                acc.push({ 
                    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                    cumulative 
                });
                return acc;
            }, []);


        return { levelDistribution, userGrowth };
    }, [usersData]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }

    return (
        <div className="p-6 space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Analytics Overview</h2>

            {/* --- الإحصائيات الرئيسية --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="text-white" />} color="bg-sky-500" />
                <StatCard title="Lessons Completed" value={stats.lessonsCompleted} icon={<BookOpen className="text-white" />} color="bg-emerald-500" />
                <StatCard title="User Feedback" value={stats.totalFeedback} icon={<MessageSquare className="text-white" />} color="bg-amber-500" />
                <StatCard title="Daily Active Users" value={stats.dailyActiveUsers} icon={<Activity className="text-white" />} color="bg-indigo-500" />
            </div>

            {/* --- المخططات البيانية --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">User Distribution by Level</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={processedData.levelDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : 'white', border: '1px solid #334155', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Bar dataKey="Users" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">User Growth Over Time</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={processedData.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : 'white', border: '1px solid #334155', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Line type="monotone" dataKey="cumulative" name="Total Users" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

