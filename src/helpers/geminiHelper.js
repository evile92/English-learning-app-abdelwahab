// src/helpers/geminiHelper.js

async function processStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    try {
        // Gemini's stream response is not a single JSON object but a series of them.
        // We find the text part from the first candidate in the first JSON object of a chunk.
        const jsonString = chunk.match(/{.*}/s);
        if (jsonString) {
            const parsed = JSON.parse(jsonString[0]);
            if (parsed.candidates && parsed.candidates[0].content.parts[0].text) {
                fullText += parsed.candidates[0].content.parts[0].text;
            }
        }
    } catch (e) {
      console.warn("Could not parse a chunk of the stream:", chunk);
    }
  }
  return fullText;
}

export async function runGemini(prompt, schema) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`استجاب الخادم بحالة: ${response.status}. ${errorBody}`);
    }

    const streamedText = await processStream(response);
    
    try {
        const cleanedText = streamedText.replace(/^```json\s*|```\s*$/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("فشل في تحليل الـ JSON المكتمل:", parseError, "النص الكامل:", streamedText);
        throw new Error("فشل تحليل الاستجابة من النموذج بعد استقبالها.");
    }

  } catch (error) {
    console.error("خطأ أثناء استدعاء API:", error.message);
    throw new Error("فشل الاتصال بالخادم الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  }
}
