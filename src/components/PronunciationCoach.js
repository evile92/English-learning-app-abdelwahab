// src/components/PronunciationCoach.js

import React, { useState, useEffect, useRef } from 'react';
import { Voicemail, LoaderCircle, Mic, Square, Wand2 } from 'lucide-react';
import { freestyleSentences } from '../data/freestyleSentences';
import { useAppContext } from '../context/AppContext';

// دالة للتواصل مع Gemini
import { runGemini } from '../helpers/geminiHelper';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

const PronunciationCoach = () => {
    const { logError } = useAppContext();
    const [text, setText] = useState('Hello, how are you today?');
    const [speechStatus, setSpeechStatus] = useState('idle');
    const [recordStatus, setRecordStatus] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    
    const [geminiFeedback, setGeminiFeedback] = useState(null);
    const [isGeminiLoading, setIsGeminiLoading] = useState(false);

    const handleListen = () => {
        if (!text.trim() || typeof window.speechSynthesis === 'undefined') {
            setError('عذرًا، متصفحك لا يدعم هذه الميزة.');
            return;
        }
        setError('');
        setSpeechStatus('speaking');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onend = () => setSpeechStatus('idle');
        utterance.onerror = () => {
            setSpeechStatus('idle');
            setError('حدث خطأ أثناء تشغيل الصوت.');
        };
        window.speechSynthesis.speak(utterance);
    };

    const handleRecord = () => {
        if (!SpeechRecognition) {
            setError('عذرًا، متصفحك لا يدعم ميزة التعرف على الصوت.');
            return;
        }
        setError('');
        setTranscript('');
        setGeminiFeedback(null);
        setIsGeminiLoading(false);

        if (recordStatus === 'recording') {
            recognition.stop();
            setRecordStatus('processing');
            return;
        }

        setRecordStatus('recording');
        recognition.start();
    };
    
    const handleSuggestSentence = () => {
        const randomIndex = Math.floor(Math.random() * freestyleSentences.length);
        const randomSentence = freestyleSentences[randomIndex];
        setText(randomSentence);
        setTranscript('');
        setGeminiFeedback(null);
        setIsGeminiLoading(false);
        setError('');
    };

    const analyzePronunciationWithGemini = async (originalText, spokenText) => {
        setIsGeminiLoading(true);
        const prompt = `You are an expert English pronunciation coach. The user's goal is to say the sentence: "${originalText}". However, their spoken text was recognized as: "${spokenText}". Provide constructive, word-by-word feedback in a simple JSON format. The JSON should have a key "feedback" which is an array of objects. Each object should have two keys: "word" (the word from the original sentence) and "status" ("correct", "missed", or "mispronounced"). Then, provide a general "summary" (in English and Arabic) of the pronunciation. Also, include an array of "suggestions" with one object having two keys: "en" and "ar".`;
        const schema = {
            type: "OBJECT",
            properties: {
                feedback: { type: "ARRAY", items: { type: "OBJECT", properties: { word: { type: "STRING" }, status: { type: "STRING" } }, required: ["word", "status"] } },
                summary: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] },
                suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] } }
            },
            required: ["feedback", "summary", "suggestions"]
        };

        try {
            const result = await runGemini(prompt, schema);
            setGeminiFeedback(result);
        } catch (e) {
            console.error("Gemini failed to generate feedback:", e);
            setError("عذرًا، لم نتمكن من تحليل نطقك. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGeminiLoading(false);
        }
    };
    
    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            setRecordStatus('processing');
            
            analyzePronunciationWithGemini(text, currentTranscript);
        };

        recognition.onend = () => {
            setRecordStatus('idle');
        };

        recognition.onerror = (event) => {
            setError(`حدث خطأ في التعرف على الصوت: ${event.error}`);
            setRecordStatus('idle');
            setIsGeminiLoading(false);
        };

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    // --- ✅ بداية الإصلاح: إضافة logError إلى مصفوفة الاعتماديات ---
    }, [text, logError]);
    // --- 🛑 نهاية الإصلاح ---


    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Voicemail /> مدرب النطق</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">اكتب أي جملة، استمع إليها، ثم حاول نطقها. أو دعنا نقترح عليك جملة للتدريب!</p>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <textarea 
                    value={text} 
                    onChange={(e) => {
                        setText(e.target.value);
                        setGeminiFeedback(null);
                        setTranscript('');
                        setError('');
                    }} 
                    placeholder="اكتب نصًا هنا..." 
                    className="w-full h-40 p-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all" 
                    dir="ltr"
                ></textarea>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={handleListen} disabled={speechStatus === 'speaking'} className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                        {speechStatus === 'speaking' ? <LoaderCircle className="animate-spin" /> : <>🎧 استمع</>}
                    </button>
                    <button onClick={handleSuggestSentence} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
                        <Wand2 size={18} /> اقترح جملة
                    </button>
                    <button onClick={handleRecord} disabled={!SpeechRecognition || recordStatus === 'processing'} className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 md:col-start-3">
                        {recordStatus === 'recording' && <Square size={18} className="animate-pulse" />}
                        {recordStatus === 'processing' && <LoaderCircle className="animate-spin" />}
                        {recordStatus === 'idle' && <Mic size={18} />}
                        {recordStatus === 'recording' ? 'إيقاف التسجيل' : recordStatus === 'processing' ? 'جارِ المعالجة...' : 'سجل صوتك'}
                    </button>
                </div>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                {(transcript || isGeminiLoading || geminiFeedback) && (
                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 animate-fade-in">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">النتيجة:</h3>
                        <p dir="ltr" className="text-left bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md">
                            <span className="font-bold">ما قلته: </span> "{transcript}"
                        </p>

                        {isGeminiLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <LoaderCircle className="animate-spin text-sky-500" size={48} />
                            </div>
                        ) : geminiFeedback && (
                            <div className="mt-3 space-y-4">
                                <p dir="ltr" className="text-left">
                                    {geminiFeedback.feedback.map((item, index) => (
                                        <span key={index} className={`font-bold transition-colors duration-300 ${item.status === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.word}{' '}
                                        </span>
                                    ))}
                                </p>
                                
                                <div className="p-4 rounded-lg bg-sky-100 dark:bg-sky-900/50">
                                    <p dir="ltr" className="font-semibold text-sky-700 dark:text-sky-300">{geminiFeedback.summary.en}</p>
                                    <p dir="rtl" className="text-sm text-sky-600 dark:text-sky-400 mt-1">{geminiFeedback.summary.ar}</p>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                                     <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">اقتراحات للتحسين:</h4>
                                     <ul className="space-y-2">
                                        {geminiFeedback.suggestions.map((s, i) => 
                                            <li key={i}>
                                                <p dir="ltr" className="text-left text-slate-800 dark:text-slate-200">{s.en}</p>
                                                <p dir="rtl" className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{s.ar}</p>
                                            </li>
                                        )}
                                     </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PronunciationCoach;
