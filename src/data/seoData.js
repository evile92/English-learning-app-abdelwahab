// src/data/seoData.js - ملف جديد
export const seoData = {
  'dashboard': {
    title: 'لوحة التحكم - تتبع تقدمك في تعلم الإنجليزية | StellarSpeak',
    description: 'تتبع تقدمك اليومي في تعلم اللغة الإنجليزية، اطلع على إنجازاتك وخطط دراستك مع StellarSpeak',
    keywords: 'تتبع التقدم, إنجازات تعلم الإنجليزية, خطة دراسة',
    pageType: 'website'
  },
  'grammar': {
    title: 'دليل القواعد - تعلم قواعد اللغة الإنجليزية بسهولة | StellarSpeak',
    description: 'دليل شامل لقواعد اللغة الإنجليزية مع شرح مبسط وأمثلة عملية لجميع المستويات',
    keywords: 'قواعد الإنجليزية, Grammar, Present Tense, Past Tense, Future Tense, Articles',
    pageType: 'course'
  },
  'vocabulary': {
    title: 'مفرداتي - إدارة وحفظ المفردات الإنجليزية | StellarSpeak',
    description: 'احفظ وراجع المفردات الإنجليزية الجديدة مع نظام التكرار المتباعد لحفظ أفضل',
    keywords: 'مفردات إنجليزية, حفظ الكلمات, قاموس شخصي, Vocabulary',
    pageType: 'course'
  },
  'pronunciation': {
    title: 'مدرب النطق - تحسين نطق الإنجليزية بالذكاء الاصطناعي | StellarSpeak',
    description: 'تدرب على نطق الإنجليزية الصحيح واحصل على تقييم فوري بتقنية الذكاء الاصطناعي',
    keywords: 'نطق الإنجليزية, تدريب النطق, Pronunciation, تحسين اللفظ',
    pageType: 'course'
  },
  'listening': {
    title: 'مركز الاستماع - تطوير مهارات الاستماع للإنجليزية | StellarSpeak',
    description: 'طور مهارات الاستماع مع محادثات حقيقية وتمارين تفاعلية لجميع المستويات',
    keywords: 'استماع إنجليزي, Listening Skills, محادثات إنجليزية, تدريب الأذن',
    pageType: 'course'
  },
  'reading': {
    title: 'مركز القراءة - تحسين مهارات القراءة والفهم | StellarSpeak',
    description: 'اقرأ نصوص متنوعة وطور مهارات الفهم والاستيعاب في اللغة الإنجليزية',
    keywords: 'قراءة إنجليزية, Reading Comprehension, نصوص إنجليزية, فهم المقروء',
    pageType: 'course'
  },
  'writing': {
    title: 'تدريب الكتابة - تعلم الكتابة بالإنجليزية | StellarSpeak',
    description: 'تدرب على الكتابة بالإنجليزية واحصل على تصحيح فوري وتقييم لنصوصك',
    keywords: 'كتابة إنجليزية, Writing Skills, تصحيح النصوص, تحسين الكتابة',
    pageType: 'course'
  },
  'lessons': {
    title: 'الدروس التفاعلية - تعلم الإنجليزية خطوة بخطوة | StellarSpeak',
    description: 'دروس تفاعلية منظمة حسب المستوى لتعلم الإنجليزية من البداية حتى الاحتراف',
    keywords: 'دروس إنجليزية, تعلم تفاعلي, مستويات اللغة, English Lessons',
    pageType: 'course'
  },
  'blog': {
    title: 'مدونة StellarSpeak - نصائح ومقالات لتعلم الإنجليزية',
    description: 'اقرأ أحدث النصائح والمقالات حول تعلم اللغة الإنجليزية وطرق التحسن السريع',
    keywords: 'مدونة تعلم الإنجليزية, نصائح اللغة, مقالات تعليمية',
    pageType: 'article'
  },
  'about': {
    title: 'حول StellarSpeak - منصة تعلم اللغة الإنجليزية الرائدة',
    description: 'تعرف على StellarSpeak، المنصة التفاعلية المجانية لتعلم اللغة الإنجليزية بطرق حديثة',
    keywords: 'عن StellarSpeak, منصة تعليمية, تعلم الإنجليزية مجاناً',
    pageType: 'website'
  },
  'contact': {
    title: 'اتصل بنا - فريق دعم StellarSpeak',
    description: 'تواصل مع فريق StellarSpeak للحصول على المساعدة أو لإرسال اقتراحاتك وملاحظاتك',
    keywords: 'اتصل بنا, دعم فني, استفسارات, StellarSpeak',
    pageType: 'website'
  }
};

// دالة مساعدة للحصول على بيانات SEO
export const getSEOData = (page) => {
  return seoData[page] || seoData['dashboard'];
};
