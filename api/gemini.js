// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    // ✅ بداية الإضافة: إضافة إعدادات الأمان والإبداع
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2, // تقليل الإبداع لضمان الحصول على JSON صحيح
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
      },
    ],
    // 🛑 نهاية الإضافة
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    // ✅ تحسين معالجة الأخط
    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0) {
      console.error("خطأ من Gemini API أو رد فارغ:", JSON.stringify(result, null, 2));
      const errorMessage = result?.promptFeedback?.blockReason 
        ? `تم حظر الرد بسبب: ${result.promptFeedback.blockReason}`
        : 'فشل استدعاء Gemini API الخارجي.';
      return res.status(geminiResponse.status).json({ error: errorMessage });
    }

    const jsonText = result.candidates[0].content.parts[0].text;
    res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    console.error("خطأ داخلي في دالة الخادم:", error);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
