// src/components/About.js

import React, { useState } from 'react';
import { Sparkles, Lightbulb, BrainCircuit, Repeat, Rocket, CheckCircle, LoaderCircle, Hourglass, HelpCircle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
        <div className="pb-10 text-right">
            <p className={`text-sm font-semibold ${color.text}`}>{status}</p>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white mt-1">{title}</h4>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

// مكون مساعد للأسئلة الشائعة
const FaqItem = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-5 text-right"
            >
                <span className="text-lg font-semibold text-slate-800 dark:text-white">{question}</span>
                <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="pb-5 text-slate-600 dark:text-slate-300 leading-relaxed text-right">
                    {children} 
                </div>
            </div>
        </div>
    );
};

const About = () => {
    const { setPage } = useAppContext();

    return (
        <div dir="rtl" className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
            {/* القسم الأول: قصة ميلاد الفكرة */}
            <div className="text-center mb-20">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white">قصة StellarSpeak</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    وُلدت فكرة StellarSpeak من ملاحظة بسيطة لكنها قوية: تعلم لغة جديدة هو رحلة، وليس وجهة. لاحظنا أن العديد من المتعلمين يجدون صعوبة في إيجاد شركاء ممارسة دائمين ومواد تعليمية جذابة. من هذا الاحتياج، انطلقنا في مهمة لبناء منصة لا تُعلّم اللغة الإنجليزية فحسب، بل تجعل عملية التعلم نفسها مغامرة شيقة.
                </p>
            </div>

            {/* القسم الثاني: فلسفتنا في التعليم */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white">فلسفتنا في التعليم</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <InfoCard icon={Repeat} title="التعلم بالممارسة">
                        نؤمن بأن اللغة تُكتسب بالممارسة الفعالة، لا بالحفظ السلبي. تم تصميم أدواتنا لتجعلك تتحدث وتكتب وتفكر باللغة الإنجليزية من اليوم الأول.
                    </InfoCard>
                    <InfoCard icon={BrainCircuit} title="تخصيص ذكي">
                        كل متعلم فريد من نوعه. تتكيف ميزاتنا المدعومة بالذكاء الاصطناعي مع مستواك وأهدافك، لتقدم تجربة مخصصة تكون محفزة ومشجعة في آن واحد.
                    </InfoCard>
                    <InfoCard icon={Lightbulb} title="المتعة والاستمرارية">
                        الاستمرارية هي مفتاح الإتقان. نحن نصنع تجارب جذابة وممتعة من القصص التفاعلية إلى التعلم بالأغاني لتحويل التعلم إلى عادة يومية ستحبها.
                    </InfoCard>
                </div>
            </div>

            {/* القسم الثالث: خريطة الطريق المستقبلية */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white">رحلتنا وخريطة الطريق المستقبلية</h2>
                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <RoadmapItem icon={CheckCircle} status="مكتمل" title="ميزات الذكاء الاصطناعي الأساسية" color={{border: 'border-green-500', text: 'text-green-500'}}>
                            تم إطلاق شريك المحادثة الذكي، مكتبة القراءة، وأداة قاموسي الشخصي.
                        </RoadmapItem>
                        <RoadmapItem icon={LoaderCircle} status="قيد التنفيذ" title="قسم الاستماع للبودكاست" color={{border: 'border-sky-500', text: 'text-sky-500'}}>
                            نعمل حاليًا على تطوير قسم جديد لممارسة الاستماع عبر البودكاست، مع نصوص كاملة وميزات لحفظ الكلمات.
                        </RoadmapItem>
                        <RoadmapItem icon={Hourglass} status="مخطط له" title="نظام متقدم لتتبع المستوى" color={{border: 'border-amber-500', text: 'text-amber-500'}}>
                            نخطط لنظام أكثر تطورًا لتتبع التقدم، وتحديد الأهداف، وتقديم تمارين قواعد مخصصة.
                        </RoadmapItem>
                        <RoadmapItem icon={Rocket} status="هدف مستقبلي" title="تطبيقات الهواتف المحمولة" color={{border: 'border-purple-500', text: 'text-purple-500'}}>
                            تتضمن رؤيتنا طويلة الأمد إطلاق تطبيقات مخصصة لأنظمة Android و iOS لجعل التعلم أثناء التنقل أسهل.
                        </RoadmapItem>
                    </div>
                </div>
            </div>

            {/* القسم الرابع: الأسئلة الشائعة */}
            <div>
                 <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white">الأسئلة الشائعة</h2>
                 <div className="max-w-3xl mx-auto">
                    <FaqItem question="هل منصة StellarSpeak مجانية بالكامل؟">
                        <p>نعم، جميع الميزات المتوفرة حاليًا على المنصة مجانية. مهمتنا هي جعل تعليم اللغة الإنجليزية عالي الجودة في متناول الجميع. في المستقبل، قد نقدم ميزات مدفوعة لدعم نمو المنصة، لكن أدواتنا الأساسية ستحتوي دائمًا على خيار مجاني.</p>
                    </FaqItem>
                    <FaqItem question="كيف يتم استخدام الذكاء الاصطناعي في المنصة؟">
                        <p>نحن نستخدم أحدث تقنيات الذكاء الاصطناعي لتشغيل ميزاتنا التفاعلية. يعمل الذكاء الاصطناعي كشريك محادثة شخصي لك، ويقدم ملاحظات فورية في التمارين، ويساعد في إنشاء قصص ديناميكية، ويوفر ترجمات مخصصة، مما يخلق تجربة تعليمية تتكيف معك.</p>
                    </FaqItem>
                    <FaqItem question="هل بياناتي الشخصية آمنة؟">
                        <p>بالتأكيد. نحن نأخذ خصوصيتك وأمن بياناتك على محمل الجد. يتم التعامل مع جميع بيانات المستخدم بسرية تامة وحمايتها باستخدام معايير الأمان المتعارف عليها في الصناعة. نحن لا نشارك بياناتك الشخصية مع أي أطراف ثالثة.</p>
                    </FaqItem>
                    {/* --- ✅ بداية الجزء الذي تم تعديله --- */}
                    <FaqItem question="كيف يمكنني اقتراح ميزة جديدة أو الإبلاغ عن مشكلة؟">
                        <p className="inline">
                            يسعدنا دائمًا الاستماع إلى مستخدمينا! يمكنك 
                            <button onClick={() => setPage('contact')} className="text-sky-500 hover:underline font-semibold mx-1">
                                التواصل معنا مباشرة عبر صفحة اتصل بنا.
                            </button>
                            اقتراحاتك لا تقدر بثمن في مساعدتنا على تحسين StellarSpeak.
                        </p>
                    </FaqItem>
                    {/* --- 🛑 نهاية الجزء الذي تم تعديله --- */}
                 </div>
            </div>
        </div>
    );
};

export default About;
