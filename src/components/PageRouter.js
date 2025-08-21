// src/components/PageRouter.js

// --- (بداية التعديل): إضافة أيقونات ومكونات للصفحات الجديدة ---
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Info, Mail, Heart } from 'lucide-react';
// --- (نهاية التعديل) ---


import WelcomeScreen from './WelcomeScreen';
import PlacementTest from './PlacementTest';
// ...باقي الاستيرادات...
import WeakPointsQuiz from './WeakPointsQuiz';


// --- (بداية الإضافة): إنشاء مكونات بسيطة للصفحات الجديدة ---
const AboutPage = () => (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg text-center">
            <Info className="mx-auto text-sky-500 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">عن Stellar Speak</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                Stellar Speak هي منصة تفاعلية مصممة لجعل تعلم اللغة الإنجليزية رحلة كونية ممتعة. مهمتنا هي توفير أدوات مبتكرة ومخصصة لمساعدتك على الوصول إلى الطلاقة، من كوكب المبتدئين إلى سديم الحكمة.
            </p>
        </div>
    </div>
);

const ContactPage = () => (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg text-center">
            <Mail className="mx-auto text-sky-500 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">اتصل بنا</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                ملاحظاتك تهمنا! إذا كانت لديك أي أسئلة أو اقتراحات أو واجهت أي مشكلة، لا تتردد في التواصل معنا عبر البريد الإلكتروني التالي:
            </p>
            <a href="mailto:abdelwahab.kahoch@gmail.com" className="mt-4 inline-block bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold px-6 py-2 rounded-full">
                abdelwahab.kahoch@gmail.com
            </a>
            <p className="text-slate-600 dark:text-slate-300 mt-6">
                يمكنك أيضاً دعم تطوير المشروع عبر زر <Heart size={16} className="inline text-red-500" /> الموجود في الشريط العلوي.
            </p>
        </div>
    </div>
);
// --- (نهاية الإضافة) ---


const PageRouter = () => {
    const { 
        page, setPage, userLevel, user, certificateToShow, 
        searchQuery, setSearchQuery, searchResults, handleSearchSelect,
        handleTestComplete, initialLevels, handleNameSubmit, 
        userName, handleCertificateDownload
    } = useAppContext();

    // ... (الكود السابق يبقى كما هو)
    

    // --- (بداية التعديل): إضافة المسارات الجديدة في نهاية الـ switch ---
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
        case 'about': return <AboutPage />;
        case 'contact': return <ContactPage />;
        default: return <Dashboard />;
    }
    // --- (نهاية التعديل) ---
};

export default PageRouter;
