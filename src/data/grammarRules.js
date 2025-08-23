// src/data/grammarRules.js

export const grammarRules = [
  {
    id: "A1-2",
    title: "Verb 'to be' (am, is, are)",
    level: "A1",
    explanation: {
      en: "The verb 'to be' is one of the most important verbs in English. We use it to describe identity, states, and qualities. It changes its form depending on the subject pronoun.",
      ar: "فعل 'to be' هو من أهم الأفعال في اللغة الإنجليزية. نستخدمه لوصف الهوية، الحالات، والصفات. يتغير شكله اعتمادًا على ضمير الفاعل."
    },
    usage: [
      { pronoun: "I", form: "am", example: "I am a student." },
      { pronoun: "He / She / It", form: "is", example: "She is a doctor. It is cold." },
      { pronoun: "You / We / They", form: "are", example: "You are happy. They are friends." }
    ]
  },
  {
    id: "A1-7",
    title: "Articles (a, an, the)",
    level: "A1",
    explanation: {
      en: "Articles are words that define a noun as specific or unspecific. 'a' and 'an' are indefinite articles, used for general nouns. 'the' is the definite article, used for a specific, known noun.",
      ar: "أدوات التعريف والتنكير هي كلمات تحدد الاسم كمعروف أو غير معروف. 'a' و 'an' هما أدوات تنكير للأسماء العامة. 'the' هي أداة تعريف لاسم محدد ومعروف."
    },
    usage: [
      { pronoun: "a", form: "Before consonant sounds", example: "I see a car." },
      { pronoun: "an", form: "Before vowel sounds", example: "She is an engineer." },
      { pronoun: "the", form: "For specific nouns", example: "The car I see is red." }
    ]
  },
  // يمكنك إضافة المزيد من القواعد هنا بنفس الهيكل
];
