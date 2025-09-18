// src/components/Blog.js

import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { articles } from '../data/blogArticles'; // <-- ✅ استيراد المقالات من الملف الجديد

const BlogArticle = ({ article, onBack }) => (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
            <ArrowLeft size={20} /> العودة إلى المدونة
        </button>
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{article.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">بواسطة {article.author} - {article.date}</p>
            <div
                className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </div>
    </div>
);

const BlogList = ({ onArticleSelect }) => (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <BookOpen className="mx-auto text-sky-500 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">مدونة Stellar Speak</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">مقالات ونصائح لمساعدتك في رحلتك لتعلم الإنجليزية.</p>
        </div>
        <div className="space-y-6">
            {articles.map(article => (
                <div 
                    key={article.slug} 
                    className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{article.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{article.author} - {article.date}</p>
                    <p className="text-slate-600 dark:text-slate-300">{article.excerpt}</p>
                    <button onClick={() => onArticleSelect(article)} className="mt-4 font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                        اقرأ المزيد &rarr;
                    </button>
                </div>
            ))}
        </div>
    </div>
);

const Blog = () => {
    const [selectedArticle, setSelectedArticle] = useState(null);

    return selectedArticle 
        ? <BlogArticle article={selectedArticle} onBack={() => setSelectedArticle(null)} /> 
        : <BlogList onArticleSelect={setSelectedArticle} />;
};

export default Blog;
