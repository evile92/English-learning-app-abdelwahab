// src/helpers/geminiHelper.js

// دالة لمعالجة الرد المتدفق (stream) وتحويله إلى نص كامل
async function getFullStreamedText(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      // معالجة أي بيانات متبقية في المخزن المؤقت
      fullText += buffer;
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    
    // محاولة تحليل الأجزاء المكتملة من الرد
    // هذا يساعد في التعامل مع الردود التي تأتي على شكل أجزاء JSON
    const parts = buffer.split('\n');
    buffer = parts.pop(); // الاحتفاظ بالجزء الأخير الذي قد يكون غير مكتمل

    for (const part of parts) {
      fullText += part;
    }
  }
  return fullText;
}

// دالة للميزات التي تتطلب كائن JSON (مثل توليد القصة، التصحيح، إلخ)
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
        
        const streamedText = await getFullStreamedText(response);

        // هذا الجزء يقوم بتنظيف الرد القادم من المحادثة
        try {
            const jsonResult = JSON.parse(streamedText.replace(/^\[\s*|,\s*\]\s*$/g, ''));
            const textContent = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textContent) {
                return { response: textContent };
            }
             throw new Error("No text content found in chat response");
        } catch(e) {
            // في حال فشل التحليل، أعد النص كما هو
             return { response: streamedText };
        }

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
