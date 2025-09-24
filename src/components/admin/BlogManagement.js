// src/components/admin/BlogManagement.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { BookOpen, Loader, Plus, Edit, Trash2 } from 'lucide-react';
import ArticleEditor from './ArticleEditor';

const BlogManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingArticle, setEditingArticle] = useState(null); // null for new, or article object for editing

    const fetchArticles = async () => {
        setLoading(true);
        const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const articlesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(articlesList);
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleSaveArticle = async (articleData) => {
        if (editingArticle && editingArticle.id) {
            // Update existing article
            const articleRef = doc(db, 'articles', editingArticle.id);
            await updateDoc(articleRef, articleData);
        } else {
            // Add new article
            await addDoc(collection(db, 'articles'), {
                ...articleData,
                createdAt: serverTimestamp()
            });
        }
        setEditingArticle(null);
        fetchArticles(); // Refresh list
    };

    const handleDeleteArticle = async (articleId) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            await deleteDoc(doc(db, 'articles', articleId));
            fetchArticles(); // Refresh list
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>;
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
                </>
            )}
        </div>
    );
};

export default BlogManagement;
