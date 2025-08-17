import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // 1. استيراد دالة تحديث الملف الشخصي
import { auth } from '../firebase'; 

const Register = ({ onLoginClick }) => {
    // 2. إضافة حالة لاسم المستخدم
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // 3. إضافة تحقق لطول اسم المستخدم
        if (username.length < 6) {
            setError('يجب أن يتكون اسم المستخدم من 6 أحرف على الأقل.');
            return;
        }

        try {
            // 4. إنشاء المستخدم كالمعتاد
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 5. تحديث الملف الشخصي للمستخدم لإضافة اسم المستخدم
            await updateProfile(userCredential.user, {
                displayName: username
            });

        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('هذا البريد الإلكتروني مستخدم بالفعل.');
            } else {
                setError('فشل في إنشاء الحساب. تأكد من أن كلمة المرور قوية.');
            }
        }
    };

    return (
        <div className="text-center animate-fade-in p-6 z-10 relative flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">أنشئ حسابًا جديدًا</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">انضم إلى مجرة Stellar Speak!</p>
                <form onSubmit={handleRegister}>
                    {/* 6. إضافة حقل إدخال اسم المستخدم */}
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
                    <button type="submit" className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all">
                        إنشاء حساب
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
