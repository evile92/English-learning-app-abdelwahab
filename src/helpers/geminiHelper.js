// src/helpers/geminiHelper.js

// دالة لمعالجة الرد المتدفق وتحويله إلى نص كامل
async function getFullStreamedText(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    fullText += decoder.decode(value, { stream: true });
  }
  return fullText;
}

// دالة للميزات التي تتطلب كائن JSON (مثل توليد القصة، التصحيح، إلخ)
export async function runGemini(prompt, schema) { // أعدنا البارامتر الثاني لضمان التوافق
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
    
    // محاولة تنظيف النص وتحويله إلى JSON
    try {
      // إزالة أي علامات Markdown قد يضيفها النموذج
      const jsonText = streamedText.replace(/^```json\s*|```\s*$/g, '').trim();
      // محاولة إصلاح الأخطاء الشائعة مثل الفاصلة الزائدة في النهاية
      const correctedJsonText = jsonText.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(correctedJsonText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Full text received:", streamedText); // طباعة النص الكامل للمساعدة في التشخيص
      throw new Error("The response from the AI could not be understood.");
    }

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    // إرجاع رسالة خطأ موحدة للمستخدم
    throw new Error("Failed to get a response from the AI service. Please check your connection and try again.");
  }
}

// دالة لميزة المحادثة (role-playing)
export async function runGeminiChat(history, onChunk) {
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
        
        // في المحادثة، نعيد النص كما هو بدون تحويله لـ JSON
        const streamedText = await getFullStreamedText(response);

        // هنا نقوم بتنظيف الرد النهائي من المحادثة
        // هذه الخطوة قد تحتاج إلى تعديل بناءً على شكل الرد الفعلي
        const cleanedResponse = streamedText.replace(/,$/, '').trim();
        return { response: cleanedResponse };


      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
