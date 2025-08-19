// src/App.js

import React from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageRouter from './components/PageRouter';
import ProfileModal from './components/ProfileModal';
// استورد أي مكونات شاملة أخرى هنا مثل Modals

export default function App() {
  const { isDarkMode, isProfileModalOpen, newlyUnlockedAchievement, ...props } = useAppContext();

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        
        <Header />

        <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8">
            <PageRouter />
        </main>
        
        {/* يمكنك إضافة المكونات التي تظهر فوق كل شيء هنا */}
        {newlyUnlockedAchievement && (
          // ... كود نافذة الإنجاز الجديد
          <></>
        )}

        {isProfileModalOpen && (
            <ProfileModal 
                user={props.user}
                userName={props.userName}
                isDarkMode={isDarkMode}
                setIsDarkMode={props.setIsDarkMode}
                handlePageChange={props.handlePageChange}
                handleLogout={props.handleLogout}
                onClose={() => props.setIsProfileModalOpen(false)}
            />
        )}

        <Footer />

      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } .animate-fade-in-fast { animation: fadeIn 0.2s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </>
  );
}
