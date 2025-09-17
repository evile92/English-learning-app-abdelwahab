// api/gemini-chat.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // نستلم سجل المحادثة من الواجهة الأمامية
  const { history } = req.body;
 const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured.' });
  }
  if (!history) {
    return res.status(400).json({ error: "Missing 'history' in the request." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
  }));

  const payload = {
    contents: contents,
    generationConfig: {
      responseMimeType: "text/plain"
    }
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("Gemini API Error:", errorBody);
      return res.status(geminiResponse.status).json({ error: 'Failed to call the external Gemini API.' });
    }

    const result = await geminiResponse.json();

    if (!result.candidates || result.candidates.length === 0) {
      return res.status(500).json({ error: 'The API returned no content.' });
    }

    const generatedText = result.candidates[0].content.parts[0].text;
    
    // نرسل الرد ككائن JSON يحتوي على النص
    res.status(200).json({ response: generatedText });

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
