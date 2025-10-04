// src/hooks/useLessonResult.js
import { useState } from 'react';

export const useLessonResult = (handleCompleteLesson) => {
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    const PASSING_SCORE = 5;

    const handleQuizComplete = (score, total) => {
        setQuizResult({ score, total });
        return score >= PASSING_SCORE ? 'result' : 'reviewPrompt';
    };

    const handleLessonCompletion = (lessonId) => {
        setIsCompleting(true);
        setTimeout(() => {
            handleCompleteLesson(lessonId, quizResult.score, quizResult.total);
        }, 500);
    };

    return {
        quizResult,
        isCompleting,
        handleQuizComplete,
        handleLessonCompletion
    };
};
