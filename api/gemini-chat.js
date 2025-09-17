// api/gemini-chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // --- بداية الإضافة لتشخيص المشكلة ---
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured on the server for chat.');
      throw new Error('API key is not configured on the server.');
    }
    // --- نهاية الإضافة ---

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${apiKey}`;

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
      // --- بداية الإضافة لتشخيص المشكلة ---
      console.error('Gemini Chat API Error:', errorBody); // سجل الخطأ الفعلي من Gemini
      // --- نهاية الإضافة ---
      throw new Error(`Gemini API Error: ${errorBody}`);
    }
    
    // Pipe the stream from Gemini directly to the client
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    geminiResponse.body.pipe(res);

  } catch (error) {
    // --- بداية التعديل لتشخيص المشكلة ---
    console.error('[Vercel Chat Function Error]', error.message);
    res.status(500).json({ error: 'An internal server error occurred in chat.', details: error.message });
    // --- نهاية التعديل ---
  }
}
