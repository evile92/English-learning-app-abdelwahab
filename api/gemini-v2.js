// api/gemini-v2.js

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

    // استخدام النموذج الجديد Gemini 2.0 Flash
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini 2.0 API Error Body:', errorBody);
      throw new Error(`Gemini 2.0 API returned an error: ${errorBody}`);
    }

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
    res.end();

  } catch (error) {
    console.error('[Vercel Function Execution Error]', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
    }
  }
}
