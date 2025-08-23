// src/data/grammarRules.js

export const grammarRules = [
  // ===================================
  // ====== Beginner (A1/A2) Rules ======
  // ===================================
  {
    id: "A1-2",
    title: "The Verb 'to be' (am, is, are)",
    level: "A1",
    explanation: {
      en: "The verb 'to be' is used to describe states, identity, and characteristics.",
      ar: "يُستخدم الفعل 'to be' لوصف الحالات، الهوية، والخصائص."
    },
    usage: [
      { pronoun: "I", form: "am", example: "I am happy." },
      { pronoun: "He / She / It", form: "is", example: "He is a doctor." },
      { pronoun: "You / We / They", form: "are", example: "They are students." }
    ]
  },
  {
    id: "A1-10",
    title: "Simple Present Tense",
    level: "A1",
    explanation: {
      en: "Used for habits, routines, and general truths.",
      ar: "يُستخدم للتعبير عن العادات، الروتين، والحقائق العامة."
    },
    usage: [
      { pronoun: "Habit", form: "verb / verb-s", example: "She walks to school every day." },
      { pronoun: "General Truth", form: "verb-s", example: "The sun rises in the east." },
      { pronoun: "Routine", form: "verb", example: "We play football on weekends." }
    ]
  },
  {
    id: "A1-7",
    title: "Articles (a, an, the)",
    level: "A1",
    explanation: {
      en: "'a/an' are indefinite articles used for non-specific nouns. 'the' is a definite article for specific nouns.",
      ar: "'a/an' هي أدوات نكرة تُستخدم للأسماء غير المحددة. 'the' هي أداة تعريف للأسماء المحددة."
    },
    usage: [
      { pronoun: "Indefinite (Consonant)", form: "a", example: "I see a cat. (any cat)" },
      { pronoun: "Indefinite (Vowel)", form: "an", example: "She has an apple." },
      { pronoun: "Definite", form: "the", example: "The cat is black. (a specific cat)" }
    ]
  },
  {
    id: "A1-6",
    title: "Nouns (Singular and Plural)",
    level: "A1",
    explanation: {
      en: "Nouns can be singular (one) or plural (more than one). Most plurals are formed by adding -s.",
      ar: "يمكن أن تكون الأسماء مفردة (واحد) أو جمع (أكثر من واحد). معظم صيغ الجمع تتكون بإضافة -s."
    },
    usage: [
      { pronoun: "Regular", form: "+ s/es", example: "book -> books, car -> cars" },
      { pronoun: "Irregular", form: "Unique form", example: "man -> men, child -> children" }
    ]
  },
  {
    id: "A1-3",
    title: "Pronouns (Subject Pronouns)",
    level: "A1",
    explanation: {
      en: "Pronouns replace nouns. Subject pronouns are: I, you, he, she, it, we, they.",
      ar: "الضمائر تحل محل الأسماء. ضمائر الفاعل هي: I, you, he, she, it, we, they."
    },
    usage: [
      { pronoun: "She", form: "Third person female", example: "She is my sister." },
      { pronoun: "They", form: "Third person plural", example: "They live in London." }
    ]
  },
  {
    id: "A1-26",
    title: "Simple Past Tense (Regular Verbs)",
    level: "A1",
    explanation: {
      en: "Used for completed actions in the past. For regular verbs, add -ed.",
      ar: "يُستخدم للأفعال التي اكتملت في الماضي. للأفعال المنتظمة، نضيف -ed."
    },
    usage: [
      { pronoun: "Yesterday", form: "walked", example: "I walked to the park yesterday." },
      { pronoun: "Past action", form: "played", example: "He played the guitar." }
    ]
  },
  {
    id: "A1-27",
    title: "Simple Past Tense (Irregular Verbs)",
    level: "A1",
    explanation: {
      en: "Irregular verbs have unique past tense forms that must be memorized.",
      ar: "الأفعال الشاذة لها أشكال فريدة في الماضي يجب حفظها."
    },
    usage: [
      { pronoun: "go", form: "went", example: "She went to the cinema." },
      { pronoun: "see", form: "saw", example: "I saw a movie." },
      { pronoun: "eat", form: "ate", example: "We ate pizza." }
    ]
  },
  {
    id: "A1-14",
    title: "Prepositions of Place (in, on, at)",
    level: "A1",
    explanation: {
      en: "Used to indicate location. 'in' for enclosed spaces, 'on' for surfaces, and 'at' for specific points.",
      ar: "تُستخدم لتحديد الموقع. 'in' للأماكن المغلقة، 'on' للأسطح، و 'at' لنقاط محددة."
    },
    usage: [
      { pronoun: "in", form: "Enclosed space", example: "The keys are in the box." },
      { pronoun: "on", form: "Surface", example: "The book is on the table." },
      { pronoun: "at", form: "Specific point", example: "Let's meet at the bus stop." }
    ]
  },
  {
    id: "A1-16",
    title: "'There is' / 'There are'",
    level: "A1",
    explanation: {
      en: "Used to say that something exists. 'There is' for singular, 'There are' for plural.",
      ar: "تُستخدم للقول بوجود شيء ما. 'There is' للمفرد، 'There are' للجمع."
    },
    usage: [
      { pronoun: "Singular", form: "There is", example: "There is a book on the table." },
      { pronoun: "Plural", form: "There are", example: "There are two chairs in the room." }
    ]
  },
  {
    id: "A1-18",
    title: "The Verb 'have got'",
    level: "A1",
    explanation: {
      en: "Used to express possession, very common in British English.",
      ar: "تُستخدم للتعبير عن الملكية، وهي شائعة جدًا في الإنجليزية البريطانية."
    },
    usage: [
      { pronoun: "I / You / We / They", form: "have got", example: "I have got a new car." },
      { pronoun: "He / She / It", form: "has got", example: "She has got blue eyes." }
    ]
  },

  // =======================================
  // ====== Intermediate (B1/B2) Rules ======
  // =======================================
  {
    id: "A1-21",
    title: "Present Continuous Tense",
    level: "B1",
    explanation: {
      en: "Used for actions happening right now or for temporary situations. (Subject + am/is/are + Verb-ing)",
      ar: "يُستخدم للأفعال التي تحدث الآن أو للمواقف المؤقتة. (فاعل + am/is/are + فعل-ing)"
    },
    usage: [
      { pronoun: "Right now", form: "are learning", example: "You are learning English now." },
      { pronoun: "Temporary", form: "is working", example: "He is working in Dubai this month." }
    ]
  },
  {
    id: "A2-5",
    title: "Present Perfect Tense",
    level: "B1",
    explanation: {
      en: "Used for actions that started in the past and continue to the present, or for past actions with a result in the present. (Subject + have/has + Past Participle)",
      ar: "يُستخدم للأفعال التي بدأت في الماضي وتستمر حتى الحاضر، أو لأفعال ماضية لها نتيجة في الحاضر. (فاعل + have/has + التصريف الثالث للفعل)"
    },
    usage: [
      { pronoun: "Unspecified past", form: "have seen", example: "I have seen that movie before." },
      { pronoun: "Duration", form: "has lived", example: "She has lived here for three years." }
    ]
  },
  {
    id: "A2-12",
    title: "Comparative and Superlative Adjectives",
    level: "B1",
    explanation: {
      en: "Comparatives compare two things (e.g., taller, more expensive). Superlatives compare three or more things (e.g., tallest, most expensive).",
      ar: "صيغ المقارنة (Comparatives) تقارن بين شيئين. صيغ التفضيل (Superlatives) تقارن بين ثلاثة أشياء أو أكثر."
    },
    usage: [
      { pronoun: "Comparative", form: "faster than", example: "My car is faster than yours." },
      { pronoun: "Superlative", form: "the most beautiful", example: "This is the most beautiful city." }
    ]
  },
  {
    id: "A2-15",
    title: "Modal Verbs (can, should, must)",
    level: "B1",
    explanation: {
      en: "Auxiliary verbs that express ability, possibility, permission, or obligation.",
      ar: "أفعال مساعدة تعبر عن القدرة، الإمكانية، الإذن، أو الالتزام."
    },
    usage: [
      { pronoun: "Ability", form: "can", example: "I can speak English." },
      { pronoun: "Advice", form: "should", example: "You should see a doctor." },
      { pronoun: "Obligation", form: "must", example: "You must finish your homework." }
    ]
  },
  {
    id: "A2-11",
    title: "'will' and 'be going to' for Future",
    level: "B1",
    explanation: {
      en: "'will' is for spontaneous decisions and predictions. 'be going to' is for plans and intentions.",
      ar: "'will' للقرارات العفوية والتنبؤات. 'be going to' للخطط والنوايا."
    },
    usage: [
      { pronoun: "Spontaneous", form: "will have", example: "I will have a coffee." },
      { pronoun: "Plan", form: "am going to", example: "I am going to travel to Egypt." }
    ]
  },
  {
    id: "A2-3",
    title: "Past Continuous Tense",
    level: "B1",
    explanation: {
      en: "Describes an action that was in progress at a specific time in the past. (Subject + was/were + Verb-ing)",
      ar: "يصف فعلاً كان مستمراً في وقت محدد في الماضي. (فاعل + was/were + فعل-ing)"
    },
    usage: [
      { pronoun: "Interrupted action", form: "was watching", example: "I was watching TV when you called." }
    ]
  },
  {
    id: "A1-24",
    title: "Adverbs of Frequency",
    level: "B1",
    explanation: {
      en: "Describe how often an action happens. They usually go before the main verb, but after 'to be'.",
      ar: "تصف عدد مرات حدوث الفعل. عادة ما تأتي قبل الفعل الرئيسي، ولكن بعد فعل 'to be'."
    },
    usage: [
      { pronoun: "always", form: "Before main verb", example: "I always drink coffee in the morning." },
      { pronoun: "never", form: "After 'to be'", example: "He is never late." }
    ]
  },
  {
    id: "A1-22",
    title: "Countable and Uncountable Nouns",
    level: "B1",
    explanation: {
      en: "Countable nouns can be counted (e.g., apple). Uncountable nouns cannot be counted (e.g., water).",
      ar: "الأسماء المعدودة يمكن عدها (مثل: تفاحة). الأسماء غير المعدودة لا يمكن عدها (مثل: ماء)."
    },
    usage: [
      { pronoun: "Countable", form: "has plural form", example: "one apple, two apples" },
      { pronoun: "Uncountable", form: "only singular", example: "some water (not waters)" }
    ]
  },
  {
    id: "A2-19",
    title: "First Conditional",
    level: "B1",
    explanation: {
      en: "Used for real possibilities in the future. (If + Simple Present, ... will + base verb)",
      ar: "تُستخدم للإمكانيات الحقيقية في المستقبل. (إذا + مضارع بسيط، ... will + الفعل الأساسي)"
    },
    usage: [
      { pronoun: "Condition", form: "If it rains", example: "If it rains, I will stay at home." }
    ]
  },
  {
    id: "B1-8",
    title: "Gerunds and Infinitives",
    level: "B1",
    explanation: {
      en: "A Gerund (verb + ing) acts like a noun. An Infinitive (to + verb) is the base form of a verb.",
      ar: "المصدر (Gerund) يعمل عمل الاسم. صيغة المصدر (Infinitive) هي الصيغة الأساسية للفعل."
    },
    usage: [
      { pronoun: "Gerund as subject", form: "verb-ing", example: "Swimming is fun." },
      { pronoun: "Infinitive after verb", form: "to + verb", example: "I want to swim." }
    ]
  },
  
  // ===================================
  // ====== Advanced (C1/C2) Rules ======
  // ===================================
  {
    id: "B1-5",
    title: "Second Conditional",
    level: "C1",
    explanation: {
      en: "Used for hypothetical or unlikely situations in the present or future. (If + Simple Past, ... would + base verb)",
      ar: "تُستخدم للمواقف الافتراضية أو غير المحتملة في الحاضر أو المستقبل. (إذا + ماضي بسيط، ... would + الفعل الأساسي)"
    },
    usage: [
      { pronoun: "Hypothetical", form: "If I won, I would...", example: "If I won the lottery, I would buy a big house." }
    ]
  },
  {
    id: "B2-1", // Closest match
    title: "Third Conditional",
    level: "C1",
    explanation: {
      en: "Used for hypothetical situations in the past; things that did not happen. (If + Past Perfect, ... would have + Past Participle)",
      ar: "تُستخدم للمواقف الافتراضية في الماضي؛ أشياء لم تحدث. (إذا + ماضي تام، ... would have + التصريف الثالث للفعل)"
    },
    usage: [
      { pronoun: "Past regret", form: "If you had studied...", example: "If you had studied harder, you would have passed." }
    ]
  },
  {
    id: "B1-10",
    title: "Passive Voice",
    level: "C1",
    explanation: {
      en: "The subject receives the action. The focus is on the action, not the doer. (Object + to be + Past Participle)",
      ar: "الفاعل يتلقى الفعل (المبني للمجهول). التركيز يكون على الحدث وليس على من قام به."
    },
    usage: [
      { pronoun: "Active", form: "Subject-Verb-Object", example: "The cat ate the mouse." },
      { pronoun: "Passive", form: "Object-Verb-Subject", example: "The mouse was eaten by the cat." }
    ]
  },
  {
    id: "B1-7",
    title: "Reported Speech",
    level: "C1",
    explanation: {
      en: "Reporting what someone else said, which often involves changing the tense ('backshifting').",
      ar: "نقل كلام شخص آخر، وغالباً ما يتضمن تغيير الزمن (العودة بالزمن للخلف)."
    },
    usage: [
      { pronoun: "Direct Speech", form: "Present tense", example: "\"I am happy.\"" },
      { pronoun: "Reported Speech", form: "Past tense", example: "He said that he was happy." }
    ]
  },
  {
    id: "B1-2",
    title: "Past Perfect Tense",
    level: "C1",
    explanation: {
      en: "Used to describe an action that happened before another action in the past. (Subject + had + Past Participle)",
      ar: "يُستخدم لوصف فعل حدث قبل فعل آخر في الماضي. (فاعل + had + التصريف الثالث للفعل)"
    },
    usage: [
      { pronoun: "Sequence of past", form: "had left", example: "When I arrived, the train had already left." }
    ]
  },
  {
    id: "A2-28",
    title: "Relative Clauses",
    level: "C1",
    explanation: {
      en: "Clauses that describe a noun. Defining clauses give essential info. Non-defining give extra info and use commas.",
      ar: "جمل تصف اسماً. جملة الصلة المحددة تعطي معلومة أساسية. غير المحددة تعطي معلومة إضافية وتستخدم فواصل."
    },
    usage: [
      { pronoun: "Defining", form: "who (no commas)", example: "The man who lives next door is a doctor." },
      { pronoun: "Non-defining", form: "who (with commas)", example: "My brother, who lives in London, is a doctor." }
    ]
  },
  {
    id: "A2-25",
    title: "Phrasal Verbs",
    level: "C1",
    explanation: {
      en: "A verb combined with a preposition or adverb, creating a new, often idiomatic, meaning.",
      ar: "فعل مركب مع حرف جر أو ظرف، مما يخلق معنى جديداً، وغالباً ما يكون اصطلاحياً."
    },
    usage: [
      { pronoun: "look up", form: "Search for info", example: "I need to look up this word." },
      { pronoun: "give up", form: "Quit", example: "Don't give up on your dreams." },
      { pronoun: "take off", form: "Leave the ground", example: "The plane will take off soon." }
    ]
  },
  {
    id: "B2-1",
    title: "Mixed Conditionals",
    level: "C1",
    explanation: {
      en: "Combining different conditional forms, usually the second and third, to link a past condition with a present result.",
      ar: "دمج أشكال مختلفة من الجمل الشرطية، عادةً الثانية والثالثة، لربط شرط في الماضي بنتيجة في الحاضر."
    },
    usage: [
      { pronoun: "Past -> Present", form: "If + past perfect, ...would + verb", example: "If I had taken that job, I would be rich now." }
    ]
  },
  {
    id: "B2-4",
    title: "Inversion",
    level: "C1",
    explanation: {
      en: "Inverting the usual subject-verb order for emphasis, often after negative adverbs like 'Never', 'Rarely', 'Not only'.",
      ar: "عكس الترتيب المعتاد للفاعل والفعل للتأكيد، وغالباً ما يأتي بعد الظروف النافية."
    },
    usage: [
      { pronoun: "Normal", form: "Subject-Verb", example: "I have never seen such a beautiful sight." },
      { pronoun: "Inversion", form: "Adverb-Aux-Subject", example: "Never have I seen such a beautiful sight." }
    ]
  },
  {
    id: "B1-4",
    title: "Future Perfect Tense",
    level: "C1",
    explanation: {
      en: "Used for an action that will be completed before another time or event in the future. (will have + Past Participle)",
      ar: "يُستخدم لفعل سيكتمل قبل وقت أو حدث آخر في المستقبل. (will have + التصريف الثالث للفعل)"
    },
    usage: [
      { pronoun: "By a future time", form: "will have graduated", example: "By next year, I will have graduated." }
    ]
  }
];
