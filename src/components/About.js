// src/components/About.js

import React, { useState } from 'react';
import { Sparkles, Lightbulb, BrainCircuit, Repeat, MessageSquare, BookOpen, Star, Rocket, CheckCircle, LoaderCircle, Hourglass, HelpCircle, ChevronDown } from 'lucide-react';

// مكون مساعد لبطاقات الميزات والفلسفة
const InfoCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className="flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-full mb-4">
            <Icon className="w-6 h-6 text-sky-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{children}</p>
    </div>
);

// مكون مساعد لعناصر خريطة الطريق
const RoadmapItem = ({ icon: Icon, status, title, children, color }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${color.border}`}>
                <Icon className={`${color.text}`} size={20} />
            </div>
            <div className="w-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
        </div>
        <div className="pb-10">
            <p className={`text-sm font-semibold ${color.text}`}>{status}</p>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white mt-1">{title}</h4>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

// مكون مساعد للأسئلة الشائعة
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-5 text-left"
            >
                <span className="text-lg font-semibold text-slate-800 dark:text-white">{question}</span>
                <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="pb-5 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const About = () => {
    const faqs = [
        {
            question: "Is StellarSpeak completely free?",
            answer: "Yes, currently all features on StellarSpeak are available for free. Our mission is to make quality English learning accessible to everyone. In the future, we may introduce premium features to support the platform's growth, but our core tools will always have a free offering."
        },
        {
            question: "How is AI used on the platform?",
            answer: "We leverage state-of-the-art AI to power our interactive features. The AI acts as your personal conversation partner, provides instant feedback in exercises, helps generate dynamic stories, and offers personalized translations, creating a learning experience that adapts to you."
        },
        {
            question: "Is my data safe?",
            answer: "Absolutely. We take your privacy and data security very seriously. All user data is handled with strict confidentiality and protected using industry-standard security measures. We do not share your personal data with third parties."
        },
        {
            question: "How can I suggest a feature or report a problem?",
            answer: "We love hearing from our users! You can use the 'Feedback' feature within the admin panel or contact us directly. Your suggestions are invaluable in helping us improve StellarSpeak."
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
            {/* Section 1: The Story Behind The Idea */}
            <div className="text-center mb-20">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white">The Story of StellarSpeak</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    StellarSpeak was born from a simple yet powerful observation: learning a new language is a journey, not a destination. We noticed many learners struggled to find consistent practice partners and engaging materials. From this need, we embarked on a mission to build a platform that doesn't just teach English, but makes the learning process itself an exciting adventure.
                </p>
            </div>

            {/* Section 2: Our Learning Philosophy */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white">Our Learning Philosophy</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <InfoCard icon={Repeat} title="Learning by Doing">
                        We believe language is acquired through active practice, not passive memorization. Our tools are designed to get you speaking, writing, and thinking in English from day one.
                    </InfoCard>
                    <InfoCard icon={BrainCircuit} title="Smart Personalization">
                        Every learner is unique. Our AI-powered features adapt to your level and goals, providing a tailored experience that is both challenging and encouraging.
                    </InfoCard>
                    <InfoCard icon={Lightbulb} title="Fun & Consistency">
                        The key to mastery is consistency. We create engaging and enjoyable experiences—from interactive stories to learning with songs—to turn learning into a daily habit you'll love.
                    </InfoCard>
                </div>
            </div>

            {/* Section 3: Future Roadmap */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white">Our Journey & Future Roadmap</h2>
                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <RoadmapItem icon={CheckCircle} status="Completed" title="Core AI Features" color={{border: 'border-green-500', text: 'text-green-500'}}>
                            Launched the AI Conversation Partner, Reading Library, and Personal Vocabulary tools.
                        </RoadmapItem>
                        <RoadmapItem icon={LoaderCircle} status="In Progress" title="Podcast Listening Section" color={{border: 'border-sky-500', text: 'text-sky-500'}}>
                            Developing a new section for listening practice with podcasts, complete with transcripts and vocabulary integration.
                        </RoadmapItem>
                        <RoadmapItem icon={Hourglass} status="Planned" title="Advanced Level-Up System" color={{border: 'border-amber-500', text: 'text-amber-500'}}>
                            Planning a more sophisticated system to track progress, set goals, and provide targeted grammar exercises.
                        </RoadmapItem>
                        <RoadmapItem icon={Rocket} status="Future Goal" title="Mobile Applications" color={{border: 'border-purple-500', text: 'text-purple-500'}}>
                            Our long-term vision includes dedicated Android and iOS apps to make learning on the go even easier.
                        </RoadmapItem>
                    </div>
                </div>
            </div>

            {/* Section 4: FAQ */}
            <div>
                 <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white">Frequently Asked Questions</h2>
                 <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default About;
