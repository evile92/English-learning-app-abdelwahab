// src/data/testPrepData.js

export const tests = [
    {
        name: "IELTS Academic Reading Practice",
        description: "An academic reading test that simulates the IELTS exam to help you practice different question types.",
        questions: [
            {
                question: "The passage is about the history of renewable energy. When was the first large-scale solar power plant built?",
                // FIX: Changed from optionA, optionB, etc. to a single 'options' array
                options: ["1969", "1984", "1991", "2005"],
                correct: "1984"
            },
            {
                question: "Which of the following is NOT mentioned as a type of renewable energy in the passage?",
                options: ["Solar", "Wind", "Geothermal", "Nuclear"],
                correct: "Nuclear"
            },
            {
                question: "The word 'ubiquitous' in the second paragraph is closest in meaning to:",
                options: ["Rare", "Widespread", "Complicated", "Expensive"],
                correct: "Widespread"
            }
        ]
    },
    {
        name: "TOEIC Listening & Reading Practice",
        description: "Practice common listening and reading questions from the TOEIC test to improve your business English comprehension.",
        questions: [
            {
                question: "Where are the speakers?",
                options: ["In an office", "At a restaurant", "In a library", "At the airport"],
                correct: "In an office"
            },
            {
                question: "What is the man's problem?",
                options: ["His computer is broken", "He missed his flight", "He lost his report", "He needs to schedule a meeting"],
                correct: "His computer is broken"
            },
            {
                question: "What will the woman most likely do next?",
                options: ["Call a technician", "Leave the office", "Buy a new computer", "Write a report"],
                correct: "Call a technician"
            }
        ]
    },
    {
        name: "TOEFL Structure Practice",
        description: "Sharpen your grammar skills with structure and written expression questions similar to those on the TOEFL ITP test.",
        questions: [
            {
                question: "The committee has met and ______.",
                options: ["they have reached a decision", "it has reached a decision", "its decision was reached", "it reached a decision"],
                correct: "it has reached a decision"
            },
            {
                question: "A seventeen-year-old is not ______ to vote in an election.",
                options: ["old enough", "as old enough", "enough old", "old as enough"],
                correct: "old enough"
            },
            {
                question: "Only after the experiment ______ completed could the researchers publish their findings.",
                options: ["was", "were", "had been", "have been"],
                correct: "had been"
            },
            {
                question: "The professor, along with his assistants, ______ preparing the conference materials.",
                options: ["is", "are", "were", "have been"],
                correct: "is"
            }
        ]
    },
    // ... Rest of the tests follow the same corrected structure
    {
        name: "Advanced Grammar & Sentence Correction",
        description: "Identify the error in each sentence or choose the best way to correct it. Focus on advanced grammar rules.",
        questions: [
            {
                question: "Despite of the heavy rain, the match continued without interruption.",
                options: ["Despite of the heavy rain", "Despite the heavy rain", "Although of the heavy rain", "In spite of the heavy rain"],
                correct: "Despite the heavy rain"
            },
            {
                question: "Neither the teacher nor the students was ready for the presentation.",
                options: ["Neither the teacher nor the students was", "Neither the teacher nor the students were", "Neither the teacher or the students was", "Neither the teacher or the students were"],
                correct: "Neither the teacher nor the students were"
            },
            {
                question: "Hardly he had entered the room when the phone rang.",
                options: ["Hardly he had entered", "Hardly had he entered", "Hardly did he entered", "Hardly has he entered"],
                correct: "Hardly had he entered"
            },
            {
                question: "He denied to have stolen the documents.",
                options: ["denied to have stolen", "denied having stolen", "denied to having stolen", "denied for having stolen"],
                correct: "denied having stolen"
            },
            {
                question: "No sooner the bell rang than the students rushed out.",
                options: ["No sooner the bell rang", "No sooner had the bell rang", "No sooner had the bell rung", "No sooner has the bell rung"],
                correct: "No sooner had the bell rung"
            }
        ]
    },
    {
        name: "IELTS Reading: Climate Change",
        description: "Read passages and answer questions related to the topic of climate change, similar to the IELTS format.",
        questions: [
            {
                question: "What is the primary cause of modern climate change mentioned in the passage?",
                options: ["Natural weather cycles", "Human activities", "Solar radiation", "Volcanic eruptions"],
                correct: "Human activities"
            },
            {
                question: "What do greenhouse gases do in the Earth’s atmosphere?",
                options: ["Block rainfall", "Trap heat", "Reduce oxygen levels", "Create wind patterns"],
                correct: "Trap heat"
            },
            {
                question: "Which of the following is a direct consequence of climate change according to the passage?",
                options: ["Improved biodiversity", "Rising sea levels", "Lower global temperatures", "Fewer weather events"],
                correct: "Rising sea levels"
            },
            {
                question: "What role does reforestation play in addressing climate change?",
                options: ["It increases greenhouse gases", "It provides renewable energy", "It helps absorb carbon dioxide", "It causes sea level rise"],
                correct: "It helps absorb carbon dioxide"
            }
        ]
    }
];
