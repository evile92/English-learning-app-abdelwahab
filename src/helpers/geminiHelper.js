// src/helpers/geminiHelper.js

// Function to process the streamed response from Gemini
async function processStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    // Gemini stream sends data in chunks, sometimes multiple JSON objects per chunk
    // We need to parse them carefully
    const lines = chunk.split('\n').filter(line => line.trim().startsWith('{'));
    
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.candidates && parsed.candidates[0].content.parts[0].text) {
          fullText += parsed.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        console.warn("Could not parse a chunk of the stream:", line);
      }
    }
  }
  
  return fullText;
}


export async function runGemini(prompt, schema) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }), // We no longer send schema
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("خطأ من جسر الخادم:", errorBody);
      throw new Error(`استجاب الخادم بحالة: ${response.status}`);
    }

    // Process the streamed text
    const streamedText = await processStream(response);
    
    // Now, parse the complete JSON object
    try {
        const cleanedText = streamedText.replace(/^```json\s*|```\s*$/g, '').trim();
        const result = JSON.parse(cleanedText);
        return result;
    } catch (parseError) {
        console.error("فشل في تحليل الـ JSON المكتمل من البث:", parseError, "النص الكامل:", streamedText);
        throw new Error("فشل تحليل الاستجابة من النموذج بعد استقبالها.");
    }


  } catch (error) {
    console.error("خطأ أثناء استدعاء مسار الـ API الآمن:", error);
    throw new Error("فشل الاتصال بالخادم الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  }
}
