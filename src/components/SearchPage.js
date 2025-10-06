// src/components/SearchPage.js

import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // (إضافة)
import { useAppContext } from '../context/AppContext';
import { Search, Feather, BookText, Headphones, Target } from 'lucide-react';
import SEO from './SEO';
import { getSEOData } from '../data/seoData';

const SearchPage = () => {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
    } = useAppContext();
    
    const navigate = useNavigate(); // (إضافة)

    const currentSEO = getSEOData('search');
    // (تعديل) استخدام الطريقة الحديثة للحصول على الرابط
    const currentURL = window.location.href;

    // (تعديل) هذه الدالة الآن ستستخدم navigate
    const handleSearchSelect = (lesson) => {
        if (lesson && lesson.id) {
            navigate(`/lesson/${lesson.id}`);
        }
    };

    // (تعديل) تحويل الاقتراحات إلى روابط باستخدام Link
    const searchSuggestions = [
        {
          path: '/writing',
          title: 'تدريب الكتابة الحرة',
          description: 'اكتب عن مواضيع متنوعة واحصل على تصحيح فوري.',
          icon: Feather,
        },
        {
          path: '/grammar',
          title: 'دليل القواعد',
          description: 'ابحث عن شرح لأي قاعدة نحوية تحتاجها.',
          icon: BookText,
        },
        {
          path: '/listening',
          title: 'مركز الاستماع',
          description: 'حسن مهاراتك في الاستماع عبر محادثات واقعية.',
          icon: Headphones,
        },
        {
            path: '/smart-focus',
            title: 'التركيز الذكي',
            description: 'ركّز على تدريب المواضيع التي تحتاجها.',
            icon: Target,
        }
    ];

    return (
        <>
            <SEO
              title={currentSEO.title}
              description={currentSEO.description}
              keywords={currentSEO.keywords}
              pageType={currentSEO.pageType}
              url={currentURL}
            />
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
                              // (تعديل) استخدام Link بدلاً من div
                              <Link
                                  key={item.path}
                                  to={item.path}
                                  className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                              >
                                  <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full">
                                      <item.icon className="text-sky-600 dark:text-sky-400" size={20} />
                                  </div>
                                  <div>
                                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  </div>
                )}
            </div>
        </>
    );
};

export default SearchPage;
