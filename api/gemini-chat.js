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

    // --- ✅ استخدام نموذج 2.0 الجديد ---
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}`;

    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // --- ✅ إضافة تهيئة للمحادثة (هذا هو الحل) ---
    // النموذج الجديد يحتاج إلى دور "model" في البداية ليعرف كيف يبدأ
    // نضيف جزءًا فارغًا من الـ model إذا كانت أول رسالة من المستخدم
    if (contents.length > 0 && contents[0].role === 'user') {
        contents.unshift({ role: 'model', parts: [{ text: ' ' }] });
    }
    
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
    console.error('[Vercel Chat Function Error]', error.message);
    if (!res.headersSent) {
        res.status(500).json({ error: 'An internal server error occurred in chat.', details: error.message });
    }
  }
}
