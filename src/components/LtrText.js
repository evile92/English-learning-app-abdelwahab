// src/components/LtrText.js

import React from 'react';

/**
 * مكون بسيط لفرض اتجاه النص من اليسار إلى اليمين (LTR).
 * مفيد لعرض النصوص الإنجليزية داخل واجهة عربية (RTL) لضمان التنسيق الصحيح.
 * @param {object} props - الخصائص التي يتم تمريرها للمكون.
 * @param {React.ReactNode} props.children - العناصر أو النصوص التي سيتم عرضها.
 * @param {string} [props.as='p'] - الوسم الذي سيتم استخدامه (مثل 'p', 'h3', 'span'). الافتراضي هو 'p'.
 * @param {string} props.className - أي فئات CSS إضافية لتطبيقها.
 */
const LtrText = ({ children, as: Component = 'p', className = '' }) => {
  return (
    <Component dir="ltr" className={className}>
      {children}
    </Component>
  );
};

export default LtrText;
