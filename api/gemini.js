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

    // ✅ التغيير 1: استخدام نقطة النهاية غير المتدفقة
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // ✅ التغيير 2: إضافة generationConfig لفرض إخراج JSON
    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: {ه type: 'STRING' },
            content: { type: 'STRING' },
            // أضفنا choices هنا لتغطية حالة القصة التفاعلية
            choices: { 
              type: 'ARRAY',
              items: { type: 'STRING' }
            }
          },
          // فقط title و content مطلوبان دائمًا
          required: ['title', 'content']
        }
      }
    };

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', errorText);
        return res.status(geminiResponse.status).json({ error: 'Failed to fetch from Gemini API.', details: errorText });
    }

    const data = await geminiResponse.json();

    // ✅ التغيير 3: استخراج النص، تحليله، وإرسال JSON نظيف للواجهة الأمامية
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const finalJsonObject = JSON.parse(jsonText
    return res.status(200).json(finalJsonObject);

  } catch (error) {
    console.error('[Vercel Function Error]', error.message);
    res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
}
  
