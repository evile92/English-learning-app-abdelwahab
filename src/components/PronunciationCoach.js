// src/components/PronunciationCoach.js

import React, { useState, useEffect, useRef } from 'react';
// --- ✅ تم تحديث الأيقونات المستوردة ---
import { Voicemail, LoaderCircle, Mic, Square, CheckCircle, XCircle, Wand2 } from 'lucide-react';
import { freestyleSentences } from '../data/freestyleSentences'; // تأكد من إنشاء هذا الملف

// للتعامل مع التوافق بين المتصفحات
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

const PronunciationCoach = () => {
    const [text, setText] = useState('Hello, how are you today?');
    const [speechStatus, setSpeechStatus] = useState('idle'); // idle, speaking
    const [recordStatus, setRecordStatus] = useState('idle'); // idle, recording, processing
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState(null); // null, correct, incorrect
    const [error, setError] = useState('');
    const [wordResults, setWordResults] = useState([]); // ✅ إضافة حالة جديدة

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
        setFeedback(null);
        setWordResults([]); // ✅ إعادة تعيين النتائج عند بدء التسجيل

        if (recordStatus === 'recording') {
            recognition.stop();
            setRecordStatus('processing');
            return;
        }

        setRecordStatus('recording');
        recognition.start();
    };
    
    // --- ✅ إضافة دالة لاقتراح جملة جديدة ---
    const handleSuggestSentence = () => {
        const randomIndex = Math.floor(Math.random() * freestyleSentences.length);
        const randomSentence = freestyleSentences[randomIndex];
        setText(randomSentence);
        setTranscript('');
        setFeedback(null);
        setWordResults([]); // ✅ إعادة تعيين النتائج عند اقتراح جملة
        setError('');
    };

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            
            // ✅ المقارنة كلمة بكلمة
            const originalWords = text.trim().toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
            const spokenWords = currentTranscript.trim().toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
            
            const newResults = originalWords.map((word, index) => {
                const isMatch = spokenWords[index] && word === spokenWords[index];
                return {
                    word: word,
                    isCorrect: isMatch
                };
            });
            
            setWordResults(newResults);

            // يمكنك هنا إضافة تقييم عام بناءً على نسبة الكلمات الصحيحة
            const correctWordsCount = newResults.filter(w => w.isCorrect).length;
            if (correctWordsCount === originalWords.length) {
                setFeedback('correct');
            } else if (correctWordsCount > 0) {
                setFeedback('partial'); // حالة جديدة للنطق الجزئي
            } else {
                setFeedback('incorrect');
            }
        };

        recognition.onend = () => {
            setRecordStatus('idle');
        };

        recognition.onerror = (event) => {
            setError(`حدث خطأ في التعرف على الصوت: ${event.error}`);
            setRecordStatus('idle');
        };

        // إيقاف التسجيل عند مغادرة المكون
        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [text]);


    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Voicemail /> مدرب النطق</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">اكتب أي جملة، استمع إليها، ثم حاول نطقها. أو دعنا نقترح عليك جملة للتدريب!</p>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <textarea 
                    value={text} 
                    onChange={(e) => {
                        setText(e.target.value);
                        setFeedback(null);
                        setTranscript('');
                        setWordResults([]);
                    }} 
                    placeholder="اكتب نصًا هنا..." 
                    className="w-full h-40 p-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all" 
                    dir="ltr"
                ></textarea>
                
                {/* --- ✅ تعديل الشبكة لإضافة الزر الجديد --- */}
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

                {(transcript || feedback) && (
                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 animate-fade-in">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">النتيجة:</h3>
                        <p dir="ltr" className="text-left bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md">
                            <span className="font-bold">ما قلته: </span> "{transcript}"
                        </p>
                        {wordResults.length > 0 && (
                            <div className="mt-3 p-3 rounded-lg flex flex-wrap gap-1 font-bold">
                                {wordResults.map((wordObj, index) => (
                                    <span 
                                        key={index}
                                        className={`transition-colors duration-300 ${wordObj.isCorrect ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
                                    >
                                        {wordObj.word}
                                    </span>
                                ))}
                            </div>
                        )}
                        {feedback && (
                            <div className={`mt-3 p-3 rounded-lg flex items-center justify-center gap-2 font-bold ${feedback === 'correct' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200' : feedback === 'partial' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-200' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200'}`}>
                                {feedback === 'correct' ? <CheckCircle /> : feedback === 'partial' ? <LoaderCircle className="animate-spin" /> : <XCircle />}
                                {feedback === 'correct' ? 'ممتاز! نطق مطابق.' : feedback === 'partial' ? 'عمل رائع، حاول مرة أخرى لتحسين الدقة.' : 'جيد! حاول مرة أخرى.'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PronunciationCoach;
