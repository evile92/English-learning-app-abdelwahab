// src/helpers/geminiHelper.js

export async function runGemini(prompt, schema) {
  // ✅ إضافة مؤقت أمان لمنع التوقف الطويل
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 ثانية كحد أقصى للانتظار

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, schema }),
      signal: controller.signal, // ربط المؤقت بالطلب
    });

    // إيقاف المؤقت عند وصول الرد
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("خطأ من جسر الخادم:", errorBody);
      throw new Error(`استجاب الخادم بحالة: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    clearTimeout(timeoutId); // التأكد من إيقاف المؤقت في حالة الخطأ أيضاً
    if (error.name === 'AbortError') {
      console.error("الطلب استغرق وقتاً طويلاً وتم إلغاؤه.");
      throw new Error("استغرق الخادم وقتاً طويلاً للرد. قد يكون هناك ضغط على الشبكة. حاول مرة أخرى.");
    }
    console.error("خطأ أثناء استدعاء مسار الـ API الآمن:", error);
    throw new Error("فشل الاتصال بالخادم الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  }
}
