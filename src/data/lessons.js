export const lessonTitles = {
  A1: [
    "The Alphabet & Greetings", "Verb 'to be' (am, is, are)", "Subject Pronouns",
    "Numbers (1-20) and Age", "Countries & Nationalities", "Singular & Plural Nouns",
    "Articles (a, an, a)", "This, That, These, Those", "Possessive Adjectives",
    "Present Simple (I, You, We, They)", "Present Simple (He, She, It)", "Question Words",
    "Adjectives", "Prepositions of Place (in, on, at)", "Telling the Time",
    "'There is' & 'There are'", "'Can' for Ability", "'Have got' for Possession",
    "Family Members", "Food and Drink", "Present Continuous",
    "Countable & Uncountable Nouns", "'Some' and 'Any'", "Adverbs of Frequency",
    "Simple Past (Verb 'to be')", "Simple Past (Regular Verbs)", "Simple Past (Irregular Verbs)",
    "Object Pronouns", "'Like' + Verb-ing", "A1 Level Review"
  ],
  A2: [
    "Present Simple vs. Present Continuous", "Past Simple Review (Irregular Verbs)", "Past Continuous",
    "Past Simple vs. Past Continuous", "Present Perfect (Introduction)", "Present Perfect with 'ever' and 'never'",
    "Present Perfect with 'just', 'already', 'yet'", "Present Perfect vs. Past Simple", "Future with 'going to'",
    "Present Continuous for Future Arrangements", "Future with 'will'", "Comparatives",
    "Superlatives", "Adverbs of Manner", "Modals of Obligation (must, have to)",
    "Modals of Advice (should)", "Quantifiers (much, many, a lot of)", "Quantifiers (a little, a few)",
    "First Conditional", "Prepositions of Movement", "'be like' for descriptions",
    "Giving Directions", "Describing People (Appearance)", "Describing People (Personality)",
    "Phrasal Verbs (Introduction)", "Health and Sickness", "Articles (a/an, the, no article)",
    "Relative Clauses (who, which, that)", "Making Suggestions", "A2 Level Review"
  ],
  B1: [ "Present Perfect Continuous", "Past Perfect", "Past Perfect Continuous", "Future Continuous & Perfect", "Second Conditional", "Relative Clauses", "Reported Speech", "Gerunds & Infinitives", "Modals for Speculation", "Passive Voice", "Question Tags", "So / Such", "Enough / Too with Adjectives", "Wish / If only", "Causative Form (have/get)", "Social Issues", "Environment & Climate", "Culture and Arts", "News and Media", "Relationships", "Education and Learning", "World Travel", "Historical Events", "Advanced Technology", "Lifestyle and Health", "Review: B1 Grammar Part 1", "Review: B1 Grammar Part 2", "Review: B1 Vocabulary Part 1", "Review: B1 Vocabulary Part 2", "Final B1 Test" ],
  B2: [ "Mixed Conditionals", "Advanced Passive Forms", "Advanced Modals", "Inversion for Emphasis", "Future in the Past", "Advanced Reported Speech", "Participle Clauses", "Nominalisation", "Non-defining Relative Clauses", "Subjunctive Mood", "Complex Connectors", "Advanced Verb Patterns", "Emphatic Structures", "Ellipsis & Substitution", "Hedging & Softening", "Business and Corporate Terms", "Economics and Finance", "Science and Inventions", "Philosophy & Abstract Ideas", "Politics & Int. Relations", "Literary Analysis", "Body Language", "Debates and Discussions", "Idiomatic Expressions", "Academic Terminology", "Review: B2 Grammar Part 1", "Review: B2 Grammar Part 2", "Review: B2 Vocabulary Part 1", "Review: B2 Vocabulary Part 2", "Final B2 Test" ],
  C1: [ "Advanced Conditionals", "Complex Inversion Patterns", "Advanced Passive", "Modals in Past & Future", "Cleft Sentences", "Advanced Linking Devices", "Elliptical Structures", "Subjunctive in Formal Contexts", "Nominal Clauses", "Reported Speech Nuances", "Mixed Verb Patterns", "Relative Clauses w/ Prepositions", "Emphasis & Word Order", "Hedging for Academia", "Advanced Discourse Markers", "Legal Terminology", "Academic Research Vocab", "Scientific Terminology", "Figurative Language", "Advanced Medical Terms", "Specialized Journalism", "Political Rhetoric", "Nuanced Emotions", "Creative Writing Vocab", "Critical Expression", "Review: C1 Grammar Part 1", "Review: C1 Grammar Part 2", "Review: C1 Vocabulary Part 1", "Review: C1 Vocabulary Part 2", "Final C1 Test" ],
};

export const initialLessonsData = Object.keys(lessonTitles).reduce((acc, level) => {
    acc[level] = lessonTitles[level].map((title, i) => ({
        id: `${level}-${i + 1}`,
        title: title,
        completed: false,
        stars: 0
    }));
    return acc;
}, {});

