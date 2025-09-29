import React, { useState, useEffect } from 'react';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { auth, db } from '../firebase';
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAppContext } from '../context/AppContext';
import { avatarList } from '../data/avatars';

const EditProfilePage = () => {
    // ✅ --- الخطوة 1: إضافة setUserData من الـ context ---
    const { userData, handleBackToProfile, setUserData } = useAppContext();

    const [newUsername, setNewUsername] = useState(userData?.username || '');
    const [selectedAvatar, setSelectedAvatar] = useState(userData?.avatarId || 'avatar1');
    const [dailyGoal, setDailyGoal] = useState(userData?.dailyGoal || 10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (userData) {
            setDailyGoal(userData.dailyGoal || 10);
        }
    }, [userData]);


    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (newUsername.length < 6) {
            setError('يجب أن يتكون اسم المستخدم من 6 أحرف على الأقل.');
            setIsLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;
            if (user) {
                if (newUsername !== userData.username) {
                    await updateProfile(user, { displayName: newUsername });
                }

                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, { 
                    username: newUsername,
                    avatarId: selectedAvatar,
                    dailyGoal: Number(dailyGoal) 
                });

                // ✅ --- الخطوة 2: تحديث النسخة المحلية من البيانات ---
                setUserData(prevData => ({
                    ...prevData,
                    username: newUsername,
                    avatarId: selectedAvatar,
                    dailyGoal: Number(dailyGoal)
                }));

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
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
             <button onClick={handleBackToProfile} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى الملف الشخصي</button>
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">تعديل الملف الشخصي</h1>
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
                            placeholder="6 أحرف على الأقل"
                            required
                            className="w-full p-3 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-700 dark:text-slate-300 mb-3 font-semibold">
                            اختر صورتك الرمزية
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {avatarList.map(avatar => (
                                <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => setSelectedAvatar(avatar.id)}
                                    className={`rounded-full p-1 transition-all duration-300 ${
                                        selectedAvatar === avatar.id 
                                        ? 'ring-4 ring-sky-500' 
                                        : 'ring-2 ring-transparent hover:ring-sky-300'
                                    }`}
                                >
                                    <img 
                                        src={avatar.src} 
                                        alt={`Avatar ${avatar.id}`} 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="dailyGoal" className="block text-slate-700 dark:text-slate-300 mb-3 font-semibold">
                            الهدف اليومي للتعلم: <span className="font-black text-sky-500">{dailyGoal} دقيقة</span>
                        </label>
                        <input
                            id="dailyGoal"
                            type="range"
                            min="5"
                            max="120"
                            step="5"
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(e.target.value)}
                            className="w-full mt-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>5 دقائق</span>
                            <span>ساعتان</span>
                        </div>
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
                        {isLoading ? 'جارِ الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
