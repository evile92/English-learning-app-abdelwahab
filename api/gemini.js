// api/gemini.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // --- بداية الإضافة لتشخيص المشكلة ---
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured on the server.');
      // لا تعرض الخطأ للمستخدم النهائي لدواعي الأمان
      throw new Error('API key is not configured on the server.');
    }
    // --- نهاية الإضافة ---

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
      // --- بداية الإضافة لتشخيص المشكلة ---
      console.error('Gemini API Error:', errorBody); // سجل الخطأ الفعلي من Gemini
      // --- نهاية الإضافة ---
      throw new Error(`Gemini API Error: ${errorBody}`);
    }

    // Pipe the stream from Gemini directly to the client
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    geminiResponse.body.pipe(res);

  } catch (error) {
    // --- بداية التعديل لتشخيص المشكلة ---
    console.error('[Vercel Function Error]', error.message);
    res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
    // --- نهاية التعديل ---
  }
}
