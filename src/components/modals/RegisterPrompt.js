import React from 'react';
import { Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPrompt() {
    const { showRegisterPrompt, setShowRegisterPrompt } = useAppContext();
    const navigate = useNavigate();

    if (!showRegisterPrompt) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-slate-200 dark:border-slate-700">
                <Save className="mx-auto text-sky-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">لا تفقد تقدمك!</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">
                    لقد بدأت رحلتك التعليمية بنجاح. أنشئ حسابًا مجانيًا الآن لحفظ تقدمك، وجمع النقاط، والوصول إلى جميع الميزات من أي جهاز.
                </p>
                <div className="space-y-3">
                    {/* زر إنشاء الحساب - تصميم عصري */}
                    <button
                        onClick={() => {
                            setShowRegisterPrompt(false);
                            navigate('/register');
                        }}
                        className="relative w-full overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 group"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            <div className="p-1 bg-white/20 rounded-full">
                                <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                                    />
                                </svg>
                            </div>
                            <span>إنشاء حساب (موصى به)</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </button>

                    {/* زر المتابعة كزائر - تصميم مطابق */}
                    <button
                        onClick={() => setShowRegisterPrompt(false)}
                        className="relative w-full bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-medium py-4 px-6 rounded-2xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800 border border-slate-200 dark:border-slate-600 group overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            <svg 
                                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                />
                            </svg>
                            <span>المتابعة كزائر</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
