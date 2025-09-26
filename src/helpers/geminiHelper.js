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

// ✅ دالة جديدة ومحسّنة لتحليل الاستجابة المتدفقة
async function parseStreamedResponse(response) {
  const streamedText = await getFullStreamedText(response);
  try {
    // المحاولة الأولى: افتراض أن الاستجابة هي مصفوفة JSON صالحة
    const jsonArray = JSON.parse(streamedText);
    let combinedText = '';
    jsonArray.forEach(obj => {
      const textPart = obj?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
        combinedText += textPart;
      }
    });
    return combinedText;
  } catch (error) {
    // المحاولة الثانية (الاحتياطية): إذا فشلت الطريقة الأولى، نستخدم Regex لاستخراج النص
    console.warn("Direct JSON parsing failed, falling back to regex extraction.", error);
    let combinedText = '';
    // هذا التعبير النمطي يبحث عن كل قيم مفتاح "text" ويجمعها
    const regex = /"text"\s*:\s*"((?:\\"|[^"])*)"/g;
    let match;
    while ((match = regex.exec(streamedText)) !== null) {
      // نستخدم JSON.parse على القيمة المستخرجة لفك تشفير المحارف الخاصة مثل \n
      combinedText += JSON.parse(`"${match[1]}"`);
    }

    if (combinedText) {
      return combinedText;
    }
    
    // إذا فشلت كل المحاولات، أبلغ عن الخطأ
    console.error("Full text received during failed parse:", streamedText);
    throw new Error("Failed to parse the streamed response from the AI.");
  }
}


export const runGemini = async (prompt, schema) => {
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

    // استخدم الدالة الجديدة لتحليل الاستجابة
    const combinedText = await parseStreamedResponse(response);
    
    // نزيل أي علامات Markdown قد يضيفها النموذج
    const cleanedJsonText = combinedText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedJsonText);

  } catch (error) {
    console.error("Error in runGemini:", error.message);
    throw new Error("Failed to get a response from the AI service. Please try again.");
  }
}

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
        
        // استخدم الدالة الجديدة لتحليل الاستجابة
        const combinedText = await parseStreamedResponse(response);
        return { response: combinedText };

      } catch (error) {
        console.error("Error in runGeminiChat:", error.message);
        throw new Error("Failed to get a response from the AI service. Please try again.");
      }
}
