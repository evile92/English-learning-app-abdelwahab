import React, { useState } from 'react';
import { Feather, Sparkles, LoaderCircle, Wand2 } from 'lucide-react';

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

const WritingSection = () => {
    const [text, setText] = useState('');
    const [correction, setCorrection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCorrect = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setCorrection(null);
        setError('');
        const prompt = `You are an expert English teacher. For the following text, provide a JSON object with three keys: 1. "correctedText": The original text with grammar/spelling mistakes fixed. 2. "improvedText": A more fluent, natural-sounding version. 3. "suggestions": An array of 3-4 specific, constructive suggestions. Each suggestion should be an object with two keys: "en" (the suggestion in English) and "ar" (a simple explanation of the suggestion in Arabic). Here is the text: "${text}"`;
        const schema = { type: "OBJECT", properties: { correctedText: { type: "STRING" }, improvedText: { type: "STRING" }, suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] } } }, required: ["correctedText", "improvedText", "suggestions"] };
        try {
            const result = await runGemini(prompt, schema);
            setCorrection(result);
        } catch (e) {
            setError("عذرًا، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Feather /> قسم الكتابة الإبداعي</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">مساحة حرة للكتابة. اكتب أي شيء، ودعنا نساعدك على التحسين.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب نصك هنا باللغة الإنجليزية..." className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"></textarea>
                    <button onClick={handleCorrect} disabled={isLoading} className="mt-4 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2">
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> صحح وحسّن النص</>}
                    </button>
                </div>
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg min-h-[320px]">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">نتائج تحليلنا</h3>
                    {isLoading && <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Wand2 className="animate-pulse" /> نقوم بتحليل النص...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {correction && (
                        <div className="animate-fade-in space-y-4">
                            <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">النص المُصحح:</h4><p dir="ltr" className="text-left text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-md">{correction.correctedText}</p></div>
                            <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">نسخة مُحسّنة:</h4><p dir="ltr" className="text-left text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 p-3 rounded-md">{correction.improvedText}</p></div>
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-200">اقتراحات للتحسين:</h4>
                                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                                    {correction.suggestions.map((s, i) => 
                                        <li key={i} className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                                            <p dir="ltr" className="text-left">{s.en}</p>
                                            <p dir="rtl" className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{s.ar}</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                    {!isLoading && !correction && !error && <p className="text-slate-500 dark:text-slate-400">ستظهر النتائج هنا بعد التصحيح.</p>}
                </div>
            </div>
        </div>
    );
};

export default WritingSection;
