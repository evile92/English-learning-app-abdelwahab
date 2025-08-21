// src/components/OtherToolsDropdown.js

import React from 'react';
import { Voicemail, BookMarked, History, Target, Search, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const otherTools = [
    { id: 'pronunciation', label: 'نطق', icon: Voicemail, description: 'استمع وتدرب على النطق الصحيح' },
    { id: 'vocabulary', label: 'قاموسي', icon: BookMarked, description: 'راجع الكلمات التي قمت بحفظها' },
    { id: 'review', label: 'مراجعة', icon: History, description: 'جلسات مراجعة ذكية لترسيخ المعلومات' },
    { id: 'weakPoints', label: 'نقاط ضعفي', icon: Target, description: 'احصل على تدريب مخصص لأخطائك' },
    { id: 'search', label: 'بحث', icon: Search, description: 'ابحث عن أي درس في جميع المستويات' },
];

const OtherToolsDropdown = () => {
    const { handlePageChange } = useAppContext();
    const [isOpen, setIsOpen] = React.useState(false);

    const navigateAndClose = (page) => {
        handlePageChange(page);
        setIsOpen(false);
    };

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
                <span className="text-sm">أدوات أخرى</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-fast"
                    style={{ zIndex: 50 }}
                >
                    <div className="py-2">
                        {otherTools.map((tool, index) => (
                            <button
                                key={tool.id}
                                onClick={() => navigateAndClose(tool.id)}
                                className="w-full text-right px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors group relative"
                            >
                                <div className="flex items-center gap-4">
                                    <tool.icon size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                                    <div>
                                        <p className="font-semibold">{tool.label}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
                                    </div>
                                </div>
                                {index < otherTools.length - 1 && (
                                    <div className="absolute bottom-0 left-4 right-4 h-px bg-slate-100 dark:bg-slate-700/50 group-hover:bg-transparent dark:group-hover:bg-transparent"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OtherToolsDropdown;
