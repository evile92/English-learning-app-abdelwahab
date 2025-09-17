// api/gemini.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    // الكود الآن يستخدم المفتاح البسيط مباشرة
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in Vercel environment variables.');
      throw new Error('API key is not configured.');
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
      console.error('Gemini API Error:', errorBody);
      throw new Error(`Gemini API Error: ${errorBody}`);
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    geminiResponse.body.pipe(res);

  } catch (error) {
    console.error('[Vercel Function Error]', error.message);
    res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
}
