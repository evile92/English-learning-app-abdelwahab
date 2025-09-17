// src/helpers/geminiHelper.js

/**
 * دالة أساسية للاتصال بـ Gemini API مباشرة من المتصفح.
 * @param {string} prompt - النص المطلوب إرساله إلى النموذج.
 * @param {boolean} isChat - تحديد ما إذا كان الطلب للمحادثة.
 * @param {Array} history - سجل المحادثة.
 * @returns {Promise<string>} - النص الذي تم توليده بواسطة النموذج.
 */
async function callGeminiAPI(prompt, isChat = false, history = []) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("مفتاح Gemini API غير موجود. يرجى التأكد من إضافته إلى ملف .env.local");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const contents = isChat 
    ? history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    : [{ role: "user", parts: [{ text: prompt }] }];

  const payload = { contents };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`فشل طلب الـ API بحالة: ${response.status}`);
    }

    const result = await response.json();

    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
      const reason = result?.promptFeedback?.blockReason;
      console.error("No valid candidates from API. Reason:", reason);
      throw new Error(reason ? `تم حظر الاستجابة بسبب: ${reason}` : 'لم يتم استلام استجابة صالحة من النموذج.');
    }

    return result.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("خطأ أثناء الاتصال بـ Gemini:", error);
    throw new Error("فشل الاتصال بالخادم الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  }
}

/**
 * دالة لتوليد محتوى بصيغة JSON (للدروس، القصص، إلخ).
 */
export async function runGemini(prompt, schema) {
  const textResponse = await callGeminiAPI(prompt);
  try {
    const cleanedText = textResponse.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("فشل في تحليل الـ JSON:", e, "النص المستلم:", textResponse);
    throw new Error("فشل تحليل الاستجابة من النموذج، لم تكن بصيغة JSON صالحة.");
  }
}

/**
 * دالة مخصصة للمحادثة (لعب الأدوار).
 */
export async function runGeminiChat(history) {
    const textResponse = await callGeminiAPI(null, true, history);
    return { response: textResponse };
}
