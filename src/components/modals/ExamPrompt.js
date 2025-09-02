import React from 'react';
import { Award } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function ExamPrompt() {
    const { examPromptForLevel, startFinalExam, setExamPromptForLevel } = useAppContext();

    const handleStartExamFromPrompt = () => {
        startFinalExam(examPromptForLevel);
        setExamPromptForLevel(null);
    };

    if (!examPromptForLevel) return null;

    return (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <button
                onClick={handleStartExamFromPrompt}
                className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 animate-pulse"
            >
                <Award size={20} />
                <span>ابدأ الامتحان النهائي للمستوى {examPromptForLevel}</span>
            </button>
        </div>
    );
}
