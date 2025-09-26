// src/helpers/geminiHelper.js

// دالة للميزات التي تتطلب كائن JSON واحد (مثل القصة، تصحيح الكتابة)
export const runGemini = async (prompt) => {
  try {
    // استدعاء الواجهة البرمجية (API)
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

    // استقبال الرد الكامل كـ JSON واستخلاص النص
    const result = await response.json();
    const textContent = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      console.error("Invalid response structure from AI:", result);
      throw new Error("The response from the AI was empty or malformed.");
    }
    
    try {
      // تنظيف النص ومحاولة تحليله كـ JSON
      const cleanedJsonText = textContent.replace(/^```json\s*|```\s*$/g, '').trim();
      return JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Full text received:", textContent);
      throw new Error("The response from the AI could not be understood.");
    }

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("Failed to get a response from the AI service. Please try again.");
  }
};

// دالة لميزة المحادثة (role-playing)
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
        
        // استقبال الرد الكامل كـ JSON واستخلاص النص
        const result = await response.json();
        const textContent = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            console.error("Invalid chat response structure from AI:", result);
            return { response: "Error: The AI response was empty." };
        }

        return { response: textContent };

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
};
