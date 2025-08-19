import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../firebase';
import { initialLessonsData } from '../data/lessons'; // <-- **إضافة مهمة**

const Register = ({ onLoginClick }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (username.length < 6) {
            setError('يجب أن يتكون اسم المستخدم من 6 أحرف على الأقل.');
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: username
            });

            // --- (بداية التعديل): إضافة حقل "قاموسي" للمستخدم الجديد ---
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: serverTimestamp(),
                points: 0,
                level: 'A1', // يتم تحديد المستوى A1 افتراضياً عند التسجيل
                earnedCertificates: [],
                lessonsData: initialLessonsData, // <-- **هذا السطر هو الحل النهائي للمشكلة**
                unlockedAchievements: [],
                myVocabulary: [] // <-- هذا هو السطر الذي تمت إضافته
            });
            // --- (نهاية التعديل) ---

        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('هذا البريد الإلكتروني مستخدم بالفعل.');
            } else {
                setError('فشل في إنشاء الحساب. تأكد من أن كلمة المرور قوية.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-center animate-fade-in p-6 z-10 relative flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">أنشئ حسابًا جديدًا</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">انضم إلى مجرة Stellar Speak!</p>
                <form onSubmit={handleRegister}>
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="اسم المستخدم (6 أحرف على الأقل)"
                        required
                        className="w-full p-3 mb-4 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                    />
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="البريد الإلكتروني"
                        required
                        className="w-full p-3 mb-4 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                    />
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="كلمة المرور"
                        required
                        className="w-full p-3 mb-4 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all disabled:opacity-50">
                        {isLoading ? 'جارِ الإنشاء...' : 'إنشاء حساب'}
                    </button>
                </form>
                <p className="mt-6 text-slate-600 dark:text-slate-300">
                    لديك حساب بالفعل؟{' '}
                    <button onClick={onLoginClick} className="text-sky-500 dark:text-sky-400 font-semibold hover:underline">
                        سجل الدخول
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
