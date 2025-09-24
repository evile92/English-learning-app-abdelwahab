// src/components/admin/ArticleEditor.js

import React, { useState, useRef } from 'react';
import { Bold, Italic, List, Heading3, Pilcrow, Eye, Code } from 'lucide-react';

// --- مكون شريط الأدوات ---
const Toolbar = ({ onCommand }) => {
    const buttons = [
        { command: 'b', icon: Bold, title: 'Bold' },
        { command: 'i', icon: Italic, title: 'Italic' },
        { command: 'p', icon: Pilcrow, title: 'Paragraph' },
        { command: 'h3', icon: Heading3, title: 'Heading 3' },
        { command: 'ul', icon: List, title: 'Unordered List' },
    ];

    return (
        <div className="flex items-center gap-2 p-2 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
            {buttons.map(({ command, icon: Icon, title }) => (
                <button
                    key={command}
                    title={title}
                    onClick={() => onCommand(command)}
                    className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                    <Icon size={18} />
                </button>
            ))}
        </div>
    );
};

const ArticleEditor = ({ article, onSave, onCancel }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [author, setAuthor] = useState(article?.author || 'Stellar Speak Team');
    const [excerpt, setExcerpt] = useState(article?.excerpt || '');
    const [content, setContent] = useState(article?.content || '');
    const [view, setView] = useState('editor'); // 'editor' or 'preview'
    const contentRef = useRef(null);

    // --- (هنا تم التصحيح الكامل للزر) ---
    const handleSave = () => {
        // التحقق من أن الحقول ليست فارغة
        if (!title.trim() || !excerpt.trim() || !content.trim()) {
            alert('Please fill in all fields: Title, Excerpt, and Content.');
            return;
        }

        // تجميع بيانات المقال
        const articleData = {
            title,
            author,
            excerpt,
            content,
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        };
        
        // إرسال البيانات إلى المكون الأب (BlogManagement) ليقوم بحفظها
        onSave(articleData);
    };

    // --- دالة لتطبيق التنسيق ---
    const applyTag = (tag) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        if (tag === 'ul') {
            const listItems = selectedText.split('\n').map(item => `    <li>${item}</li>`).join('\n');
            const newText = `<ul>\n${listItems}\n</ul>`;
            const updatedContent = content.substring(0, start) + newText + content.substring(end);
            setContent(updatedContent);
        } else {
            const newText = `<${tag}>${selectedText}</${tag}>`;
            const updatedContent = content.substring(0, start) + newText + content.substring(end);
            setContent(updatedContent);
        }
        
        textarea.focus();
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4">{article?.id ? 'Edit Article' : 'New Article'}</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"/>
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"/>
                <textarea placeholder="Excerpt (short summary)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 h-24"></textarea>
                
                {/* --- (محرر النصوص المطور) --- */}
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