export const initialLevels = {
  A1: { name: "كوكب الأساسيات", icon: "A1", lessons: 30, color: "from-sky-500 to-indigo-500" },
  A2: { name: "قمر البناء", icon: "A2", lessons: 30, color: "from-teal-400 to-cyan-500" },
  B1: { name: "سديم المتوسطين", icon: "B1", lessons: 30, color: "from-amber-400 to-orange-500" },
  B2: { name: "مجرة الطلاقة", icon: "B2", lessons: 30, color: "from-orange-500 to-red-600" },
  C1: { name: "سديم الحكمة", icon: "C1", lessons: 30, color: "from-purple-600 to-indigo-700" },
};

export const placementTestQuestionsByLevel = {
    A1: [
        { question: "___ name is John.", options: ["I", "My", "Me", "Mine"], answer: "My" },
        { question: "They ___ from Spain.", options: ["is", "are", "am", "be"], answer: "are" },
        { question: "Can you pass me ___ apple, please?", options: ["a", "an", "the", "any"], answer: "an" },
        { question: "Look at ___ birds in the sky!", options: ["this", "that", "these", "those"], answer: "those" },
        { question: "There ___ a book on the table.", options: ["is", "are", "have", "has"], answer: "is" }
    ],
    A2: [
        { question: "I ___ to the cinema yesterday.", options: ["go", "goes", "went", "gone"], answer: "went" },
        { question: "She is ___ than her brother.", options: ["tall", "taller", "tallest", "more tall"], answer: "taller" },
        { question: "We are ___ visit our grandparents next week.", options: ["going to", "will", "go to", "goes to"], answer: "going to" },
        { question: "Have you ever ___ to Japan?", options: ["be", "been", "was", "were"], answer: "been" },
        { question: "You ___ touch that, it's dangerous.", options: ["must", "mustn't", "have to", "don't have to"], answer: "mustn't" }
    ],
    B1: [
        { question: "If I ___ more money, I would buy a new car.", options: ["have", "had", "will have", "would have"], answer: "had" },
        { question: "The Mona Lisa ___ by Leonardo da Vinci.", options: ["painted", "was painted", "has painted", "paints"], answer: "was painted" },
        { question: "He has been ___ for three hours.", options: ["study", "studying", "studied", "studies"], answer: "studying" },
        { question: "She told me she ___ tired.", options: ["is", "was", "has been", "had been"], answer: "was" },
        { question: "I enjoy ___ books in my free time.", options: ["read", "to read", "reading", "to reading"], answer: "reading" }
    ],
    B2: [
        { question: "By the time you arrive, I ___ dinner.", options: ["will finish", "will be finishing", "will have finished", "finish"], answer: "will have finished" },
        { question: "I wish I ___ earlier.", options: ["left", "had left", "leave", "would leave"], answer: "had left" },
        { question: "Despite ___ hard, he failed the exam.", options: ["studying", "he studied", "to study", "of studying"], answer: "studying" },
        { question: "It is ___ a beautiful day that we decided to go to the beach.", options: ["so", "such", "very", "too"], answer: "such" },
        { question: "The man ___ car was stolen went to the police.", options: ["who", "which", "that", "whose"], answer: "whose" }
    ],
    C1: [
        { question: "___ had I walked in the door than the phone rang.", options: ["No sooner", "Hardly", "Scarcely", "Barely"], answer: "No sooner" },
        { question: "The project, ___ was a great success, is now completed.", options: ["that", "which", "who", "whose"], answer: "which" },
        { question: "I'd rather you ___ that to me.", options: ["didn't say", "hadn't said", "don't say", "wouldn't say"], answer: "hadn't said" },
        { question: "She is considered ___ one of the best artists of her generation.", options: ["to be", "being", "be", "to being"], answer: "to be" },
        { question: "___ the weather, the picnic was a huge success.", options: ["Although", "Despite", "In spite", "Notwithstanding"], answer: "Notwithstanding" }
    ]
};

export const initialReadingMaterials = [ { id: 1, type: 'Story', title: 'The Lost Compass', content: "In a small village nestled between rolling hills, a young boy named Leo found an old brass compass. It didn't point north. Instead, it whispered directions to forgotten places and lost memories. One day, it led him to an ancient oak tree with a hidden door at its base. He opened it, and a wave of starlight and forgotten songs washed over him. He realized the compass didn't find places, but moments of wonder. He learned that the greatest adventures are not on a map, but in the heart." }, { id: 2, type: 'Article', title: 'The Power of Sleep', content: "Sleep is not just a period of rest; it's a critical biological process. During sleep, our brains consolidate memories, process information, and clear out metabolic waste. A lack of quality sleep can impair cognitive function, weaken the immune system, and affect our mood. Scientists recommend 7-9 hours of sleep for adults for optimal health. It's as important as a balanced diet and regular exercise. Prioritizing sleep is an investment in your physical and mental well-being." }, ];
