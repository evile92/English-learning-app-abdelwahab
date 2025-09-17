// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // لقد أزلنا schema من هنا بشكل نهائي لأنها سبب المشكلة
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
    generationConfig: {
      // نطلب من النموذج الرد بصيغة JSON
      responseMimeType: "application/json",
      // نقلل الإبداع لضمان التزامه بتوليد JSON صحيح
      temperature: 0.2,
    },
    // نضيف إعدادات الأمان لتجاوز الحظر غير المبرر من Google
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

    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0) {
      console.error("Gemini API Error or Blocked Response:", JSON.stringify(result, null, 2));
      const errorMessage = result?.promptFeedback?.blockReason
        ? `تم حظر الرد بسبب: ${result.promptFeedback.blockReason}`
        : 'فشل استدعاء Gemini API. قد يكون السبب هو حظر الرد.';
      return res.status(geminiResponse.status || 500).json({ error: errorMessage });
    }

    const jsonText = result.candidates[0].content.parts[0].text;

    try {
      res.status(200).json(JSON.parse(jsonText));
    } catch (parseError) {
      console.error("فشل في تحليل JSON من Gemini:", jsonText);
      res.status(500).json({ error: 'فشل الخادم في معالجة رد الذكاء الاصطناعي.' });
    }

  } catch (error) {
    console.error("خطأ في دالة الخادم:", error);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
