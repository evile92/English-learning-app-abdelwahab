// src/helpers/geminiHelper.js

// This function processes the streamed response from the Gemini API
async function processStream(response) {
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

  // Clean up the full text to make sure it's valid JSON
  try {
    // Remove the markdown backticks and any prefixes
    const cleanedText = fullText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error("Failed to parse the completed JSON:", parseError);
    console.error("Full text received from API:", fullText);
    throw new Error("Failed to parse the response from the model.");
  }
}

// Function for features that need a complete JSON object
export async function runGemini(prompt) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Server responded with an error: ${errorBody}`);
    }

    return await processStream(response);

  } catch (error) {
    console.error("Error calling the backend API:", error.message);
    throw new Error("Failed to connect to the smart server. Please try again.");
  }
}

// Function for the role-playing chat feature
export async function runGeminiChat(history) {
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
        
        // For the chat, we process it differently to get the raw text
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
        }

        // The chat API returns a complex stream; we need to parse it to find the text
        // This is a simplified parser for the expected chat format
        try {
            const chatResponse = JSON.parse(fullText.replace(/^\[\s*|,\s*\]\s*$/g, ''));
            const textContent = chatResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textContent) {
                return { response: textContent };
            }
        } catch (e) {
            // Fallback for a simple text stream
            return { response: fullText };
        }

      } catch (error) {
        console.error("Error calling the chat API:", error.message);
        throw new Error("Failed to connect to the smart server for chat.");
      }
}
