// src/components/ClickableText.js

import React from 'react';

const ClickableText = ({ content, onWordClick }) => {
    return (
        <p dir="ltr" className="prose dark:prose-invert max-w-none text-lg text-left leading-relaxed">
            {content.split(/(\s+)/).map((segment, index) => (
                segment.trim() ?
                <span key={index} onClick={() => onWordClick(segment)} className="cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-md p-0.5 -m-0.5 transition-colors">
                    {segment}
                </span> :
                <span key={index}>{segment}</span>
            ))}
        </p>
    );
};

export default ClickableText;
