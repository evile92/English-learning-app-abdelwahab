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

// دالة معالجة تنسيق Gemini 2.0 الجديد
function parseGemini2Response(streamedText) {
  try {
    // Gemini 2.0 يرسل البيانات بتنسيق مختلف
    // قد يكون JSON أو text خام حسب نوع الاستجابة
    
    // محاولة تنظيف البيانات أولاً
    let cleanedText = streamedText.trim();
    
    // إزالة بيانات التحكم في Stream إذا وُجدت
    cleanedText = cleanedText
      .replace(/data:\s*\[DONE\]/g, '')
      .replace(/data:\s*/g, '')
      .split('\n')
      .filter(line => line.trim() && !line.includes('[DONE]'))
      .join('\n');
    
    // محاولة تحليل كل سطر كـ JSON منفصل
    const lines = cleanedText.split('\n').filter(line => line.trim());
    let combinedText = '';
    
    for (const line of lines) {
      try {
        const jsonObj = JSON.parse(line);
        
        // تنسيق Gemini 2.0 الجديد
        if (jsonObj.candidates && jsonObj.candidates[0]) {
          const content = jsonObj.candidates[0].content;
          if (content && content.parts && content.parts[0]) {
            combinedText += content.parts[0].text || '';
          }
        }
        // تنسيق احتياطي للاستجابات المختلفة
        else if (jsonObj.text) {
          combinedText += jsonObj.text;
        }
        else if (typeof jsonObj === 'string') {
          combinedText += jsonObj;
        }
      } catch (lineError) {
        // إذا لم يكن JSON صالح، أضف السطر كما هو
        if (line.trim() && !line.includes('data:') && !line.includes('[DONE]')) {
          combinedText += line + '\n';
        }
      }
    }
    
    // إذا لم نحصل على نص، استخدم النص الخام
    if (!combinedText.trim()) {
      combinedText = streamedText;
    }
    
    return combinedText.trim();
    
  } catch (error) {
    console.error('Error parsing Gemini 2.0 response:', error);
    // عودة للنص الخام في حالة الفشل
    return streamedText;
  }
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
      throw new Error(`The server responded with an error: ${response.status}`);
    }

    const streamedText = await getFullStreamedText(response);
    console.log("Raw Gemini 2.0 response:", streamedText); // للتشخيص

    // معالجة تنسيق Gemini 2.0
    const combinedText = parseGemini2Response(streamedText);
    console.log("Processed text:", combinedText); // للتشخيص

    if (!combinedText || combinedText.trim() === '') {
      throw new Error("Empty response from Gemini 2.0");
    }

    try {
      // تنظيف النص من علامات Markdown للـ JSON
      const cleanedJsonText = combinedText
        .replace(/^```
        .replace(/^```\s*/gm, '')
        .replace(/```
        .trim();
      
      console.log("Attempting to parse JSON:", cleanedJsonText); // للتشخيص
      
      // محاولة تحليل JSON
      const parsedJson = JSON.parse(cleanedJsonText);
      return parsedJson;
      
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Clean text received:", combinedText);
      
      // محاولة استخراج JSON من النص إذا كان مُضمّناً
      const jsonMatch = combinedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch);
          return extractedJson;
        } catch (extractError) {
          console.error("Failed to extract JSON:", extractError);
        }
      }
      
      // إذا فشل كل شيء، ارجع النص كما هو مع تنسيق افتراضي
      return {
        title: "قصة مُولدة",
        content: combinedText,
        error: "تم إرجاع النص الخام لأن تحليل JSON فشل"
      };
    }

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("فشل في الحصول على رد من خدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
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
      console.error("Chat Server Error Body:", errorBody);
      throw new Error(`Server responded with an error: ${response.status}`);
    }
    
    const streamedText = await getFullStreamedText(response);
    console.log("Raw chat response:", streamedText); // للتشخيص

    // معالجة تنسيق Gemini 2.0 للمحادثة
    const combinedText = parseGemini2Response(streamedText);
    console.log("Processed chat text:", combinedText); // للتشخيص

    if (!combinedText || combinedText.trim() === '') {
      return { response: "عذراً، لم أتمكن من الحصول على رد مناسب. يرجى المحاولة مرة أخرى." };
    }

    return { response: combinedText.trim() };

  } catch (error) {
    console.error("Error in runGeminiChat:", error.message);
    return { 
      response: "عذراً، حدث خطأ في خدمة المحادثة. يرجى المحاولة مرة أخرى.",
      error: error.message 
    };
  }
}
