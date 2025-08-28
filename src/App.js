// src/App.js

import React, { useEffect, useState } from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageRouter from './components/PageRouter';
import ProfileModal from './components/ProfileModal';
import { Award, FileText, X, Feather, Mic, History, Search, User, Target, Info, Mail, Save, Check, BookText } from 'lucide-react';
import StellarSpeakLogo from './components/StellarSpeakLogo';

const moreMenuItems = [
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'review', label: 'مراجعة', icon: History },
    { id: 'weakPoints', label: 'نقاط ضعفي', icon: Target },
    { id: 'grammar', label: 'دليل القواعد', icon: BookText },
    { id: 'profile', label: 'ملفي الشخصي', icon: User },
    { id: 'about', label: 'عن الموقع', icon: Info },
    { id: 'contact', label: 'اتصل بنا', icon: Mail },
];

export default function App() {
  const { 
    isDarkMode, isProfileModalOpen, isMoreMenuOpen, 
    setIsMoreMenuOpen, newlyUnlockedAchievement, setNewlyUnlockedAchievement,
    user, userName, setIsDarkMode, handlePageChange, handleLogout,
    setIsProfileModalOpen, userLevel, page, setPage, authStatus, isSyncing,
    examPromptForLevel, setExamPromptForLevel, startFinalExam,
    showRegisterPrompt, setShowRegisterPrompt,
    dailyGoal, timeSpent, setTimeSpent
  } = useAppContext();

  const [showGoalReachedPopup, setShowGoalReachedPopup] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    let dailyGoalAchievedToday = localStorage.getItem('dailyGoalAchievedDate') === today;

    if (timeSpent.date !== today) {
        setTimeSpent({ time: 0, date: today });
        dailyGoalAchievedToday = false;
        localStorage.removeItem('dailyGoalAchievedDate');
    }
    
    const interval = setInterval(() => {
        if (document.hidden || dailyGoalAchievedToday) {
            return;
        }

        setTimeSpent(prev => {
            const newTime = prev.time + 10;
            if (newTime >= dailyGoal * 60) {
                if (!dailyGoalAchievedToday) {
                    setShowGoalReachedPopup(true);
                    localStorage.setItem('dailyGoalAchievedDate', today);
                }
                dailyGoalAchievedToday = true;
            }
            return { ...prev, time: newTime };
        });

    }, 10000);

    return () => clearInterval(interval);
  }, [dailyGoal, timeSpent, setTimeSpent]);

  const handleStartExamFromPrompt = () => {
    startFinalExam(examPromptForLevel);
    setExamPromptForLevel(null);
  };

  if (authStatus === 'loading' || isSyncing) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
      </div>
    );
  }

  return (
    <>
      <div id="background-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
          <div id="nebula-bg"></div>
          <div id="stars-bg"></div>
      </div>
      
      {!isDarkMode && (
        <div id="light-background-container" className="fixed inset-0 z-0 overflow-hidden">
           <div id="light-stars"></div>
           <div id="light-twinkles"></div>
           <div id="light-nebula"></div>
        </div>
      )}

      <div 
        className={`relative z-10 min-h-screen font-sans 
            ${isDarkMode 
                ? 'bg-transparent text-slate-200' 
                : 'bg-transparent text-slate-800'
            }`
        }
      >
        <Header />

        <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8">
            <PageRouter />
        </main>
        
        {newlyUnlockedAchievement && (
          <div 
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 border border-amber-400 dark:border-amber-500 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in"
              onClick={() => setNewlyUnlockedAchievement(null)}
          >
              <p className="text-sm font-semibold text-amber-500">إنجاز جديد!</p>
              <div className="text-7xl my-4">{newlyUnlockedAchievement.emoji}</div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{newlyUnlockedAchievement.name}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{newlyUnlockedAchievement.description}</p>
              <button 
                  onClick={() => setNewlyUnlockedAchievement(null)} 
                  className="mt-6 w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg"
              >
                  رائع!
              </button>
          </div>
        )}
        {examPromptForLevel && (
            <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
              <button
                onClick={handleStartExamFromPrompt}
                className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 animate-pulse"
              >
                <Award size={20} />
                <span>ابدأ الامتحان النهائي للمستوى {examPromptForLevel}</span>
              </button>
            </div>
        )}
        { !userLevel && (page !== 'welcome' && page !== 'test' && page !== 'nameEntry') && (
            <div className="fixed bottom-24 md:bottom-10 right-10 z-50 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg mb-2 text-center border border-slate-200 dark:border-slate-700 max-w-xs">
                    <p className="font-semibold text-slate-800 dark:text-white">حدد مستواك للبدء!</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">أجرِ اختبار تحديد المستوى لفتح الدروس.</p>
                </div>
                <button
                    onClick={() => setPage('test')}
                    className="w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <FileText size={20} />
                    <span>ابدأ الاختبار</span>
                </button>
            </div>
        )}
        {isProfileModalOpen && (
            <ProfileModal 
                user={user}
                userName={userName}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                handlePageChange={handlePageChange}
                handleLogout={handleLogout}
                onClose={() => setIsProfileModalOpen(false)}
            />
        )}
        {isMoreMenuOpen && (
            <div 
                onClick={() => setIsMoreMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-black/40 z-40 animate-fade-in-fast"
            >
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className={`fixed bottom-0 left-0 right-0 p-4 pb-20 rounded-t-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">جميع الميزات</h3>
                        <button onClick={() => setIsMoreMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <X size={20} />
                        </button>
                    </div>
                    {/* --- ✅ بداية التعديل --- */}
                    <div className="flex flex-col gap-2">
                        {moreMenuItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => { handlePageChange(item.id); setIsMoreMenuOpen(false); }}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-right"
                            >
                                <item.icon size={24} className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    {/* --- 🛑 نهاية التعديل --- */}
                </div>
            </div>
        )}
        {showRegisterPrompt && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div 
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-slate-200 dark:border-slate-700"
                >
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
        )}
        {showGoalReachedPopup && (
            <div 
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 border border-green-400 dark:border-green-500 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in"
            >
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">أحسنت!</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1">لقد أكملت هدفك اليومي وهو {dailyGoal} دقيقة من التعلم. استمر في هذا العمل الرائع!</p>
                <button 
                    onClick={() => setShowGoalReachedPopup(false)} 
                    className="mt-6 w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg"
                >
                    إغلاق
                </button>
            </div>
        )}

        <Footer />
      </div>
      
      <style jsx global>{`
        #background-container {
          pointer-events: none;
          overflow: hidden;
          background-color: #0f172a;
        }
        @keyframes move-background {
          from { transform: translateX(0); }
          to { transform: translateX(-66.66%); }
        }
        @keyframes twinkle-stars {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        #nebula-bg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
          opacity: 0.1;
        }
        #stars-bg {
          position: absolute;
          top: 0; left: 0;
          width: 300%; height: 100%;
          background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
          background-size: auto;
          animation: 
            move-background 200s linear infinite,
            twinkle-stars 7s ease-in-out infinite alternate;
        }

        #light-background-container {
          background: linear-gradient(to bottom right, #e0f2fe, #dbeafe);
        }
        
        #light-stars, #light-twinkles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            display: block;
        }

        #light-stars {
            background-image: 
                radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                radial-gradient(3px 3px at 50px 160px, #ddd, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: zoom-in-out 200s ease infinite;
        }

        #light-twinkles {
            background-image: 
                radial-gradient(1px 1px at 10px 90px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 70px 20px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 100px 150px, #ddd, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 180px 60px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 140px 110px, #fff, rgba(0,0,0,0)),
                radial-gradient(3px 3px at 190px 140px, #ddd, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 300px 300px;
            animation: twinkle-light 5s ease-in-out infinite alternate;
        }
        
        #light-nebula {
            position: absolute;
            width: 100vw;
            height: 100vh;
            bottom: -40vh;
            right: -50vw;
            background: radial-gradient(ellipse at center, rgba(147, 197, 253, 0.2) 0%, rgba(255, 255, 255, 0) 60%);
            opacity: 0.5;
            animation: drift 120s linear infinite alternate;
        }

        @keyframes zoom-in-out {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        @keyframes twinkle-light {
            0% { opacity: 0.1; }
            100% { opacity: 0.5; }
        }
        
        @keyframes drift {
            from { transform: translateX(-10vw) translateY(-10vh); }
            to { transform: translateX(10vw) translateY(10vh); }
        }
        
        .animate-fade-in-fast { 
          animation: fadeIn 0.2s ease-in-out; 
        }
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
      `}</style>
    </>
  );
}
