// api/gemini.js (نسخة مبسطة للتشخيص)
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body; // أزلنا schema مؤقتاً
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  // نستخدم نفس النموذج الناجح
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      // طلب نصي بسيط جداً
      responseMimeType: "text/plain", 
      temperature: 0.3,
    },
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
        const errorDetails = await geminiResponse.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error("Gemini API HTTP Error:", geminiResponse.status, errorDetails);
        return res.status(geminiResponse.status).json({ error: 'فشل استدعاء Gemini API.', details: errorDetails });
    }

    const result = await geminiResponse.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Empty/Blocked response:", result);
      return res.status(502).json({ error: 'لم يتم استلام نص صالح من النموذج.' });
    }

    // بما أننا لم نعد نطلب JSON، نرجع النص مباشرة
    return res.status(200).json({ text });

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
