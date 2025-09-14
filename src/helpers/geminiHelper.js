// src/helpers/geminiHelper.js

export async function runGemini(prompt, schema) {
  try {
    // ✅ هذا الكود يتصل بالوسيط الآمن الموجود على موقعك
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, schema }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error calling our secure API route:", error);
    throw new Error("فشل الاتصال بالخادم الذكي. يرجى المحاولة مرة أخرى.");
  }
}
