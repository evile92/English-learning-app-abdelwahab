import React, { useState, useEffect, useRef } from 'react';
import { Mic, ArrowLeft, LoaderCircle, Volume2, Send } from 'lucide-react'; // استيراد أيقونة Send

// Gemini API Helper (يبقى كما هو)
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

const RolePlaySection = () => {
    const scenarios = {
        'ordering-coffee': { 
            title: 'طلب قهوة', 
            emoji: '☕', 
            prompt: "You are a friendly barista in a coffee shop. I am a customer. Start the conversation by greeting me and asking for my order. Keep your responses short and natural.",
            color: 'bg-amber-500'
        },
        'asking-directions': { 
            title: 'السؤال عن الاتجاهات', 
            emoji: '🗺️', 
            prompt: "You are a helpful local person on the street. I am a tourist who is lost. Start the conversation by asking if I need help. Keep your responses short and natural.",
            color: 'bg-sky-500'
        },
        'shopping': { 
            title: 'التسوق', 
            emoji: '🛍️', 
            prompt: "You are a shop assistant in a clothing store. I am a customer looking for a new jacket. Start the conversation by greeting me and asking how you can help. Keep your responses short and natural.",
            color: 'bg-pink-500'
        },
        'talking-friend': { 
            title: 'التحدث مع صديق', 
            emoji: '😊', 
            prompt: "You are my friend. I am telling you about my weekend. Start the conversation by asking me 'So, how was your weekend?'. Keep your responses friendly and natural.",
            color: 'bg-emerald-500'
        },
    };

    const [selectedScenario, setSelectedScenario] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const startConversation = async (scenarioKey) => {
        const scenario = scenarios[scenarioKey];
        setSelectedScenario(scenario);
        setIsLoading(true);
        setConversation([]);
        setConversation([{ sender: 'system', text: `بدأت محادثة: ${scenario.title}. أنت تبدأ.` }]);
        setIsLoading(false);
    };
    
    const speak = (text) => {
        if (typeof window.speechSynthesis === 'undefined') {
            alert("عذراً، متصفحك لا يدعم تحويل النص إلى كلام.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;
        const newUserMessage = { sender: 'user', text: userInput };
        const currentConversation = [...conversation, newUserMessage];
        setConversation(currentConversation);
        setUserInput('');
        setIsLoading(true);
        let fullPrompt = `Let's continue a role-play. ${selectedScenario.prompt}\n\n`;
        currentConversation.forEach(msg => {
            if (msg.sender === 'user') { fullPrompt += `Me: ${msg.text}\n`; }
            else if (msg.sender === 'ai') { fullPrompt += `You: ${msg.text}\n`; }
        });
        fullPrompt += "You: ";
        const schema = { type: "OBJECT", properties: { response: { type: "STRING" } }, required: ["response"] };
        try {
            const result = await runGemini(prompt, schema);
            const aiMessage = { sender: 'ai', text: result.response };
            setConversation(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'system', text: 'عذرًا، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!selectedScenario) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Mic /> محادثات لعب الأدوار</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8">اختر سيناريو لممارسة مهارات المحادثة لديك.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                        <div 
                            key={key} 
                            onClick={() => startConversation(key)} 
                            className={`p-6 rounded-2xl shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center text-white text-center h-48 ${scenario.color}`}
                        >
                            <div className="text-6xl mb-3">{scenario.emoji}</div>
                            <h3 className="text-xl font-bold">{scenario.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={() => setSelectedScenario(null)} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> اختر سيناريو آخر</button>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{selectedScenario.title} {selectedScenario.emoji}</h1>
            
            <div 
                className="rounded-2xl shadow-lg h-[60vh] flex flex-col overflow-hidden 
                           bg-gradient-to-br from-sky-50 to-blue-100 
                           dark:from-slate-800 dark:to-slate-900"
            >
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                                    🤖
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : msg.sender === 'ai' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200 text-center w-full'}`}>
                                <p dir="auto">{msg.text}</p>
                            </div>
                            {msg.sender === 'ai' && (
                                <button onClick={() => speak(msg.text)} className="p-2 text-slate-500 hover:text-sky-500 transition-colors">
                                    <Volume2 size={20}/>
                                </button>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 dark:border-slate-700/50 flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        placeholder="اكتب ردك هنا..." 
                        className="flex-1 p-3 bg-slate-100 dark:bg-slate-900/70 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white placeholder:text-slate-500 border border-transparent" 
                        disabled={isLoading} 
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !userInput.trim()} 
                        className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                        {isLoading ? 
                            <LoaderCircle className="animate-spin" size={20} /> : 
                            <Send size={20} />
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RolePlaySection;
