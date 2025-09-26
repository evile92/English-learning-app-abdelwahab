// src/helpers/geminiHelper.js - النسخة المُبسطة

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

// دالة للميزات التي تتطلب JSON (القصص، التصحيح)
export async function runGemini(prompt) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const streamedText = await getFullStreamedText(response);
    
    // Gemini 2.0 يرسل النص مباشرة، لا يحتاج معالجة معقدة
    const cleanText = streamedText
      .replace(/```
      .replace(/```\s*/g, '')
      .trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Error:", error);
    throw new Error("فشل توليد المحتوى. حاول مرة أخرى.");
  }
}

// دالة للمحادثة
export async function runGeminiChat(history) {
  try {
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const streamedText = await getFullStreamedText(response);
    return { response: streamedText.trim() };

  } catch (error) {
    console.error("Chat error:", error);
    return { response: "عذراً، حدث خطأ. حاول مرة أخرى." };
  }
}
