// src/components/admin/ArticleEditor.js

import React, { useState, useRef } from 'react';
import { Bold, Italic, List, Heading3, Pilcrow, Eye, Code } from 'lucide-react';

const Toolbar = ({ onCommand }) => {
    // ... Toolbar component remains the same
};

const ArticleEditor = ({ article, onSave, onCancel }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [author, setAuthor] = useState(article?.author || 'Stellar Speak Team');
    const [excerpt, setExcerpt] = useState(article?.excerpt || '');
    const [content, setContent] = useState(article?.content || '');
    const [view, setView] = useState('editor');
    const contentRef = useRef(null);

    const handleSave = () => {
        if (!title.trim() || !excerpt.trim() || !content.trim()) {
            alert('Please fill in all fields: Title, Excerpt, and Content.');
            return;
        }
        const articleData = {
            title,
            author,
            excerpt,
            content,
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        };
        onSave(articleData);
    };

    const applyTag = (tag) => {
        // ... applyTag function remains the same
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4">{article?.id ? 'Edit Article' : 'New Article'}</h3>
            <div className="space-y-4">
                {/* Input fields for title, author, excerpt */}
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"/>
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"/>
                <textarea placeholder="Excerpt (short summary)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 h-24"></textarea>
                
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setView('editor')} className={`px-3 py-1 text-sm rounded-md ${view === 'editor' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}><Code size={16} className="inline mr-1"/> Editor</button>
                        <button onClick={() => setView('preview')} className={`px-3 py-1 text-sm rounded-md ${view === 'preview' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}><Eye size={16} className="inline mr-1"/> Preview</button>
                    </div>

                    {view === 'editor' ? (
                         <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
                            <Toolbar onCommand={applyTag} />
                            <textarea
                                ref={contentRef}
                                placeholder="Write your article content here. Select text and use the toolbar to format."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-3 bg-slate-100 dark:bg-slate-900 h-64 rounded-b-lg focus:outline-none font-mono"
                            ></textarea>
                        </div>
                    ) : (
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg h-[330px] overflow-y-auto">
                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <button onClick={onCancel} className="bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-lg">Cancel</button>
                <button onClick={handleSave} className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600">Save Article</button>
            </div>
        </div>
    );
};

export default ArticleEditor;
