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

    // --- ✅ التحديث النهائي: استخدام نموذج gemini-2.0-flash المستقر ---
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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

    // --- ✅ إرسال الرد الكامل كـ JSON ليتوافق مع التطبيق ---
    const data = await geminiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('[Vercel Function Execution Error]', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
    }
  }
}

