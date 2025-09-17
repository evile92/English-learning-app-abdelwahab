// api/gemini.js (كود نهائي للتشخيص والتعامل مع الأمان)
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body; // نسترجع schema
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      // نرجع لطلب JSON إذا كان schema موجوداً
      responseMimeType: schema ? "application/json" : "text/plain",
      responseSchema: schema || undefined,
      temperature: 0.7, // يمكن زيادة الحرارة قليلاً للقصص
    },
    // الأهم: إضافة إعدادات أمان متوازنة
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

    // إذا فشل الطلب نفسه (مثل 400, 429)
    if (!geminiResponse.ok) {
      console.error("Gemini API HTTP Error:", geminiResponse.status, JSON.stringify(result, null, 2));
      return res.status(geminiResponse.status).json({
        error: 'فشل استدعاء Gemini API.',
        details: result.error ? result.error.message : result
      });
    }

    // إذا لم يتم إرجاع أي مرشحين (غالباً بسبب حظر الطلب الأولي)
    if (!result.candidates || result.candidates.length === 0) {
      const blockReason = result.promptFeedback?.blockReason;
      console.error("Request blocked by API. Reason:", blockReason, JSON.stringify(result.promptFeedback, null, 2));
      return res.status(502).json({
        error: `تم حظر الطلب من قبل Gemini. السبب: ${blockReason || 'غير معروف'}.`,
        details: result.promptFeedback
      });
    }

    const candidate = result.candidates[0];
    const text = candidate.content?.parts?.[0]?.text;

    // إذا كان هناك مرشح لكنه فارغ (غالباً بسبب حظر الاستجابة)
    if (!text) {
      const finishReason = candidate.finishReason;
      console.error("Response blocked by API. Finish Reason:", finishReason, JSON.stringify(candidate.safetyRatings, null, 2));
      return res.status(502).json({
        error: `تم حظر استجابة Gemini. السبب: ${finishReason || 'غير معروف'}.`,
        details: { finishReason: finishReason, safetyRatings: candidate.safetyRatings }
      });
    }
    
    // إذا كان من المفترض أن تكون الاستجابة JSON
    if (schema) {
      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (e) {
        console.error("JSON parse failed. Raw text:", text);
        return res.status(502).json({ error: 'فشل تحليل استجابة JSON من النموذج.', raw: text });
      }
    }

    // إذا كانت الاستجابة نصاً عادياً
    return res.status(200).json({ text });

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
