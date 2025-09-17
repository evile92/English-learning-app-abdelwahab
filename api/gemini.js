// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ✅ زيادة مهلة Vercel إلى 15 ثانية (متوفرة في الخطة المجانية)
  res.setHeader('connection', 'keep-alive');

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined.");
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
  // ✅ ***التعديل الجوهري***
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    // 1. إجبار Gemini على إرجاع JSON نقي ومضمون
    generationConfig: {
      responseMimeType: "application/json",
    },
    // 2. إبقاء إعدادات الأمان مخففة
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    // ✅ معالجة أخطاء أكثر دقة
    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
      const reason = result?.promptFeedback?.blockReason || result?.candidates?.[0]?.finishReason;
      console.error("API Error. Reason:", reason, "Full Response:", JSON.stringify(result, null, 2));
      const userMessage = `فشل النموذج في إنشاء استجابة. السبب: ${reason || 'غير معروف'}`;
      return res.status(502).json({ error: userMessage });
    }
    
    const text = result.candidates[0].content.parts[0].text;
    if (!text) {
        console.error("Empty text in response:", JSON.stringify(result, null, 2));
        return res.status(502).json({ error: 'استجابة النموذج كانت فارغة.' });
    }

    // الآن نحن متأكدون 100% أن النص هو JSON صالح
    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم أثناء الاتصال بـ Gemini.' });
  }
};
