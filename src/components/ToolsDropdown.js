// src/components/ToolsDropdown.js

import React from 'react';
import { Library, Feather, Mic, Voicemail, BookMarked, History, Target, Search, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const tools = [
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'pronunciation', label: 'نطق', icon: Voicemail },
    { id: 'vocabulary', label: 'قاموسي', icon: BookMarked },
    { id: 'review', label: 'مراجعة', icon: History },
    { id: 'weakPoints', label: 'نقاط ضعفي', icon: Target },
    { id: 'search', label: 'بحث', icon: Search },
];

const ToolsDropdown = () => {
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
                <span className="text-sm">أدوات التعلم</span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-fast"
                    style={{ zIndex: 50 }}
                >
                    <div className="py-2">
                        {tools.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => navigateAndClose(tool.id)}
                                className="w-full text-right flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <tool.icon size={18} />
                                <span>{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolsDropdown;
