import React, { useState } from 'react';

const NameEntryScreen = ({ onNameSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };

    return (
        <div className="text-center animate-fade-in p-6 z-10 relative flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">خطوة أخيرة!</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                    ما هو الاسم الذي تحب أن يظهر على شهاداتك؟
                </p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اكتب اسمك هنا..."
                        className="w-full p-3 text-lg text-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                    />
                    <button type="submit" className="mt-6 w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all">
                        انطلق إلى لوحة التحكم
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NameEntryScreen;
