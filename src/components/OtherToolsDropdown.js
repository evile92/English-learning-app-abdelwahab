// src/components/OtherToolsDropdown.js

import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, BookOpen, Edit3, Type, BrainCircuit, Mic, MessageSquare, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const tools = [
    { name: 'مركز القراءة', page: 'reading', icon: BookOpen },
    { name: 'دليل القواعد', page: 'grammar', icon: Edit3 },
    { name: 'قسم الكتابة', page: 'writing', icon: Type },
    { name: 'مدرب النطق', page: 'pronunciation', icon: Mic },
    { name: 'لعب الأدوار', page: 'roleplay', icon: MessageSquare },
    { name: 'المراجعة الذكية', page: 'review', icon: BrainCircuit },
    { name: 'التحضير للاختبارات', page: 'testPrep', icon: Award }, // <-- ✅ تم الإضافة هنا
];

const OtherToolsDropdown = () => {
    const { handlePageChange } = useAppContext();

    const handleSelect = (page) => {
        handlePageChange(page);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-white/10 dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    أدوات أخرى
                    <ChevronDown size={16} />
                </Menu.Button>
            </div>
            <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1">
                        {tools.map((tool) => (
                            <Menu.Item key={tool.page}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleSelect(tool.page)}
                                        className={`${
                                            active ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-slate-200'
                                        } group flex w-full items-center rounded-md px-3 py-2 text-sm text-right gap-3`}
                                    >
                                        <tool.icon size={16} />
                                        {tool.name}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default OtherToolsDropdown;
