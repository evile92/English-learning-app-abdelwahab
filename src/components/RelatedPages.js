// src/components/RelatedPages.js - ملف جديد
import React from 'react';
import { BookOpen, Headphones, Mic, PenTool, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const RelatedPages = ({ currentPage }) => {
  const { handlePageChange } = useAppContext();

  const relatedData = {
    'grammar': [
      { name: 'تدريب الكتابة', page: 'writing', icon: PenTool, desc: 'طبق القواعد في الكتابة' },
      { name: 'الدروس التفاعلية', page: 'lessons', icon: BookOpen, desc: 'دروس شاملة' },
      { name: 'التركيز الذكي', page: 'smartFocus', icon: Target, desc: 'ركز على نقاط ضعفك' }
    ],
    'vocabulary': [
      { name: 'مدرب النطق', page: 'pronunciation', icon: Mic, desc: 'تدرب على نطق الكلمات' },
      { name: 'القراءة', page: 'reading', icon: BookOpen, desc: 'تعلم كلمات جديدة' },
      { name: 'الاستماع', page: 'listening', icon: Headphones, desc: 'استمع للكلمات' }
    ],
    'pronunciation': [
      { name: 'مفرداتي', page: 'vocabulary', icon: BookOpen, desc: 'احفظ الكلمات الجديدة' },
      { name: 'الاستماع', page: 'listening', icon: Headphones, desc: 'تحسين الفهم' },
      { name: 'التمثيل', page: 'roleplay', icon: Target, desc: 'تدرب على المحادثة' }
    ],
    // إضافة المزيد حسب الحاجة...
  };

  const related = relatedData[currentPage];
  if (!related) return null;

  return (
    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        مواضيع ذات صلة
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map(item => (
          <button
            key={item.page}
            onClick={() => handlePageChange(item.page)}
            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-left"
          >
            <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full">
              <item.icon size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedPages;
