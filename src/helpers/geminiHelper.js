// src/helpers/geminiHelper.js

export async function runGemini(prompt, schema) { // schema is kept for compatibility but not sent
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    // Handle both successful and failed responses
    const data = await response.json();

    if (!response.ok) {
      // If the server returned an error (4xx or 5xx), throw it to be caught below
      throw new Error(data.error || `استجاب الخادم بحالة: ${response.status}`);
    }

    // If response is ok, return the JSON data
    return data;

  } catch (error) {
    console.error("خطأ أثناء استدعاء API:", error.message);
    // This will now display the specific error message from the server to the user
    throw new Error(error.message || "فشل الاتصال بالخادم الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  }
}
