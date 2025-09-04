// src/components/RolePlaySection.js

import React, { useState, useEffect, useRef } from 'react';
import { Mic, ArrowLeft, LoaderCircle, Volume2, Send } from 'lucide-react';

// ✅ تم تحديث الدالة runGemini لقبول سجل المحادثة الكامل
async function runGemini(history) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Gemini API key is not set!");
        throw new Error("API key is missing.");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // بناء محتوى الحمولة مع سجل المحادثة
    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // ✅ تم تحديث الحمولة لتكون أكثر مرونة
    const payload = {
        contents: contents,
        generationConfig: {
            // ✅ طلب نص عادي بدلاً من JSON
            responseMimeType: "text/plain" 
        }
    };
    
    try {
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Body:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.candidates || result.candidates.length === 0) {
            throw new Error("No candidates returned from API.");
        }
        
        const generatedText = result.candidates[0].content.parts[0].text;
        
        // ✅ محاولة تحليل JSON أولاً، وإلا استخدام النص الخام
        try {
            return JSON.parse(generatedText);
        } catch (jsonError) {
            return { response: generatedText };
        }
    } catch (error) {
        // ✅ تم إصلاح console.t
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
        // ✅ سيناريوهات جديدة
        'reserving-restaurant': {
            title: 'حجز مطعم',
            emoji: '🍽️',
            prompt: "You are a receptionist at a popular restaurant. I am a customer calling to make a reservation for two people tonight. Greet me and ask for the time I'd like to book. Keep your responses short and professional.",
            color: 'bg-indigo-500'
        },
        'doctor-visit': {
            title: 'زيارة طبيب',
            emoji: '🏥',
            prompt: "You are a doctor in a clinic. I am your patient. Start the conversation by asking me about my symptoms. Keep your responses clear and concise.",
            color: 'bg-teal-500'
        },
        'job-interview': {
            title: 'مقابلة عمل',
            emoji: '💼',
            prompt: "You are an interviewer for a company. I am a candidate applying for a marketing position. Start the conversation by asking me to tell you about myself. Keep your responses formal and encouraging.",
            color: 'bg-purple-500'
        }
    };

    const [selectedScenario, setSelectedScenario] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);
    
    // ✅ تحديث دالة بدء المحادثة
    const startConversation = async (scenarioKey) => {
        const scenario = scenarios[scenarioKey];
        setSelectedScenario(scenario);
        setIsLoading(true);
        
        const systemPrompt = { sender: 'system', text: `بدأت محادثة: ${scenario.title}. أنت تبدأ.` };
        setConversation([systemPrompt]);
        
        // بناء سجل المحادثة لإرساله إلى AI
        const historyForGemini = [
            { sender: 'user', text: scenario.prompt }
        ];

        try {
            const result = await runGemini(historyForGemini);
            const aiMessage = { sender: 'ai', text: result.response };
            setConversation(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'system', text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
    
    // ✅ الكود المصحح
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;
        
        const newUserMessage = { sender: 'user', text: userInput };
        const updatedConversation = [...conversation, newUserMessage];
        setConversation(updatedConversation);
        setUserInput('');
        setIsLoading(true);

        // ✅ بناء سجل المحادثة بشكل صحيح:
        // 1. إضافة البرومبت الأولي (رسالة المستخدم الأولى)
        const historyForGemini = [{ sender: 'user', text: selectedScenario.prompt }];

        // 2. إضافة جميع رسائل المحادثة (التي تبدأ من الرسالة الثانية في مصفوفة conversation)
        updatedConversation.slice(1).forEach(msg => {
            historyForGemini.push({
                sender: msg.sender,
                text: msg.text
            });
        });

        try {
            const result = await runGemini(historyForGemini);
            const aiMessage = { sender: 'ai', text: result.response };
            setConversation(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'system', text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' };
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
            <button onClick={() => setSelectedScenario(null)} className="flex items-center gap-2 text-sky-400 dark:text-sky-300 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> اختر سيناريو آخر</button>
            <h1 className="text-3xl font-bold text-slate-100 dark:text-white mb-4">{selectedScenario.title} {selectedScenario.emoji}</h1>
            
            <div 
                className="rounded-2xl shadow-lg h-[60vh] flex flex-col overflow-hidden 
                        bg-gradient-to-br from-slate-900 to-gray-900 
                        dark:from-slate-900 dark:to-gray-900 border border-slate-700"
            >
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-700 dark:bg-indigo-700 flex items-center justify-center text-lg flex-shrink-0 mt-1 shadow-md">
                                    👽
                                </div>
                            )}
                            <div className={`max-w-[75%] md:max-w-md p-4 rounded-2xl shadow-lg text-white ${
                                msg.sender === 'user' 
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700 rounded-bl-3xl'
                                    : msg.sender === 'ai' 
                                        ? 'bg-gradient-to-br from-teal-500 to-blue-600 rounded-br-3xl'
                                        : 'bg-amber-700 dark:bg-amber-900/50 text-amber-200 text-center w-full rounded-lg'
                            }`}>
                                <p dir="auto">{msg.text}</p>
                            </div>
                            {msg.sender === 'ai' && (
                                <button onClick={() => speak(msg.text)} className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0 mt-1">
                                    <Volume2 size={20}/>
                                </button>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/80 dark:border-slate-700/50 flex items-center gap-3 bg-slate-800/60 dark:bg-slate-900/60 backdrop-blur-md">
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        placeholder="اكتب ردك هنا..." 
                        className="flex-1 p-3 bg-slate-700 dark:bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100 dark:text-white placeholder:text-slate-400 border border-transparent shadow-inner" 
                        disabled={isLoading} 
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !userInput.trim()} 
                        className="bg-indigo-500 text-white rounded-full p-3 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-md"
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
