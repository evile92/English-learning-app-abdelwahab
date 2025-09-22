// src/components/PageRouter.js

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Info, Mail, Heart, Feather, BookText, Headphones, Target, Shield, BookOpen } from 'lucide-react';


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
import Blog from './Blog'; // <-- استيراد المدونة
import PrivacyPolicy from './PrivacyPolicy'; // <-- استيراد سياسة الخصوصية

const AboutPage = () => (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg text-center">
            <Info className="mx-auto text-sky-500 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">عن Stellar Speak</h1>
            <div className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed text-right space-y-4">
                <p>
                    أهلاً بكم في Stellar Speak، منصتكم لاستكشاف اللغة الإنجليزية بطريقة مبتكرة!
                </p>
                <p>
                    نحن فريق من عشاق اللغات والتقنية، نؤمن بأن تعلم لغة جديدة يجب أن يكون تجربة ملهمة وممتعة، لا مجرد واجب. انطلق مشروعنا من فكرة بسيطة: كيف يمكننا تسخير قوة التكنولوجيا لجعل ممارسة اللغة الإنجليزية أكثر تفاعلية وذكاءً؟ من هذا السؤال، وُلدت Stellar Speak.
                </p>
                <p>
                    مهمتنا هي توفير الأدوات التي تساعدكم على بناء الثقة وتطوير مهاراتكم خطوة بخطوة. من خلال منصتنا، يمكنكم الحصول على دروس مخصصة، وتصحيح فوري لأخطائكم، وخوض محادثات إبداعية، كل ذلك بفضل تقنيات الذكاء الاصطناعي المتقدمة.
                </p>
                <p>
                    نحن ملتزمون بتطوير المنصة باستمرار وتقديم أفضل تجربة تعليمية ممكنة. انضموا إلينا في هذه الرحلة، ولنجعل تعلم اللغة الإنجليزية مغامرة لا تُنسى.
                </p>
            </div>
        </div>
    </div>
);

// src/components/PageRouter.js

import React, { useState } from 'react'; // <-- استيراد useState
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase'; // <-- استيراد قاعدة البيانات
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // <-- استيراد دوال Firestore
import { Mail, Send, LoaderCircle, CheckCircle } from 'lucide-react'; // <-- استيراد أيقونات جديدة

// ... (باقي الاستيرادات والمكونات الأخرى تبقى كما هي)

const ContactPage = () => {
    const { user, userName } = useAppContext();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'sent'
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('يرجى كتابة رسالتك قبل الإرسال.');
            return;
        }
        
        setStatus('sending');
        setError('');

        try {
            // إنشاء سجل جديد في مجموعة اسمها "feedback"
            await addDoc(collection(db, "feedback"), {
                message: message,
                userId: user ? user.uid : 'guest',
                username: user ? userName || user.displayName : 'Guest User',
                email: user ? user.email : 'N/A',
                createdAt: serverTimestamp(),
                status: 'new' // لتتبع البلاغات الجديدة
            });
            setStatus('sent');
            setMessage('');
        } catch (err) {
            console.error("Error submitting feedback: ", err);
            setError('حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.');
            setStatus('idle');
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg text-center">
                <Mail className="mx-auto text-sky-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">تواصل معنا</h1>
                
                {status === 'sent' ? (
                    <div className="text-center p-6 bg-green-100 dark:bg-green-900/50 rounded-lg animate-fade-in">
                        <CheckCircle className="mx-auto text-green-500 mb-3" size={40} />
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-200">تم إرسال رسالتك بنجاح!</h3>
                        <p className="text-green-700 dark:text-green-300 mt-1">شكرًا لك على ملاحظاتك، سنقوم بمراجعتها قريبًا.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                            هل لديك اقتراح لتطوير الموقع أو واجهت مشكلة تقنية؟ يسعدنا سماع ذلك منك!
                        </p>
                        <form onSubmit={handleSubmit} className="mt-6 text-left">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="اكتب تفاصيل المشكلة أو اقتراحك هنا..."
                                rows="5"
                                required
                                className="w-full p-3 text-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                            ></textarea>
                            
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            
                            <button 
                                type="submit" 
                                disabled={status === 'sending'}
                                className="mt-4 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                            >
                                {status === 'sending' ? (
                                    <LoaderCircle className="animate-spin" size={20} />
                                ) : (
                                    <Send size={18} />
                                )}
                                <span>{status === 'sending' ? 'جارِ الإرسال...' : 'إرسال'}</span>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

// ... (باقي مكونات PageRouter تبقى كما هي)

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
        case 'smartFocus': return <SmartFocusSection />;
        case 'smartFocusQuiz': return <SmartFocusQuiz />;
        case 'grammar': return <GrammarGuide />;
        case 'verbList': return <VerbListComponent />;
        case 'idioms': return <IdiomsAndPhrases />;
        case 'vocabularyGuide': return <VocabularyGuide />;
        case 'listening': return <ListeningCenter />;
        case 'blog': return <Blog />; // <-- إضافة مسار المدونة
        case 'privacy': return <PrivacyPolicy />; // <-- إضافة مسار سياسة الخصوصية
        default: return <Dashboard />;
    }
};

export default PageRouter;
