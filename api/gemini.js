// api/gemini.js

export default async function handler(req, res) {
  // --- الكود التشخيصي ---
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("Attempting to run the Gemini API function."); // رسالة للتحقق من أن الدالة تعمل

  if (!apiKey) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is undefined or null in the function.");
    return res.status(500).json({ 
      error: "Server configuration error.", 
      details: "The GEMINI_API_KEY environment variable is missing on the server." 
    });
  }

  // سنقوم بطباعة جزء من المفتاح فقط للتأكد من أنه موجود (لدواعي الأمان)
  console.log(`API Key found. Starts with: ${apiKey.substring(0, 5)}...`); 
  // --- نهاية الكود التشخيصي ---

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
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
      console.error('Gemini API Error Body:', errorBody);
      throw new Error(`Gemini API returned an error: ${errorBody}`);
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    geminiResponse.body.pipe(res);

  } catch (error) {
    console.error('[Vercel Function Execution Error]', error.message);
    res.status(500).json({ error: 'An internal server error occurred during execution.', details: error.message });
  }
}
