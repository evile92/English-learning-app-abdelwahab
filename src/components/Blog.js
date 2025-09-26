// src/components/Blog.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { articles as localArticles } from '../data/blogArticles';
import { BookOpen, ChevronRight, Loader, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import ShareArticle from './ShareArticle';
import ArticleFeedback from './ArticleFeedback';
import { useAppContext } from '../context/AppContext';


// --- دالة لتحديد لغة النص ---
const isEnglish = (text) => {
    if (!text) return false;
    const firstLetter = text.match(/[a-zA-Z\u0600-\u06FF]/);
    if (!firstLetter) return false;
    return /[a-zA-Z]/.test(firstLetter[0]);
};

const Blog = () => {
    const { page, handlePageChange } = useAppContext();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchAndSetArticles = async () => {
            try {
                const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const firestoreArticles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const combinedArticles = [...firestoreArticles];
                localArticles.forEach(localArticle => {
                    if (!firestoreArticles.some(fa => fa.title === localArticle.title)) {
                        combinedArticles.push({ id: localArticle.slug, ...localArticle });
                    }
                });
                
                combinedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                setArticles(combinedArticles);

                const slugFromUrl = page.split('/')[1];

                if (slugFromUrl) {
                    const articleFromUrl = combinedArticles.find(a => (a.slug || a.id) === slugFromUrl);
                    if (articleFromUrl) {
                        setSelectedArticle(articleFromUrl);
                    } else if (combinedArticles.length > 0) {
                        setSelectedArticle(combinedArticles[0]);
                    }
                } else if (combinedArticles.length > 0) {
                    setSelectedArticle(combinedArticles[0]);
                }

            } catch (error) {
                console.error("Error fetching articles, falling back to local:", error);
                const localWithIds = localArticles.map(a => ({ id: a.slug, ...a }));
                setArticles(localWithIds);
                if (localWithIds.length > 0) {
                    setSelectedArticle(localWithIds[0]);
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchAndSetArticles();
    }, [page]);

    useEffect(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo(0, 0);
        }
    }, [selectedArticle]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }

    if (articles.length === 0 || !selectedArticle) {
        return <div className="p-8 text-center text-slate-500">No blog articles found.</div>;
    }

    const articleSlug = selectedArticle.slug || selectedArticle.id;
    const isArticleEnglish = isEnglish(selectedArticle.title);
    const articleUrl = `${window.location.origin}/?page=blog/${articleSlug}`;

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-2xl max-h-[calc(100vh-8rem)] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <BookOpen size={24} className="text-sky-500" />
                            Blog Articles
                        </h2>
                        <nav className="space-y-2">
                            {articles.map(article => (
                                <button
                                    key={article.id}
                                    onClick={() => handlePageChange(`blog/${article.slug || article.id}`)}
                                    className={`w-full p-3 rounded-lg flex justify-between items-center transition-all duration-200 ${isEnglish(article.title) ? 'text-left' : 'text-right'} ${
                                        selectedArticle.id === article.id
                                            ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    <span>{article.title}</span>
                                    <ChevronRight size={18} className={`flex-shrink-0 transition-transform ${selectedArticle.id === article.id ? 'transform scale-110' : ''} ${isEnglish(article.title) ? 'order-last' : 'order-first rotate-180'}`} />
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className="w-full lg:w-3/4">
                    <article 
                        dir={isArticleEnglish ? 'ltr' : 'rtl'} 
                        className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 rounded-2xl shadow-lg"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">{selectedArticle.title}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            By {selectedArticle.author} - {selectedArticle.date}
                        </p>
                        <div
                            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                        />
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <ArticleFeedback articleId={selectedArticle.id} />
                            <ShareArticle title={selectedArticle.title} url={articleUrl} />
                        </div>
                    </article>
                </main>
            </div>
        </div>
    );
};

export default Blog;
