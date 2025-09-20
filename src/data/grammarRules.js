// src/data/grammarRules.js

export const grammarRules = [
  // ===================================
  // ====== A1 Level Rules (20) ======
  // ===================================
  {
    id: "A1-1",
    title: "The Verb 'to be' (am, is, are)",
    level: "A1",
    category: "Verbs",
    explanation: { en: "Used to describe states, identity, and characteristics.", ar: "يُستخدم الفعل 'to be' لوصف الحالات، الهوية، والخصائص." },
    usage: [
      { pronoun: "I", form: "am", example: "I am a student." },
      { pronoun: "He / She / It", form: "is", example: "She is happy." },
      { pronoun: "You / We / They", form: "are", example: "They are friends." }
    ]
  },
  {
    id: "A1-2",
    title: "Subject Pronouns (I, you, he...)",
    level: "A1",
    category: "Pronouns",
    explanation: { en: "Pronouns that perform the action in a sentence.", ar: "الضمائر التي تقوم بالفعل في الجملة." },
    usage: [
        { pronoun: "I / You", form: "Singular", example: "I work here. You are tall." },
        { pronoun: "He / She / It", form: "3rd Person Singular", example: "He likes pizza. It is cold." },
        { pronoun: "We / They", form: "Plural", example: "We live in a city. They study hard." }
    ]
  },
  {
    id: "A1-3",
    title: "Simple Present Tense",
    level: "A1",
    category: "Tenses",
    explanation: { en: "Used for habits, routines, and general truths.", ar: "يُستخدم للتعبير عن العادات، الروتين، والحقائق العامة." },
    usage: [
      { pronoun: "I / You / We / They", form: "verb", example: "I play tennis on Saturdays." },
      { pronoun: "He / She / It", form: "verb-s", example: "She works in a hospital." },
      { pronoun: "Negative", form: "don't / doesn't + verb", example: "He doesn't like coffee." }
    ]
  },
  {
    id: "A1-4",
    title: "Articles (a, an, the)",
    level: "A1",
    category: "Nouns and Articles",
    explanation: { en: "'a/an' are for non-specific nouns. 'the' is for specific nouns.", ar: "'a/an' هي للأسماء غير المحددة. 'the' للأسماء المحددة." },
    usage: [
      { pronoun: "Indefinite (Consonant)", form: "a", example: "I see a car." },
      { pronoun: "Indefinite (Vowel)", form: "an", example: "She has an apple." },
      { pronoun: "Definite", form: "the", example: "The car is red." }
    ]
  },
  {
    id: "A1-5",
    title: "Nouns (Singular and Plural)",
    level: "A1",
    category: "Nouns and Articles",
    explanation: { en: "Most plural nouns are formed by adding -s. Some are irregular.", ar: "معظم أسماء الجمع تتكون بإضافة -s. وبعضها شاذ." },
    usage: [
      { pronoun: "Regular", form: "+ s/es", example: "book -> books, box -> boxes" },
      { pronoun: "Irregular", form: "Unique form", example: "man -> men, child -> children" }
    ]
  },
  {
    id: "A1-6",
    title: "Demonstratives (this, that, these, those)",
    level: "A1",
    category: "Determiners",
    explanation: { en: "Used to point out specific people or things.", ar: "تُستخدم للإشارة إلى أشخاص أو أشياء محددة." },
    usage: [
        { pronoun: "This / These", form: "Near", example: "This is my pen. These are my books." },
        { pronoun: "That / Those", form: "Far", example: "That is your house. Those birds are high." }
    ]
  },
  {
    id: "A1-7",
    title: "Possessive Adjectives (my, your...)",
    level: "A1",
    category: "Determiners",
    explanation: { en: "Used to show ownership. They come before a noun.", ar: "تُستخدم لإظهار الملكية. تأتي قبل الاسم." },
    usage: [
      { pronoun: "my / your", form: "Singular", example: "This is my book. What is your name?" },
      { pronoun: "his / her / its", form: "3rd Person Singular", example: "His car is new. Its color is blue." },
      { pronoun: "our / their", form: "Plural", example: "Our class is big. Their house is old." }
    ]
  },
  {
    id: "A1-8",
    title: "'There is' / 'There are'",
    level: "A1",
    category: "Sentence Structure",
    explanation: { en: "Used to say that something exists.", ar: "تُستخدم للقول بوجود شيء ما." },
    usage: [
      { pronoun: "Singular", form: "There is", example: "There is a cat on the chair." },
      { pronoun: "Plural", form: "There are", example: "There are two cats on the floor." }
    ]
  },
  {
    id: "A1-9",
    title: "'Can' for Ability",
    level: "A1",
    category: "Modals",
    explanation: { en: "Used to express ability or to say that you know how to do something.", ar: "تُستخدم للتعبير عن القدرة أو المعرفة بكيفية فعل شيء ما." },
    usage: [
        { pronoun: "Positive", form: "can + verb", example: "I can speak English." },
        { pronoun: "Negative", form: "cannot / can't + verb", example: "He can't swim." },
        { pronoun: "Question", form: "Can...?", example: "Can you help me?" }
    ]
  },
  {
    id: "A1-10",
    title: "Prepositions of Place (in, on, at)",
    level: "A1",
    category: "Prepositions",
    explanation: { en: "'in' for enclosed spaces, 'on' for surfaces, and 'at' for specific points.", ar: "'in' للأماكن المغلقة، 'on' للأسطح، و 'at' لنقاط محددة." },
    usage: [
      { pronoun: "in", form: "Enclosed space/City", example: "The keys are in the box. I live in Cairo." },
      { pronoun: "on", form: "Surface/Street", example: "The book is on the table." },
      { pronoun: "at", form: "Specific point/Address", example: "Let's meet at the airport." }
    ]
  },
  {
    id: "A1-11",
    title: "Present Continuous Tense",
    level: "A1",
    category: "Tenses",
    explanation: { en: "Used for actions happening at the moment of speaking.", ar: "تُستخدم للأفعال التي تحدث في لحظة الكلام." },
    usage: [
        { pronoun: "Positive", form: "am/is/are + verb-ing", example: "I am reading a book now." },
        { pronoun: "Negative", form: "am/is/are + not + verb-ing", example: "She is not sleeping." },
        { pronoun: "Question", form: "Am/Is/Are...?", example: "Are they playing outside?" }
    ]
  },
  {
    id: "A1-12",
    title: "Object Pronouns (me, you, him...)",
    level: "A1",
    category: "Pronouns",
    explanation: { en: "Pronouns that receive the action of a verb.", ar: "ضمائر يقع عليها فعل الفاعل (ضمائر المفعول به)." },
    usage: [
      { pronoun: "me / you", form: "Singular", example: "She gave me a gift. I saw you." },
      { pronoun: "him / her / it", form: "3rd Person Singular", example: "Please call him. Give it to her." },
      { pronoun: "us / them", form: "Plural", example: "He taught us. I like them." }
    ]
  },
  {
    id: "A1-13",
    title: "Simple Past Tense (was, were)",
    level: "A1",
    category: "Tenses",
    explanation: { en: "The past tense of the verb 'to be'.", ar: "صيغة الماضي من الفعل 'to be'." },
    usage: [
      { pronoun: "I / He / She / It", form: "was", example: "I was tired yesterday." },
      { pronoun: "You / We / They", form: "were", example: "They were at the party." }
    ]
  },
  {
    id: "A1-14",
    title: "Simple Past Tense (Regular Verbs)",
    level: "A1",
    category: "Tenses",
    explanation: { en: "For completed actions in the past. For regular verbs, add -ed.", ar: "للأفعال التي اكتملت في الماضي. للأفعال المنتظمة، نضيف -ed." },
    usage: [
      { pronoun: "Positive", form: "verb-ed", example: "She worked late last night." },
      { pronoun: "Negative", form: "didn't + verb", example: "We didn't watch the movie." },
      { pronoun: "Question", form: "Did...?", example: "Did you visit your friend?" }
    ]
  },
  {
    id: "A1-15",
    title: "Simple Past Tense (Irregular Verbs)",
    level: "A1",
    category: "Tenses",
    explanation: { en: "Irregular verbs have unique past tense forms that must be memorized.", ar: "الأفعال الشاذة لها أشكال فريدة في الماضي يجب حفظها." },
    usage: [
      { pronoun: "go -> went", form: "Positive", example: "I went to the market." },
      { pronoun: "see -> saw", form: "Positive", example: "She saw a good film." },
      { pronoun: "Negative / Question", form: "did + base verb", example: "Did you go? I didn't see it." }
    ]
  },
  {
    id: "A1-16",
    title: "Question Words (What, Where, When...)",
    level: "A1",
    category: "Sentence Structure",
    explanation: { en: "Used at the beginning of questions to ask for specific information.", ar: "تُستخدم في بداية الأسئلة لطلب معلومات محددة." },
    usage: [
      { pronoun: "What", form: "Asking about things", example: "What is your name?" },
      { pronoun: "Where", form: "Asking about places", example: "Where do you live?" },
      { pronoun: "When", form: "Asking about time", example: "When is your birthday?" },
      { pronoun: "Who", form: "Asking about people", example: "Who is that man?" },
      { pronoun: "Why", form: "Asking for a reason", example: "Why are you late?" },
      { pronoun: "How", form: "Asking about manner", example: "How are you?" }
    ]
  },
  {
    id: "A1-17",
    title: "Countable & Uncountable Nouns",
    level: "A1",
    category: "Nouns and Articles",
    explanation: { en: "Countable nouns can be counted (one book). Uncountable nouns cannot (water, rice).", ar: "الأسماء المعدودة يمكن عدها (كتاب واحد). الأسماء غير المعدودة لا يمكن (ماء، أرز)." },
    usage: [
        { pronoun: "Countable", form: "a book / two books", example: "I have three apples." },
        { pronoun: "Uncountable", form: "some water (not a water)", example: "Can I have some information?" }
    ]
  },
  {
    id: "A1-18",
    title: "'Some' and 'Any'",
    level: "A1",
    category: "Determiners",
    explanation: { en: "'Some' is for positive sentences. 'Any' is for questions and negatives.", ar: "'Some' للجمل المثبتة. 'Any' للأسئلة والجمل المنفية." },
    usage: [
      { pronoun: "Some (Positive)", form: "some + noun", example: "I have some friends. I need some sugar." },
      { pronoun: "Any (Question)", form: "any + noun", example: "Do you have any questions?" },
      { pronoun: "Any (Negative)", form: "not any + noun", example: "I don't have any money." }
    ]
  },
  {
    id: "A1-19",
    title: "Adjectives",
    level: "A1",
    category: "Adjectives and Adverbs",
    explanation: { en: "Words that describe nouns. They usually come before the noun.", ar: "كلمات تصف الأسماء. عادة ما تأتي قبل الاسم الموصوف." },
    usage: [
      { pronoun: "Before a noun", form: "adjective + noun", example: "She has a beautiful car." },
      { pronoun: "After 'to be'", form: "be + adjective", example: "The car is beautiful." }
    ]
  },
  {
    id: "A1-20",
    title: "Conjunctions (and, but, or)",
    level: "A1",
    category: "Sentence Structure",
    explanation: { en: "Words that connect words, phrases, or clauses.", ar: "كلمات تربط بين الكلمات، العبارات، أو الجمل." },
    usage: [
      { pronoun: "and", form: "Addition", example: "I like tea and coffee." },
      { pronoun: "but", form: "Contrast", example: "He is rich but unhappy." },
      { pronoun: "or", form: "Choice", example: "Do you want water or juice?" }
    ]
  },

  // ===================================
  // ====== A2 Level Rules (20) ======
  // ===================================
  {
    id: "A2-1",
    title: "Present Simple vs. Continuous",
    level: "A2",
    category: "Tenses",
    explanation: { en: "Simple for habits/facts (I work). Continuous for now/temporary (I am working).", ar: "المضارع البسيط للعادات/الحقائق (أنا أعمل). والمستمر للآن/المؤقت (أنا أعمل الآن)." },
    usage: [
        { pronoun: "Contrast", form: "usually... but now...", example: "He usually drinks tea, but now he is drinking coffee." }
    ]
  },
  {
    id: "A2-2",
    title: "Past Continuous",
    level: "A2",
    category: "Tenses",
    explanation: { en: "Describes an action in progress at a specific time in the past.", ar: "يصف حدثًا كان مستمرًا في وقت محدد في الماضي." },
    usage: [
      { pronoun: "Interrupted Action", form: "was/were + verb-ing", example: "I was watching TV when the phone rang." }
    ]
  },
  {
    id: "A2-3",
    title: "Past Simple vs. Continuous",
    level: "A2",
    category: "Tenses",
    explanation: { en: "Continuous for the longer, background action. Simple for the shorter, interrupting action.", ar: "المستمر للحدث الأطول في الخلفية. والبسيط للحدث الأقصر الذي قاطعه." },
    usage: [
        { pronoun: "Sequence", form: "While I was walking...", example: "While I was walking, I saw an accident." }
    ]
  },
  {
    id: "A2-4",
    title: "Quantifiers (much, many, a lot of)",
    level: "A2",
    category: "Determiners",
    explanation: { en: "'many' for countable nouns, 'much' for uncountable, 'a lot of' for both.", ar: "'many' للمعدود، 'much' لغير المعدود، 'a lot of' لكليهما." },
    usage: [
        { pronoun: "many (countable)", form: "many + plural noun", example: "She has many books." },
        { pronoun: "much (uncountable)", form: "much + noun", example: "I don't have much time." },
        { pronoun: "a lot of (both)", form: "a lot of + noun", example: "There are a lot of people. / There is a lot of traffic." }
    ]
  },
  {
    id: "A2-5",
    title: "Quantifiers (a little, a few)",
    level: "A2",
    category: "Determiners",
    explanation: { en: "'a few' for a small number of countable nouns, 'a little' for a small amount of uncountable nouns.", ar: "'a few' لعدد قليل من الأسماء المعدودة، 'a little' لكمية قليلة من غير المعدودة." },
    usage: [
        { pronoun: "a few (countable)", form: "a few + plural noun", example: "I have a few friends." },
        { pronoun: "a little (uncountable)", form: "a little + noun", example: "I need a little help." }
    ]
  },
  {
    id: "A2-6",
    title: "Future with 'going to'",
    level: "A2",
    category: "Tenses",
    explanation: { en: "Used for future plans and intentions decided before speaking.", ar: "تُستخدم للخطط والنوايا المستقبلية التي تم تحديدها قبل الكلام." },
    usage: [
        { pronoun: "Plan", form: "be going to + verb", example: "I am going to visit my uncle next week." },
        { pronoun: "Prediction (evidence)", form: "be going to + verb", example: "Look at the clouds! It is going to rain." }
    ]
  },
  {
    id: "A2-7",
    title: "Future with 'will'",
    level: "A2",
    category: "Tenses",
    explanation: { en: "Used for spontaneous decisions, offers, promises, and predictions.", ar: "تُستخدم للقرارات العفوية، العروض، الوعود، والتنبؤات." },
    usage: [
        { pronoun: "Spontaneous Decision", form: "will + verb", example: "The phone is ringing. I'll get it." },
        { pronoun: "Prediction (opinion)", form: "will + verb", example: "I think it will be a good movie." },
        { pronoun: "Offer", form: "will + verb", example: "That looks heavy. I'll help you." }
    ]
  },
  {
    id: "A2-8",
    title: "Adverbs of Manner (-ly)",
    level: "A2",
    category: "Adjectives and Adverbs",
    explanation: { en: "Describe how an action is done. Often formed by adding -ly to an adjective.", ar: "تصف كيفية القيام بالفعل. غالبًا ما تتكون بإضافة -ly إلى الصفة." },
    usage: [
        { pronoun: "slow -> slowly", form: "verb + adverb", example: "He drives slowly." },
        { pronoun: "quick -> quickly", form: "verb + adverb", example: "She finished her work quickly." }
    ]
  },
  {
    id: "A2-9",
    title: "Comparative Adjectives",
    level: "A2",
    category: "Adjectives and Adverbs",
    explanation: { en: "Used to compare two things. Use -er for short adjectives and 'more' for long ones.", ar: "تُستخدم لمقارنة شيئين. استخدم -er للصفات القصيرة و 'more' للطويلة." },
    usage: [
      { pronoun: "Short Adjective", form: "adjective-er + than", example: "My car is faster than your car." },
      { pronoun: "Long Adjective", form: "more + adjective + than", example: "This book is more interesting than that one." }
    ]
  },
  {
    id: "A2-10",
    title: "Superlative Adjectives",
    level: "A2",
    category: "Adjectives and Adverbs",
    explanation: { en: "Used to compare one thing to a group. Use -est for short adjectives and 'the most' for long ones.", ar: "تُستخدم لمقارنة شيء بمجموعة. استخدم -est للصفات القصيرة و 'the most' للطويلة." },
    usage: [
      { pronoun: "Short Adjective", form: "the + adjective-est", example: "Mount Everest is the highest mountain." },
      { pronoun: "Long Adjective", form: "the most + adjective", example: "This is the most expensive watch." }
    ]
  },
  {
    id: "A2-11",
    title: "Present Perfect (Introduction)",
    level: "A2",
    category: "Tenses",
    explanation: { en: "Connects the past with the present. Used for actions at an unspecified time with a result now.", ar: "يربط الماضي بالحاضر. يُستخدم لأفعال في وقت غير محدد لها نتيجة الآن." },
    usage: [
        { pronoun: "Result in present", form: "have/has + past participle", example: "I have lost my keys. (I can't find them now)." },
        { pronoun: "Life experience", form: "have/has + past participle", example: "She has been to Paris." }
    ]
  },
  {
    id: "A2-12",
    title: "Present Perfect with 'ever' and 'never'",
    level: "A2",
    category: "Tenses",
    explanation: { en: "'ever' in questions about life experiences, 'never' for zero experience.", ar: "'ever' في أسئلة التجارب الحياتية، 'never' لعدم وجود تجربة." },
    usage: [
        { pronoun: "ever (question)", form: "Have you ever...?", example: "Have you ever eaten sushi?" },
        { pronoun: "never (statement)", form: "I have never...", example: "I have never seen that movie." }
    ]
  },
  {
    id: "A2-13",
    title: "Modals of Obligation (must, have to)",
    level: "A2",
    category: "Modals",
    explanation: { en: "'must' for personal obligation, 'have to' for external rules.", ar: "'must' للالتزام الشخصي، 'have to' للقواعد الخارجية." },
    usage: [
        { pronoun: "must (internal)", form: "must + verb", example: "I must finish this report today." },
        { pronoun: "have to (external)", form: "have to + verb", example: "You have to wear a uniform at school." }
    ]
  },
  {
    id: "A2-14",
    title: "Modals of Advice (should)",
    level: "A2",
    category: "Modals",
    explanation: { en: "Used to give advice or opinions about what is right.", ar: "تُستخدم لتقديم النصائح أو الآراء حول ما هو صواب." },
    usage: [
        { pronoun: "should (advice)", form: "should + verb", example: "You should see a doctor." },
        { pronoun: "shouldn't (negative advice)", form: "shouldn't + verb", example: "He shouldn't eat so much sugar." }
    ]
  },
  {
    id: "A2-15",
    title: "First Conditional",
    level: "A2",
    category: "Conditionals",
    explanation: { en: "Describes a real or likely situation in the future. (If + present simple, ...will + base verb)", ar: "تصف موقفًا حقيقيًا أو محتملاً في المستقبل." },
    usage: [
      { pronoun: "Real possibility", form: "If it rains, ...", example: "If it rains, I will take an umbrella." },
      { pronoun: "Cause and effect", form: "If you study, ...", example: "If you study hard, you will pass the exam." }
    ]
  },
  {
    id: "A2-16",
    title: "Prepositions of Movement (to, into, out of...)",
    level: "A2",
    category: "Prepositions",
    explanation: { en: "Show direction of movement.", ar: "توضح اتجاه الحركة." },
    usage: [
        { pronoun: "to / from", form: "Destination / Origin", example: "I am going to the park. I came from home." },
        { pronoun: "into / out of", form: "Entering / Exiting", example: "He walked into the room. She got out of the car." },
        { pronoun: "across / through", form: "Crossing", example: "We walked across the bridge. We drove through the tunnel." }
    ]
  },
  {
    id: "A2-17",
    title: "Phrasal Verbs (Introduction)",
    level: "A2",
    category: "Verbs",
    explanation: { en: "A verb combined with a preposition or adverb, creating a new meaning.", ar: "فعل مقترن بحرف جر أو ظرف، يخلق معنى جديدًا." },
    usage: [
        { pronoun: "get up", form: "Wake up", example: "I get up at 7 AM." },
        { pronoun: "turn on / off", form: "Activate / Deactivate", example: "Please turn on the light." },
        { pronoun: "look for", form: "Search", example: "I am looking for my keys." }
    ]
  },
  {
    id: "A2-18",
    title: "Gerunds after certain verbs (like, love, enjoy)",
    level: "A2",
    category: "Verbs",
    explanation: { en: "Some verbs are followed by the -ing form (gerund) to describe an activity.", ar: "بعض الأفعال يتبعها صيغة -ing (المصدر) لوصف نشاط." },
    usage: [
        { pronoun: "like", form: "like + verb-ing", example: "I like playing football." },
        { pronoun: "enjoy", form: "enjoy + verb-ing", example: "She enjoys reading books." },
        { pronoun: "hate", form: "hate + verb-ing", example: "They hate waiting in line." }
    ]
  },
  {
    id: "A2-19",
    title: "Infinitives of Purpose",
    level: "A2",
    category: "Verbs",
    explanation: { en: "Using 'to + verb' to explain the reason or purpose of an action.", ar: "استخدام 'to + فعل' لشرح سبب أو غرض فعل ما." },
    usage: [
        { pronoun: "Purpose", form: "...to + verb", example: "I went to the store to buy milk." },
        { pronoun: "Reason", form: "...to + verb", example: "He is studying hard to pass the exam." }
    ]
  },
  {
    id: "A2-20",
    title: "Possessive Pronouns (mine, yours...)",
    level: "A2",
    category: "Pronouns",
    explanation: { en: "Used to replace a possessive adjective + noun to avoid repetition.", ar: "تُستخدم لتحل محل صفة ملكية + اسم لتجنب التكرار." },
    usage: [
        { pronoun: "my book -> mine", form: "is mine", example: "This book is mine." },
        { pronoun: "your car -> yours", form: "is yours", example: "Is that car yours?" },
        { pronoun: "her dress -> hers", form: "is hers", example: "The blue dress is hers." }
    ]
  },
  
  // ===================================
  // ====== B1 Level Rules (25) ======
  // ===================================
  {
    id: "B1-1",
    title: "Present Perfect vs. Past Simple",
    level: "B1",
    category: "Tenses",
    explanation: { en: "Past simple for finished actions at a specific time (yesterday). Present perfect when time is not specified or connected to now.", ar: "الماضي البسيط لأحداث منتهية في وقت محدد (أمس). المضارع التام عندما لا يكون الوقت محددًا أو مرتبطًا بالحاضر." },
    usage: [
        { pronoun: "Past Simple", form: "verb-ed / irregular", example: "I visited Paris in 2020." },
        { pronoun: "Present Perfect", form: "have + past participle", example: "I have visited Paris three times." }
    ]
  },
  {
    id: "B1-2",
    title: "Present Perfect Continuous",
    level: "B1",
    category: "Tenses",
    explanation: { en: "Used to talk about an action that started in the past and is still continuing now.", ar: "تُستخدم للحديث عن فعل بدأ في الماضي وما زال مستمرًا حتى الآن." },
    usage: [
        { pronoun: "For / Since", form: "have been + verb-ing", example: "I have been waiting for two hours." }
    ]
  },
  {
    id: "B1-3",
    title: "Past Perfect Simple",
    level: "B1",
    category: "Tenses",
    explanation: { en: "Used for an action that happened before another action in the past.", ar: "تُستخدم لفعل حدث قبل فعل آخر في الماضي." },
    usage: [
        { pronoun: "Past sequence", form: "had + past participle", example: "When I arrived, the train had already left." }
    ]
  },
  {
    id: "B1-4",
    title: "'Used to' for Past Habits",
    level: "B1",
    category: "Verbs",
    explanation: { en: "Used to talk about past habits or states that are no longer true.", ar: "تُستخدم للحديث عن عادات أو حالات ماضية لم تعد صحيحة الآن." },
    usage: [
      { pronoun: "Past Habit", form: "used to + verb", example: "I used to play the piano when I was a child." },
      { pronoun: "Past State", form: "used to be", example: "This building used to be a cinema." }
    ]
  },
  {
    id: "B1-5",
    title: "Second Conditional",
    level: "B1",
    category: "Conditionals",
    explanation: { en: "Used for hypothetical or unlikely situations in the present or future.", ar: "تُستخدم للمواقف الافتراضية أو غير المحتملة في الحاضر أو المستقبل." },
    usage: [
      { pronoun: "Hypothetical", form: "If + past, ...would + verb", example: "If I had a million dollars, I would travel the world." },
      { pronoun: "Advice", form: "If I were you...", example: "If I were you, I would take the job." }
    ]
  },
   {
    id: "B1-6",
    title: "Passive Voice (Present and Past Simple)",
    level: "B1",
    category: "Verbs",
    explanation: { en: "Used when the focus is on the action, not the person who does it.", ar: "تُستخدم عندما يكون التركيز على الفعل، وليس على من قام به." },
    usage: [
        { pronoun: "Present Passive", form: "is/are + past participle", example: "English is spoken all over the world." },
        { pronoun: "Past Passive", form: "was/were + past participle", example: "The telephone was invented by Alexander Bell." }
    ]
  },
  {
    id: "B1-7",
    title: "Reported Speech (Statements)",
    level: "B1",
    category: "Sentence Structure",
    explanation: { en: "Reporting what someone said, usually by shifting the tense back.", ar: "نقل ما قاله شخص ما، عادة عن طريق إرجاع الزمن خطوة للوراء." },
    usage: [
      { pronoun: "Direct", form: "'I am happy.'", example: "He said, 'I am happy.'" },
      { pronoun: "Reported", form: "said that... was", example: "He said that he was happy." }
    ]
  },
  {
    id: "B1-8",
    title: "Gerunds and Infinitives",
    level: "B1",
    category: "Verbs",
    explanation: { en: "Some verbs are followed by a gerund (-ing), others by an infinitive (to + verb).", ar: "بعض الأفعال يتبعها المصدر (-ing)، والبعض الآخر يتبعه صيغة المصدر (to + verb)." },
    usage: [
      { pronoun: "enjoy", form: "+ Gerund (-ing)", example: "I enjoy playing tennis." },
      { pronoun: "want", form: "+ Infinitive (to)", example: "I want to play tennis." },
      { pronoun: "stop", form: "stop + -ing/to", example: "He stopped smoking. He stopped to smoke." }
    ]
  },
  {
    id: "B1-9",
    title: "Relative Clauses (who, which, that, where)",
    level: "B1",
    category: "Sentence Structure",
    explanation: { en: "Clauses that give more information about a noun.", ar: "جمل تعطي معلومات إضافية عن اسم." },
    usage: [
        { pronoun: "who (people)", form: "...who...", example: "The man who lives next door is a doctor." },
        { pronoun: "which (things)", form: "...which...", example: "This is the book which I read." },
        { pronoun: "where (places)", form: "...where...", example: "That's the restaurant where we met." }
    ]
  },
  {
    id: "B1-10",
    title: "Modals of Probability (may, might, could)",
    level: "B1",
    category: "Modals",
    explanation: { en: "Used to express possibility in the present or future.", ar: "تُستخدم للتعبير عن الاحتمالية في الحاضر أو المستقبل." },
    usage: [
        { pronoun: "may / might", form: "may/might + verb", example: "It might rain later. (It's possible)" },
        { pronoun: "could", form: "could + verb", example: "He could be at home. (It's one possibility)" }
    ]
  },
  {
    id: "B1-11",
    title: "Comparisons with 'as...as'",
    level: "B1",
    category: "Adjectives and Adverbs",
    explanation: { en: "Used to say that two things are the same or equal.", ar: "تُستخدم للقول بأن شيئين متماثلان أو متساويان." },
    usage: [
        { pronoun: "Equal", form: "as + adjective + as", example: "She is as tall as her brother." },
        { pronoun: "Not Equal", form: "not as/so + adjective + as", example: "This car is not as expensive as that one." }
    ]
  },
  {
    id: "B1-12",
    title: "'Too' and 'Enough'",
    level: "B1",
    category: "Adjectives and Adverbs",
    explanation: { en: "'Too' means more than necessary. 'Enough' means a sufficient amount.", ar: "'Too' تعني أكثر من اللازم. 'Enough' تعني كمية كافية." },
    usage: [
        { pronoun: "too", form: "too + adjective", example: "The coffee is too hot to drink." },
        { pronoun: "enough", form: "adjective + enough / enough + noun", example: "He is not old enough to drive. I have enough money." }
    ]
  },
  {
    id: "B1-13",
    title: "Question Tags",
    level: "B1",
    category: "Sentence Structure",
    explanation: { en: "A short question at the end of a statement, used for confirmation.", ar: "سؤال قصير في نهاية الجملة، يُستخدم للتأكيد (أليس كذلك؟)." },
    usage: [
      { pronoun: "Positive -> Negative", form: "..., isn't it?", example: "It's a beautiful day, isn't it?" },
      { pronoun: "Negative -> Positive", form: "..., have you?", example: "You haven't seen my keys, have you?" }
    ]
  },
  {
    id: "B1-14",
    title: "Both, Either, Neither",
    level: "B1",
    category: "Determiners",
    explanation: { en: "'Both' refers to two things together. 'Either' refers to one of two choices. 'Neither' means not one and not the other.", ar: "'Both' تشير إلى شيئين معًا. 'Either' تشير إلى أحد خيارين. 'Neither' تعني لا هذا ولا ذاك." },
    usage: [
        { pronoun: "Both", form: "Both... and...", example: "I like both tea and coffee." },
        { pronoun: "Either", form: "Either... or...", example: "You can have either the blue one or the red one." },
        { pronoun: "Neither", form: "Neither... nor...", example: "He speaks neither English nor French." }
    ]
  },
  {
    id: "B1-15",
    title: "Adverbs of Frequency",
    level: "B1",
    category: "Adjectives and Adverbs",
    explanation: { en: "Describe how often an action happens (always, usually, sometimes, never).", ar: "تصف عدد مرات حدوث الفعل (دائماً، عادة، أحياناً، أبداً)." },
    usage: [
        { pronoun: "Position", form: "Before main verb, after 'be'", example: "I always get up early. She is often late." }
    ]
  },
  {
    id: "B1-16",
    title: "Future Continuous",
    level: "B1",
    category: "Tenses",
    explanation: { en: "Describes an action that will be in progress at a specific time in the future.", ar: "يصف فعلاً سيكون مستمراً في وقت محدد في المستقبل." },
    usage: [
      { pronoun: "Action in progress", form: "will be + verb-ing", example: "This time tomorrow, I will be flying to Paris." }
    ]
  },
  {
    id: "B1-17",
    title: "Future Perfect",
    level: "B1",
    category: "Tenses",
    explanation: { en: "Describes an action that will be completed before a specific time in the future.", ar: "يصف فعلاً سيكتمل قبل وقت محدد في المستقبل." },
    usage: [
        { pronoun: "Completed action", form: "will have + past participle", example: "By 2030, I will have finished my studies." }
    ]
  },
  {
    id: "B1-18",
    title: "Defining vs. Non-defining Relative Clauses",
    level: "B1",
    category: "Sentence Structure",
    explanation: { en: "Defining clauses are essential information (no commas). Non-defining give extra information (with commas).", ar: "الجمل المحددة ضرورية للمعنى (بدون فواصل). وغير المحددة تعطي معلومات إضافية (مع فواصل)." },
    usage: [
        { pronoun: "Defining", form: "The woman who...", example: "The woman who called you is my boss." },
        { pronoun: "Non-defining", form: "My boss, who...", example: "My boss, who is very busy, called you." }
    ]
  },
  {
    id: "B1-19",
    title: "Modals of Deduction (must, can't, might)",
    level: "B1",
    category: "Modals",
    explanation: { en: "Used to make logical guesses about the present.", ar: "تُستخدم لعمل تخمينات أو استنتاجات منطقية حول الحاضر." },
    usage: [
      { pronoun: "must (certainty)", form: "must be", example: "He isn't answering. He must be busy." },
      { pronoun: "can't (impossibility)", form: "can't be", example: "That can't be true!" },
      { pronoun: "might (possibility)", form: "might be", example: "She might be at the library." }
    ]
  },
  {
    id: "B1-20",
    title: "Phrasal Verbs (Separable and Inseparable)",
    level: "B1",
    category: "Verbs",
    explanation: { en: "Some phrasal verbs can be separated by an object (turn the light on). Others cannot (look after my cat).", ar: "بعض الأفعال المركبة يمكن فصلها بمفعول به. والبعض الآخر لا يمكن." },
    usage: [
        { pronoun: "Separable", form: "turn on the light / turn the light on", example: "Please turn the TV on." },
        { pronoun: "Inseparable", form: "look after my cat (not look my cat after)", example: "Can you look after my dog?" }
    ]
  },
  {
    id: "B1-21",
    title: "The Passive (Present Continuous and Perfect)",
    level: "B1",
    category: "Verbs",
    explanation: { en: "Extending the passive voice to continuous and perfect tenses.", ar: "توسيع استخدام صيغة المبني للمجهول لتشمل الأزمنة المستمرة والتامة." },
    usage: [
        { pronoun: "Present Continuous Passive", form: "is being + p.p.", example: "My car is being repaired at the moment." },
        { pronoun: "Present Perfect Passive", form: "has been + p.p.", example: "The report has been finished." }
    ]
  },
  {
    id: "B1-22",
    title: "State Verbs",
    level: "B1",
    category: "Verbs",
    explanation: { en: "Verbs that describe a state, not an action, and are not usually used in continuous tenses (e.g., know, believe, own).", ar: "أفعال تصف حالة وليس فعلًا، ولا تُستخدم عادة في الأزمنة المستمرة." },
    usage: [
        { pronoun: "Correct", form: "I know the answer.", example: "I understand the problem." },
        { pronoun: "Incorrect", form: "I am knowing...", example: "Incorrect: I am understanding the problem." }
    ]
  },
  {
    id: "B1-23",
    title: "Reported Questions",
    level: "B1",
    category: "Sentence Structure",
    explanation: { en: "To report a question, we use a normal statement word order and change the tense.", ar: "لنقل سؤال، نستخدم ترتيب جملة خبرية ونغير الزمن." },
    usage: [
        { pronoun: "Direct", form: "'Where is he?'", example: "She asked, 'Where is he?'" },
        { pronoun: "Reported", form: "asked where he was", example: "She asked where he was." }
    ]
  },
  {
    id: "B1-24",
    title: "'Wish' + Past Simple",
    level: "B1",
    category: "Conditionals",
    explanation: { en: "Used to express a wish or regret about a present situation.", ar: "تُستخدم للتعبير عن أمنية أو ندم بخصوص موقف حاضر." },
    usage: [
      { pronoun: "Wish for present", form: "wish + simple past", example: "I wish I had more free time." }
    ]
  },
  {
    id: "B1-25",
    title: "So / Such",
    level: "B1",
    category: "Adjectives and Adverbs",
    explanation: { en: "Used for emphasis. 'so' with adjectives/adverbs, 'such' with noun phrases.", ar: "تُستخدم للتأكيد. 'so' مع الصفات/الظروف، 'such' مع العبارات الاسمية." },
    usage: [
      { pronoun: "so", form: "so + adjective/adverb", example: "The movie was so good. He ran so quickly." },
      { pronoun: "such", form: "such + (a/an) + adj + noun", example: "It was such a good movie." }
    ]
  },
  
  // ===================================
  // ====== B2 Level Rules (25) ======
  // ===================================
  {
    id: "B2-1",
    title: "Third Conditional",
    level: "B2",
    category: "Conditionals",
    explanation: { en: "Talks about a hypothetical past situation and its result. (If + past perfect, ...would have + p.p.)", ar: "تتحدث عن موقف افتراضي في الماضي ونتيجته. (لو + ماضي تام، ... لكان قد + تصريف ثالث)" },
    usage: [
      { pronoun: "Past Regret", form: "If I had studied...", example: "If I had studied harder, I would have passed." }
    ]
  },
  {
    id: "B2-2",
    title: "Mixed Conditionals",
    level: "B2",
    category: "Conditionals",
    explanation: { en: "Mixes the second and third conditionals to link a past condition to a present result or a present condition to a past result.", ar: "تمزج بين الشرطية الثانية والثالثة لربط شرط ماضٍ بنتيجة حاضرة أو العكس." },
    usage: [
        { pronoun: "Past -> Present", form: "If + past perfect, ...would + verb", example: "If I had taken the job, I would be rich now." },
        { pronoun: "Present -> Past", form: "If + past simple, ...would have + p.p.", example: "If I were a good cook, I would have made dinner." }
    ]
  },
  {
    id: "B2-3",
    title: "Past Perfect Continuous",
    level: "B2",
    category: "Tenses",
    explanation: { en: "Describes a continuous action in the past that was completed before another past action.", ar: "يصف فعلاً مستمراً في الماضي انتهى قبل وقوع فعل ماضٍ آخر." },
    usage: [
      { pronoun: "Duration before past event", form: "had been + verb-ing", example: "I had been waiting for an hour when the bus finally arrived." }
    ]
  },
  {
    id: "B2-4",
    title: "Future Perfect Continuous",
    level: "B2",
    category: "Tenses",
    explanation: { en: "Describes a continuous action that will be completed at some point in the future.", ar: "يصف فعلاً مستمراً سينتهي عند نقطة ما في المستقبل." },
    usage: [
      { pronoun: "Duration at future point", form: "will have been + verb-ing", example: "By next year, I will have been working here for five years." }
    ]
  },
  {
    id: "B2-5",
    title: "Advanced Passive Forms",
    level: "B2",
    category: "Verbs",
    explanation: { en: "Using the passive voice with modals, infinitives, and gerunds.", ar: "استخدام المبني للمجهول مع الأفعال الناقصة، المصادر، وصيغ -ing." },
    usage: [
        { pronoun: "With Modals", form: "modal + be + p.p.", example: "The work must be finished by tomorrow." },
        { pronoun: "With Gerunds", form: "being + p.p.", example: "I hate being told what to do." },
        { pronoun: "With Infinitives", form: "to be + p.p.", example: "She wants to be promoted." }
    ]
  },
  {
    id: "B2-6",
    title: "Modals of Deduction (Past)",
    level: "B2",
    category: "Modals",
    explanation: { en: "Making logical guesses about the past using must have, can't have, might have.", ar: "عمل تخمينات منطقية حول الماضي." },
    usage: [
        { pronoun: "must have", form: "Certainty", example: "The ground is wet. It must have rained." },
        { pronoun: "can't have", form: "Impossibility", example: "He can't have finished already!" },
        { pronoun: "might have", form: "Possibility", example: "She's late. She might have missed the bus." }
    ]
  },
  {
    id: "B2-7",
    title: "Relative Clauses with 'Whose', 'Whom'",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "'Whose' for possession. 'Whom' as the object of a verb or preposition (formal).", ar: "'Whose' للملكية. 'Whom' كمفعول به (رسمية)." },
    usage: [
      { pronoun: "Whose (possession)", form: "...whose...", example: "That's the man whose dog bit me." },
      { pronoun: "Whom (object, formal)", form: "...whom...", example: "The person to whom I spoke was very helpful." }
    ]
  },
  {
    id: "B2-8",
    title: "Participle Clauses",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "A way to connect ideas using an -ing or -ed form, making writing more concise.", ar: "طريقة لربط الأفكار باستخدام صيغة -ing أو -ed لجعل الكتابة موجزة." },
    usage: [
      { pronoun: "-ing form (active)", form: "Feeling tired, ...", example: "Feeling tired, I went to bed early." },
      { pronoun: "-ed form (passive)", form: "Built in 1990, ...", example: "Built in 1990, the bridge is now old." }
    ]
  },
  {
    id: "B2-9",
    title: "'Wish' + Past Perfect",
    level: "B2",
    category: "Conditionals",
    explanation: { en: "Used to express a regret about a past situation.", ar: "تُستخدم للتعبير عن ندم بخصوص موقف في الماضي." },
    usage: [
      { pronoun: "Regret for past", form: "wish + past perfect", example: "I wish I had studied harder for the exam." }
    ]
  },
  {
    id: "B2-10",
    title: "Causative Verbs (have, get)",
    level: "B2",
    category: "Verbs",
    explanation: { en: "Used to show that someone causes something to happen. 'have someone do', 'get someone to do'.", ar: "تُستخدم لإظهار أن شخصًا ما تسبب في حدوث شيء ما." },
    usage: [
        { pronoun: "have something done", form: "Arrange for a service", example: "I had my car repaired." },
        { pronoun: "get something done", form: "Arrange for a service (informal)", example: "I need to get my hair cut." },
        { pronoun: "get someone to do", form: "Persuade someone", example: "I got him to help me with my homework." }
    ]
  },
  {
    id: "B2-11",
    title: "Reported Speech (Commands and Questions)",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Reporting commands using 'told + to-infinitive' and questions using 'asked if/whether' or a question word.", ar: "نقل الأوامر والأسئلة." },
    usage: [
        { pronoun: "Command", form: "told me to...", example: "Direct: 'Close the door.' -> Reported: He told me to close the door." },
        { pronoun: "Yes/No Question", form: "asked if...", example: "Direct: 'Are you busy?' -> Reported: She asked if I was busy." },
        { pronoun: "Wh- Question", form: "asked what...", example: "Direct: 'What is your name?' -> Reported: He asked what my name was." }
    ]
  },
  {
    id: "B2-12",
    title: "Inversion",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Inverting the subject and verb for emphasis, usually after negative adverbials.", ar: "قلب الفاعل والفعل للتأكيد، عادة بعد الظروف المنفية." },
    usage: [
      { pronoun: "Never before...", form: "Never before had I seen...", example: "Never before had I seen such a beautiful sight." },
      { pronoun: "Not only...", form: "Not only does he sing...", example: "Not only does he sing, but he also plays the guitar." }
    ]
  },
  {
    id: "B2-13",
    title: "Emphasis (Cleft Sentences)",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Restructuring a sentence to emphasize a part, often starting with 'It was...' or 'What...'.", ar: "إعادة هيكلة الجملة للتأكيد على جزء معين." },
    usage: [
      { pronoun: "Emphasizing subject", form: "It was [subject] who...", example: "It was John who broke the window." },
      { pronoun: "Emphasizing object", form: "What [subject] did was...", example: "What I need is a cup of coffee." }
    ]
  },
  {
    id: "B2-14",
    title: "Articles (Advanced)",
    level: "B2",
    category: "Nouns and Articles",
    explanation: { en: "Complex uses of articles, including with geographical names and zero article for general concepts.", ar: "استخدامات معقدة لأدوات التعريف، بما في ذلك مع الأسماء الجغرافية وعدم استخدام أداة للمفاهيم العامة." },
    usage: [
        { pronoun: "Zero article", form: "General concept", example: "I believe education is important." },
        { pronoun: "The", form: "Geographical features", example: "The Nile River, The Alps, The Atlantic Ocean." },
        { pronoun: "No The", form: "Most countries/cities", example: "I visited France, not the France." }
    ]
  },
  {
    id: "B2-15",
    title: "Linking Words (Contrast and Concession)",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Using words like 'although', 'despite', 'in spite of', 'however' to link contrasting ideas.", ar: "استخدام كلمات لربط الأفكار المتناقضة." },
    usage: [
        { pronoun: "Although", form: "Although + clause", example: "Although it was raining, we went out." },
        { pronoun: "Despite", form: "Despite + noun/-ing", example: "We went out despite the rain." },
        { pronoun: "However", form: "Sentence connector", example: "It was raining. However, we went out." }
    ]
  },
  {
    id: "B2-16",
    title: "Future in the Past",
    level: "B2",
    category: "Tenses",
    explanation: { en: "Talking about something that was the future at a certain point in the past (e.g., using 'was going to', 'would').", ar: "التحدث عن شيء كان مستقبلاً في نقطة معينة في الماضي." },
    usage: [
        { pronoun: "was going to", form: "Past plan that didn't happen", example: "I was going to call you, but I forgot." },
        { pronoun: "would", form: "Future from a past perspective", example: "He said he would be there at 8." }
    ]
  },
  {
    id: "B2-17",
    title: "Ellipsis",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Omitting words from a sentence because they are understood from the context.", ar: "حذف كلمات من الجملة لأنها مفهومة من السياق." },
    usage: [
      { pronoun: "With auxiliary", form: "A: 'Do you like coffee?' B: 'Yes, I do.' (Instead of 'Yes, I do like coffee.')", example: "She can play the guitar, but I can't." }
    ]
  },
  {
    id: "B2-18",
    title: "Substitution (so, not, one)",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Using words like 'so', 'not', or 'one' to avoid repeating a clause or noun phrase.", ar: "استخدام كلمات لتجنب تكرار عبارة أو جملة." },
    usage: [
        { pronoun: "so / not", form: "I think so / I hope not", example: "A: 'Is it going to rain?' B: 'I hope not.'" },
        { pronoun: "one / ones", form: "To replace a noun", example: "I'd like a coffee. A large one, please." }
    ]
  },
  {
    id: "B2-19",
    title: "Reflexive Pronouns (myself, yourself...)",
    level: "B2",
    category: "Pronouns",
    explanation: { en: "Used when the subject and the object of a verb are the same.", ar: "تُستخدم عندما يكون الفاعل والمفعول به في الجملة هو نفسه." },
    usage: [
      { pronoun: "Reflexive", form: "verb + myself/etc.", example: "I cut myself while cooking." },
      { pronoun: "For emphasis", form: "I myself...", example: "I myself built this computer." }
    ]
  },
  {
    id: "B2-20",
    title: "Determiners (all, most, some, no)",
    level: "B2",
    category: "Determiners",
    explanation: { en: "Used to talk about quantities in a general sense.", ar: "تُستخدم للحديث عن الكميات بشكل عام." },
    usage: [
        { pronoun: "all / most", form: "all/most + noun", example: "All children need love. Most people agree." },
        { pronoun: "some / no", form: "some/no + noun", example: "I need some advice. There is no reason to worry." }
    ]
  },
  {
    id: "B2-21",
    title: "Phrasal Verbs (Advanced)",
    level: "B2",
    category: "Verbs",
    explanation: { en: "Understanding three-part phrasal verbs and more idiomatic meanings.", ar: "فهم الأفعال المركبة المكونة من ثلاثة أجزاء والمعاني الاصطلاحية." },
    usage: [
        { pronoun: "look forward to", form: "+ verb-ing", example: "I'm looking forward to seeing you." },
        { pronoun: "come up with", form: "devise/invent", example: "She came up with a great idea." },
        { pronoun: "get away with", form: "avoid punishment", example: "He got away with cheating on the test." }
    ]
  },
  {
    id: "B2-22",
    title: "Relative clauses with prepositions",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "Placing a preposition before the relative pronoun (formal style).", ar: "وضع حرف الجر قبل ضمير الوصل (أسلوب رسمي)." },
    usage: [
        { pronoun: "Informal", form: "...which I was talking about.", example: "This is the project which I was talking about." },
        { pronoun: "Formal", form: "...about which...", example: "This is the project about which I was talking." }
    ]
  },
  {
    id: "B2-23",
    title: "Adjective Order",
    level: "B2",
    category: "Adjectives and Adverbs",
    explanation: { en: "The conventional order for multiple adjectives before a noun (e.g., opinion, size, age, shape, color, origin, material, purpose).", ar: "الترتيب المتعارف عليه للصفات المتعددة قبل الاسم." },
    usage: [
        { pronoun: "Correct Order", form: "OSASCOMP", example: "A beautiful (opinion) small (size) old (age) Italian (origin) sports (purpose) car." }
    ]
  },
  {
    id: "B2-24",
    title: "The Subjunctive",
    level: "B2",
    category: "Verbs",
    explanation: { en: "Used for hypothetical situations or to express wishes, suggestions, or demands. Often uses the base form of the verb.", ar: "تُستخدم للمواقف الافتراضية، أو للتعبير عن الأمنيات، الاقتراحات، أو الطلبات." },
    usage: [
      { pronoun: "Suggestion", form: "suggest that he be...", example: "I suggest that he be present at the meeting." },
      { pronoun: "Demand", form: "insist that... arrive", example: "The manager insists that all employees arrive on time." }
    ]
  },
  {
    id: "B2-25",
    title: "Nominalisation",
    level: "B2",
    category: "Sentence Structure",
    explanation: { en: "The process of turning verbs and adjectives into nouns, common in academic and formal writing.", ar: "عملية تحويل الأفعال والصفات إلى أسماء، شائعة في الكتابة الأكاديمية والرسمية." },
    usage: [
        { pronoun: "Verb -> Noun", form: "investigate -> investigation", example: "The police's investigation continued for weeks." },
        { pronoun: "Adjective -> Noun", form: "difficult -> difficulty", example: "He had no difficulty solving the problem." }
    ]
  },

  // ===================================
  // ====== C1 Level Rules (15) ======
  // ===================================
  {
    id: "C1-1",
    title: "Advanced Conditionals",
    level: "C1",
    category: "Conditionals",
    explanation: { en: "Using 'if' with modals, inversions (Had I known...), and implied conditionals.", ar: "استخدام 'if' مع الأفعال الناقصة، القلب (Inversion)، والجمل الشرطية الضمنية." },
    usage: [
        { pronoun: "Inversion", form: "Had I known...", example: "Had I known you were in town, I would have called you." },
        { pronoun: "Implied", form: "without...", example: "I wouldn't be here without your help. (If you hadn't helped me...)" }
    ]
  },
  {
    id: "C1-2",
    title: "Advanced Inversion",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Using inversion for emphasis after a wider range of negative or limiting adverbials (e.g., 'Seldom', 'Rarely', 'Under no circumstances').", ar: "استخدام القلب للتأكيد بعد مجموعة أوسع من الظروف المنفية أو المقيدة." },
    usage: [
        { pronoun: "Seldom", form: "Seldom do we see...", example: "Seldom do we see such talent." },
        { pronoun: "Under no circumstances", form: "Under no circumstances should you...", example: "Under no circumstances should you open that door." }
    ]
  },
  {
    id: "C1-3",
    title: "Cleft Sentences (Advanced)",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Advanced structures for emphasis, such as 'All I want is...', 'The reason why...is that...', 'The place where...is...'.", ar: "هياكل متقدمة للتأكيد." },
    usage: [
        { pronoun: "All...", form: "All I did was...", example: "All I did was ask a simple question." },
        { pronoun: "The reason why...", form: "The reason why... is that...", example: "The reason why he failed is that he didn't study." }
    ]
  },
  {
    id: "C1-4",
    title: "Reduced Relative Clauses",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Shortening relative clauses by omitting the relative pronoun and 'be' verb.", ar: "تقصير جمل الوصل بحذف ضمير الوصل وفعل 'be'." },
    usage: [
        { pronoun: "Full", form: "The man who is sitting...", example: "The man who is sitting over there is my brother." },
        { pronoun: "Reduced", form: "The man sitting...", example: "The man sitting over there is my brother." }
    ]
  },
  {
    id: "C1-5",
    title: "Adverbial Clauses of Concession",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Using advanced connectors like 'even though', 'while', 'whereas', 'no matter how'.", ar: "استخدام روابط متقدمة مثل 'even though', 'while', 'whereas'." },
    usage: [
        { pronoun: "even though", form: "even though + clause", example: "He went to work even though he was sick." },
        { pronoun: "whereas", form: "to contrast two facts", example: "She is very outgoing, whereas her sister is very shy." }
    ]
  },
  {
    id: "C1-6",
    title: "Determiners (Advanced)",
    level: "C1",
    category: "Determiners",
    explanation: { en: "Nuances of determiners like 'each', 'every', 'either', 'neither' with singular verbs, and the use of 'of'.", ar: "الفروق الدقيقة في استخدام المحددات." },
    usage: [
        { pronoun: "Each", form: "Each student has...", example: "Each student has a different book." },
        { pronoun: "Neither of", form: "Neither of the answers is...", example: "Neither of the answers is correct." }
    ]
  },
  {
    id: "C1-7",
    title: "The Passive with 'get'",
    level: "C1",
    category: "Verbs",
    explanation: { en: "Using 'get' instead of 'be' to form the passive, often in informal contexts or to talk about things that happen by accident.", ar: "استخدام 'get' بدلاً من 'be' لتكوين المبني للمجهول، غالبًا في سياقات غير رسمية أو للحديث عن أشياء تحدث بالصدفة." },
    usage: [
        { pronoun: "Accident", form: "get + past participle", example: "My phone got stolen last week." },
        { pronoun: "Process", form: "get + past participle", example: "He got promoted after years of hard work." }
    ]
  },
  {
    id: "C1-8",
    title: "Hedging and Softening Language",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Using words and phrases to make statements less direct or assertive (e.g., 'it seems that', 'it could be argued that', 'tend to').", ar: "استخدام كلمات وعبارات لجعل العبارات أقل مباشرة أو حزمًا." },
    usage: [
        { pronoun: "Hedging", form: "It seems that...", example: "It seems that the results are inconclusive." },
        { pronoun: "Softening", form: "tend to", example: "People tend to prefer summer over winter." }
    ]
  },
  {
    id: "C1-9",
    title: "Modal Verbs (Advanced)",
    level: "C1",
    category: "Modals",
    explanation: { en: "Nuances of modals, such as 'should have' for past criticism, and 'needn't have' for unnecessary past actions.", ar: "الفروق الدقيقة في الأفعال الناقصة، مثل 'should have' للنقد الماضي، و 'needn't have' للأفعال الماضية غير الضرورية." },
    usage: [
        { pronoun: "should have", form: "Past criticism/regret", example: "You should have told me you were coming." },
        { pronoun: "needn't have", form: "Unnecessary past action", example: "You needn't have bought milk; we have plenty." }
    ]
  },
  {
    id: "C1-10",
    title: "Double Comparative",
    level: "C1",
    category: "Adjectives and Adverbs",
    explanation: { en: "The structure 'The + comparative, the + comparative' to show that two things change together.", ar: "بنية 'The + مقارنة، the + مقارنة' لإظهار أن شيئين يتغيران معًا." },
    usage: [
        { pronoun: "Cause and effect", form: "The more..., the more...", example: "The more you study, the more you learn." },
        { pronoun: "Inverse relationship", form: "The older..., the less...", example: "The older I get, the less I worry." }
    ]
  },
  {
    id: "C1-11",
    title: "It-clauses and What-clauses (Clefts)",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Used to give emphasis to a particular part of a sentence.", ar: "تستخدم للتأكيد على جزء معين من الجملة." },
    usage: [
      { pronoun: "It-clause", form: "It was X that...", example: "It was my brother that broke the vase." },
      { pronoun: "What-clause", form: "What X does is...", example: "What I need is a long holiday." }
    ]
  },
  {
    id: "C1-12",
    title: "Discourse Markers",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Words and phrases used to connect, organize and manage what we say or write (e.g., 'Consequently', 'Nevertheless', 'To sum up').", ar: "كلمات وعبارات تستخدم لربط وتنظيم وإدارة ما نقوله أو نكتبه." },
    usage: [
        { pronoun: "Contrast", form: "Nevertheless", example: "It was a difficult test. Nevertheless, she passed." },
        { pronoun: "Result", form: "Consequently", example: "He didn't study. Consequently, he failed." }
    ]
  },
  {
    id: "C1-13",
    title: "Fronting and Topicalization",
    level: "C1",
    category: "Sentence Structure",
    explanation: { en: "Moving a part of the sentence to the beginning for emphasis.", ar: "نقل جزء من الجملة إلى البداية للتأكيد." },
    usage: [
        { pronoun: "Normal", form: "I love Italian food.", example: "I will never forget that day." },
        { pronoun: "Fronting", form: "Italian food, I love.", example: "That day, I will never forget." }
    ]
  },
  {
    id: "C1-14",
    title: "Adjectives and Adverbs (Advanced)",
    level: "C1",
    category: "Adjectives and Adverbs",
    explanation: { en: "Understanding gradable vs. ungradable adjectives, and the use of intensifying adverbs.", ar: "فهم الصفات القابلة وغير القابلة للتدرج، واستخدام ظروف التكثيف." },
    usage: [
        { pronoun: "Gradable", form: "very hot, a bit tired", example: "I'm very tired today." },
        { pronoun: "Ungradable", form: "absolutely exhausted, completely unique", example: "The view was absolutely breathtaking." }
    ]
  },
  {
    id: "C1-15",
    title: "Complex Prepositional Phrases",
    level: "C1",
    category: "Prepositions",
    explanation: { en: "Using multi-word prepositions and understanding their nuances (e.g., 'in spite of', 'by means of', 'on behalf of').", ar: "استخدام حروف الجر متعددة الكلمات وفهم فروقها الدقيقة." },
    usage: [
        { pronoun: "in spite of", form: "despite", example: "He succeeded in spite of the difficulties." },
        { pronoun: "on behalf of", form: "representing", example: "I am speaking on behalf of my colleagues." }
    ]
  },
];
