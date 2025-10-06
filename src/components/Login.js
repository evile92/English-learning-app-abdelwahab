// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // (إضافة)
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useAppContext } from '../context/AppContext';
import { LoaderCircle } from 'lucide-react';

const Login = () => { // (إزالة) onRegisterClick
    const { handleGoogleSignIn } = useAppContext();
    const navigate = useNavigate(); // (إضافة)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsEmailLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); // (إضافة) الانتقال بعد النجاح
        } catch (err) {
            setError('فشل في تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.');
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleGoogleClick = async () => {
        setIsGoogleLoading(true);
        try {
            await handleGoogleSignIn();
            navigate('/dashboard'); // (إضافة) الانتقال بعد النجاح
        } catch (err) {
             setError('فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.');
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
                                {/* SVG paths */}
                            </svg>
                            <span>المتابعة باستخدام جوجل</span>
                        </>
                    )}
                </button>

                <p className="mt-6 text-slate-600 dark:text-slate-300">
                    ليس لديك حساب؟{' '}
                    {/* (تعديل) */}
                    <Link to="/register" className="text-sky-500 dark:text-sky-400 font-semibold hover:underline">
                        أنشئ حسابًا جديدًا
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
