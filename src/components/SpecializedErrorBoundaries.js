// src/components/SpecializedErrorBoundaries.js

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// Error Boundary للصفحة الرئيسية
export const PageErrorBoundary = ({ children, isDarkMode, onGoHome }) => (
  <ErrorBoundary
    isDarkMode={isDarkMode}
    onGoHome={onGoHome}
    showHomeButton={true}
    title="خطأ في تحميل الصفحة"
    message="حدث خطأ أثناء تحميل هذه الصفحة. يرجى إعادة المحاولة."
  >
    {children}
  </ErrorBoundary>
);

// Error Boundary للمكونات التفاعلية
export const InteractiveErrorBoundary = ({ children, isDarkMode }) => (
  <ErrorBoundary
    isDarkMode={isDarkMode}
    showHomeButton={false}
    title="خطأ في المكون"
    message="حدث خطأ في هذا الجزء. سيتم إعادة تحميله تلقائياً."
  >
    {children}
  </ErrorBoundary>
);

// Error Boundary للكوائز والاختبارات
export const QuizErrorBoundary = ({ children, isDarkMode, onQuizReset }) => (
  <ErrorBoundary
    isDarkMode={isDarkMode}
    showHomeButton={true}
    title="خطأ في الاختبار"
    message="حدث خطأ أثناء الاختبار. يمكنك إعادة المحاولة أو العودة للرئيسية."
    onGoHome={onQuizReset}
  >
    {children}
  </ErrorBoundary>
);

// Error Boundary لتحميل البيانات
export const DataLoadingErrorBoundary = ({ children, isDarkMode }) => (
  <ErrorBoundary
    isDarkMode={isDarkMode}
    showHomeButton={false}
    title="خطأ في تحميل البيانات"
    message="فشل في تحميل البيانات. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
  >
    {children}
  </ErrorBoundary>
);
