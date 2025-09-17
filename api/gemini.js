// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // لم نعد بحاجة إلى schema هنا، فالـ prompt يطلب JSON بالفعل
  const { prompt } = req.body;
  
  // ✅ 1. استخدام اسم المتغير الصحيح الذي يقرأه خادم Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    // ✅ 2. إزالة الإعدادات الصارمة التي تسبب الفشل عند الحظر الأمني
    // generationConfig تم حذفه بالكامل لزيادة الموثوقية
    safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API Error:", geminiResponse.status, JSON.stringify(result, null, 2));
      return res.status(geminiResponse.status).json({ error: 'فشل استدعاء Gemini API.', details: result });
    }

    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
      const reason = result?.promptFeedback?.blockReason || result?.candidates?.[0]?.finishReason;
      console.error("No valid candidates. Reason:", reason, JSON.stringify(result, null, 2));
      return res.status(502).json({ error: `لم يتم استلام محتوى صالح. السبب المحتمل: ${reason}` });
    }
    
    const text = result.candidates[0].content.parts[0].text;

    if (!text) {
        return res.status(502).json({ error: 'استجابة النموذج كانت فارغة.' });
    }

    // ✅ 3. تحليل الاستجابة بذكاء
    try {
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
      const data = JSON.parse(cleanedText);
      return res.status(200).json(data);
    } catch (e) {
      console.error("JSON parse failed:", e, "Raw text:", text);
      return res.status(502).json({ error: 'فشل تحليل الاستجابة من النموذج.', raw: text });
    }

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
