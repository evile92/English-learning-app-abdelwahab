// src/helpers/geminiHelper.js

// ملاحظة:
// - القصص/الدروس تحصل على JSON جاهز من الخادم (api/gemini).
// - المحادثة الآن غير متدفقة وتعود ككائن JSON يحتوي الحقل response فقط من (api/gemini-chat).

// قصص/مقالات/دروس: نستلم JSON مضبوط من الخادم
export const runGemini = async (prompt, mode = 'story', schema) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mode, schema })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`The server responded with an error: ${errorBody}`);
  }

  // الخادم يُعيد JSON نهائي مطابقاً للمخطط
  return await response.json();
};

// اختصارات للوضوح إذا كنت تستخدمها في الواجهة:
export const runGeminiStory = (prompt) => runGemini(prompt, 'story');
export const runGeminiArticle = (prompt) => runGemini(prompt, 'article');
export const runGeminiLesson = (prompt) => runGemini(prompt, 'lesson');

// المحادثة: غير متدفقة الآن وتعود كـ JSON { response: "النص" }
export const runGeminiChat = async (history) => {
  const response = await fetch('/api/gemini-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Server responded with an error: ${errorBody}`);
  }

  // الخادم يعيد { response: "..." }
  const data = await response.json();
  return { response: (data?.response || '').trim() };
};
