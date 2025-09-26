// src/hooks/useMaterialGeneration.js

import { useState } from 'react';
import { runGemini } from '../helpers/geminiHelper';

// ✅ دالة مساعدة جديدة مع منطق إعادة المحاولة
const runGeminiWithRetry = async (prompt, schema, retries = 1) => {
    try {
        return await runGemini(prompt, schema);
    } catch (error) {
        if (retries > 0) {
            console.warn("Gemini request failed. Retrying one more time...");
            // انتظر قليلاً قبل إعادة المحاولة لإعطاء الخادم فرصة
            await new Promise(resolve => setTimeout(resolve, 500)); 
            return await runGeminiWithRetry(prompt, schema, retries - 1);
        }
        // إذا فشلت كل المحاولات، أبلغ عن الخطأ النهائي
        throw error;
    }
};


export const useMaterialGeneration = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generationType, setGenerationType] = useState('story');
    const [lastUsedTopic, setLastUsedTopic] = useState(null);

    const handleGenerate = async (type, setMaterials, setSelectedMaterial) => {
        setIsGenerating(true);
        setGenerationType(type);
        setError('');

        let prompt;
        let schema;
        let topic;

        if (type === 'interactive-story') {
            const storyTopics = ["a mysterious old map", "a spaceship adventure", "a lost kingdom"];
            topic = storyTopics[Math.floor(Math.random() * storyTopics.length)];
            prompt = `You are a creative writer and game master. Start a short interactive story for a B1-level English learner about "${topic}". The story should be about 100 words and end with a choice. Return a JSON object with two keys: "content" (the story text) and "choices" (an array of 2-3 short strings, each representing a choice).`;
            schema = { type: "OBJECT", properties: { content: { type: "STRING" }, choices: { type: "ARRAY", items: { type: "STRING" } } }, required: ["content", "choices"] };
        } else {
            let topics;
            if (type === 'article') {
                topics = [
                    "the importance of recycling for the planet", 
                    "the benefits of regular exercise on the mind", 
                    "how technology has changed communication", 
                    "the history of coffee and its journey around the world", 
                    "the secrets of the deep ocean and its creatures",
                    "why bees are essential for our ecosystem",
                    "the future of space travel and colonizing Mars",
                    "the psychology of colors in marketing",
                    "simple techniques for better time management",
                    "the story of a famous invention like the light bulb",
                    "understanding the basics of cancer",
                    "the importance of mental health awareness",
                    "how vaccines work to protect us",
                    "healthy eating habits for a stronger heart",
                    "a tourist's guide to the wonders of Morocco",
                    "exploring the vibrant culture of Japan",
                    "the natural beauty of the Amazon rainforest",
                    "a journey through the historical cities of Italy",
                    "why Paris is called the city of love",
                    "the unique wildlife of Australia"
                ];
            } else { // type === 'story'
                topics = [
                    "a message in a bottle from the future", 
                    "a secret garden hidden in a big city", 
                    "an animal that can talk and needs help", 
                    "a magical camera that shows the past", 
                    "an adventure to a floating island in the sky",
                    "a time traveler who accidentally changes history",
                    "a friendship between a human and a robot",
                    "a detective solving the mystery of a missing painting",
                    "a strange coded message found in an old book",
                    "the mystery of the ship that disappeared in the fog",
                    "a famous chef who must find a secret ingredient",
                    "two people who meet by chance during a train journey",
                    "a love letter that gets delivered 50 years late",
                    "a story about finding love in an unexpected place, like a library",
                    "a house that remembers its previous owners",
                    "a strange noise coming from the basement every night",
                    "a mysterious phone call with no one on the other end",
                    "a forest where the trees whisper secrets",
                    "a musician who finds a lost and powerful song",
                    "a chef who cooks with emotions instead of ingredients"
                ];
            }

            const availableTopics = topics.filter(t => t !== lastUsedTopic);
            topic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
            setLastUsedTopic(topic);
            
            prompt = `You are a creative writer. Generate a short ${type} for a B1-level English language learner about "${topic}". The content should be about 150 words long. Return the result as a JSON object with two keys: "title" and "content".`;
            schema = { type: "OBJECT", properties: { title: { type: "STRING" }, content: { type: "STRING" } }, required: ["title", "content"] };
        }

        try {
            // ✅ تم استبدال runGemini بالدالة الجديدة التي تعيد المحاولة
            const result = await runGeminiWithRetry(prompt, schema);
            
            let newMaterial;
            if (type === 'interactive-story') {
                newMaterial = { id: Date.now(), type: 'Interactive Story', title: `قصة تفاعلية عن ${topic}`, content: result.content, choices: result.choices };
            } else {
                newMaterial = { id: Date.now(), type: type === 'story' ? 'Story' : 'Article', ...result };
            }
            setMaterials(prev => [newMaterial, ...prev]);
            setSelectedMaterial(newMaterial);
        } catch (e) {
            // الآن هذه الرسالة لن تظهر إلا إذا فشلت المحاولتان
            setError("فشلت عملية التوليد. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };

    return { isGenerating, error, generationType, handleGenerate };
};
