// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable.");
    return res.status(500).json({ error: 'مفتاح الـ API غير مهيأ على الخادم.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "الطلب يفتقد 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    // تم حذف generationConfig الصارم لزيادة الموثوقية
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
      return res.status(geminiResponse.status).json({ error: 'فشل استدعاء Gemini API.', details: result });
    }

    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
      const reason = result?.promptFeedback?.blockReason || result?.candidates?.[0]?.finishReason;
      console.error("No valid candidates from API. Reason:", reason, JSON.stringify(result, null, 2));
      return res.status(502).json({ error: `لم يتم استلام محتوى صالح. السبب المحتمل: ${reason}` });
    }
    
    const text = result.candidates[0].content.parts[0].text;

    if (!text) {
        console.error("Empty text in response candidate:", JSON.stringify(result, null, 2));
        return res.status(502).json({ error: 'استجابة النموذج كانت فارغة.' });
    }

    // محاولة ذكية لتحليل النص كـ JSON
    try {
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();
      const data = JSON.parse(cleanedText);
      return res.status(200).json(data);
    } catch (e) {
      console.error("JSON parse failed:", e, "Raw text received:", text);
      return res.status(502).json({ error: 'فشل تحليل الاستجابة من النموذج، لم تكن بصيغة JSON صالحة.', raw: text });
    }

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'حدث خطأ داخلي في الخادم.' });
  }
};
