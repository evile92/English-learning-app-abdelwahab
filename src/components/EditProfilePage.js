// src/components/EditProfilePage.js

import React, { useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAppContext } from '../context/AppContext';
// --- [الإضافة 1] ---
// استيراد قائمة وصور الأفاتار
import { avatarList, getAvatarById } from '../data/avatars';

const EditProfilePage = () => {
    // --- [الإضافة 2] ---
    // إضافة setUserData لتحديث الواجهة فوراً بعد الحفظ
    const { userData, handleBackToProfile, setUserData } = useAppContext();

    const [newUsername, setNewUsername] = useState(userData?.username || '');
    // --- [الإضافة 3] ---
    // حالات جديدة لتتبع الصورة المختارة وفتح نافذة الاختيار
    const [selectedAvatarId, setSelectedAvatarId] = useState(userData?.avatarId || 'avatar1');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (newUsername.length < 3) { // تم تعديل الشرط ليناسب المنطق الجديد في ملف التسجيل
            setError('يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل.');
            setIsLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, { displayName: newUsername });
                const userDocRef = doc(db, "users", user.uid);
                // --- [الإضافة 4] ---
                // إضافة avatarId إلى البيانات التي سيتم تحديثها في قاعدة البيانات
                await updateDoc(userDocRef, { 
                    username: newUsername,
                    avatarId: selectedAvatarId
                });

                // تحديث الحالة المحلية فوراً لتعكس التغييرات في كل التطبيق
                if (setUserData) {
                    setUserData(prev => ({...prev, username: newUsername, avatarId: selectedAvatarId}));
                }

                setSuccess('تم تحديث ملفك الشخصي بنجاح!');
            }
        } catch (err) {
            console.error("Error updating profile: ", err);
            setError('فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <>
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={handleBackToProfile} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى الملف الشخصي</button>
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">تعديل الملف الشخصي</h1>
                
                {/* --- [الإضافة 5] --- */}
                {/* قسم جديد لاختيار الصورة الرمزية */}
                <div className="flex flex-col items-center mb-6">
                    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-semibold">
                        صورتك الرمزية
                    </label>
                    <button type="button" onClick={() => setIsAvatarModalOpen(true)} className="rounded-full ring-2 ring-offset-4 ring-sky-500 ring-offset-slate-100 dark:ring-offset-slate-800 hover:scale-105 transition-transform">
                        <img 
                            src={getAvatarById(selectedAvatarId)} 
                            alt="Selected Avatar" 
                            className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700"
                        />
                    </button>
                </div>

                <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-slate-700 dark:text-slate-300 mb-2 font-semibold">
                            اسم المستخدم الجديد
                        </label>
                        <input 
                            type="text"
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="3 أحرف على الأقل"
                            required
                            className="w-full p-3 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                        />
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? <LoaderCircle className="animate-spin" /> : 'حفظ التغييرات'}
                    </button>
                </form>
            </div>
        </div>

        {/* --- [الإضافة 6] --- */}
        {/* نافذة منبثقة لاختيار الصورة */}
        {isAvatarModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsAvatarModalOpen(false)}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">اختر صورتك الرمزية</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {avatarList.map(avatar => (
                            <button
                                key={avatar.id}
                                type="button"
                                onClick={() => {
                                    setSelectedAvatarId(avatar.id);
                                    setIsAvatarModalOpen(false);
                                }}
                                className={`rounded-full p-1 transition-all ${selectedAvatarId === avatar.id ? 'ring-4 ring-sky-500' : 'hover:ring-2 hover:ring-sky-400'}`}
                            >
                                <img src={avatar.src} alt={`Avatar ${avatar.id}`} className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default EditProfilePage;
