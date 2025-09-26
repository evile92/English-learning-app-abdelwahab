// src/helpers/geminiHelper.js

// دالة لمعالجة الرد المتدفق (stream) وتحويله إلى نص كامل
async function getFullStreamedText(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullText += decoder.decode(value, { stream: true });
  }
  return fullText;
}

// ✅ دالة بسيطة وموثوقة لتحليل الاستجابة
async function parseStreamedResponse(response) {
  const streamedText = await getFullStreamedText(response);
  try {
    // الاستجابة تأتي كمصفوفة من الكائنات، لذا نجمّع النص منها
    // هذا هو الجزء الأهم: يجب أن تكون الاستجابة قابلة للتحليل كمصفوفة JSON
    const jsonArray = JSON.parse(streamedText);
    let combinedText = '';
    jsonArray.forEach(obj => {
      const textPart = obj?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
        combinedText += textPart;
      }
    });
    return combinedText;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    console.error("Full text received:", streamedText);
    throw new Error("The response from the AI could not be understood.");
  }
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
