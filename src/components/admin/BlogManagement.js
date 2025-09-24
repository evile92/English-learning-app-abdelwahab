// src/components/admin/BlogManagement.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { BookOpen, Loader, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import ArticleEditor from './ArticleEditor';

const BlogManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingArticle, setEditingArticle] = useState(null);

    const fetchArticles = async () => {
        setLoading(true);
        setError('');
        try {
            const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const articlesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setArticles(articlesList);
        } catch (err) {
            console.error("Firebase error:", err);
            setError('فشل في جلب المقالات. قد تحتاج إلى إنشاء فهرس (Index) في Firestore. افتح الـ console في المتصفح لرؤية الرابط.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleSaveArticle = async (articleData) => {
        // ... (This function remains the same)
    };

    const handleDeleteArticle = async (articleId) => {
        // ... (This function remains the same)
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                <div className="flex items-center gap-2 font-bold">
                    <AlertCircle />
                    <p>حدث خطأ</p>
                </div>
                <p className="mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><BookOpen /> Blog Management</h2>

            {editingArticle !== null ? (
                <ArticleEditor
                    article={editingArticle}
                    onSave={handleSaveArticle}
                    onCancel={() => setEditingArticle(null)}
                />
            ) : (
                <>
                    <button onClick={() => setEditingArticle({})} className="bg-sky-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2 hover:bg-sky-600 transition-colors">
                        <Plus size={18} /> Add New Article
                    </button>
                    
                    {articles.length > 0 ? (
                        <div className="space-y-4">
                            {articles.map(article => (
                                <div key={article.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold">{article.title}</h4>
                                        <p className="text-sm text-slate-500">By {article.author} on {article.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setEditingArticle(article)} className="text-sky-500 hover:text-sky-700"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteArticle(article.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">No articles found. Click "Add New Article" to create one.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default BlogManagement;
