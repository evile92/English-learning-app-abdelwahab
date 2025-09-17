// api/gemini-chat.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured.' });
  }
  if (!history) {
    return res.status(400).json({ error: "Missing 'history' in the request." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
  }));

  const payload = {
    contents: contents,
    // ✅ --- بداية الإضافة: تخفيف فلاتر الأمان ---
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
      },
    ],
    // 🛑 --- نهاية الإضافة ---
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();
    
    if (!geminiResponse.ok || !result.candidates || result.candidates.length === 0) {
      console.error("Gemini Chat API Error:", JSON.stringify(result, null, 2));
      return res.status(502).json({ error: 'Failed to get a response from the chat API.' });
    }

    const generatedText = result.candidates[0].content.parts[0].text;
    res.status(200).json({ response: generatedText });

  } catch (error) {
    console.error("Serverless Function Error (Chat):", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
