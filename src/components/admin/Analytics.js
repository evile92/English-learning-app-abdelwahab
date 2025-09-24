// src/components/admin/Analytics.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, BarChart2, Book, Loader, AlertCircle, TrendingUp, Target } from 'lucide-react';

const StatCard = ({ title, value, icon, loading }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
            <div className="bg-sky-500/10 text-sky-500 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                {loading ? <Loader className="animate-spin" size={24}/> : <p className="text-2xl font-bold text-slate-800 dark:text-white truncate">{value}</p>}
            </div>
        </div>
    </div>
);

const Analytics = () => {
    const [stats, setStats] = useState({ totalUsers: 0, newUsersLast7Days: 0, mostCompletedLesson: 'N/A', mostCommonWeakPoint: 'N/A' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const totalUsers = usersSnapshot.size;

                const sevenDaysAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
                const newUsersQuery = query(collection(db, 'users'), where('createdAt', '>=', sevenDaysAgo));
                const newUsersSnapshot = await getDocs(newUsersQuery);
                const newUsersLast7Days = newUsersSnapshot.size;
                
                let lessonCompletions = {};
                let weakPoints = {};
                usersSnapshot.docs.forEach(doc => {
                    const userData = doc.data();
                    if (userData.lessonsData) {
                        Object.values(userData.lessonsData).flat().forEach(lesson => {
                            if (lesson.completed) {
                                lessonCompletions[lesson.title] = (lessonCompletions[lesson.title] || 0) + 1;
                            }
                        });
                    }
                    if (userData.errorLog) {
                        userData.errorLog.forEach(error => {
                            const lessonTitle = error.topic; // Assuming topic is the lesson ID
                            weakPoints[lessonTitle] = (weakPoints[lessonTitle] || 0) + 1;
                        });
                    }
                });

                const mostCompletedLesson = Object.keys(lessonCompletions).length ? Object.entries(lessonCompletions).sort((a,b) => b[1]-a[1])[0][0] : 'N/A';
                const mostCommonWeakPoint = Object.keys(weakPoints).length ? Object.entries(weakPoints).sort((a,b) => b[1]-a[1])[0][0] : 'N/A';

                setStats({ totalUsers, newUsersLast7Days, mostCompletedLesson, mostCommonWeakPoint });

            } catch (err) {
                setError('Failed to fetch analytics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return <div className="flex items-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg"><AlertCircle /> {error}</div>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><BarChart2 /> Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={24}/>} loading={loading} />
                <StatCard title="New Users (Last 7 Days)" value={stats.newUsersLast7Days} icon={<TrendingUp size={24}/>} loading={loading} />
                <StatCard title="Most Completed Lesson" value={stats.mostCompletedLesson} icon={<Book size={24}/>} loading={loading} />
                <StatCard title="Most Common Weak Point" value={stats.mostCommonWeakPoint} icon={<Target size={24}/>} loading={loading} />
            </div>
        </div>
    );
};

export default Analytics;
