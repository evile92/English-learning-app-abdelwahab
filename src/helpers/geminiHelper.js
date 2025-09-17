// src/helpers/geminiHelper.js

// دالة لمعالجة الرد المتدفق وتحويله إلى نص كامل
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

// دالة للميزات التي تتطلب كائن JSON واحد (مثل القصة، تصحيح الكتابة)
export async function runGemini(prompt) {
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

    try {
      // الرد يأتي أحيانًا كمصفوفة من الكائنات، لذا نجمّع النص منها
      const jsonArray = JSON.parse(`[${streamedText.replace(/}\s*\[/g, '},{')}]`);
      let combinedText = '';
      jsonArray.forEach(obj => {
        const textPart = obj?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textPart) {
          combinedText += textPart;
        }
      });
      
      // الآن نحاول تحليل النص المجمع كـ JSON
      return JSON.parse(combinedText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Full text received:", streamedText);
      throw new Error("The response from the AI could not be understood.");
    }

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("Failed to get a response from the AI service. Please try again.");
  }
}

// دالة لميزة المحادثة (role-playing)
export async function runGeminiChat(history) {
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

        try {
          // الرد يأتي كمصفوفة من الكائنات، لذا نجمّع النص منها
          const jsonArray = JSON.parse(streamedText);
          let combinedText = '';
          jsonArray.forEach(obj => {
            const textPart = obj?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              combinedText += textPart;
            }
          });
          return { response: combinedText };
        } catch(e) {
            console.error("Failed to parse chat response:", e);
            console.error("Full chat text received:", streamedText);
            // في حال فشل التحليل، أعد النص كما هو لتشخيص المشكلة
            return { response: "Error: Could not understand the AI's response format." };
        }

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
