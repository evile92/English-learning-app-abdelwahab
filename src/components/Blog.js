// src/components/Blog.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
// (الخطوة 1): استيراد المقالات القديمة من الملف
import { articles as localArticles } from '../data/blogArticles';
import { BookOpen, ChevronRight, Loader } from 'lucide-react';

const Blog = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchAndMergeArticles = async () => {
            try {
                // (الخطوة 2): جلب المقالات الجديدة من قاعدة البيانات
                const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const firestoreArticles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // (الخطوة 3): دمج المقالات القديمة والجديدة معاً
                // نتأكد من عدم وجود تكرار بناءً على العنوان
                const combinedArticles = [...firestoreArticles];
                localArticles.forEach(localArticle => {
                    if (!firestoreArticles.some(fa => fa.title === localArticle.title)) {
                        combinedArticles.push({ id: localArticle.slug, ...localArticle });
                    }
                });
                
                // (الخطوة 4): فرز جميع المقالات حسب التاريخ لضمان الترتيب الصحيح
                combinedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

                setArticles(combinedArticles);
                if (combinedArticles.length > 0) {
                    setSelectedArticle(combinedArticles[0]);
                }

            } catch (error) {
                console.error("Error fetching articles, falling back to local:", error);
                // في حال فشل الاتصال، نعرض المقالات القديمة فقط
                setArticles(localArticles.map(a => ({ id: a.slug, ...a })));
                if (localArticles.length > 0) {
                    setSelectedArticle(localArticles[0]);
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchAndMergeArticles();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedArticle]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }

    if (articles.length === 0) {
        return <div className="p-8 text-center text-slate-500">No blog articles found.</div>;
    }

    if (!selectedArticle) {
        return null;
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <BookOpen size={24} className="text-sky-500" />
                            Blog Articles
                        </h2>
                        <nav className="space-y-2">
                            {articles.map(article => (
                                <button
                                    key={article.id}
                                    onClick={() => setSelectedArticle(article)}
                                    className={`w-full text-right p-3 rounded-lg flex justify-between items-center transition-all duration-200 ${
                                        selectedArticle.id === article.id
                                            ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    <span>{article.title}</span>
                                    <ChevronRight size={18} className={`flex-shrink-0 transition-transform ${selectedArticle.id === article.id ? 'transform scale-110' : ''}`} />
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className="w-full lg:w-3/4">
                    <article className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 rounded-2xl shadow-lg">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">{selectedArticle.title}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            By {selectedArticle.author} - {selectedArticle.date}
                        </p>
                        <div
                            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                        />
                    </article>
                </main>
            </div>
        </div>
    );
};

export default Blog;
