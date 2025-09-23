// src/components/MinimalistStarChart.js

import React from 'react';
import './MinimalistStarChart.css';

// بيانات النجوم والكوكبات
// يمكنك تغيير هذه الإحداثيات كما تشاء لإنشاء تصميمات مختلفة
const stars = [
  { id: 1, top: '20%', left: '15%' },
  { id: 2, top: '35%', left: '30%' },
  { id: 3, top: '25%', left: '55%' },
  { id: 4, top: '40%', left: '75%' },
  { id: 5, top: '65%', left: '85%' },
  { id: 6, top: '80%', left: '60%' },
  { id: 7, top: '75%', left: '35%' },
  { id: 8, top: '10%', left: '70%' },
  { id: 9, top: '55%', left: '10%' },
  { id: 10, top: '50%', left: '50%' },
];

const constellations = [
  { fromId: 1, toId: 2 },
  { fromId: 2, toId: 3 },
  { fromId: 3, toId: 4 },
  { fromId: 4, toId: 5 },
  { fromId: 6, toId: 7 },
  { fromId: 7, toId: 1 },
  { fromId: 3, toId: 6 },
  { fromId: 5, toId: 7 },
];

// قائمة كلمات بسيطة كمثال
const vocabulary = ['Stellar', 'Galaxy', 'Orbit', 'Comet', 'Gravity', 'Cosmic', 'Nebula', 'Asteroid', 'Supernova', 'Lightyear'];

function MinimalistStarChart() {
  const handleStarClick = (event) => {
    event.stopPropagation(); // لمنع تفعيل أي أحداث نقر أخرى على الخلفية
    // اختر كلمة عشوائية من القائمة
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    // اعرض الكلمة في تنبيه بسيط
    alert(`✨ ${randomWord}`);
  };

  return (
    <div className="star-chart-container">
      {/* عرض خطوط الكوكبات */}
      {constellations.map((constellation, index) => {
        const star1 = stars.find(s => s.id === constellation.fromId);
        const star2 = stars.find(s => s.id === constellation.toId);
        
        if (!star1 || !star2) return null;

        // حساب الإحداثيات والزاوية للخط
        const x1 = parseFloat(star1.left);
        const y1 = parseFloat(star1.top);
        const x2 = parseFloat(star2.left);
        const y2 = parseFloat(star2.top);

        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        return (
          <div
            key={index}
            className="constellation-line"
            style={{
              width: `${length}%`,
              top: `${midY}%`,
              left: `${midX}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`
            }}
          />
        );
      })}

      {/* عرض النجوم بشكل ديناميكي */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{ top: star.top, left: star.left }}
          onClick={handleStarClick} // إضافة دالة النقر هنا
        />
      ))}
    </div>
  );
}

export default MinimalistStarChart;
