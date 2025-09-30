// src/components/Blog.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { articles as localArticles } from '../data/blogArticles';
import { Loader, ArrowLeft } from 'lucide-react';
import ShareArticle from './ShareArticle';
import ArticleFeedback from './ArticleFeedback';
import { useAppContext } from '../context/AppContext';

const isEnglish = (text) => {
    if (!text) return false;
    const firstLetter = text.match(/[a-zA-Z\u0600-\u06FF]/);
    if (!firstLetter) return false;
    return /[a-zA-Z]/.test(firstLetter[0]);
};

// --- ✅ 1. مكون جديد لصفحة القراءة المنفصلة ---
const ArticleReader = ({ article, onBack }) => {
    useEffect(() => {
        // Scroll to top when article changes
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.scrollTo(0, 0);
    }, [article]);

    if (!article) return null;

    const isArticleEnglish = isEnglish(article.title);
    const articleUrl = `${window.location.origin}/?page=blog/${article.slug || article.id}`;

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة إلى كل المقالات
            </button>
            <article dir={isArticleEnglish ? 'ltr' : 'rtl'} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 rounded-2xl shadow-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">{article.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    By {article.author} - {article.date}
                </p>
                <div
                    className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <ArticleFeedback articleId={article.id} />
                    <ShareArticle title={article.title} url={articleUrl} />
                </div>
            </article>
        </div>
    );
};

// --- ✅ 2. مكون جديد لقائمة المقالات الرئيسية ---
const ArticleList = ({ articles, onArticleSelect }) => {
    const [featuredArticle, ...otherArticles] = articles;

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">مدونة Stellar Speak</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">مقالات ونصائح عملية لتعزيز رحلتك في تعلم الإنجليزية.</p>
            </div>

            {/* --- المقال المميز --- */}
            {featuredArticle && (
                <div 
                    onClick={() => onArticleSelect(featuredArticle)}
                    className="mb-12 p-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg cursor-pointer group transition-all duration-300 hover:border-sky-500 dark:hover:border-sky-400"
                >
                    <h2 className={`text-3xl font-bold text-slate-800 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors ${isEnglish(featuredArticle.title) ? 'text-left' : 'text-right'}`}>{featuredArticle.title}</h2>
                    <p className={`mt-2 text-slate-500 dark:text-slate-400 text-sm ${isEnglish(featuredArticle.title) ? 'text-left' : 'text-right'}`}>
                        {featuredArticle.author} &bull; {featuredArticle.date}
                    </p>
                    <p className={`mt-4 text-slate-600 dark:text-slate-300 line-clamp-3 ${isEnglish(featuredArticle.title) ? 'text-left' : 'text-right'}`}>{featuredArticle.excerpt}</p>
                </div>
            )}
            
            {/* --- باقي المقالات --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherArticles.map(article => (
                    <div 
                        key={article.id}
                        onClick={() => onArticleSelect(article)}
                        className="p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg cursor-pointer group transition-all duration-300 hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1"
                    >
                        <h3 className={`font-bold text-xl text-slate-800 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.title}</h3>
                        <p className={`mt-2 text-slate-500 dark:text-slate-400 text-sm line-clamp-2 ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.excerpt}</p>
                        <p className={`mt-3 text-xs text-slate-400 dark:text-slate-500 ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Blog = () => {
    const { page, handlePageChange } = useAppContext();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchAndProcessArticles = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const firestoreArticles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const combinedArticles = [...firestoreArticles];
                localArticles.forEach(localArticle => {
                    if (!firestoreArticles.some(fa => fa.title === localArticle.title)) {
                        // تأكد من أن كل مقال له slug و id متسقان
                        combinedArticles.push({ 
                            ...localArticle, 
                            id: localArticle.slug,
                            slug: localArticle.slug,
                            isLocal: true 
                        });
                    }
                });
                
                combinedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                setArticles(combinedArticles);

                // منطق البحث عن المقال المحسّن
                const slugFromUrl = page.split('/')[1];
                if (slugFromUrl) {
                    console.log('البحث عن مقال بالـ slug:', slugFromUrl);
                    console.log('المقالات المتاحة:', combinedArticles.map(a => ({slug: a.slug, id: a.id, title: a.title})));
                    
                    const articleFromUrl = combinedArticles.find(a => {
                        const articleSlug = a.slug || a.id;
                        return articleSlug === slugFromUrl;
                    });
                    
                    if (articleFromUrl) {
                        console.log('تم العثور على المقال:', articleFromUrl.title);
                        setSelectedArticle(articleFromUrl);
                    } else {
                        console.error('لم يتم العثور على المقال بالـ slug:', slugFromUrl);
                        // محاولة بحث بديلة بناءً على العنوان
                        const fallbackArticle = combinedArticles.find(a => 
                            a.title.toLowerCase().includes(slugFromUrl.replace(/-/g, ' ').toLowerCase())
                        );
                        setSelectedArticle(fallbackArticle || null);
                    }
                } else {
                    setSelectedArticle(null); // لا يوجد مقال محدد، اعرض القائمة
                }
            } catch (error) {
                console.error("خطأ في جلب المقالات:", error);
                const processedLocalArticles = localArticles.map(a => ({ 
                    ...a, 
                    id: a.slug,
                    slug: a.slug 
                }));
                setArticles(processedLocalArticles);
                
                const slugFromUrl = page.split('/')[1];
                if (slugFromUrl) {
                    const articleFromUrl = processedLocalArticles.find(a => a.slug === slugFromUrl);
                    setSelectedArticle(articleFromUrl || null);
                } else {
                    setSelectedArticle(null);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAndProcessArticles();
    }, [page]);
    
    const handleArticleSelection = (article) => {
        const slug = article.slug || article.id;
        handlePageChange(`blog/${slug}`);
    };

    const handleBackToList = () => {
        handlePageChange('blog');
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }

    // --- ✅ 3. منطق العرض الجديد ---
    return (
        <div className="max-w-7xl mx-auto">
            {selectedArticle ? (
                <ArticleReader article={selectedArticle} onBack={handleBackToList} />
            ) : (
                <ArticleList articles={articles} onArticleSelect={handleArticleSelection} />
            )}
        </div>
    );
};

export default Blog;
