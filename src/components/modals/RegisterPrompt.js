import React from 'react';
import { Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function RegisterPrompt() {
    const { showRegisterPrompt, setShowRegisterPrompt, setPage } = useAppContext();

    if (!showRegisterPrompt) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-slate-200 dark:border-slate-700">
                <Save className="mx-auto text-sky-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">لا تفقد تقدمك!</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">
                    لقد بدأت رحلتك التعليمية بنجاح. أنشئ حسابًا مجانيًا الآن لحفظ تقدمك، وجمع النقاط، والوصول إلى جميع الميزات من أي جهاز.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => {
                            setShowRegisterPrompt(false);
                            setPage('register');
                        }}
                        className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all"
                    >
                        إنشاء حساب (موصى به)
                    </button>
                    <button 
                        onClick={() => setShowRegisterPrompt(false)}
                        className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                        المتابعة كزائر
                    </button>
                </div>
            </div>
        </div>
    );
}
