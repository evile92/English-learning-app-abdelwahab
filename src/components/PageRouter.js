// src/components/PageRouter.js

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Info, Mail, Heart, Feather, BookText, Headphones, Target, Shield, BookOpen } from 'lucide-react';

// استيراد جميع المكونات بما في ذلك المكون الجديد
import AdminDashboard from './AdminDashboard';
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
import SmartFocusSection from './SmartFocusSection';
import SmartFocusQuiz from './SmartFocusQuiz';
import GrammarGuide from './GrammarGuide';
import VerbListComponent from './VerbListComponent';
import IdiomsAndPhrases from './IdiomsAndPhrases';
import VocabularyGuide from './VocabularyGuide';
import ListeningCenter from './ListeningCenter';
import Blog from './Blog';
import PrivacyPolicy from './PrivacyPolicy';
import ContactPage from './ContactPage';
import AboutPage from './About'; // <-- ✅ الخطوة 1: استيراد المكون الجديد

// <-- ❌ الخطوة 2: تم حذف الكود القديم لـ "AboutPage" من هنا بالكامل

const PageRouter = () => {
    const {
        page, setPage, userLevel, user, certificateToShow,
        searchQuery, setSearchQuery, searchResults, handleSearchSelect,
        handleTestComplete, initialLevels, handleNameSubmit,
        userName, handleCertificateDownload
    } = useAppContext();

    if (!user && !userLevel && (page === 'welcome' || page === 'test' || page === 'nameEntry')) {
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
    if (page === 'about') return <AboutPage />;
    if (page === 'contact') return <ContactPage />;

    if (page === 'search') {
      const searchSuggestions = [
        {
          title: 'تدريب الكتابة الحرة',
          description: 'اكتب عن مواضيع متنوعة واحصل على تصحيح فوري.',
          icon: Feather,
          action: () => setPage('writing')
        },
        {
          title: 'دليل القواعد',
          description: 'ابحث عن شرح لأي قاعدة نحوية تحتاجها.',
          icon: BookText,
          action: () => setPage('grammar')
        },
        {
          title: 'مركز الاستماع',
          description: 'حسن مهاراتك في الاستماع عبر محادثات واقعية.',
          icon: Headphones,
          action: () => setPage('listening')
        },
        {
            title: 'التركيز الذكي',
            description: 'ركّز على تدريب المواضيع التي تحتاجها.',
            icon: Target,
            action: () => setPage('smartFocus')
        }
      ];

      return (
          <div className="p-4 md:p-8 animate-fade-in z-10 relative">
              <div className="relative max-w-lg mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                      type="text"
                      placeholder="ابحث عن أي درس أو ميزة..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white dark:bg-slate-800 w-full rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border dark:border-slate-700"
                  />
              </div>
              
              {searchQuery.trim() !== '' ? (
                  <div className="mt-4 max-w-lg mx-auto bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border dark:border-slate-700 max-h-[60vh] overflow-y-auto">
                      {searchResults.length > 0 ? searchResults.map(lesson => (
                          <div key={lesson.id} onClick={() => handleSearchSelect(lesson)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer border-b dark:border-slate-700">
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">المستوى: {lesson.id.substring(0,2)}</p>
                          </div>
                      )) : <p className="p-4 text-center text-slate-500">لا توجد نتائج بحث...</p>}
                  </div>
              ) : (
                <div className="mt-8 max-w-lg mx-auto">
                    <h3 className="text-center font-bold text-slate-700 dark:text-slate-300 mb-4">أو يمكنك استكشاف الميزات التالية</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {searchSuggestions.map(item => (
                            <div 
                                key={item.title} 
                                onClick={item.action}
                                className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                            >
                                <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full">
                                    <item.icon className="text-sky-600 dark:text-sky-400" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
          </div>
      );
    }

    // --- ✅ بداية التعديل المطلوب ---
    if (page.startsWith('blog')) {
        return <Blog />;
    } else if (page === 'admin') {
        return <AdminDashboard />;
    } else if (page === 'dashboard') {
        return <Dashboard />;
    } else if (page === 'lessons') {
        return <LessonView />;
    } else if (page === 'lessonContent') {
        return <LessonContent />;
    } else if (page === 'writing') {
        return <WritingSection />;
    } else if (page === 'reading') {
        return <ReadingCenter />;
    } else if (page === 'vocabulary') {
        return <MyVocabulary />;
    } else if (page === 'roleplay') {
        return <RolePlaySection />;
    } else if (page === 'pronunciation') {
        return <PronunciationCoach />;
    } else if (page === 'review') {
        return <ReviewSection />;
    } else if (page === 'reviewSession') {
        return <ReviewSession />;
    } else if (page === 'finalExam') {
        return <FinalExam />;
    } else if (page === 'smartFocus') {
        return <SmartFocusSection />;
    } else if (page === 'smartFocusQuiz') {
        return <SmartFocusQuiz />;
    } else if (page === 'grammar') {
        return <GrammarGuide />;
    } else if (page === 'verbList') {
        return <VerbListComponent />;
    } else if (page === 'idioms') {
        return <IdiomsAndPhrases />;
    } else if (page === 'vocabularyGuide') {
        return <VocabularyGuide />;
    } else if (page === 'listening') {
        return <ListeningCenter />;
    } else if (page === 'privacy') {
        return <PrivacyPolicy />;
    } else {
        return <Dashboard />;
    }
    // --- 🛑 نهاية التعديل المطلوب ---
};

export default PageRouter;
