// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // (إضافة)
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../firebase';
import { initialLessonsData } from '../data/lessons';
import { useAppContext } from '../context/AppContext';
import { LoaderCircle } from 'lucide-react';

const Register = () => { // (إزالة) onLoginClick
    const { handleGoogleSignIn, tempUserName } = useAppContext();
    const navigate = useNavigate(); // (إضافة)
    const [username, setUsername] = useState(tempUserName || '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const finalUsername = username.trim();

        if (finalUsername.length < 3) {
            setError('يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل.');
            setIsLoading(false);
            return;
        }

        try {
            const tempLevel = JSON.parse(localStorage.getItem('stellarSpeakTempLevel')) || 'A1';
            const visitorLessons = JSON.parse(localStorage.getItem('stellarSpeakVisitorLessons')) || initialLessonsData;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: finalUsername
            });

            await setDoc(doc(db, "users", user.uid), {
                username: finalUsername,
                email: email,
                createdAt: serverTimestamp(),
                points: 0,
                level: tempLevel,
                lessonsData: visitorLessons,
                earnedCertificates: [],
                unlockedAchievements: [],
                myVocabulary: [],
                reviewSchedule: {
                    lessons: {},
                    vocabulary: {}
                },
                avatarId: 'avatar1'
            });
            
            localStorage.removeItem('stellarSpeakTempLevel');
            localStorage.removeItem('stellarSpeakTempName');
            localStorage.removeItem('stellarSpeakVisitorLessons');
            
            navigate('/dashboard'); // (إضافة) الانتقال بعد النجاح

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

    const handleGoogleClick = async () => {
        setIsGoogleLoading(true);
        try {
            await handleGoogleSignIn();
            navigate('/dashboard'); // (إضافة) الانتقال بعد النجاح
        } catch(err) {
            setError('فشل التسجيل باستخدام جوجل. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="text-center animate-fade-in p-6 z-10 relative flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">أنشئ حسابًا لحفظ تقدمك</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">احفظ شهاداتك وتقدمك للأبد!</p>
                <form onSubmit={handleRegister}>
                    {/* ... (باقي حقول الإدخال تبقى كما هي) ... */}
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="اسم المستخدم (سيظهر في الشهادات)"
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
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin" size={20} />
                                جارِ الإنشاء...
                            </>
                        ) : (
                            'إنشاء حساب'
                        )}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    {/* ... (فاصل "أو" يبقى كما هو) ... */}
                </div>

                <button
                    onClick={handleGoogleClick}
                    disabled={isGoogleLoading}
                    className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 px-8 rounded-full text-lg border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {/* ... (زر جوجل يبقى كما هو) ... */}
                </button>
                <p className="mt-6 text-slate-600 dark:text-slate-300">
                    لديك حساب بالفعل؟{' '}
                    {/* (تعديل) */}
                    <Link to="/login" className="text-sky-500 dark:text-sky-400 font-semibold hover:underline">
                        سجل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
