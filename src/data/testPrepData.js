// src/data/testPrepData.js

export const tests = [
    {
        name: "IELTS Academic Reading Practice",
        description: "اختبار قراءة أكاديمي يحاكي اختبار IELTS لمساعدتك على التدرب على أنواع الأسئلة المختلفة.",
        questions: [
            {
                question: "Read the passage and answer the question. The passage is about the history of renewable energy. When was the first large-scale solar power plant built?",
                options: ["1969", "1984", "1991", "2005"],
                correct: "1984"
            },
            {
                question: "Which of the following is NOT mentioned as a type of renewable energy in the passage?",
                options: ["Solar", "Wind", "Geothermal", "Nuclear"],
                correct: "Nuclear"
            }
        ]
    },
    {
        name: "TOEIC Listening Practice",
        description: "تدرب على أسئلة الاستماع الشائعة في اختبار TOEIC لتحسين فهمك للغة الإنجليزية في سياق الأعمال.",
        questions: [
            {
                question: "Listen to the conversation. Where are the speakers?",
                options: ["In an office", "At a restaurant", "In a library", "At the airport"],
                correct: "In an office"
            },
            {
                question: "What is the man's problem?",
                options: ["His computer is broken", "He missed his flight", "He lost his report", "He needs to schedule a meeting"],
                correct: "His computer is broken"
            }
        ]
    },
    {
        name: "TOEFL Structure Practice",
        description: "هذا القسم لم يكتمل بعد وسيتم إضافة محتوى له قريباً.",
        //  لا يوجد قسم أسئلة هنا لتجنب المشكلة السابقة
    }
];
