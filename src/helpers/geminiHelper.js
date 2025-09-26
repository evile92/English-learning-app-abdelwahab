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

// دالة موحدة لتحليل الاستجابة المتدفقة من Gemini
function parseStreamedResponse(streamedText) {
  try {
    // النموذج يرسل سلسلة من كائنات JSON، نقوم بتغليفها لجعلها مصفوفة صالحة
    const validJsonArrayString = `[${streamedText.trim().replace(/,\s*$/, "")}]`;
    const jsonArray = JSON.parse(validJsonArrayString);
    
    let combinedText = '';
    jsonArray.forEach(obj => {
      const textPart = obj?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
        combinedText += textPart;
      }
    });
    return combinedText;
  } catch (error) {
    console.error("Failed to parse streamed response as JSON array:", error);
    console.error("Full text received:", streamedText);
    // إذا فشل التحليل، قد تكون الاستجابة نصًا عاديًا (في المحادثة) أو تحتوي على خطأ
    if (streamedText.includes("error")) {
        throw new Error("The AI service returned an error. Check the server logs.");
    }
    return streamedText; // أعد النص كما هو إذا لم يكن JSON
  }
}


// دالة لتوليد القصص والدروس (تتوقع استجابة JSON)
export const runGemini = async (prompt) => {
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

    const streamedText = await getFullStreamedText(response);
    const combinedText = parseStreamedResponse(streamedText);
    
    // نزيل أي علامات Markdown قد يضيفها النموذج
    const cleanedJsonText = combinedText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedJsonText);

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("Failed to get a response from the AI service. Please try again.");
  }
}

// دالة للمحادثة ولعب الأدوار (تتوقع استجابة نصية)
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
        
        const streamedText = await getFullStreamedText(response);
        const combinedText = parseStreamedResponse(streamedText);
        return { response: combinedText };

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
