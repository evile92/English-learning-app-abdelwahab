import React from 'react';
import { Download, Award } from 'lucide-react';

const Certificate = ({ levelId, userName, onDownload, initialLevels }) => {
    // هذا الكود يحل مشكلة لون الخط في الوضع النهاري التي ذكرتها
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? 'text-white' : 'text-slate-800';
    const subtitleColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';

    return (
        <div className="p-4 md:p-8 animate-fade-in text-center flex flex-col items-center z-10 relative">
            <h1 className={`text-3xl font-bold ${textColor} mb-2`}>تهانينا! 🏆</h1>
            <p className={`${subtitleColor} mb-6 max-w-lg`}>
                لقد أكملت بنجاح جميع متطلبات {initialLevels[levelId].name}. تقديرًا لجهودك، نفخر بمنحك هذه الشهادة.
            </p>
            
            {/* --- بداية التصميم الجديد للشهادة --- */}
            <div 
                className="w-full max-w-3xl aspect-[1.414] bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-amber-400 p-2 rounded-lg shadow-2xl relative overflow-hidden"
                style={{ fontFamily: "'Times New Roman', serif" }}
            >
                {/* خلفية النجوم */}
                <div id="stars-container" className="absolute inset-0 opacity-40"> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
                
                {/* الإطار الداخلي المنقط */}
                <div className="w-full h-full border-2 border-dashed border-amber-300/50 rounded-md p-6 flex flex-col items-center justify-between relative text-white">
                    
                    {/* الجزء العلوي: العنوان والشعار */}
                    <div className="text-center">
                        <p className="text-xl font-semibold tracking-widest text-amber-200">CERTIFICATE OF ACHIEVEMENT</p>
                        <p className="text-md text-slate-300">شهادة إنجاز</p>
                    </div>

                    {/* أيقونة الشريط الذهبي */}
                    <div className="my-4">
                        <svg className="w-24 h-24 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" fill="#ffd700"/>
                          <path d="M12 4.13l1.94 4.41l4.86.42l-3.51 3.42l.83 4.85L12 14.7l-4.12 2.53l.83-4.85l-3.51-3.42l4.86-.42L12 4.13M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" fill="url(#gold-gradient)"/>
                          <defs>
                            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" style={{stopColor: '#FFDF00'}} />
                              <stop offset="100%" style={{stopColor: '#B8860B'}} />
                            </linearGradient>
                          </defs>
                        </svg>
                    </div>

                    {/* نص الشهادة */}
                    <div className="text-center">
                        <p className="text-lg text-slate-300 mb-2">This is to certify that</p>
                        <p className="text-4xl font-bold text-sky-300 tracking-wider my-2">{userName || 'Stellar Student'}</p>
                        <p className="text-lg text-slate-300 mt-2 max-w-md mx-auto">
                            has successfully completed all requirements for the
                        </p>
                        <p className="text-2xl font-semibold text-amber-200 mt-1">"{initialLevels[levelId].name}" - Level {levelId}</p>
                    </div>
                    
                    {/* الجزء السفلي: التاريخ والتوقيع */}
                    <div className="w-full flex justify-between items-end mt-8 text-slate-300">
                        <div className="text-center">
                            <p className="text-lg font-semibold border-b-2 border-slate-500 pb-1">{new Date().toLocaleDateString()}</p>
                            <p className="text-sm mt-1">Date</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold border-b-2 border-slate-500 pb-1" style={{ fontFamily: "'Brush Script MT', cursive" }}>Stellar Speak Academy</p>
                            <p className="text-sm mt-1">Signature</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- نهاية التصميم الجديد للشهادة --- */}
            
            <button onClick={onDownload} className="mt-8 bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"><Download size={20} /> تحميل والعودة للمجرة</button>
        </div>
    );
};

export default Certificate;
