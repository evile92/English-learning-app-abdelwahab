// src/App.js

import React from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageRouter from './components/PageRouter';
import ProfileModal from './components/ProfileModal';
import { FileText, X, Feather, Library, Mic, Voicemail, History, Search, User } from 'lucide-react'; // استيراد أيقونات إضافية
import StellarSpeakLogo from './components/StellarSpeakLogo';

// (بداية التصحيح) --- الخطوة 1: إعادة تعريف قائمة الأزرار المفقودة
const moreMenuItems = [
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'review', label: 'مراجعة', icon: History },
    { id: 'search', label: 'بحث', icon: Search },
    { id: 'profile', label: 'ملفي', icon: User },
];
// (نهاية التصحيح)

export default function App() {
  const { 
    isDarkMode, 
    isProfileModalOpen, 
    isMoreMenuOpen, // <-- جلب حالة قائمة "المزيد"
    setIsMoreMenuOpen, // <-- جلب دالة التعديل
    newlyUnlockedAchievement, 
    setNewlyUnlockedAchievement,
    user,
    userName,
    setIsDarkMode,
    handlePageChange,
    handleLogout,
    setIsProfileModalOpen,
    userLevel,
    page,
    setPage,
    authStatus,
    isSyncing
  } = useAppContext();

  if (authStatus === 'loading' || isSyncing) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
      </div>
    );
  }

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        
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
        
        {/* (بداية التصحيح) --- الخطوة 2: إعادة إضافة الكود الخاص بنافذة "المزيد" */}
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
                    <div className="grid grid-cols-3 gap-4">
                        {moreMenuItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => { handlePageChange(item.id); setIsMoreMenuOpen(false); }}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <item.icon size={24} className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        {/* (نهاية التصحيح) */}

        <Footer />

      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } .animate-fade-in-fast { animation: fadeIn 0.2s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </>
  );
  }
