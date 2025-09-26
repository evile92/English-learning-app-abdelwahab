// api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, mode = 'story', schema } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server configuration error.' });

    // اختر نموذج إخراج مضبوط حسب النوع أو استخدم schema القادم من العميل
    const defaultSchemas = {
      story: {
        type: 'object',
        properties: { title: { type: 'string' }, content: { type: 'string' } },
        required: ['title', 'content']
      },
      article: {
        type: 'object',
        properties: { title: { type: 'string' }, content: { type: 'string' } },
        required: ['title', 'content']
      },
      lesson: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          level: { type: 'string' },
          objectives: { type: 'array', items: { type: 'string' } },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                heading: { type: 'string' },
                explanation: { type: 'string' },
                examples: { type: 'array', items: { type: 'string' } },
                practice: { type: 'array', items: { type: 'string' } }
              },
              required: ['heading', 'explanation']
            }
          },
          summary: { type: 'string' },
          quiz: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                choices: { type: 'array', items: { type: 'string' } },
                answer: { type: 'string' },
                explanation: { type: 'string' }
              },
              required: ['question', 'choices', 'answer']
            }
          }
        },
        required: ['title', 'objectives', 'sections']
      }
    };

    const responseSchema = schema || defaultSchemas[mode] || defaultSchemas.story;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema
      }
    };

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).send(err);
    }

    const data = await r.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const obj = JSON.parse(jsonText);
    return res.status(200).json(obj);

  } catch (e) {
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error', details: String(e) });
    }
  }
}
