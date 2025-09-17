// api/gemini-chat.js

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { history } = await req.json(); // يستقبل سجل المحادثة
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error('API key is not configured.');
    if (!history) throw new Error("Missing 'history' in the request.");

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${apiKey}`;

    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const payload = { contents };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Gemini API responded with status: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error("Chat Serverless Function Error:", error.message);
    return new Response(JSON.stringify({ error: 'An internal server error occurred in chat.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
