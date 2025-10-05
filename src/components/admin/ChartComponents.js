// src/components/admin/ChartComponents.js
import React from 'react';

export const ChartsContainer = ({ recharts, data }) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } = recharts;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">User Distribution by Level</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.levelDistribution}>
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
                    <LineChart data={data.userGrowth}>
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
    );
};
