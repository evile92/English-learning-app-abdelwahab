// src/components/FillInTheBlankQuiz.js

import React from 'react';
import { Lightbulb } from 'lucide-react';

const FillInTheBlankQuiz = ({ quiz, onComplete }) => {
    // هذا المكون بسيط حالياً ويعرض كل الأسئلة معاً. يمكن تطويره ليعرض سؤالاً واحداً كل مرة.
    
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
                ✍️ تمرين تطبيقي: املأ الفراغ
            </h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                اكتب الكلمة الصحيحة في الفراغ لإكمال الجملة.
            </p>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto space-y-6">
                {quiz.map((item, index) => (
                    <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                        <p dir="ltr" className="text-lg text-slate-800 dark:text-slate-100 text-left mb-3">
                            {index + 1}. {item.question.replace('___', '______')}
                        </p>
                        <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                            <Lightbulb size={20} className="text-amber-500 flex-shrink-0" />
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                <span className="font-semibold">الإجابة الصحيحة:</span>
                                <span dir="ltr" className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md mx-1">{item.correctAnswer}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="max-w-2xl mx-auto mt-6">
                <button 
                    onClick={onComplete}
                    className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all"
                >
                    فهمت، أكمل الدرس
                </button>
            </div>
        </div>
    );
};

export default FillInTheBlankQuiz;
