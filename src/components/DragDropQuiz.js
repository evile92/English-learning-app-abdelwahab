import React, { useState, useEffect } from 'react';
import { Check, RefreshCw, Sparkles } from 'lucide-react';

const DragDropQuiz = ({ quiz, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [droppedWords, setDroppedWords] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // ✅ حماية شاملة من الأخطاء
  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="p-4 md:p-8 animate-fade-in z-10 relative">
        <div className="max-w-2xl mx-auto text-center space-y-4 p-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
          <div className="text-6xl">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">لا توجد تمارين متاحة</h3>
          <p className="text-slate-600 dark:text-slate-300">عذراً، لم يتم إنشاء تمارين السحب والإفلات لهذا الدرس بعد.</p>
          <button 
            onClick={onComplete}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
          >
            متابعة إلى النتيجة
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz[currentIndex];

  // ✅ حماية من البيانات التالفة
  if (!currentQuestion || !currentQuestion.words || !Array.isArray(currentQuestion.words) || currentQuestion.words.length === 0) {
    return (
      <div className="p-4 md:p-8 animate-fade-in z-10 relative">
        <div className="max-w-2xl mx-auto text-center space-y-4 p-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
          <div className="text-6xl">🔧</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">بيانات التمرين غير صحيحة</h3>
          <p className="text-slate-600 dark:text-slate-300">التمرين {currentIndex + 1} يحتوي على بيانات غير مكتملة.</p>
          <div className="flex gap-4 justify-center">
            {currentIndex > 0 && (
              <button 
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
              >
                السابق
              </button>
            )}
            <button 
              onClick={() => {
                if (currentIndex < quiz.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                } else {
                  onComplete();
                }
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
            >
              {currentIndex < quiz.length - 1 ? 'التالي' : 'إنهاء'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // تحضير الكلمات والحالة الأولية
  useEffect(() => {
    if (!currentQuestion || !currentQuestion.words || !Array.isArray(currentQuestion.words)) {
      return;
    }

    try {
      const words = currentQuestion.words.map((word, index) => ({
        id: `word_${index}_${Date.now()}`, // ✅ ID أكثر فرادة
        text: String(word), // ✅ تأكد أنه string
        originalIndex: index
      }));
      
      // خلط الكلمات
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      
      // إنشاء مصفوفة فارغة للكلمات المُسقطة
      setDroppedWords(new Array(currentQuestion.words.length).fill(null));
      setIsCompleted(false);
      setShowResult(false);
      setDraggedItem(null);
      setIsCorrect(false);
    } catch (error) {
      console.error('خطأ في تحضير التمرين:', error);
    }
  }, [currentQuestion, currentIndex]);

  const handleDragStart = (e, item) => {
    if (!item) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    if (e.target) {
      e.target.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e) => {
    if (e.target) {
      e.target.style.opacity = '1';
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedItem || dropIndex < 0) return;

    try {
      const newDroppedWords = [...droppedWords];
      
      // إذا كان هناك كلمة في هذا المكان، أعدها للقائمة الأصلية
      if (newDroppedWords[dropIndex]) {
        setShuffledWords(prev => [...prev, newDroppedWords[dropIndex]]);
      }
      
      newDroppedWords[dropIndex] = draggedItem;
      setDroppedWords(newDroppedWords);
      
      // إزالة الكلمة من القائمة الأصلية
      setShuffledWords(prev => prev.filter(item => item.id !== draggedItem.id));
      setDraggedItem(null);

      // التحقق من الإنجاز
      if (newDroppedWords.every(item => item !== null)) {
        checkAnswer(newDroppedWords);
      }
    } catch (error) {
      console.error('خطأ في عملية الإفلات:', error);
    }
  };

  const handleDropToOriginal = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedItem) return;
    
    try {
      // إعادة الكلمة للقائمة الأصلية إذا تم سحبها من منطقة الإجابة
      const wasInDropZone = droppedWords.some(item => item && item.id === draggedItem.id);
      
      if (wasInDropZone) {
        const newDroppedWords = droppedWords.map(item => 
          item && item.id === draggedItem.id ? null : item
        );
        setDroppedWords(newDroppedWords);
        setShuffledWords(prev => [...prev, draggedItem]);
      }
      
      setDraggedItem(null);
    } catch (error) {
      console.error('خطأ في إعادة الكلمة:', error);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const checkAnswer = (finalAnswer) => {
    try {
      const correctOrder = currentQuestion.correctOrder || finalAnswer.map((_, i) => i);
      const userAnswer = finalAnswer.map(item => item ? item.originalIndex : -1);
      const correct = userAnswer.length === correctOrder.length && 
                     userAnswer.every((pos, index) => pos === correctOrder[index]);
      
      setIsCorrect(correct);
      setIsCompleted(true);
      setShowResult(true);
    } catch (error) {
      console.error('خطأ في التحقق من الإجابة:', error);
      setIsCorrect(false);
      setIsCompleted(true);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const resetCurrentQuestion = () => {
    if (!currentQuestion || !currentQuestion.words) return;
    
    try {
      const words = currentQuestion.words.map((word, index) => ({
        id: `word_${index}_${Date.now()}`,
        text: String(word),
        originalIndex: index
      }));
      
      setShuffledWords([...words].sort(() => Math.random() - 0.5));
      setDroppedWords(new Array(currentQuestion.words.length).fill(null));
      setIsCompleted(false);
      setShowResult(false);
      setDraggedItem(null);
      setIsCorrect(false);
    } catch (error) {
      console.error('خطأ في إعادة التعيين:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
        🎯 تمرين السحب والإفلات
      </h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
        التمرين {currentIndex + 1} من {quiz.length}
      </p>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* العنوان والرمز التعبيري */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentQuestion.question || 'رتب الكلمات لتكوين الجملة الصحيحة:'}
          </h3>
          {currentQuestion.emoji && (
            <div className="text-6xl animate-bounce">{currentQuestion.emoji}</div>
          )}
        </div>

        {/* منطقة الكلمات المتاحة */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold mb-4 text-center text-slate-700 dark:text-slate-300">
            اسحب الكلمات من هنا:
          </h4>
          <div 
            className="flex flex-wrap gap-3 justify-center min-h-[80px] p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl transition-all drag-zone"
            onDrop={handleDropToOriginal}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            {shuffledWords.map((item) => (
              <div
                key={item.id}
                draggable={!isCompleted}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={`
                  px-6 py-3 rounded-xl font-semibold cursor-move transform transition-all duration-200 select-none
                  ${isCompleted 
                    ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }
                  text-white
                `}
                style={{
                  opacity: draggedItem && draggedItem.id === item.id ? 0.5 : 1
                }}
              >
                {item.text}
              </div>
            ))}
            
            {shuffledWords.length === 0 && !isCompleted && (
              <div className="text-slate-500 dark:text-slate-400 italic py-4">
                تم استخدام جميع الكلمات ✨
              </div>
            )}
          </div>
        </div>

        {/* منطقة الإجابة */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center text-slate-700 dark:text-slate-300">
            رتب الكلمات هنا لتكوين الجملة الصحيحة:
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {droppedWords.map((item, index) => (
              <div
                key={`drop_${index}`}
                className={`
                  min-w-[100px] h-16 border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 drop-zone
                  ${item 
                    ? showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-100 dark:bg-green-900 shadow-green-200 shadow-lg' 
                        : 'border-red-500 bg-red-100 dark:bg-red-900 shadow-red-200 shadow-lg'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-slate-400 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:scale-105'
                  }
                `}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
              >
                {item ? (
                  <div
                    draggable={!isCompleted}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`
                      px-4 py-2 rounded-lg font-semibold cursor-move transform transition-all select-none
                      ${showResult
                        ? isCorrect 
                          ? 'bg-green-500 text-white animate-pulse' 
                          : 'bg-red-500 text-white animate-shake'
                        : isCompleted
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }
                    `}
                  >
                    {item.text}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm font-semibold select-none">
                    {index + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* النتيجة والأزرار */}
        {showResult && (
          <div className={`text-center space-y-4 p-6 rounded-2xl border-2 animate-fade-in ${
            isCorrect 
              ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
          }`}>
            <div className={`text-3xl font-bold ${
              isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isCorrect ? (
                <div className="animate-bounce">
                  🎉 ممتاز! الإجابة صحيحة
                </div>
              ) : (
                <div>
                  😅 حاول مرة أخرى
                </div>
              )}
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              {isCorrect ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  {currentIndex < quiz.length - 1 ? 'التمرين التالي' : 'إنهاء التمارين'}
                </button>
              ) : (
                <button
                  onClick={resetCurrentQuestion}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  إعادة المحاولة
                </button>
              )}
            </div>
          </div>
        )}

        {/* عرض الجملة الصحيحة عند الخطأ */}
        {showResult && !isCorrect && currentQuestion.words && (
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300 mb-2">الترتيب الصحيح:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {(currentQuestion.correctOrder || currentQuestion.words.map((_, i) => i)).map((orderIndex, position) => (
                <span 
                  key={position}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold"
                >
                  {currentQuestion.words[orderIndex]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* تعليمات */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <strong>تعليمات:</strong>
          </div>
          <p>اسحب الكلمات من المنطقة العلوية وأفلتها في المربعات السفلية لترتيب الجملة الصحيحة</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            يمكنك إعادة ترتيب الكلمات أو إرجاعها للأعلى في أي وقت
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragDropQuiz;
