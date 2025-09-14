// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body;
  // ✅ سيقوم هذا الكود بقراءة المفتاح السري بأمان من إعدادات Vercel
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured.' });
  }
  if (!prompt || !schema) {
    return res.status(400).json({ error: "Missing 'prompt' or 'schema'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("API Error:", errorBody);
      return res.status(geminiResponse.status).json({ error: 'Failed to call Gemini API.' });
    }

    const result = await geminiResponse.json();
    const jsonText = result.candidates[0].content.parts[0].text;

    res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
