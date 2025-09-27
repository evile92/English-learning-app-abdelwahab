// src/helpers/geminiHelper.js

// 🆕 إضافة استيراد Error Handler فقط
import { errorHandler, logError, AppError, ErrorCodes } from '../utils/errorHandler';

// ملاحظة:
// - القصص/الدروس تحصل على JSON جاهز من الخادم (api/gemini).
// - المحادثة الآن غير متدفقة وتعود ككائن JSON يحتوي الحقل response فقط من (api/gemini-chat).

// قصص/مقالات/دروس: نستلم JSON مضبوط من الخادم
export const runGemini = async (prompt, mode = 'story', schema) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode, schema })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // 🆕 تسجيل خطأ الخادم
      const serverError = new AppError(
        `خطأ في خادم Gemini: ${errorBody}`, 
        ErrorCodes.API_SERVER_ERROR, 
        'high'
      );
      await logError(serverError, 'Gemini API Server Error');
      throw new Error(`The server responded with an error: ${errorBody}`);
    }

    // الخادم يُعيد JSON نهائي مطابقاً للمخطط
    return await response.json();
    
  } catch (error) {
    // 🆕 معالجة أخطاء الشبكة والاتصال
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new AppError(
        'فشل الاتصال بخدمة الذكي الاصطناعي - تحقق من الاتصال',
        ErrorCodes.FIREBASE_NETWORK_ERROR,
        'critical'
      );
      await logError(networkError, 'Gemini Network Error');
    } else if (!error.message.includes('The server responded with an error')) {
      // 🆕 فقط سجل الأخطاء الأخرى (غير أخطاء الخادم التي سُجلت بالفعل)
      await logError(error, 'Gemini API Error', { prompt: prompt?.substring(0, 100), mode, schema });
    }
    
    // 🆕 إعادة نفس الخطأ بدون تغيير
    throw error;
  }
};

// اختصارات للوضوح إذا كنت تستخدمها في الواجهة:
export const runGeminiStory = (prompt) => runGemini(prompt, 'story');
export const runGeminiArticle = (prompt) => runGemini(prompt, 'article');
export const runGeminiLesson = (prompt) => runGemini(prompt, 'lesson');

// المحادثة: غير متدفقة الآن وتعود كـ JSON { response: "النص" }
export const runGeminiChat = async (history) => {
  try {
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // 🆕 تسجيل خطأ الخادم
      const serverError = new AppError(
        `خطأ في خادم المحادثة: ${errorBody}`,
        ErrorCodes.API_SERVER_ERROR,
        'high'
      );
      await logError(serverError, 'Gemini Chat Server Error');
      throw new Error(`Server responded with an error: ${errorBody}`);
    }

    // الخادم يعيد { response: "..." }
    const data = await response.json();
    return { response: (data?.response || '').trim() };
    
  } catch (error) {
    // 🆕 معالجة أخطاء الشبكة
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new AppError(
        'فشل الاتصال بخدمة المحادثة - تحقق من الاتصال',
        ErrorCodes.FIREBASE_NETWORK_ERROR,
        'critical'
      );
      await logError(networkError, 'Gemini Chat Network Error');
    } else if (!error.message.includes('Server responded with an error')) {
      // 🆕 تسجيل الأخطاء الأخرى
      await logError(error, 'Gemini Chat Error', { historyLength: history?.length });
    }
    
    // 🆕 إعادة نفس الخطأ بدون تغيير
    throw error;
  }
};
