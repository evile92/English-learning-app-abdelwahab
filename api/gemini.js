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

    // غير متدفق: نُجبر الإخراج على JSON مضبوط
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' }
          },
          required: ['title', 'content']
        }
      }
    };

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Gemini JSON API Error:', err);
      return res.status(r.status).send(err);
    }

    const data = await r.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const obj = JSON.parse(jsonText); // JSON مضبوط من النموذج
    return res.status(200).json(obj);

  } catch (e) {
    console.error('[Vercel Function Execution Error]', e);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error', details: String(e) });
    }
  }
}
