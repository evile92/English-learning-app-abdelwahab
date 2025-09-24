import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, BarChart2, Book, Loader, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon, loading }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
            <div className="bg-sky-500/10 text-sky-500 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                {loading ? <Loader className="animate-spin" size={24}/> : <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>}
            </div>
        </div>
    </div>
);

const Analytics = () => {
    const [stats, setStats] = useState({ totalUsers: 0, lessonsCached: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const lessonsSnapshot = await getDocs(collection(db, 'lessonContents'));
                setStats({
                    totalUsers: usersSnapshot.size,
                    lessonsCached: lessonsSnapshot.size,
                });
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={24}/>} loading={loading} />
                <StatCard title="Cached Lessons" value={stats.lessonsCached} icon={<Book size={24}/>} loading={loading} />
                {/* Add more stat cards as needed */}
            </div>
        </div>
    );
};

export default Analytics;
