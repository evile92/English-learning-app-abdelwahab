// src/hooks/useWeakPoints.js

import { useState, useCallback } from 'react';
import { arrayUnion } from "firebase/firestore";
import { runGemini } from '../helpers/geminiHelper';
import { usePersistentState } from './usePersistentState';

export const useWeakPoints = (user, errorLog, updateUserData, setPage) => {
    const [weakPoints, setWeakPoints] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [weakPointsQuiz, setWeakPointsQuiz] = useState(null);
    const [lastTrainingDate, setLastTrainingDate] = usePersistentState('stellarSpeakLastTraining', null);

    const canTrainAgain = !lastTrainingDate || new Date().toDateString() !== new Date(lastTrainingDate).toDateString();

    const logError = useCallback(async (questionTopic) => {
        if (!user || !questionTopic) return;
        await updateUserData({
            errorLog: arrayUnion({ topic: questionTopic, date: new Date().toISOString() })
        });
    }, [user, updateUserData]);
    
    const analyzeWeakPoints = useCallback(async () => {
        // ... (منطق تحليل نقاط الضعف كما هو)
    }, [errorLog]);

    const startWeakPointsTraining = useCallback(async () => {
        // ... (منطق بدء تدريب نقاط الضعف كما هو)
    }, [user, weakPoints, canTrainAgain, setPage, updateUserData]);

    const handleWeakPointsQuizComplete = useCallback((answers) => {
        // ... (منطق إكمال اختبار نقاط الضعف كما هو)
    }, [weakPointsQuiz, setPage]);

    return {
        logError,
        weakPoints,
        isAnalyzing,
        analyzeWeakPoints,
        startWeakPointsTraining,
        weakPointsQuiz,
        handleWeakPointsQuizComplete,
        lastTrainingDate,
        canTrainAgain
    };
};
