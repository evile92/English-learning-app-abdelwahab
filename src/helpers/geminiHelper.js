// src/helpers/geminiHelper.js

// قراءة الاستجابة المتدفقة كنص كامل (للمحادثة فقط)
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

// توليد القصص/الدروس: الخادم يعيد JSON مضبوط بالفعل
export const runGemini = async (prompt) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Server Error Body:', errorBody);
    throw new Error('The server responded with an error.');
  }

  // لا بث هنا، نأخذ JSON النهائي مباشرة
  return await response.json();
};

// المحادثة: نجمع النص المتدفق ونُعيده كنص
export const runGeminiChat = async (history) => {
  const response = await fetch('/api/gemini-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Server responded with an error: ${errorBody}`);
  }

  const text = await getFullStreamedText(response);
  return { response: text.trim() };
};
