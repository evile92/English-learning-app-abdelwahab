// src/components/PageRouter.js

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Search } from 'lucide-react';

import WelcomeScreen from './WelcomeScreen';
import PlacementTest from './PlacementTest';
import NameEntryScreen from './NameEntryScreen';
import Dashboard from './Dashboard';
import LessonView from './LessonView';
import LessonContent from './LessonContent';
import WritingSection from './WritingSection';
import ReadingCenter from './ReadingCenter';
import RolePlaySection from './RolePlaySection';
import PronunciationCoach from './PronunciationCoach';
import ReviewSection from './ReviewSection';
import Login from './Login';
import Register from './Register';
import ProfilePage from './ProfilePage';
import EditProfilePage from './EditProfilePage';
import MyVocabulary from './MyVocabulary';
import ReviewSession from './ReviewSession';
import Certificate from './Certificate';
import FinalExam from './FinalExam';
import WeakPointsSection from './WeakPointsSection';
import WeakPointsQuiz from './WeakPointsQuiz';

const PageRouter = () => {
    const { 
        page, setPage, userLevel, user, certificateToShow, 
        searchQuery, setSearchQuery, searchResults, handleSearchSelect,
        handleTestComplete, initialLevels, handleNameSubmit, 
        userName, handleCertificateDownload
    } = useAppContext();

    if (!userLevel && (page === 'welcome' || page === 'test' || page === 'nameEntry')) {
        if(page === 'welcome') return <WelcomeScreen onStart={() => setPage('test')} />;
        if(page === 'test') return <PlacementTest onTestComplete={handleTestComplete} initialLevels={initialLevels} />;
        if(page === 'nameEntry') return <NameEntryScreen onNameSubmit={handleNameSubmit} />;
    }

    if (page === 'login') {
        if (user) { setPage('dashboard'); return null; }
        return <Login onRegisterClick={() => setPage('register')} />;
    }
    if (page === 'register') {
        if (user) { setPage('dashboard'); return null; }
        return <Register onLoginClick={() => setPage('login')} />;
    }

    if (certificateToShow) { 
        return <Certificate 
            levelId={certificateToShow} 
            userName={userName || user?.displayName} 
            onDownload={handleCertificateDownload} 
            initialLevels={initialLevels} 
        /> 
    }
    
    if (page === 'profile') return <ProfilePage />;
    if (page === 'editProfile') return <EditProfilePage />;

    if (page === 'search') {
      return (
          <div className="p-4 md:p-8 animate-fade-in z-10 relative">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text"
                    placeholder="ابحث عن أي درس..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white dark:bg-slate-800 w-full rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border dark:border-slate-700"
                />
              </div>
              {searchQuery.trim() !== '' && 
                  <div className="mt-4 max-w-lg mx-auto bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border dark:border-slate-700 max-h-[60vh] overflow-y-auto">
                      {searchResults.length > 0 ? searchResults.map(lesson => (
                          <div key={lesson.id} onClick={() => handleSearchSelect(lesson)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer border-b dark:border-slate-700">
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">المستوى: {lesson.id.substring(0,2)}</p>
                          </div>
                      )) : <p className="p-4 text-center text-slate-500">لا توجد نتائج بحث...</p>}
                  </div>
              }
          </div>
      );
    }

    switch (page) {
        case 'dashboard': return <Dashboard />;
        case 'lessons': return <LessonView />;
        case 'lessonContent': return <LessonContent />;
        case 'writing': return <WritingSection />;
        case 'reading': return <ReadingCenter />;
        case 'vocabulary': return <MyVocabulary />;
        case 'roleplay': return <RolePlaySection />;
        case 'pronunciation': return <PronunciationCoach />;
        case 'review': return <ReviewSection />;
        case 'reviewSession': return <ReviewSession />;
        case 'finalExam': return <FinalExam />;
        case 'weakPoints': return <WeakPointsSection />;
        case 'weakPointsQuiz': return <WeakPointsQuiz />;
        default: return <Dashboard />;
    }
};

export default PageRouter;
