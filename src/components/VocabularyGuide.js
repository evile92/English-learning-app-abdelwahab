// src/components/VocabularyGuide.js

import React, { useState } from 'react';
import { vocabularyCategories } from '../data/vocabularyLists';
import { FaArrowLeft, FaVolumeUp } from 'react-icons/fa'; // استيراد أيقونة الصوت

const VocabularyGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // دالة لنطق النص
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // تحديد اللغة الإنجليزية
      window.speechSynthesis.speak(utterance);
    } else {
      alert('عذراً، متصفحك لا يدعم ميزة النطق.');
    }
  };

  if (selectedCategory) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center text-cyan-400 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          العودة إلى الفئات
        </button>
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">
          {selectedCategory.emoji} {selectedCategory.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedCategory.terms.map((term, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-xl font-semibold">{term.ar}</p>
              <div className="flex items-center justify-center mt-2">
                <p className="text-lg text-cyan-300 mr-2">{term.en}</p>
                {/* زر النطق */}
                <button onClick={() => speak(term.en)} className="text-cyan-400 hover:text-cyan-200">
                  <FaVolumeUp />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">دليل المفردات الأساسية</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vocabularyCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category)}
            className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-5xl">{category.emoji}</span>
            <h2 className="text-2xl font-semibold mt-4">{category.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyGuide;
