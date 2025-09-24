// src/components/admin/ArticleEditor.js

import React, { useState } from 'react';

const ArticleEditor = ({ article, onSave, onCancel }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [author, setAuthor] = useState(article?.author || 'Stellar Speak Team');
    const [excerpt, setExcerpt] = useState(article?.excerpt || '');
    const [content, setContent] = useState(article?.content || ''); // Should be HTML content

    const handleSave = () => {
        const articleData = {
            title,
            author,
            excerpt,
            content,
            slug: title.toLowerCase().replace(/\s+/g, '-'),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        onSave(articleData);
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{article?.id ? 'Edit Article' : 'New Article'}</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded"/>
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded"/>
                <textarea placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full p-2 border rounded h-24"></textarea>
                <textarea placeholder="HTML Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-64"></textarea>
            </div>
            <div className="mt-4">
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">Save Article</button>
                <button onClick={onCancel} className="ml-2 bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
            </div>
        </div>
    );
};

export default ArticleEditor;
