// src/helpers/geminiHelper.js

export async function runGemini(prompt, schema) {
  try {
    // هذا الكود يستدعي دالة الخادم الآمنة الموجودة على موقعك في Vercel
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, schema }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("خطأ من جسر الخادم:", errorBody);
      throw new Error(`استجاب الخادم بحالة: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("خطأ أثناء استدعاء مسار الـ API الآمن:", error);
    // عرض رسالة خطأ واضحة للمستخدم
    throw new Error("فشل الاتصال بالخادم الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  }
}
