// api/gemini.js
module.exports = async (req, res) => {
  // 1. التحقق من أن الطلب من نوع POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. التحقق من وجود مفتاح API على الخادم
  if (!apiKey) {
    console.error("Vercel env error: GEMINI_API_KEY is not defined.");
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }

  // 3. التحقق من وجود 'prompt'
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: schema ? "application/json" : "text/plain", // الأفضل تحديد النوع
      responseSchema: schema || undefined,
      temperature: 0.3,
    },
    safetySettings: [ // إعدادات أمان متوازنة
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

    // 4. إذا فشل الطلب، سجل التفاصيل الكاملة
    if (!geminiResponse.ok) {
      console.error("Gemini API HTTP Error:", geminiResponse.status, JSON.stringify(result, null, 2));
      return res.status(geminiResponse.status).json({
        error: 'فشل استدعاء Gemini API.',
        details: result
      });
    }

    // 5. التحقق من وجود مرشحين (candidates)
    const candidate = result.candidates?.[0];
    if (!candidate) {
        console.error("No candidates returned from API:", JSON.stringify(result, null, 2));
        const blockReason = result.promptFeedback?.blockReason;
        return res.status(502).json({
            error: blockReason ? `تم حظر الطلب بسبب: ${blockReason}` : 'لم يتم استلام أي مرشحين من النموذج.',
            details: result.promptFeedback || 'No details'
        });
    }
    
    // 6. التحقق من سبب الإنهاء (finishReason)
    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      console.error("Content generation stopped:", { finishReason: candidate.finishReason, safetyRatings: candidate.safetyRatings });
      return res.status(502).json({
        error: `توقف توليد المحتوى. السبب: ${candidate.finishReason}`,
        details: {
          finishReason: candidate.finishReason,
          safetyRatings: candidate.safetyRatings
        }
      });
    }

    const text = candidate.content?.parts?.[0]?.text;

    if (!text) {
        console.error("Empty text in candidate:", JSON.stringify(candidate, null, 2));
        return res.status(502).json({ error: 'تم استلام استجابة فارغة من النموذج.' });
    }
    
    // 7. التعامل مع استجابة JSON
    if (schema) {
      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (e) {
        console.error("JSON parse failed:", text);
        return res.status(502).json({
          error: 'فشل تحويل الاستجابة إلى JSON.',
          raw: text
        });
      }
    }

    // 8. التعامل مع الاستجابة النصية العادية
    return res.status(200).json({ text });

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
