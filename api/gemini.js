// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, schema } = req.body;
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured.' });
  }
  if (!prompt || !schema) {
    return res.status(400).json({ error: "Missing 'prompt' or 'schema'." });
  }

  // ✅ التعديل الوحيد: استخدام أحدث نسخة من النموذج لضمان التوافق الكامل
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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

    if (!result.candidates || result.candidates.length === 0) {
        // إضافة تحقق إضافي في حال وجود مرشحين ولكن بدون محتوى
        console.error("API returned no candidates or empty content.", result);
        return res.status(500).json({ error: 'API returned no content.' });
    }

    const jsonText = result.candidates[0].content.parts[0].text;
    res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
