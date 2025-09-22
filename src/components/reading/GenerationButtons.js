// src/components/reading/GenerationButtons.js

import React from 'react';
import { Sparkles, Newspaper, MessageSquare, LoaderCircle } from 'lucide-react';

const GenerationButtons = ({ onGenerate, isGenerating, generationType }) => {
    return (
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-sm">
            <button
                onClick={() => onGenerate('story')}
                disabled={isGenerating}
                className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
                {isGenerating && generationType === 'story' ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={16} /> توليد قصة</>}
            </button>
            <button
                onClick={() => onGenerate('article')}
                disabled={isGenerating}
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
                {isGenerating && generationType === 'article' ? <LoaderCircle className="animate-spin" /> : <><Newspaper size={16} /> توليد مقال</>}
            </button>
            <button
                onClick={() => onGenerate('interactive-story')}
                disabled={isGenerating}
                className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
                {isGenerating && generationType === 'interactive-story' ? <LoaderCircle className="animate-spin" /> : <><MessageSquare size={16} /> قصة تفاعلية</>}
            </button>
        </div>
    );
};

export default GenerationButtons;
