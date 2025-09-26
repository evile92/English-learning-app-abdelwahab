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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}`;

    const contents = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini Chat API Error:', errorBody);
      return res.status(geminiResponse.status).send(errorBody);
    }

    // بث كنص خام وليس JSON
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const reader = geminiResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();

  } catch (error) {
    console.error('[Vercel Chat Function Error]', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Chat streaming error', details: String(error) });
    }
  }
}
