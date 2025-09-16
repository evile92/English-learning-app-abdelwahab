// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body;
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt || !schema) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt' أو 'schema'." });
  }

  // ✅ **الإصلاح النهائي والحقيقي: استخدام نسخة نموذج مستقرة ومجانية**
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    // ✅ إضافة بسيطة لزيادة استقرار الاستجابة
    safetySettings: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
        }
    ]
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("خطأ من Gemini API:", errorBody);
      return res.status(geminiResponse.status).json({ error: 'فشل استدعاء Gemini API الخارجي.' });
    }

    const result = await geminiResponse.json();

    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
        console.error("الـ API لم يرجع أي مرشحين أو محتوى فارغ.", result);
        return res.status(500).json({ error: 'الـ API لم يرجع أي محتوى صالح.' });
    }

    const jsonText = result.candidates[0].content.parts[0].text;
    res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    console.error("خطأ داخلي في دالة الخادم:", error);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
