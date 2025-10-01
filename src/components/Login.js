// src/components/Login.js

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
// --- ✅ 1. استيراد useAppContext للوصول إلى دالة جوجل ---
import { useAppContext } from '../context/AppContext';
// ✅ إضافة LoaderCircle للتحميل
import { LoaderCircle } from 'lucide-react';

const Login = ({ onRegisterClick }) => {
    const { handleGoogleSignIn } = useAppContext(); // <-- ✅ 2. جلب الدالة
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // ✅ إضافة states للتحميل
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsEmailLoading(true); // ✅ إضافة
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError('فشل في تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.');
        } finally {
            setIsEmailLoading(false); // ✅ إضافة
        }
    };

    // ✅ دالة جديدة لمعالجة تسجيل الدخول بجوجل
    const handleGoogleClick = async () => {
        setIsGoogleLoading(true);
        try {
            await handleGoogleSignIn();
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="text-center animate-fade-in p-6 z-10 relative flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">أهلاً بعودتك!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">سجل الدخول لتكمل رحلتك الكونية.</p>
                <form onSubmit={handleLogin}>
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
                    <button 
                        type="submit" 
                        disabled={isEmailLoading} 
                        className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isEmailLoading ? (
                            <>
                                <LoaderCircle className="animate-spin" size={20} />
                                جاري تسجيل الدخول...
                            </>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </button>
                </form>

                {/* --- ✅ 3. إضافة الزر والفاصل --- */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400">أو</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>

                <button
                    onClick={handleGoogleClick}
                    disabled={isGoogleLoading}
                    className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 px-8 rounded-full text-lg border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isGoogleLoading ? (
                        <>
                            <LoaderCircle className="animate-spin" size={20} />
                            <span>جاري تسجيل الدخول...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z"/>
                                <path fill="#34A853" d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98,.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z"/>
                                <path fill="#FBBC05" d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43,.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z"/>
                                <path fill="#EA4335" d="M12,5.38c1.62,0,3.06,.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z"/>
                            </svg>
                            <span>المتابعة باستخدام جوجل</span>
                        </>
                    )}
                </button>
                {/* --- نهاية الإضافة --- */}

                <p className="mt-6 text-slate-600 dark:text-slate-300">
                    ليس لديك حساب؟{' '}
                    <button onClick={onRegisterClick} className="text-sky-500 dark:text-sky-400 font-semibold hover:underline">
                        أنشئ حسابًا جديدًا
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
