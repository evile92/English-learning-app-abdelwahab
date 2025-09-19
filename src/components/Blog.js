// src/components/Blog.js

import React, { useState, useEffect } from 'react';
import { articles } from '../data/blogArticles';
import { BookOpen, ChevronRight } from 'lucide-react';

const Blog = () => {
    // تحديد أول مقال كالمقال الافتراضي عند تحميل الصفحة
    const [selectedArticle, setSelectedArticle] = useState(articles[0]);

    // تأثير لتمرير الصفحة للأعلى عند اختيار مقال جديد
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedArticle]);

    if (!selectedArticle) {
        return <div>لا توجد مقالات لعرضها.</div>;
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* --- القائمة الجانبية للمقالات --- */}
                <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <BookOpen size={24} className="text-sky-500" />
                            مقالات المدونة
                        </h2>
                        <nav className="space-y-2">
                            {articles.map(article => (
                                <button
                                    key={article.slug}
                                    onClick={() => setSelectedArticle(article)}
                                    className={`w-full text-right p-3 rounded-lg flex justify-between items-center transition-all duration-200 ${
                                        selectedArticle.slug === article.slug
                                            ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    <span>{article.title}</span>
                                    <ChevronRight size={18} className={`flex-shrink-0 transition-transform ${selectedArticle.slug === article.slug ? 'transform scale-110' : ''}`} />
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* --- محتوى المقال الرئيسي --- */}
                <main className="w-full lg:w-3/4">
                    <article className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 md:p-10 rounded-2xl shadow-lg">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">{selectedArticle.title}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            بواسطة {selectedArticle.author} - {selectedArticle.date}
                        </p>
                        <div
                            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 prose-blockquote:bg-slate-100 prose-blockquote:dark:bg-slate-800 prose-blockquote:p-4 prose-blockquote:rounded-lg prose-blockquote:border-r-4 prose-blockquote:border-sky-500"
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                        />
                    </article>
                </main>

            </div>
        </div>
    );
};

export default Blog;
