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

    // --- ✅ بداية الإصلاح: تعديل الدالة لتكون مرنة ---
    const handleSaveWord = useCallback(async (arg1, arg2) => {
        if (!user) {
            setShowRegisterPrompt(true);
            return;
        }

        let englishWord;
        let arabicTranslation;

        // التحقق من طريقة استدعاء الدالة
        if (typeof arg1 === 'object' && arg1 !== null && arg1.en && arg1.ar) {
            // الحالة الأولى: تم تمرير كائن واحد (من صفحة MyVocabulary)
            englishWord = arg1.en;
            arabicTranslation = arg1.ar;
        } else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
            // الحالة الثانية: تم تمرير كلمتين (من صفحة ReadingCenter)
            englishWord = arg1;
            arabicTranslation = arg2;
        } else {
            // إذا كانت البيانات غير متوقعة، أوقف التنفيذ
            console.error("Invalid arguments passed to handleSaveWord:", arg1, arg2);
            alert("حدث خطأ غير متوقع أثناء محاولة حفظ الكلمة.");
            return;
        }
        
        const newWord = { en: englishWord.toLowerCase().trim(), ar: arabicTranslation.trim() };

        // التأكد من أن الكلمة ليست فارغة
        if (!newWord.en || !newWord.ar) return;
        
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
    // --- 🛑 نهاية الإصلاح ---

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
