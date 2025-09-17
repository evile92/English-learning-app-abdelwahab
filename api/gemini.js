// api/gemini.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: "The request is missing the 'prompt'." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API HTTP Error:", geminiResponse.status, JSON.stringify(result, null, 2));
      return res.status(geminiResponse.status).json({
        error: 'Failed to call the Gemini API.',
        details: result
      });
    }

    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content || !result.candidates[0].content.parts) {
      const finishReason = result?.candidates?.[0]?.finishReason || result?.promptFeedback?.blockReason;
      console.error("No valid candidates returned from API. Reason:", finishReason, JSON.stringify(result, null, 2));
      return res.status(502).json({
        error: 'No valid content received from the model. This might be due to safety filters.',
        details: { finishReason }
      });
    }
    
    const text = result.candidates[0].content.parts[0].text;

    if (!text) {
        console.error("Empty text in response candidate:", JSON.stringify(result, null, 2));
        return res.status(502).json({ error: 'The model response was empty.' });
    }

    try {
      // Sometimes the model wraps the JSON in markdown, so we clean it.
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
      const data = JSON.parse(cleanedText);
      return res.status(200).json(data);
    } catch (e) {
      console.error("JSON parse failed:", e, "Raw text received:", text);
      return res.status(502).json({
        error: 'Failed to parse the response from the model. It was not valid JSON.',
        raw: text
      });
    }

  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
