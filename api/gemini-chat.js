// api/gemini-chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server configuration error.' });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}`;

    const contents = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      return res.status(upstream.status).send(errorBody);
    }

    // سنحوّل JSON المتدفق إلى نص خالص قبل إرساله للعميل
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // كل سطر يمثل كائناً JSON عادةً؛ نعالج المكتمل ونُبقي الباقي في buffer
      let lastNewline = buffer.lastIndexOf('
');
      if (lastNewline === -1) continue;

      const chunkLines = buffer.slice(0, lastNewline).split('
').filter(l => l.trim());
      buffer = buffer.slice(lastNewline + 1);

      for (const line of chunkLines) {
        try {
          const obj = JSON.parse(line);
          const parts = obj?.candidates?.[0]?.content?.parts || [];
          for (const p of parts) {
            if (typeof p.text === 'string') {
              res.write(p.text);
            }
          }
        } catch {
          // لو تعذّر التحليل، نتجاهل السطر (قد يكون غير مكتمل)
        }
      }
    }

    // عالج أي بقايا في buffer كسطر أخير
    if (buffer.trim()) {
      try {
        const obj = JSON.parse(buffer.trim());
        const parts = obj?.candidates?.[0]?.content?.parts || [];
        for (const p of parts) {
          if (typeof p.text === 'string') res.write(p.text);
        }
      } catch {
        // تجاهل البقايا غير الصالحة
      }
    }

    res.end();

  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Chat streaming error', details: String(error) });
    }
  }
}
