// src/components/Blog.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { articles as localArticles } from '../data/blogArticles';
import { Loader, X, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import ShareArticle from './ShareArticle';
import ArticleFeedback from './ArticleFeedback';
import { useAppContext } from '../context/AppContext';

const isEnglish = (text) => {
    if (!text) return false;
    const firstLetter = text.match(/[a-zA-Z\u0600-\u06FF]/);
    if (!firstLetter) return false;
    return /[a-zA-Z]/.test(firstLetter[0]);
};

// --- ✅ 1. مكون جديد لنافذة عرض المقال ---
const ArticleModal = ({ article, onClose }) => {
    if (!article) return null;

    const isArticleEnglish = isEnglish(article.title);
    const articleUrl = `${window.location.origin}/?page=blog/${article.slug || article.id}`;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">{article.title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20} /></button>
                </div>
                <div className="p-6 md:p-10 overflow-y-auto flex-grow">
                    <article dir={isArticleEnglish ? 'ltr' : 'rtl'}>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">{article.title}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            By {article.author} - {article.date}
                        </p>
                        <div
                            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </article>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
                    <ArticleFeedback articleId={article.id} />
                    <ShareArticle title={article.title} url={articleUrl} />
                </div>
            </div>
        </div>
    );
};


const Blog = () => {
    const { page, handlePageChange } = useAppContext();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    // --- ✅ 2. تحديث منطق جلب وفتح المقالات ---
    useEffect(() => {
        const fetchAndSetArticles = async () => {
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

                const slugFromUrl = page.split('/')[1];
                if (slugFromUrl) {
                    const articleFromUrl = combinedArticles.find(a => (a.slug || a.id) === slugFromUrl);
                    if (articleFromUrl) {
                        setSelectedArticle(articleFromUrl);
                    }
                }

            } catch (error) {
                console.error("Error fetching articles:", error);
                setArticles(localArticles.map(a => ({ id: a.slug, ...a })));
            } finally {
                setLoading(false);
            }
        };
        fetchAndSetArticles();
    }, [page]);
    
    // --- ✅ 3. دالة لفتح وإغلاق نافذة المقال وتحديث الرابط ---
    const handleArticleSelect = (article) => {
        const slug = article.slug || article.id;
        setSelectedArticle(article);
        handlePageChange(`blog/${slug}`);
    };

    const handleCloseModal = () => {
        setSelectedArticle(null);
        handlePageChange('blog');
    };


    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">مدونة Stellar Speak</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">مقالات ونصائح عملية لتعزيز رحلتك في تعلم الإنجليزية.</p>
            </div>
            
            {/* --- ✅ 4. تصميم الشبكة الجديد لعرض المقالات --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <div 
                        key={article.id}
                        onClick={() => handleArticleSelect(article)}
                        className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg cursor-pointer group overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col"
                    >
                        <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sky-500 text-5xl font-bold">
                            {article.title.charAt(0)}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className={`font-bold text-xl text-slate-800 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.title}</h3>
                            <p className={`mt-2 text-slate-500 dark:text-slate-400 text-sm flex-grow ${isEnglish(article.title) ? 'text-left' : 'text-right'}`}>{article.excerpt}</p>
                            <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                                <span>{article.author}</span> &bull; <span>{article.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ✅ 5. عرض نافذة المقال عند اختياره --- */}
            <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
        </div>
    );
};

export default Blog;
