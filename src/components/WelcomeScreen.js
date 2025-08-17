import React from 'react';
import StellarSpeakLogo from './StellarSpeakLogo';

const WelcomeScreen = ({ onStart }) => (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in z-10 relative">
        <StellarSpeakLogo />
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mt-4 dark:text-shadow" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>Stellar Speak</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 mt-4 mb-8 max-w-lg">انطلق في رحلة كونية لتعلم الإنجليزية، من كوكب المبتدئين إلى سديم الحكمة.</p>
        <button onClick={onStart} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50">ابدأ رحلتك الكونية ✨</button>
    </div>
);

export default WelcomeScreen;
