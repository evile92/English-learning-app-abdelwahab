// src/hooks/useVocabulary.js

import { useCallback } from 'react';
import { arrayUnion, arrayRemove, deleteField } from "firebase/firestore";
// 🔧 تصحيح الاستيراد - إزالة createError
import { errorHandler, logError, AppError, ErrorCodes } from '../utils/errorHandler';

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
        
        // 🔧 استخدام new AppError بدلاً من createError
        if (!englishWord || !arabicTranslation) {
            const validationError = new AppError(
                'يجب إدخال الكلمة الإنجليزية والترجمة العربية',
                ErrorCodes.VALIDATION_ERROR,
                'low'
            );
            const handledError = await logError(validationError, 'Save Word Validation');
            alert(handledError.message);
            return;
        }
        
        const newWord = { 
            en: englishWord.toLowerCase().trim(), 
            ar: arabicTranslation.trim(),
            // 🆕 إضافة تاريخ الإضافة للتتبع
            addedAt: new Date().toISOString()
        };

        // التحقق مما إذا كانت الكلمة موجودة بالفعل في الحالة الحالية
        if (userData.myVocabulary && userData.myVocabulary.some(v => v.en === newWord.en)) {
            alert(`"${englishWord}" موجودة بالفعل في قاموسك.`);
            return;
        }

        // 🆕 حفظ الحالة السابقة للـ Rollback
        const previousVocabulary = [...userData.myVocabulary];
        const previousSchedule = {...userData.reviewSchedule.vocabulary};

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
            alert(`✅ تم حفظ "${englishWord}" في قاموسك وجدولتها للمراجعة!`);
            
        } catch (error) {
            console.error("Error saving word:", error);
            
            // 🆕 Rollback - إعادة الحالة السابقة
            setUserData(prevData => ({
                ...prevData,
                myVocabulary: previousVocabulary,
                reviewSchedule: {
                    ...prevData.reviewSchedule,
                    vocabulary: previousSchedule
                }
            }));
            
            // 🆕 معالجة وتسجيل الخطأ
            let handledError;
            if (error.code && error.code.startsWith('permission-denied')) {
                handledError = errorHandler.firebase(error);
            } else {
                handledError = await logError(error, 'Save Vocabulary', user.uid);
            }
            
            alert(`❌ ${handledError.message}`);
            
            // 🆕 تسجيل تفاصيل إضافية
            await logError(error, 'Save Word Failed', {
                userId: user.uid,
                wordData: newWord,
                vocabularyCount: userData.myVocabulary.length
            });
        }
    }, [user, userData, setUserData, updateUserDoc, setShowRegisterPrompt]);

    const handleDeleteWord = useCallback(async (wordToDelete) => {
        if (!user) return;
        
        // 🔧 استخدام new AppError بدلاً من createError
        if (!wordToDelete || !wordToDelete.en) {
            const validationError = new AppError(
                'بيانات الكلمة غير صحيحة',
                ErrorCodes.VALIDATION_ERROR,
                'low'
            );
            const handledError = await logError(validationError, 'Delete Word Validation');
            alert(handledError.message);
            return;
        }
        
        const confirmDelete = window.confirm(`هل أنت متأكد من أنك تريد حذف كلمة "${wordToDelete.en}" من قاموسك؟`);
        if (!confirmDelete) return;

        // 🆕 حفظ الحالة السابقة
        const previousVocabulary = [...userData.myVocabulary];
        const previousSchedule = {...userData.reviewSchedule.vocabulary};

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
            alert(`✅ تم حذف "${wordToDelete.en}" بنجاح.`);
            
        } catch (error) {
            console.error("Error deleting word:", error);
            
            // 🆕 Rollback
            setUserData(prevData => ({
                ...prevData,
                myVocabulary: previousVocabulary,
                reviewSchedule: {
                    ...prevData.reviewSchedule,
                    vocabulary: previousSchedule
                }
            }));
            
            // 🆕 معالجة الخطأ
            const handledError = await logError(error, 'Delete Vocabulary', user.uid);
            alert(`❌ ${handledError.message}`);
            
            await logError(error, 'Delete Word Failed', {
                userId: user.uid,
                wordData: wordToDelete
            });
        }
    }, [user, userData, setUserData, updateUserDoc]);

    return { handleSaveWord, handleDeleteWord };
};
