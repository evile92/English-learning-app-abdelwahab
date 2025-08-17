import React, { useState } from 'react';
import { Voicemail, LoaderCircle, Mic } from 'lucide-react';

const PronunciationCoach = () => {
    const [text, setText] = useState('Hello, how are you today?');
    const [status, setStatus] = useState('idle');

    const handleListen = () => {
        if (!text.trim() || typeof window.speechSynthesis === 'undefined') {
            setStatus('error');
            return;
        }
        setStatus('speaking');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onend = () => setStatus('idle');
        utterance.onerror = () => setStatus('error');
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Voicemail /> مدرب النطق</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">اكتب أي جملة باللغة الإنجليزية واستمع إلى النطق الصحيح.</p>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب نصًا هنا..." className="w-full h-40 p-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all" dir="ltr"></textarea>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={handleListen} disabled={status === 'speaking'} className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                        {status === 'speaking' ? <LoaderCircle className="animate-spin" /> : <>🎧 استمع</>}
                    </button>
                    <button disabled className="w-full bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                        <Mic size={18} /> سجل صوتك (قريبًا)
                    </button>
                </div>
                {status === 'error' && <p className="text-red-500 mt-4 text-center">عذرًا، حدث خطأ أو أن متصفحك لا يدعم هذه الميزة.</p>}
            </div>
        </div>
    );
};

export default PronunciationCoach;
