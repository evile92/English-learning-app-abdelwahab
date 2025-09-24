import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, Search, Loader, AlertCircle } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (err) {
                setError('Failed to fetch users. Please check your Firestore rules.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.username?.toLowerCase().includes(searchTerm.toLowerCase())) || // ✅ تم التعديل هنا
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader className="animate-spin" /></div>;
    }

    if (error) {
        return <div className="flex items-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg"><AlertCircle /> {error}</div>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Users /> User Management</h2>
            
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-800/50 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-700 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Level</th>
                            <th className="px-6 py-3">Points</th>
                            <th className="px-6 py-3">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                {/* ✅ تم التعديل هنا من userName إلى username */}
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.username || 'N/A'}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email || 'N/A'}</td>
                                <td className="px-6 py-4">{user.level || 'A1'}</td>
                                <td className="px-6 py-4">{user.points || 0}</td>
                                <td className="px-6 py-4">{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;

