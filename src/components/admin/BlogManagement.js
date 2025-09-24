// src/components/admin/BlogManagement.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { BookOpen, Loader, Plus, Edit, Trash2 } from 'lucide-react';
import ArticleEditor from './ArticleEditor';

const BlogManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingArticle, setEditingArticle] = useState(null); // null for new, or article object for editing

    const fetchArticles = async () => {
        const querySnapshot = await getDocs(collection(db, 'articles'));
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
    
    // ... (الكود السابق) ...
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
                    <button onClick={() => setEditingArticle({})} className="bg-sky-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><Plus /> Add New Article</button>
                    {/* ... (عرض قائمة المقالات) ... */}
                </>
            )}
        </div>
    );
}

export default BlogManagement;
