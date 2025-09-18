import React, { useState, useRef, useEffect } from 'react';
import { LtrText } from './LtrText';
import { runGeminiChat } from '../helpers/geminiHelper';

const scenarios = {
    doctor: {
        title: 'At the Doctor\'s Office',
        description: 'You are at the doctor\'s office. Explain your symptoms to the doctor.',
        prompt: 'You are a helpful and friendly doctor. Start the conversation by asking "Hello, how can I help you today?". Wait for my response before continuing.'
    },
    restaurant: {
        title: 'Ordering Food',
        description: 'You are at a restaurant. Order your favorite meal.',
        prompt: 'You are a waiter at a restaurant. Start by saying "Welcome! Here is your menu. What would you like to start with?". Wait for my response.'
    },
    jobInterview: {
        title: 'Job Interview',
        description: 'You are in a job interview. Answer the interviewer\'s questions.',
        prompt: 'You are a job interviewer. Start by saying "Thank you for coming in today. Can you tell me a little about yourself?". Wait for my response.'
    },
    airport: {
        title: 'At the Airport',
        description: 'You are checking in for a flight. Talk to the check-in agent.',
        prompt: 'You are an airline check-in agent. Greet me and ask "Where are you flying to today?". Wait for my response.'
    },
    friend: {
        title: 'Chat with a Friend',
        description: 'You are talking to a friend. Make some weekend plans.',
        prompt: 'You are my friend. Start by saying "Hey! How have you been? Any plans for the weekend?". Wait for my response.'
    }
};

const RolePlaySection = () => {
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const conversationEndRef = useRef(null);

    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [conversation]);

    const startConversation = async (scenarioKey) => {
        const scenario = scenarios[scenarioKey];
        setSelectedScenario(scenario);
        setIsLoading(true);
        // --- ✅ بداية الإصلاح ---
        // إعادة تعيين المحادثة عند بدء سيناريو جديد
        setConversation([]);
        // --- 🛑 نهاية الإصلاح ---
        const historyForGemini = [
            { sender: 'user', text: scenario.prompt }
        ];
        try {
            const result = await runGeminiChat(historyForGemini);
            const aiMessage = { sender: 'ai', text: result.response };
            setConversation([aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'system', text: 'Sorry, there was a connection error. Please try again.' };
            setConversation([errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage = { sender: 'user', text: userInput };
        const newConversation = [...conversation, userMessage];
        setConversation(newConversation);
        setUserInput('');
        setIsLoading(true);

        const historyForGemini = newConversation.map(msg => ({
            sender: msg.sender,
            text: msg.text
        }));

        try {
            const result = await runGeminiChat(historyForGemini);
            const aiMessage = { sender: 'ai', text: result.response };
            setConversation(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'system', text: 'Sorry, there was a connection error. Please try again.' };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 rounded-lg shadow-lg bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-400">Role-Play Practice</h2>
            {!selectedScenario ? (
                <div>
                    <p className="text-center mb-6">Choose a scenario to start practicing your conversation skills.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(scenarios).map(key => (
                            <button
                                key={key}
                                onClick={() => startConversation(key)}
                                className="p-4 rounded-lg text-left bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600/70 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{scenarios[key].title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{scenarios[key].description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{selectedScenario.title}</h3>
                        <button onClick={() => setSelectedScenario(null)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                            Choose Another Scenario
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto p-4 rounded-lg bg-white dark:bg-slate-900/70 mb-4 border border-slate-200 dark:border-slate-700">
                        {conversation.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200'}`}>
                                    {msg.sender === 'system' ? (
                                        <p className="text-sm text-red-500 dark:text-red-400">{msg.text}</p>
                                    ) : (
                                        <LtrText text={msg.text} />
                                    )}
                                </div>
                            </div>
                        ))}
                         {isLoading && conversation.length > 0 && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={conversationEndRef} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            dir="auto"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                            placeholder="Type your response..."
                            className="flex-grow p-2 border rounded-lg bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolePlaySection;
