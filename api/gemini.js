// api/gemini.js

const { OpenAIStream, StreamingTextResponse } = require('ai');
const fetch = require('node-fetch');

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not found.');
    }

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
      console.error('Gemini API Error:', errorBody);
      return new Response(errorBody, { status: geminiResponse.status });
    }

    // This part correctly pipes the stream from Gemini to your app
    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body.getReader();
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          }).catch(error => {
             console.error('Stream reading error:', error);
             controller.error(error);
          });
        }
        push();
      },
    });

    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('[Vercel Function Error] api/gemini.js:', error.message);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
