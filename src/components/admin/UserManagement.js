// src/components/admin/UserManagement.js

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, Search, Loader, AlertCircle, Edit, ShieldOff, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [username, setUsername] = useState(user.username || '');
    const [level, setLevel] = useState(user.level || 'A1');
    const [points, setPoints] = useState(user.points || 0);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin || false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const updates = {
            username,
            level,
            points: Number(points),
            isAdmin
        };
        try {
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, updates);
            onUpdate(user.id, updates);
            onClose();
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Error: Could not update user.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit User: {user.username}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded mt-1 bg-slate-50 dark:bg-slate-700"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Level (e.g., A1, A2, B1)</label>
                        <input type="text" value={level} onChange={e => setLevel(e.target.value)} className="w-full p-2 border rounded mt-1 bg-slate-50 dark:bg-slate-700"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Points</label>
                        <input type="number" value={points} onChange={e => setPoints(e.target.value)} className="w-full p-2 border rounded mt-1 bg-slate-50 dark:bg-slate-700"/>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="h-4 w-4 rounded"/>
                        <label htmlFor="isAdmin" className="ml-2 text-sm">Is Admin?</label>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-lg">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-sky-500 text-white px-4 py-2 rounded-lg disabled:bg-slate-400">
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    // Pagination State
    const [lastVisible, setLastVisible] = useState(null);
    const [page, setPage] = useState(1);
    const USERS_PER_PAGE = 10;

    const fetchUsers = async (direction = 'next') => {
        setLoading(true);
        try {
            let q;
            if (direction === 'next' && lastVisible) {
                q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(USERS_PER_PAGE));
            } else {
                 q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(USERS_PER_PAGE));
            }
            
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (!querySnapshot.empty) {
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);
                setUsers(usersList);
            }
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    const handleUpdateUser = (userId, updatedData) => {
        setUsers(users.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    };

    const handleSuspendUser = async (userId, isSuspended) => {
        if (window.confirm(`Are you sure you want to ${isSuspended ? 'unsuspend' : 'suspend'} this user?`)) {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, { isSuspended: !isSuspended });
            handleUpdateUser(userId, { isSuspended: !isSuspended });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm(`WARNING: This is permanent. Are you sure you want to delete this user?`)) {
            await deleteDoc(doc(db, "users", userId));
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    if (loading && page === 1) {
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
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className={`border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 ${user.isSuspended ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.username || 'N/A'}</td>
                                <td className="px-6 py-4">{user.email || 'N/A'}</td>
                                <td className="px-6 py-4">{user.level || 'A1'}</td>
                                <td className="px-6 py-4">{user.points || 0}</td>
                                <td className="px-6 py-4">{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    {user.isSuspended ? <span className="text-orange-500 font-bold">Suspended</span> : <span className="text-green-500">Active</span>}
                                </td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => setEditingUser(user)} className="text-sky-500 hover:text-sky-700"><Edit size={18}/></button>
                                    <button onClick={() => handleSuspendUser(user.id, user.isSuspended)} className="text-orange-500 hover:text-orange-700"><ShieldOff size={18}/></button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateUser} />}
        </div>
    );
};

export default UserManagement;
