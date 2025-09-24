// src/components/admin/UserManagement.js

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, endBefore, limitToLast } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, Search, Loader, AlertCircle, Edit, ShieldOff, Trash2 } from 'lucide-react';
import UserDetailsModal from './UserDetailsModal'; // <-- (إضافة 1): استيراد المكون الجديد

// --- EditUserModal component remains the same ---
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
    const [detailsUser, setDetailsUser] = useState(null); // <-- (إضافة 2): حالة جديدة لعرض نافذة التفاصيل

    // --- Pagination State ---
    const [page, setPage] = useState(1);
    const [firstVisible, setFirstVisible] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [isLastPage, setIsLastPage] = useState(false);
    const USERS_PER_PAGE = 8;

    const fetchUsers = async (pageQuery) => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(pageQuery);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (!querySnapshot.empty) {
                setFirstVisible(querySnapshot.docs[0]);
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
                setUsers(usersList);
                // Check if this is the last page
                const nextQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), limit(1));
                const nextSnapshot = await getDocs(nextQuery);
                setIsLastPage(nextSnapshot.empty);
            } else {
                 setIsLastPage(true);
            }
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const initialQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(USERS_PER_PAGE));
        fetchUsers(initialQuery);
    }, []);

    const nextPage = () => {
        if (!isLastPage) {
            const nextQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(USERS_PER_PAGE));
            fetchUsers(nextQuery);
            setPage(p => p + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            const prevQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), endBefore(firstVisible), limitToLast(USERS_PER_PAGE));
            fetchUsers(prevQuery);
            setPage(p => p - 1);
        }
    };

    const handleUpdateUser = (userId, updatedData) => setUsers(users.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    const handleSuspendUser = async (userId, isSuspended) => {
        if (window.confirm(`Are you sure you want to ${isSuspended ? 'unsuspend' : 'suspend'} this user?`)) {
            await updateDoc(doc(db, 'users', userId), { isSuspended: !isSuspended });
            handleUpdateUser(userId, { isSuspended: !isSuspended });
        }
    };
    const handleDeleteUser = async (userId) => {
        if (window.confirm(`WARNING: This is permanent. Are you sure you want to delete this user?`)) {
            await deleteDoc(doc(db, "users", userId));
            setUsers(users.filter(u => u.id !== userId));
        }
    };
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);
    

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Users /> User Management</h2>
            
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" placeholder="Search (only on current page)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700" />
                </div>
            </div>

            {loading && <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>}
            {error && <div className="text-red-500 p-4 bg-red-100 rounded-lg"><AlertCircle className="inline mr-2"/>{error}</div>}
            
            {!loading && !error && (
                <>
                    <div className="overflow-x-auto bg-white dark:bg-slate-800/50 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase">
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
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.username}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.level}</td>
                                        <td className="px-6 py-4">{user.points}</td>
                                        <td className="px-6 py-4">{user.createdAt?.toDate().toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            {user.isSuspended ? <span className="text-orange-500 font-bold">Suspended</span> : <span className="text-green-500">Active</span>}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            {/* --- (إضافة 3): زر "التفاصيل" --- */}
                                            <button onClick={() => setDetailsUser(user)} className="text-blue-500 hover:underline">Details</button>
                                            <button onClick={() => setEditingUser(user)}><Edit size={18}/></button>
                                            <button onClick={() => handleSuspendUser(user.id, user.isSuspended)}><ShieldOff size={18}/></button>
                                            <button onClick={() => handleDeleteUser(user.id)}><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Pagination Controls --- */}
                    <div className="mt-4 flex justify-between items-center">
                        <button onClick={prevPage} disabled={page === 1} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <span className="text-slate-600 dark:text-slate-300">Page {page}</span>
                        <button onClick={nextPage} disabled={isLastPage} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </>
            )}
            
            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateUser} />}
            {/* --- (إضافة 4): عرض نافذة التفاصيل عند اختيار مستخدم --- */}
            {detailsUser && <UserDetailsModal user={detailsUser} onClose={() => setDetailsUser(null)} />}
        </div>
    );
};

export default UserManagement;
