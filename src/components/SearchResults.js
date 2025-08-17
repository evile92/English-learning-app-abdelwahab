import React from 'react';

const SearchResults = ({ results, onSelectLesson, onClose }) => {
    if (results.length === 0) {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
            <div 
                className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {results.length > 0 ? results.map(lesson => (
                        <div 
                            key={lesson.id} 
                            onClick={() => onSelectLesson(lesson)}
                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                        >
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">المستوى: {lesson.id.substring(0,2)}</p>
                        </div>
                    )) : <p className="text-center text-slate-500 p-4">لا توجد نتائج</p>}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
