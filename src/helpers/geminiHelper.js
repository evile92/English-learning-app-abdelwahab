// src/helpers/geminiHelper.js

// ✅ دالة جديدة ومحسّنة بالكامل لمعالجة الاستجابة
async function parseStreamedResponse(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    // ابحث عن الفاصل الذي أضفناه في الخلفية
    const parts = buffer.split("|||---|||");
    
    // الجزء الأخير قد يكون غير مكتمل، لذا نحتفظ به في buffer للمرة القادمة
    buffer = parts.pop() || '';

    for (const part of parts) {
      if (part.trim() === '') continue;
      try {
        const json = JSON.parse(part);
        const textContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textContent) {
          fullText += textContent;
        }
      } catch (error) {
        console.warn("Skipping invalid JSON chunk:", part, error);
      }
    }
  }

  if (fullText) {
    return fullText;
  }
  
  throw new Error("Failed to extract any valid text from the AI's response.");
}

export const runGemini = async (prompt, schema) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Server Error Body:", errorBody);
      throw new Error(`The server responded with an error.`);
    }

    const combinedText = await parseStreamedResponse(response);
    
    // نزيل أي علامات Markdown قد يضيفها النموذج
    const cleanedJsonText = combinedText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedJsonText);

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("Failed to get a response from the AI service. Please try again.");
  }
}

export const runGeminiChat = async (history) => {
    try {
        const response = await fetch('/api/gemini-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Server responded with an error: ${errorBody}`);
        }
        
        const combinedText = await parseStreamedResponse(response);
        return { response: combinedText };

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
