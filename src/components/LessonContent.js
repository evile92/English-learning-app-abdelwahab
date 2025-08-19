// src/components/LessonContent.js

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, LoaderCircle, Sparkles } from 'lucide-react';
import QuizView from './QuizView';
import { manualLessonsContent } from '../data/manualLessons';
import { useAppContext } from '../context/AppContext';

async function runGemini(prompt, schema) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Gemini API key is not set!");
        throw new Error("API key is missing.");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
            const errorBody = await response.text(); console.error("API Error Body:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        if (!result.candidates || result.candidates.length === 0) { throw new Error("No candidates returned from API."); }
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

const LessonContent = () => {
    const { currentLesson, handleBackToLessons, handleCompleteLesson } = useAppContext();

    const [lessonContent, setLessonContent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [view, setView] = useState('lesson');
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    const generateLessonContent = useCallback(async () => {
        if (!currentLesson) return;
        setView('lesson');
        setLessonContent(null);
        setQuiz(null);
        setIsLoading(prev => ({ ...prev, lesson: true }));
        setError('');
        
        const manualContent = manualLessonsContent[currentLesson.id];
        if (manualContent) {
            setTimeout(() => {
                setLessonContent(manualContent);
                setIsLoading(prev => ({ ...prev, lesson: false }));
            }, 300);
        } else {
            const level = currentLesson.id.substring(0, 2);
            const prompt = `You are an expert English teacher. For the lesson titled "${currentLesson.title}" for a ${level}-level student, generate a JSON object. The object must have two keys: 1. "explanation": an object with "en" (English explanation) and "ar" (Arabic clarification). 2. "examples": an array of at least 10 practical example sentences.`;
            const schema = {
                type: "OBJECT",
                properties: {
                  explanation: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] },
                  examples: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: ["explanation", "examples"]
            };
            try {
                const result = await runGemini(prompt, schema);
                setLessonContent(result);
            } catch (e) {
                setError('عذرًا، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
            } finally {
                setIsLoading(prev => ({ ...prev, lesson: false }));
            }
        }
    }, [currentLesson]);

    // (بداية التصحيح)
    // هذا الكود سيتحقق من وجود الدرس بعد عرض الصفحة
    useEffect(() => {
        if (!currentLesson) {
            handleBackToLessons();
        } else {
            generateLessonContent();
        }
    }, [currentLesson, handleBackToLessons, generateLessonContent]);
    // (نهاية التصحيح)

    const handleStartQuiz = async () => {
        setIsLoading(prev => ({ ...prev, quiz: true }));
        setError('');
        const lessonTextContent = `Explanation: ${lessonContent.explanation.en}. Examples: ${lessonContent.examples.join(' ')}`;
        const prompt = `Based STRICTLY on the following lesson content: "${lessonTextContent}", create a JSON object for a quiz...`; // Prompt مختصر
        const schema = { /* ... schema ... */ };
        try {
          const result = await runGemini(prompt, schema);
          setQuiz(result.quiz);
          setView('quiz');
        } catch (e) {
          setError('عذرًا، فشل إنشاء الاختبار.');
        } finally {
          setIsLoading(prev => ({ ...prev, quiz: false }));
        }
    };

    const handleQuizComplete = (score, total) => { setQuizResult({ score, total }); setView('result'); };
    
    const handleLessonCompletion = async () => {
        setIsCompleting(true);
        await handleCompleteLesson(currentLesson.id, quizResult.score, quizResult.total);
    };

    if (!currentLesson) {
        return null;
    }
  
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={handleBackToLessons} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى قائمة الدروس</button>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 break-words" dir="ltr">{currentLesson.title}</h1>
            
            {/* ... بقية الكود يبقى كما هو ... */}

        </div>
    );
};

export default LessonContent;
