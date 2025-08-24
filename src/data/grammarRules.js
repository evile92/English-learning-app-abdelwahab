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
  {
    id: "A1-9",
    title: "Possessive Adjectives (my, your, his, her)",
    level: "A2",
    explanation: {
      en: "Used to show ownership or possession. They come before a noun.",
      ar: "تُستخدم لإظهار الملكية. تأتي قبل الاسم."
    },
    usage: [
      { pronoun: "my", form: "Belonging to me", example: "This is my book." },
      { pronoun: "your", form: "Belonging to you", example: "What is your name?" },
      { pronoun: "her", form: "Belonging to her", example: "Her car is red." }
    ]
  },
  {
    id: "A1-8",
    title: "Demonstratives (this, that, these, those)",
    level: "A2",
    explanation: {
      en: "Used to point out specific people or things based on proximity.",
      ar: "تُستخدم للإشارة إلى أشخاص أو أشياء محددة بناءً على القرب."
    },
    usage: [
      { pronoun: "This", form: "Singular, near", example: "This is an apple." },
      { pronoun: "That", form: "Singular, far", example: "That is a house." },
      { pronoun: "These", form: "Plural, near", example: "These are my keys." },
      { pronoun: "Those", form: "Plural, far", example: "Those are birds." }
    ]
  },
  {
    id: "A1-17",
    title: "'Can' for Ability and Permission",
    level: "A2",
    explanation: {
      en: "Used to express ability (what you know how to do) or to ask for permission.",
      ar: "تُستخدم للتعبير عن القدرة أو لطلب الإذن."
    },
    usage: [
      { pronoun: "Ability", form: "can + verb", example: "I can swim." },
      { pronoun: "Permission", form: "Can I...?", example: "Can I open the window?" }
    ]
  },
  {
    id: "A1-12",
    title: "Question Words (What, Where, When, Who)",
    level: "A2",
    explanation: {
      en: "Used at the beginning of questions to ask for information.",
      ar: "تُستخدم في بداية الأسئلة لطلب المعلومات."
    },
    usage: [
      { pronoun: "What", form: "Asking about things", example: "What is your job?" },
      { pronoun: "Where", form: "Asking about places", example: "Where do you live?" },
      { pronoun: "When", form: "Asking about time", example: "When is the party?" },
      { pronoun: "Who", form: "Asking about people", example: "Who is that man?" }
    ]
  },
  {
    id: "B2-11", // Placeholder
    title: "Conjunctions (and, but, or)",
    level: "A2",
    explanation: {
      en: "Words that connect words, phrases, or clauses.",
      ar: "كلمات تربط بين الكلمات، العبارات، أو الجمل."
    },
    usage: [
      { pronoun: "and", form: "Addition", example: "I like tea and coffee." },
      { pronoun: "but", form: "Contrast", example: "He is rich but unhappy." },
      { pronoun: "or", form: "Choice", example: "Do you want water or juice?" }
    ]
  },
  {
    id: "A1-13",
    title: "Adjectives",
    level: "A2",
    explanation: {
      en: "Words that describe nouns (people, places, things). They usually come before the noun.",
      ar: "كلمات تصف الأسماء. عادة ما تأتي قبل الاسم الموصوف في الإنجليزية."
    },
    usage: [
      { pronoun: "Describing a thing", form: "adjective + noun", example: "She has a beautiful house." },
      { pronoun: "Describing a person", form: "adjective + noun", example: "He is a tall man." }
    ]
  },
  {
    id: "B1-7", // Placeholder, Imperatives are a mood not a tense
    title: "The Imperative",
    level: "A2",
    explanation: {
      en: "Used to give commands, instructions, or make requests. Use the base form of the verb.",
      ar: "تُستخدم لإعطاء الأوامر، التعليمات، أو الطلبات. نستخدم صيغة الأمر من الفعل."
    },
    usage: [
      { pronoun: "Command", form: "Base verb", example: "Close the door." },
      { pronoun: "Instruction", form: "Base verb", example: "Turn left." },
      { pronoun: "Request", form: "Please + Base verb", example: "Please sit down." }
    ]
  },
  {
    id: "A1-28",
    title: "Object Pronouns (me, you, him, her, it, us, them)",
    level: "A2",
    explanation: {
      en: "Pronouns that receive the action of a verb.",
      ar: "ضمائر يقع عليها فعل الفاعل (ضمائر المفعول به)."
    },
    usage: [
      { pronoun: "me", form: "Receiver of action", example: "She gave me a book." },
      { pronoun: "him", form: "Receiver of action", example: "I saw him at the park." }
    ]
  },
  {
    id: "A1-14", // Also Prepositions of Place
    title: "Prepositions of Time (at, in, on)",
    level: "A2",
    explanation: {
      en: "Used to indicate when something happens.",
      ar: "تُستخدم لتحديد وقت حدوث شيء ما."
    },
    usage: [
      { pronoun: "at", form: "For specific times", example: "at 5 PM." },
      { pronoun: "in", form: "For months, years, seasons", example: "in August, in 2025." },
      { pronoun: "on", form: "For days and dates", example: "on Monday, on June 15th." }
    ]
  },
  {
    id: "A1-23",
    title: "'Some' and 'Any'",
    level: "A2",
    explanation: {
      en: "Used with plural countable and uncountable nouns.",
      ar: "تُستخدم مع الأسماء المعدودة الجمع والأسماء غير المعدودة."
    },
    usage: [
      { pronoun: "Some", form: "Positive sentences", example: "I have some friends." },
      { pronoun: "Any", form: "Questions & negatives", example: "Do you have any questions?" }
    ]
  },

  // =======================================
  // ====== Intermediate (B1/B2) Rules ======
  // =======================================
  {
    id: "B1-14", // Placeholder
    title: "'Used to'",
    level: "B1",
    explanation: {
      en: "Used to talk about past habits or states that are no longer true.",
      ar: "تُستخدم للحديث عن عادات أو حالات ماضية لم تعد صحيحة الآن (اعتدت على)."
    },
    usage: [
      { pronoun: "Past Habit", form: "used to + verb", example: "I used to play the piano." },
      { pronoun: "Past State", form: "used to be", example: "This building used to be a cinema." }
    ]
  },
  {
    id: "B1-3",
    title: "Past Perfect Continuous",
    level: "B2",
    explanation: {
      en: "Describes a continuous action in the past that was completed before another past action. (Subject + had been + Verb-ing)",
      ar: "يصف فعلاً مستمراً في الماضي انتهى قبل وقوع فعل ماضٍ آخر."
    },
    usage: [
      { pronoun: "Duration before past event", form: "had been waiting", example: "I had been waiting for an hour when the bus arrived." }
    ]
  },
  {
    id: "B1-9",
    title: "Modals of Deduction (must, can't, might)",
    level: "B2",
    explanation: {
      en: "Used to make logical guesses or deductions about the present.",
      ar: "تُستخدم لعمل تخمينات أو استنتاجات منطقية حول الحاضر."
    },
    usage: [
      { pronoun: "must", form: "Certainty (positive)", example: "He must be busy." },
      { pronoun: "can't", form: "Certainty (negative)", example: "She can't be hungry." },
      { pronoun: "might", form: "Possibility", example: "He might be at the library." }
    ]
  },
  {
    id: "B1-4",
    title: "Future Continuous",
    level: "B2",
    explanation: {
      en: "Describes an action that will be in progress at a specific time in the future. (will be + Verb-ing)",
      ar: "يصف فعلاً سيكون مستمراً في وقت محدد في المستقبل."
    },
    usage: [
      { pronoun: "Action in progress in future", form: "will be flying", example: "This time tomorrow, I will be flying to Paris." }
    ]
  },
  {
    id: "B2-7", // Placeholder
    title: "Reflexive Pronouns (myself, yourself, himself)",
    level: "B1",
    explanation: {
      en: "Used when the subject and the object of a verb are the same person or thing.",
      ar: "تُستخدم عندما يكون الفاعل والمفعول به في الجملة هو نفسه."
    },
    usage: [
      { pronoun: "myself", form: "Refers to 'I'", example: "I cut myself while cooking." },
      { pronoun: "himself", form: "Refers to 'He'", example: "He taught himself how to play the guitar." }
    ]
  },
  {
    id: "B1-12",
    title: "'So' and 'Such'",
    level: "B1",
    explanation: {
      en: "Used for emphasis.",
      ar: "تُستخدم للتأكيد (جداً)."
    },
    usage: [
      { pronoun: "so", form: "so + adjective/adverb", example: "The movie was so good." },
      { pronoun: "such", form: "such + (a/an) + adj + noun", example: "It was such a good movie." }
    ]
  },
  {
    id: "A2-17",
    title: "Quantifiers (a lot of, many, much, a few, a little)",
    level: "B1",
    explanation: {
      en: "Specify the quantity of a noun.",
      ar: "تُستخدم لتحديد كمية الاسم."
    },
    usage: [
      { pronoun: "many / a few", form: "With countable nouns", example: "many books, a few cars" },
      { pronoun: "much / a little", form: "With uncountable nouns", example: "much time, a little water" },
      { pronoun: "a lot of", form: "With both", example: "a lot of people, a lot of sugar" }
    ]
  },
  {
    id: "B1-11",
    title: "Tag Questions",
    level: "B2",
    explanation: {
      en: "A short question at the end of a statement, used for confirmation.",
      ar: "سؤال قصير في نهاية الجملة، يُستخدم للتأكيد (أليس كذلك؟)."
    },
    usage: [
      { pronoun: "Positive -> Negative", form: "..., isn't it?", example: "It's a beautiful day, isn't it?" },
      { pronoun: "Negative -> Positive", form: "..., have you?", example: "You haven't seen my keys, have you?" }
    ]
  },
  {
    id: "B2-9", // Placeholder
    title: "Relative Clauses with 'Whose' and 'Where'",
    level: "B2",
    explanation: {
      en: "'Whose' is used for possession. 'Where' is used for place.",
      ar: "'Whose' تُستخدم للملكية. 'Where' تُستخدم للمكان."
    },
    usage: [
      { pronoun: "Whose", form: "Possession", example: "That's the man whose dog bit me." },
      { pronoun: "Where", form: "Place", example: "This is the house where I grew up." }
    ]
  },
  {
    id: "B1-8",
    title: "Verbs followed by Gerunds or Infinitives",
    level: "B2",
    explanation: {
      en: "Some verbs are followed by a gerund (-ing), others by an infinitive (to + verb).",
      ar: "بعض الأفعال يتبعها المصدر (gerund)، والبعض الآخر يتبعه صيغة المصدر (infinitive)."
    },
    usage: [
      { pronoun: "enjoy", form: "+ Gerund (-ing)", example: "I enjoy playing tennis." },
      { pronoun: "want", form: "+ Infinitive (to)", example: "I want to play tennis." }
    ]
  },

  // ===================================
  // ====== Advanced (C1/C2) Rules ======
  // ===================================
  {
    id: "B2-10",
    title: "Subjunctive Mood",
    level: "C1",
    explanation: {
      en: "Used for hypothetical situations, suggestions, or demands. Often uses the base form of the verb.",
      ar: "تُستخدم للمواقف الافتراضية، الاقتراحات، أو الطلبات (صيغة النصب)."
    },
    usage: [
      { pronoun: "Suggestion", form: "suggest that he be...", example: "I suggest that he be present at the meeting." },
      { pronoun: "Demand", form: "insist that... arrive", example: "The manager insists all employees arrive on time." }
    ]
  },
  {
    id: "B2-14",
    title: "Ellipsis",
    level: "C2",
    explanation: {
      en: "The omission of words from a sentence because they are understood from the context.",
      ar: "حذف كلمات من الجملة لأنها مفهومة من السياق (الحذف)."
    },
    usage: [
      { pronoun: "Full sentence", form: "Repeating words", example: "She likes coffee, and I like coffee too." },
      { pronoun: "With ellipsis", form: "Using auxiliary", example: "She likes coffee, and I do too." }
    ]
  },
  {
    id: "C1-5",
    title: "Cleft Sentences",
    level: "C2",
    explanation: {
      en: "A way of restructuring a sentence to emphasize a particular part. Often starts with 'It was...' or 'What...'.",
      ar: "طريقة لإعادة هيكلة الجملة للتأكيد على جزء معين منها (جمل التوكيد/الشق)."
    },
    usage: [
      { pronoun: "Emphasizing subject", form: "It was [subject] who...", example: "It was John who broke the window." },
      { pronoun: "Emphasizing action", form: "What [subject] did was...", example: "What John did was break the window." }
    ]
  },
  {
    id: "B2-7",
    title: "Participle Clauses",
    level: "C1",
    explanation: {
      en: "A way to connect two ideas in one sentence using an -ing or -ed/-en form, making writing more concise.",
      ar: "طريقة لربط فكرتين في جملة واحدة باستخدام صيغة اسم الفاعل أو المفعول لجعل الكتابة أكثر إيجازًا."
    },
    usage: [
      { pronoun: "-ing form", form: "Reason", example: "Feeling tired, I went to bed early." },
      { pronoun: "-ed/-en form", form: "Passive action", example: "Built in 1990, the bridge is now old." }
    ]
  },
  {
    id: "B1-4", // Also Future Continuous
    title: "Future Perfect Continuous",
    level: "C2",
    explanation: {
      en: "Describes a continuous action that will be completed at some point in the future. (will have been + Verb-ing)",
      ar: "يصف فعلاً مستمراً سينتهي عند نقطة ما في المستقبل."
    },
    usage: [
      { pronoun: "Duration at future point", form: "will have been +ing", example: "I will have been studying for five hours by then." }
    ]
  },
  {
    id: "B1-14",
    title: "'Wish' + Past Tense",
    level: "C1",
    explanation: {
      en: "Used to express a wish or regret about a present situation that is impossible or unlikely.",
      ar: "تُستخدم للتعبير عن أمنية أو ندم بخصوص موقف حاضر (أتمنى لو)."
    },
    usage: [
      { pronoun: "Wish for present", form: "wish + simple past", example: "I wish I had more money." }
    ]
  },
  {
    id: "B1-2", // Also Past Perfect
    title: "'Wish' + Past Perfect",
    level: "C1",
    explanation: {
      en: "Used to express a regret about a past situation.",
      ar: "تُستخدم للتعبير عن ندم بخصوص موقف في الماضي."
    },
    usage: [
      { pronoun: "Regret for past", form: "wish + past perfect", example: "I wish I had studied harder." }
    ]
  },
  {
    id: "A2-17", // Quantifiers
    title: "Determiners (all, most, some, none of)",
    level: "C1",
    explanation: {
      en: "Used to talk about proportions of a specific group, often followed by 'of the'.",
      ar: "تُستخدم للحديث عن نسب من مجموعة محددة."
    },
    usage: [
      { pronoun: "all of", form: "100%", example: "All of the students passed." },
      { pronoun: "most of", form: "Majority", example: "Most of my friends live nearby." },
      { pronoun: "none of", form: "0%", example: "None of the information was useful." }
    ]
  },
  {
    id: "B2-4", // Inversion
    title: "'Hardly', 'Scarcely', 'No sooner'",
    level: "C2",
    explanation: {
      en: "Negative adverbs used with inversion to say that one thing happened immediately after another.",
      ar: "ظروف نفي تُستخدم مع القلب (inversion) للقول بأن شيئًا ما حدث فور وقوع شيء آخر."
    },
    usage: [
      { pronoun: "Hardly... when", form: "Hardly had I...", example: "Hardly had I closed the door when the phone rang." },
      { pronoun: "No sooner... than", form: "No sooner had...", example: "No sooner had he arrived than they left." }
    ]
  },
  {
    id: "B1-15",
    title: "Causative Verbs (have, get, make, let)",
    level: "C2",
    explanation: {
      en: "Verbs used to show that someone causes something to happen.",
      ar: "أفعال تُستخدم لإظهار أن شخصًا ما تسبب في حدوث شيء ما."
    },
    usage: [
      { pronoun: "have", form: "Arrange for a service", example: "I had my car repaired." },
      { pronoun: "get", form: "Persuade someone", example: "I got him to help me." },
      { pronoun: "make", form: "Force someone", example: "The movie made me cry." },
      { pronoun: "let", form: "Allow someone", example: "My parents let me stay out late." }
    ]
  }
];
