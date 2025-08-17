import React, { useState } from 'react';
import { History, LoaderCircle, ArrowLeft } from 'lucide-react';
import QuizView from './QuizView';

// Gemini API Helper
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

const ReviewSection = ({ lessonsData }) => {
    const [view, setView] = useState('start'); // start, quiz, result, interactive
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // For Quiz
    const [reviewQuiz, setReviewQuiz] = useState(null);
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });

    // For Interactive Review
    const [interactiveExercises, setInteractiveExercises] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [results, setResults] = useState([]);

    const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed);
    const topics = completedLessons.map(l => l.title).slice(-5).join(', '); // Use last 5 completed

    const handleStartQuizReview = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Based on these topics: "${topics}", create a JSON object for a quiz. The key "quiz" should be an array of 5 multiple-choice questions with "question", "options", and "correctAnswer".`;
        const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" } }, required: ["question", "options", "correctAnswer"] } } }, required: ["quiz"] };
        try {
            const result = await runGemini(prompt, schema);
            setReviewQuiz(result.quiz);
            setView('quiz');
        } catch (e) { setError('عذرًا، فشل إنشاء اختبار المراجعة.'); setView('start'); } 
        finally { setIsLoading(false); }
    };
    
    const handleStartInteractiveReview = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Based on these topics: "${topics}", create a JSON object for an interactive review. The key "exercises" should be an array of 5 objects, each with "sentence" (a sentence with '[___]' as a blank) and "correctAnswer".`;
        const schema = { type: "OBJECT", properties: { exercises: { type: "ARRAY", items: { type: "OBJECT", properties: { sentence: { type: "STRING" }, correctAnswer: { type: "STRING" } }, required: ["sentence", "correctAnswer"] } } }, required: ["exercises"] };
        try {
            const result = await runGemini(prompt, schema);
            setInteractiveExercises(result.exercises);
            setUserAnswers(Array(result.exercises.length).fill(''));
            setResults(Array(result.exercises.length).fill(null));
            setView('interactive');
        } catch (e) { setError('عذرًا، فشل إنشاء المراجعة التفاعلية.'); setView('start'); }
        finally { setIsLoading(false); }
    };

    const handleQuizComplete = (score, total) => {
        setQuizResult({ score, total });
        setView('result');
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
    };

    const checkAnswer = (index) => {
        const newResults = [...results];
        if (userAnswers[index].trim().toLowerCase() === interactiveExercises[index].correctAnswer.toLowerCase()) {
            newResults[index] = 'correct';
        } else {
            newResults[index] = 'incorrect';
        }
        setResults(newResults);
    };

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center p-10"><LoaderCircle className="animate-spin text-sky-500" size={48} /><p className="mt-4 text-lg">نقوم بإعداد المراجعة لك...</p></div>;
    }

    if (view === 'quiz') {
        return <QuizView quiz={reviewQuiz} onQuizComplete={handleQuizComplete} />;
    }

    if (view === 'interactive') {
        return (
            <div className="z-10 relative animate-fade-in">
                <button onClick={() => setView('start')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى خيارات المراجعة</button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">مراجعة تفاعلية (املأ الفراغ)</h1>
                <div className="space-y-6">
                    {interactiveExercises.map((ex, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p dir="ltr" className="text-left text-lg text-slate-800 dark:text-slate-200 mb-3">{ex.sentence.replace('[___]', '_____')}</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input type="text" value={userAnswers[index]} onChange={(e) => handleAnswerChange(index, e.target.value)} className="flex-1 p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                                <button onClick={() => checkAnswer(index)} className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md">تحقق</button>
                            </div>
                            {results[index] === 'correct' && <p className="text-green-500 mt-2 font-semibold">صحيح!</p>}
                            {results[index] === 'incorrect' && <p className="text-red-500 mt-2 font-semibold">الإجابة الصحيحة: {ex.correctAnswer}</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (view === 'result') {
        return (
             <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 text-center">نتيجة المراجعة</h1>
                <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">أحسنت!</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300">نتيجتك هي:</p>
                    <p className="text-6xl font-bold my-4 text-sky-500 dark:text-sky-400">{quizResult.score} / {quizResult.total}</p>
                    <button onClick={() => setView('start')} className="mt-6 bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all">إجراء مراجعة أخرى</button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><History/> قسم المراجعة</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">اختر الطريقة التي تفضلها لمراجعة الدروس التي أكملتها.</p>
            
            {completedLessons.length === 0 ? (
                 <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg text-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">لا توجد دروس للمراجعة</h3>
                    <p className="text-slate-600 dark:text-slate-300">أكمل بعض الدروس أولاً لتتمكن من إنشاء مراجعة.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">اختر نوع المراجعة</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">سنقوم بإنشاء مراجعة بناءً على آخر الدروس التي أكملتها:</p>
                    <ul className="list-disc list-inside mb-6 text-slate-500 dark:text-slate-400">
                        {completedLessons.slice(-5).map(l => <li key={l.id}>{l.title}</li>)}
                    </ul>
                    {error && <p className="text-red-500 my-4 text-center">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={handleStartQuizReview} disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                           🧠 مراجعة عادية (أسئلة)
                        </button>
                         <button onClick={handleStartInteractiveReview} disabled={isLoading} className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                           💡 مراجعة تفاعلية (املأ الفراغ)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
