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
            setError('Failed to fetch articles. You may need to create a Firestore Index.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // --- (هنا تم التصحيح الكامل لدالة الحفظ) ---
    const handleSaveArticle = async (articleData) => {
        try {
            if (editingArticle && editingArticle.id) {
                // تحديث مقال موجود
                const articleRef = doc(db, 'articles', editingArticle.id);
                await updateDoc(articleRef, {
                    ...articleData,
                    updatedAt: serverTimestamp() // إضافة تاريخ التحديث
                });
            } else {
                // إضافة مقال جديد
                await addDoc(collection(db, 'articles'), {
                    ...articleData,
                    createdAt: serverTimestamp(),
                    // إنشاء التاريخ عند الحفظ
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                });
            }
        } catch (e) {
            console.error("Error saving article:", e);
            alert("Failed to save the article. Please check the console for details.");
            return; // إيقاف الدالة عند حدوث خطأ
        }
        
        setEditingArticle(null); // إغلاق المحرر بعد الحفظ
        await fetchArticles(); // إعادة تحميل قائمة المقالات
    };

    const handleDeleteArticle = async (articleId) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            await deleteDoc(doc(db, 'articles', articleId));
            fetchArticles();
        }
    };

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
                    <button onClick={() => setEditingArticle({})} className="bg-sky-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
                        <Plus size={18} /> Add New Article
                    </button>
                    {loading && <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>}
                    {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg"><AlertCircle className="inline mr-2"/>{error}</div>}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {articles.map(article => (
                                <div key={article.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold">{article.title}</h4>
                                        <p className="text-sm text-slate-500">By {article.author} on {article.date || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setEditingArticle(article)} className="text-sky-500 hover:text-sky-700"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteArticle(article.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BlogManagement;
