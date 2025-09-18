// src/components/Blog.js

import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

// محتوى المقالات يمكن وضعه هنا مباشرة أو في ملف منفصل لاحقًا
const articles = [
    {
        slug: 'common-mistakes-in-english',
        title: '5 أخطاء شائعة يقع بها متعلمو اللغة الإنجليزية وكيفية تجنبها',
        author: 'فريق Stellar Speak',
        date: '18 سبتمبر 2025',
        excerpt: 'تعلم لغة جديدة رحلة مليئة بالتحديات، ومن الطبيعي ارتكاب الأخطاء. في هذا المقال، نسلط الضوء على 5 من أكثر الأخطاء شيوعًا...',
        content: `
            <h2>مقدمة</h2>
            <p>تعلم لغة جديدة رحلة مليئة بالتحديات، ومن الطبيعي ارتكاب الأخطاء. في هذا المقال، نسلط الضوء على 5 من أكثر الأخطاء شيوعًا التي يقع فيها متعلمو اللغة الإنجليزية وكيف يمكنك تجنبها بسهولة لتحسين طلاقتك.</p>
            <h3>1. الخلط بين 'Your' و 'You're'</h3>
            <p><strong>الخطأ:</strong> كتابة "Your welcome" بدلاً من "You're welcome".</p>
            <p><strong>الشرح:</strong> 'Your' هي صفة ملكية (مثل 'your book'). أما 'You're' فهي اختصار لـ 'You are'. القاعدة بسيطة: إذا كان يمكنك استبدال الكلمة بـ 'You are'، فاستخدم 'You're'.</p>
            <h3>2. استخدام حروف الجر بشكل خاطئ (Prepositions)</h3>
            <p><strong>الخطأ:</strong> قول "I am good in English" بدلاً من "I am good at English".</p>
            <p><strong>الشرح:</strong> حروف الجر مثل 'in', 'on', 'at' غالبًا ما تكون مربكة. أفضل طريقة لتعلمها هي من خلال الممارسة والاستماع للناطقين الأصليين. 'Good at' هي العبارة الصحيحة للتعبير عن المهارة في شيء ما.</p>
        `
    },
    {
        slug: 'tips-for-speaking-fluently',
        title: 'نصائح ذهبية لتحسين الطلاقة في المحادثة باللغة الإنجليزية',
        author: 'فريق Stellar Speak',
        date: '15 سبتمبر 2025',
        excerpt: 'الطلاقة في المحادثة هي هدف كل متعلم. لا يتعلق الأمر فقط بمعرفة القواعد والمفردات، بل بالقدرة على استخدامها بسلاسة وثقة...',
        content: `
            <h2>كيف تتحدث الإنجليزية بطلاقة؟</h2>
            <p>الطلاقة في المحادثة هي هدف كل متعلم. لا يتعلق الأمر فقط بمعرفة القواعد والمفردات، بل بالقدرة على استخدامها بسلاسة وثقة. إليك بعض النصائح العملية:</p>
            <h3>1. فكّر باللغة الإنجليزية</h3>
            <p>حاول التوقف عن الترجمة في عقلك من لغتك الأم. ابدأ بالتفكير في أشياء بسيطة بالإنجليزية، مثل "I need to get some water" بدلاً من التفكير بها بالعربية ثم ترجمتها.</p>
            <h3>2. تحدث إلى نفسك</h3>
            <p>قد يبدو الأمر غريباً، لكن التحدث إلى نفسك بالإنجليزية بصوت عالٍ هو طريقة ممتازة للممارسة دون ضغط. يمكنك وصف يومك أو التحدث عن خططك.</p>
        `
    }
];

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
