// src/helpers/geminiHelper.js

async function processStream(response, onChunk) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process buffer line by line
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep the last, possibly incomplete, line

    for (const line of lines) {
      if (line.trim() === ']' || line.trim() === '[') continue;
      let cleanedLine = line.trim();
      if (cleanedLine.endsWith(',')) {
        cleanedLine = cleanedLine.slice(0, -1);
      }

      if (cleanedLine.startsWith('{')) {
        try {
          const parsed = JSON.parse(cleanedLine);
          if (parsed.candidates && parsed.candidates[0].content.parts[0].text) {
            const chunkText = parsed.candidates[0].content.parts[0].text;
            fullText += chunkText;
            if (onChunk) {
              onChunk(chunkText); // Callback for real-time updates
            }
          }
        } catch (e) {
          console.warn("Could not parse a chunk of the stream:", cleanedLine);
        }
      }
    }
  }
  return fullText;
}

// For features that need a complete JSON object at the end
export async function runGemini(prompt) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Server responded with status: ${response.status}. ${errorBody}`);
    }

    const streamedText = await processStream(response);

    try {
        const cleanedText = streamedText.replace(/^```json\s*|```\s*$/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse the completed JSON:", parseError, "Full text:", streamedText);
        throw new Error("Failed to parse the response from the model after receiving it.");
    }

  } catch (error) {
    console.error("Error calling the API:", error.message);
    throw new Error("Failed to connect to the smart server. Please check your internet connection and try again.");
  }
}

// For the role-playing chat feature
export async function runGeminiChat(history, onChunk) {
    try {
        const response = await fetch('/api/gemini-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Server responded with status: ${response.status}. ${errorBody}`);
        }

        const streamedText = await processStream(response, onChunk);
        return { response: streamedText };

      } catch (error) {
        console.error("Error calling the chat API:", error.message);
        throw new Error("Failed to connect to the smart server. Please check your internet connection and try again.");
      }
}
