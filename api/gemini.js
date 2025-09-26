// api/gemini.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('CRITICAL ERROR: GEMINI_API_KEY is undefined.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // --- ✅ التعديل المطلوب: التحول إلى نموذج gemini-1.0-pro الاقتصادي والمستقر ---
    // تم تغيير النموذج ونقطة النهاية لحل مشكلة التوافر بشكل نهائي.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini API Error Body:', errorBody);
      throw new Error(`Gemini API returned an error: ${errorBody}`);
    }

    // --- ✅ تعديل ضروري: التعامل مع الاستجابة الكاملة بدلاً من البث المباشر ---
    // هذا الجزء تم تعديله ليتوافق مع نقطة النهاية الجديدة.
    const data = await geminiResponse.json();
    res.status(200).json(data);
    // --- نهاية التعديل ---

  } catch (error) {
    console.error('[Vercel Function Execution Error]', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
    }
  }
}
