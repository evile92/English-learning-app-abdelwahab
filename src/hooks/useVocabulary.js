// src/hooks/useVocabulary.js

import { useCallback } from 'react';
import { arrayUnion, arrayRemove, deleteField } from "firebase/firestore";

// ✅ تعديل المدخلات لتلقي الدوال الصحيحة
export const useVocabulary = (user, userData, setUserData, updateUserDoc, setShowRegisterPrompt) => {

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
        
        const newWord = { en: englishWord.toLowerCase().trim(), ar: arabicTranslation.trim() };
        if (!newWord.en || !newWord.ar) return;

        // التحقق مما إذا كانت الكلمة موجودة بالفعل في الحالة الحالية
        if (userData.myVocabulary && userData.myVocabulary.some(v => v.en === newWord.en)) {
            alert(`"${englishWord}" موجودة بالفعل في قاموسك.`);
            return;
        }

        // ✅ الخطوة 1: تحديث الواجهة فورًا (التحديث المتفائل)
        setUserData(prevData => ({
            ...prevData,
            myVocabulary: [...prevData.myVocabulary, newWord],
            reviewSchedule: {
                ...prevData.reviewSchedule,
                vocabulary: {
                    ...prevData.reviewSchedule.vocabulary,
                    [newWord.en]: { level: 0, nextReviewDate: getNextReviewDate(0) }
                }
            }
        }));
        
        // ✅ الخطوة 2: تحديث قاعدة البيانات في الخلفية بهدوء
        try {
            await updateUserDoc({
                myVocabulary: arrayUnion(newWord),
                [`reviewSchedule.vocabulary.${newWord.en}`]: { level: 0, nextReviewDate: getNextReviewDate(0) }
            });
            alert(`تم حفظ "${englishWord}" في قاموسك وجدولتها للمراجعة!`);
        } catch (error) {
            console.error("Error saving word:", error);
            alert("حدث خطأ أثناء حفظ الكلمة في قاعدة البيانات.");
        }
    }, [user, userData, setUserData, updateUserDoc, setShowRegisterPrompt]);

    const handleDeleteWord = useCallback(async (wordToDelete) => {
        if (!user) return;
        const confirmDelete = window.confirm(`هل أنت متأكد من أنك تريد حذف كلمة "${wordToDelete.en}" من قاموسك؟`);
        if (!confirmDelete) return;

        setUserData(prevData => {
            const newVocab = prevData.myVocabulary.filter(v => v.en !== wordToDelete.en);
            const newSchedule = { ...prevData.reviewSchedule.vocabulary };
            delete newSchedule[wordToDelete.en];
            return {
                ...prevData,
                myVocabulary: newVocab,
                reviewSchedule: { ...prevData.reviewSchedule, vocabulary: newSchedule }
            };
        });

        try {
            await updateUserDoc({
                myVocabulary: arrayRemove(wordToDelete),
                [`reviewSchedule.vocabulary.${wordToDelete.en}`]: deleteField()
            });
            alert(`تم حذف "${wordToDelete.en}" بنجاح.`);
        } catch (error) {
            console.error("Error deleting word:", error);
            alert("حدث خطأ أثناء حذف الكلمة من قاعدة البيانات.");
        }
    }, [user, setUserData, updateUserDoc]);

    return { handleSaveWord, handleDeleteWord };
};
