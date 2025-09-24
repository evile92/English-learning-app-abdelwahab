// src/components/admin/ArticleEditor.js

import React, { useState } from 'react';
// (الخطوة 1): استيراد المحرر الجديد وملف التنسيق الخاص به
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // استيراد থিম المحرر

const ArticleEditor = ({ article, onSave, onCancel }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [author, setAuthor] = useState(article?.author || 'Stellar Speak Team');
    const [excerpt, setExcerpt] = useState(article?.excerpt || '');
    // (الخطوة 2): استخدام `content` مع المحرر الجديد
    const [content, setContent] = useState(article?.content || '');

    const handleSave = () => {
        if (!title.trim() || !excerpt.trim() || !content.trim()) {
            alert('Please fill in all fields before saving.');
            return;
        }
        const articleData = {
            title,
            author,
            excerpt,
            content, // المحتوى الآن سيكون HTML من المحرر مباشرة
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        };
        onSave(articleData);
    };

    // (الخطوة 3): تعريف شريط الأدوات للمحرر الجديد
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link'],
            ['clean']
        ],
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4">{article?.id ? 'Edit Article' : 'New Article'}</h3>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                />
                <input 
                    type="text" 
                    placeholder="Author" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                />
                <textarea 
                    placeholder="Excerpt (short summary)" 
                    value={excerpt} 
                    onChange={(e) => setExcerpt(e.target.value)} 
                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 h-24"
                ></textarea>
                
                {/* --- (الخطوة 4): استخدام مكون ReactQuill بدلاً من textarea --- */}
                <div className="bg-white text-slate-900 rounded-lg">
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent}
                        modules={modules}
                        className="h-64 mb-12" // زيادة المساحة للكتابة
                    />
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
                <button onClick={onCancel} className="bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-lg">Cancel</button>
                <button onClick={handleSave} className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600">Save Article</button>
            </div>
        </div>
    );
};

export default ArticleEditor;
