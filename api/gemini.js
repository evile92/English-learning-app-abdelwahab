// api/gemini.js (النسخة النهائية والمستقرة)

module.exports = async (req, res) => {
  // التأكد من أن الطلب هو POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // استلام التعليمات (prompt) والبنية (schema) من الطلب
  const { prompt, schema } = req.body;
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  // التحقق من وجود مفتاح الـ API والبيانات المطلوبة
  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt || !schema) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt' أو 'schema'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.3, // يجعل الردود أكثر اتساقًا ودقة
    },
    // ✅ الجزء الأهم: هذا الكود يخبر Google بتجاوز فلاتر الأمان الافتراضية الصارمة
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  try {
    // إرسال الطلب إلى Google Gemini API
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    // معالجة محسنة للأخطاء: إذا فشل الطلب أو تم حظره، يتم إرجاع رسالة واضحة
    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0) {
      console.error("Gemini API Error or Blocked Response:", JSON.stringify(result, null, 2));
      return res.status(geminiResponse.status || 500).json({ error: 'فشل استدعاء Gemini API. قد يكون الرد قد تم حظره.' });
    }

    const jsonText = result.candidates[0].content.parts[0].text;
    
    // إرسال الرد الناجح إلى التطبيق
    res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
