// src/components/admin/UserManagement.js

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, Search, Loader, AlertCircle, MoreVertical, Edit, Trash2, ShieldOff, ChevronLeft, ChevronRight } from 'lucide-react';

// مكون جديد لنافذة التعديل المنبثقة
const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [username, setUsername] = useState(user.username || '');
    const [level, setLevel] = useState(user.level || 'A1');
    const [points, setPoints] = useState(user.points || 0);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin || false);

    const handleSave = async () => {
        const updates = {
            username,
            level,
            points: Number(points),
            isAdmin
        };
        const userDocRef = doc(db, 'users', user.id);
        await updateDoc(userDocRef, updates);
        onUpdate(user.id, updates);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit User: {user.username}</h3>
                {/* ... (حقول التعديل) ... */}
                <button onClick={handleSave} className="bg-sky-500 text-white px-4 py-2 rounded-lg">Save</button>
                <button onClick={onClose} className="ml-2 bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
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

    // --- Pagination State ---
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
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
                setFirstVisible(querySnapshot.docs[0]);
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
    
    // ... (الكود السابق) ...

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Users /> User Management</h2>
            
            {/* ... (شريط البحث) ... */}

            <div className="overflow-x-auto bg-white dark:bg-slate-800/50 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left">
                    {/* ... (رأس الجدول) ... */}
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className={`${user.isSuspended ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                {/* ... (بيانات المستخدم) ... */}
                                <td className="px-6 py-4">
                                    <button onClick={() => setEditingUser(user)} className="text-sky-500 hover:underline">Edit</button>
                                    <button onClick={() => handleSuspendUser(user.id, user.isSuspended)} className="ml-4 text-orange-500 hover:underline">
                                        {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* --- Pagination Controls --- */}
            <div className="mt-4 flex justify-between items-center">
                <button onClick={() => {}} disabled={page === 1} className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-50">Previous</button>
                <span>Page {page}</span>
                <button onClick={() => fetchUsers('next')} className="px-4 py-2 bg-slate-200 rounded-lg">Next</button>
            </div>
            
            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateUser} />}
        </div>
    );
};

export default UserManagement;
