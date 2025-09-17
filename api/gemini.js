// api/gemini.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt /* schema قد يكون اختياريًا أثناء التشخيص */) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      // جرّب تعليق السطرين التاليين مؤقتًا إذا ظهرت مشاكل JSON/حظر:
      responseMimeType: schema ? "application/json" : undefined,
      responseSchema: schema || undefined,
      temperature: 0.3,
    },
    // يفضل عدم فرض BLOCK_NONE دائمًا؛ اتركها افتراضية أولًا
    // أو ابدأ بـ BLOCK_ONLY_HIGH كتوازن:
    // safetySettings: [
    //   { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
    //   { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
    //   { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
    //   { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    // ],
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API HTTP Error:", geminiResponse.status, JSON.stringify(result, null, 2));
      return res.status(geminiResponse.status).json({
        error: 'فشل استدعاء Gemini API.',
        details: result
      });
    }

    const cand = result?.candidates?.;
    const text = cand?.content?.parts?.?.text;

    // سجّل أسباب الإنهاء/السلامة للمساعدة في التشخيص
    const finish = cand?.finishReason || result?.promptFeedback?.blockReason;
    const safety = cand?.safetyRatings || result?.promptFeedback?.safetyRatings;

    if (!text) {
      console.error("Empty/Blocked candidate:", { finish, safety, result });
      return res.status(502).json({
        error: 'لم يتم استلام نص صالح من النموذج.',
        finishReason: finish || 'UNKNOWN',
        safetyRatings: safety || []
      });
    }

    // إذا كنت تتوقع JSON، تحقق قبل الـ parse:
    let data = null;
    if (schema) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse failed:", e, text);
        return res.status(502).json({
          error: 'فشل تحويل الاستجابة إلى JSON. جرّب تخفيف القيود أو إزالة responseMimeType مؤقتًا.',
          raw: text
        });
      }
    }

    return res.status(200).json(schema ? data : { text });
  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
