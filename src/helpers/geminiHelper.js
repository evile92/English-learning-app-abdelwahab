// --- دوال التدفق (خاصة بالمحادثة فقط) ---

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

function parseChatResponse(streamedText) {
  try {
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
    // إذا فشل التحليل، فهذا طبيعي في المحادثة، أعد النص كما هو
    return streamedText; 
  }
}

// --- الدوال المصدرة ---

// ✅ تم التبسيط بالكامل: هذه الدالة الآن للقصص والدروس (غير متدفقة)
export const runGemini = async (prompt) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.json(); // الخادم يرسل JSON الآن عند الخطأ
      console.error("Server Error Body:", errorBody.details);
      throw new Error(`The server responded with an error.`);
    }

    // لم نعد بحاجة لتحليل النص، الخادم يرسل JSON جاهزًا!
    return await response.json();

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("Failed to get a response from the AI service. Please try again.");
  }
}

// ✅ هذه الدالة للمحادثة فقط (متدفقة)
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
        const combinedText = parseChatResponse(streamedText);
        return { response: combinedText };

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
