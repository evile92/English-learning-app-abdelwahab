import React from 'react';
import { Edit3, BookOpen, List } from 'lucide-react';

const ContentManagement = () => {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Edit3 /> Content Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><List/> Vocabulary Lists</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">This section will allow you to add, edit, or delete vocabulary categories and terms directly from the dashboard.</p>
                    <button disabled className="mt-4 bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded-lg text-xs cursor-not-allowed">Coming Soon</button>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><BookOpen/> Blog Posts</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">A full content editor to write, publish, and manage blog articles without needing to touch the code.</p>
                    <button disabled className="mt-4 bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded-lg text-xs cursor-not-allowed">Coming Soon</button>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
