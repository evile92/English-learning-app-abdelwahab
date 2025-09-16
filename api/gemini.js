// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body;
  // يتم الوصول إلى مفتاح الـ API بأمان هنا على الخادم، ولا يتم إرساله أبداً للمستخدم
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt || !schema) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt' أو 'schema'." });
  }

  // ✅ **الإصلاح النهائي: العودة إلى النموذج الأصلي والمستقر**
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
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

    if (!result.candidates || result.candidates.length === 0) {
        console.error("الـ API لم يرجع أي مرشحين أو محتوى فارغ.", result);
        return res.status(500).json({ error: 'الـ API لم يرجع أي محتوى.' });
    }

    const jsonText = result.candidates[0].content.parts[0].text;
    // نجاح: أرسل النتيجة مرة أخرى إلى الواجهة الأمامية
    res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    console.error("خطأ داخلي في دالة الخادم:", error);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
