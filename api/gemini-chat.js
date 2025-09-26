// api/gemini-chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('CRITICAL ERROR: GEMINI_API_KEY is undefined.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // --- ✅ التعديل الأول: تغيير نقطة النهاية (Endpoint) ---
    // تم تغيير streamGenerateContent إلى generateContent لحل مشكلة التوافر.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini Chat API Error:', errorBody);
      throw new Error(`Gemini Chat API Error: ${errorBody}`);
    }
    
    // --- ✅ التعديل الثاني: التعامل مع الاستجابة الكاملة ---
    // بدلاً من البث المباشر، نقوم الآن بتحليل الاستجابة الكاملة كـ JSON وإرسالها.
    const data = await geminiResponse.json();
    res.status(200).json(data);
    // --- نهاية التعديل ---

  } catch (error) {
    console.error('[Vercel Chat Function Error]', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'An internal server error occurred in chat.', details: error.message });
    }
  }
}
