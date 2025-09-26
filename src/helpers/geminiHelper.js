// src/helpers/geminiHelper.js

// قراءة بث كنص كامل (للمحادثة فقط)
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

// قصص/مقالات/دروس: نرسل النوع للخادم كي يفرض المخطط المناسب ويعيد JSON مضبوط
export const runGemini = async (prompt, mode = 'story', schema) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mode, schema })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`The server responded with an error: ${errorBody}`);
  }

  return await response.json();
};

// اختصارات مريحة:
export const runGeminiStory = (prompt) => runGemini(prompt, 'story');
export const runGeminiArticle = (prompt) => runGemini(prompt, 'article');
export const runGeminiLesson = (prompt) => runGemini(prompt, 'lesson');

// المحادثة: نستقبل نصاً متدفقاً جاهزاً من الخادم
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
