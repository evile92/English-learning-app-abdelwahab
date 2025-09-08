// src/hooks/useVocabulary.js

import { useCallback } from 'react';
import { arrayUnion, arrayRemove, deleteField } from "firebase/firestore";

export const useVocabulary = (user, updateUserData, setShowRegisterPrompt) => {

    const getNextReviewDate = (currentLevel = 0) => {
        const intervals = [1, 3, 7, 14, 30, 60, 120];
        const nextLevel = Math.min(currentLevel, intervals.length - 1);
        const date = new Date();
        date.setDate(date.getDate() + intervals[nextLevel]);
        return date.toISOString().split('T')[0];
    };

    const handleSaveWord = useCallback(async (englishWord, arabicTranslation) => {
        if (!user) {
            setShowRegisterPrompt(true);
            return;
        }
        const newWord = { en: englishWord.toLowerCase(), ar: arabicTranslation };
        
        try {
            await updateUserData({
                myVocabulary: arrayUnion(newWord),
                [`reviewSchedule.vocabulary.${newWord.en}`]: { level: 0, nextReviewDate: getNextReviewDate(0) }
            });
            alert(`تم حفظ "${englishWord}" في قاموسك وجدولتها للمراجعة!`);
        } catch (error) {
            console.error("Error saving word:", error);
            alert("حدث خطأ أثناء حفظ الكلمة.");
        }
    }, [user, updateUserData, setShowRegisterPrompt]);

    const handleDeleteWord = useCallback(async (wordToDelete) => {
        if (!user) return;

        const confirmDelete = window.confirm(`هل أنت متأكد من أنك تريد حذف كلمة "${wordToDelete.en}" من قاموسك؟`);
        if (!confirmDelete) return;

        try {
            await updateUserData({
                myVocabulary: arrayRemove(wordToDelete),
                [`reviewSchedule.vocabulary.${wordToDelete.en}`]: deleteField()
            });
            alert(`تم حذف "${wordToDelete.en}" بنجاح.`);
        } catch (error) {
            console.error("Error deleting word:", error);
            alert("حدث خطأ أثناء حذف الكلمة.");
        }
    }, [user, updateUserData]);

    return { handleSaveWord, handleDeleteWord };
};
