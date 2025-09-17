// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  // ✅ استخدام اسم المتغير الصحيح الذي يقرأه خادم Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0) {
      console.error("Gemini API Error or empty candidates:", JSON.stringify(result, null, 2));
      return res.status(502).json({ error: 'فشل استدعاء Gemini API أو كانت الاستجابة فارغة.' });
    }
    
    const text = result.candidates[0].content.parts[0].text;

    // محاولة تحليل النص المستلم كـ JSON
    try {
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
      const data = JSON.parse(cleanedText);
      return res.status(200).json(data);
    } catch (e) {
      console.error("JSON parse failed:", e, "Raw text:", text);
      return res.status(502).json({ error: 'فشل تحليل الاستجابة من النموذج.' });
    }

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
