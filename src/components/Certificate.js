import React from 'react';
import { Award, Download } from 'lucide-react';

const Certificate = ({ levelId, userName, onDownload, initialLevels }) => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const textColor = isDarkMode ? 'text-white' : 'text-slate-800';
    const subtitleColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';

    return (
        <div className="p-4 md:p-8 animate-fade-in text-center flex flex-col items-center z-10 relative">
            <h1 className={`text-3xl font-bold ${textColor} mb-2`}>تهانينا! 🏆</h1>
            <p className={`${subtitleColor} mb-6`}>لقد أكملت بنجاح متطلبات {initialLevels[levelId].name} وحصلت على هذه الشهادة.</p>
            <div className="w-full max-w-2xl aspect-[1.414] bg-slate-800/80 backdrop-blur-sm border-4 border-sky-400 p-8 rounded-lg shadow-2xl relative">
                <div className="text-center relative">
                    <Award size={60} className="mx-auto text-amber-400 mb-4" />
                    <p className="text-lg text-slate-300">Certificate of Achievement</p>
                    <h2 className="text-4xl font-bold text-sky-400 my-4">Level {levelId} Completion</h2>
                    <p className="text-lg text-slate-300">This certifies that</p>
                    <p className="text-3xl font-serif text-white my-4 border-b-2 border-dotted border-slate-500 pb-2">{userName || 'Stellar Student'}</p>
                    <p className="text-lg text-slate-300">has successfully completed all the requirements for Level {levelId} of the Stellar Speak program.</p>
                    <p className="mt-8 text-sm text-slate-400">Issued on: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <button onClick={onDownload} className="mt-8 bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"><Download size={20} /> تحميل والعودة للمجرة</button>
        </div>
    );
};

export default Certificate;
