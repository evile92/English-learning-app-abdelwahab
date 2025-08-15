// src/api/gemini.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, schema } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // سنستخدم هذا الاسم الجديد

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not configured.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
       const errorBody = await geminiResponse.text();
       console.error("Gemini API Error:", errorBody);
       return res.status(geminiResponse.status).json({ error: 'Failed to fetch from Gemini API' });
    }

    const data = await geminiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
