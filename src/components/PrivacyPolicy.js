// src/components/PrivacyPolicy.js

import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-6">
                    <Shield className="mx-auto text-sky-500 mb-4" size={48} />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">سياسة الخصوصية</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">آخر تحديث: 18 سبتمبر 2025</p>
                </div>
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                    <p>أهلاً بك في Stellar Speak. خصوصيتك تهمنا. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.</p>

                    <h2>1. المعلومات التي نجمعها</h2>
                    <ul>
                        <li><strong>معلومات الحساب:</strong> عند التسجيل، نقوم بجمع اسم المستخدم والبريد الإلكتروني. عند استخدام تسجيل الدخول عبر Google، نحصل على اسمك وبريدك الإلكتروني من حسابك.</li>
                        <li><strong>بيانات التقدم:</strong> نقوم بتخزين بيانات تقدمك في الدروس، النقاط، والإنجازات.</li>
                    </ul>

                    <h2>2. كيف نستخدم معلوماتك</h2>
                    <ul>
                        <li>لتخصيص تجربتك التعليمية وحفظ تقدمك.</li>
                        <li>لتحليل أدائك وتقديم ميزات مثل "التركيز الذكي".</li>
                        <li>لتحسين خدماتنا وإصلاح المشاكل التقنية.</li>
                    </ul>
                    
                    <h2>3. الإعلانات</h2>
                    <p>نحن نستخدم Google AdSense لعرض الإعلانات على موقعنا. قد تستخدم Google ملفات تعريف الارتباط لعرض إعلانات مخصصة بناءً على زياراتك السابقة لموقعنا أو لمواقع أخرى. يمكنك إلغاء الاشتراك في الإعلانات المخصصة عن طريق زيارة <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">إعدادات إعلانات Google</a>.</p>

                    <h2>4. اتصل بنا</h2>
                    <p>إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني: <a href="mailto:abdelwahab.kahoch@gmail.com">abdelwahab.kahoch@gmail.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
