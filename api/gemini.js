// api/gemini.js (النسخة النهائية والمستقرة)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // لقد قمنا بإزالة schema من هنا لأننا لن نستخدمها للتحقق الصارم
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
      // نقلل الإبداع لضمان التزامه بالتعليمات وتوليد JSON صحيح
      temperature: 0.2, 
    },
    // نضيف إعدادات الأمان لتجاوز الحظر غير المبرر
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

    // معالجة محسنة للأخطاء للتعرف على سبب الفشل
    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0) {
      console.error("Gemini API Error or Blocked Response:", JSON.stringify(result, null, 2));
      const errorMessage = result?.promptFeedback?.blockReason 
        ? `تم حظر الرد بسبب: ${result.promptFeedback.blockReason}`
        : 'فشل استدعاء Gemini API. قد يكون السبب هو حظر الرد.';
      return res.status(geminiResponse.status || 500).json({ error: errorMessage });
    }

    const jsonText = result.candidates[0].content.parts[0].text;
    
    // محاولة تحليل الـ JSON وإرسال خطأ واضح إذا فشل التحليل
    try {
      res.status(200).json(JSON.parse(jsonText));
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", jsonText);
      res.status(500).json({ error: 'فشل الخادم في معالجة رد الذكاء الاصطناعي.' });
    }

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
