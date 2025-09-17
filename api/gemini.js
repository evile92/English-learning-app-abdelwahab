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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${apiKey}`;

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

    // --- بداية التعديل النهائي ---
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const reader = geminiResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end(); // إنهاء الإرسال
    // --- نهاية التعديل النهائي ---

  } catch (error) {
    console.error('[Vercel Function Execution Error]', error.message);
    // تأكد من عدم إرسال رد آخر إذا كان قد تم إرسال جزء منه بالفعل
    if (!res.headersSent) {
      res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
    }
  }
}
