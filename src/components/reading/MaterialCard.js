// src/components/reading/MaterialCard.js

import React from 'react';

const MaterialCard = ({ material, onClick }) => {
    return (
        <div
            onClick={() => onClick(material)}
            className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"
            dir="ltr"
        >
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${material.type === 'Story' || material.type === 'Interactive Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>
                {material.type}
            </span>
            <h3 className="text-xl font-bold mt-3 text-slate-800 dark:text-white">{material.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{material.content}</p>
        </div>
    );
};

export default MaterialCard;
