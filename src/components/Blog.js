// src/components/Blog.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { articles as localArticles } from '../data/blogArticles';
import { Loader, ArrowLeft } from 'lucide-react';
import ShareArticle from './ShareArticle';
import ArticleFeedback from './ArticleFeedback';
import { useAppContext } from '../context/AppContext';
import SEO from './SEO';
import { Link, useParams } from 'react-router-dom'; // (إضافة)

const isEnglish = (text) => {
    if (!text) return false;
    const firstLetter = text.match(/[a-zA-Z\u0600-\u06FF]/);
    if (!firstLetter) return false;
    return /[a-zA-Z]/.test(firstLetter[0]);
};

// --- المكون الداخلي لقارئ المقال ---
const ArticleReader = ({ article }) => { // (تعديل) إزالة onBack
    useEffect(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.scrollTo(0, 0);
    }, [article]);

    if (!article) return null;

    const isArticleEnglish = isEnglish(article.title);
    const articleUrl = window.location.href; // (تعديل)

    return (
        <div className="animate-fade-in">
            <SEO 
                title={`${article.title} - StellarSpeak Blog`}
                description={article.excerpt || `مقال ${article.title} في مدونة StellarSpeak لتعلم اللغة الإنجليزية`}
                keywords={`${article.title}, تعلم الإنجليزية, مدونة StellarSpeak, ${article.author}`}
                url={articleUrl}
                type="article"
                author={article.author}
            />
            {/* (تعديل) استخدام Link للعودة */}
            <Link to="/blog" className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> العودة إلى كل المقالات
            </Link>
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

// --- المكون الداخلي لقائمة المقالات ---
const ArticleList = ({ articles }) => { // (تعديل) إزالة onArticleSelect
    const [featuredArticle, ...otherArticles] = articles;

    return (
        <div className="animate-fade-in">
            <SEO 
                title="مدونة StellarSpeak | مقالات ونصائح لتعلم الإنجليزية"
                description="اكتشف مقالات ونصائح عملية لتعزيز رحلتك في تعلم اللغة الإنجليزية مع خبراء StellarSpeak"
                keywords="مدونة تعلم الإنجليزية, نصائح تعلم اللغة, مقالات إنجليزية, StellarSpeak blog"
                url="https://www.stellarspeak.online/blog" // (تعديل)
            />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">مدونة Stellar Speak</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">مقالات ونصائح عملية لتعزيز رحلتك في تعلم الإنجليزية.</p>
            </div>

            {featuredArticle && (
                // (تعديل) استخدام Link
                <Link 
                    to={`/blog/${featuredArticle.slug || featuredArticle.id}`}
                    className="mb-12 block p-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg cursor-pointer group transition-all duration-300 hover:border-sky-500 dark:hover:border-sky-400"
                >
                    <h2 className={`text-3xl font-bold text-slate-800 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors ${isEnglish(featuredArticle.title) ? 'text-left' : 'text-right'}`}>{featuredArticle.title}</h2>
                    <p className={`mt-2 text-slate-500 dark:text-slate-400 text-sm ${isEnglish(featuredArticle.title) ? 'text-left' : 'text-right'}`}>
                        {featuredArticle.author} &bull; {featuredArticle.date}
                    </p>
                    <p className={`mt-4 text-slate-600 dark:text-slate-300 line-clamp-3 ${isEnglish(featuredArticle.title) ? 'text-left' : 'text-right'}`}>{featuredArticle.excerpt}</p>
                </Link>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherArticles.map(article => (
                    // (تعديل) استخدام Link
                    <Link
                        key={article.id}
                        to={`/blog/${article.slug || article.id}`}
                        className="p-6 block bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg cursor-pointer group transition-all duration-300 hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1"
                    >
                        <h3 className={`font-bold text-xl text-slate-800 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.title}</h3>
                        <p className={`mt-2 text-slate-500 dark:text-slate-400 text-sm line-clamp-2 ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.excerpt}</p>
                        <p className={`mt-3 text-xs text-slate-400 dark:text-slate-500 ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.date}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};


const Blog = () => {
    // (إزالة) page, handlePageChange
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    // (إزالة) selectedArticle, setSelectedArticle

    // (إضافة) استخدام useParams للحصول على slug من الرابط
    const { slug } = useParams();

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
                        combinedArticles.push({ id: localArticle.slug, ...localArticle, isLocal: true });
                    }
                });
                
                combinedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                setArticles(combinedArticles);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setArticles(localArticles.map(a => ({ id: a.slug, ...a })));
            } finally {
                setLoading(false);
            }
        };
        fetchAndProcessArticles();
    }, []); // (تعديل) useEffect يعمل مرة واحدة فقط
    
    // (إزالة) handleArticleSelection, handleBackToList

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }
    
    // --- منطق العرض الجديد يعتمد على slug ---
    if (slug) {
        const selectedArticle = articles.find(a => (a.slug || a.id) === slug);
        return (
            <div className="max-w-7xl mx-auto">
                <ArticleReader article={selectedArticle} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <ArticleList articles={articles} />
        </div>
    );
};

export default Blog;
