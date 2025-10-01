// src/services/PWANotificationService.js

class PWANotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  // طلب إذن الإشعارات
  async requestPermission() {
    if (!this.isSupported) return false;

    if (this.permission === 'granted') return true;

    const result = await Notification.requestPermission();
    this.permission = result;
    return result === 'granted';
  }

  // إشعار بسيط
  showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') return;

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'stellarspeak',
      renotify: true,
      requireInteraction: false,
      ...options
    };

    return new Notification(title, defaultOptions);
  }

  // إشعار تذكير الدراسة
  scheduleStudyReminder(timeInMs = 24 * 60 * 60 * 1000) { // 24 ساعة افتراضياً
    setTimeout(() => {
      this.showNotification('وقت الدراسة! 📚', {
        body: 'هيا لنكمل رحلتك التعليمية اليوم',
        actions: [
          { action: 'study', title: '📖 ابدأ الدراسة' },
          { action: 'later', title: '⏰ ذكرني لاحقاً' }
        ]
      });
    }, timeInMs);
  }

  // إشعار الإنجاز
  celebrateAchievement(achievementTitle) {
    this.showNotification('إنجاز جديد! 🎉', {
      body: `تهانينا! لقد حققت: ${achievementTitle}`,
      tag: 'achievement',
      requireInteraction: true
    });

    // اهتزاز إذا مدعوم
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 300]);
    }
  }

  // إشعار انتهاء الدرس
  lessonCompleted(lessonTitle, score) {
    const emoji = score >= 80 ? '🌟' : score >= 60 ? '👏' : '💪';
    this.showNotification(`درس مكتمل ${emoji}`, {
      body: `أنهيت "${lessonTitle}" بنتيجة ${score}%`,
      tag: 'lesson-complete'
    });
  }

  // إشعار تذكير المراجعة
  reviewReminder(wordsCount) {
    this.showNotification('وقت المراجعة! 🔄', {
      body: `لديك ${wordsCount} كلمة تحتاج مراجعة اليوم`,
      actions: [
        { action: 'review', title: '📝 ابدأ المراجعة' },
        { action: 'snooze', title: '⏰ أجل ساعة' }
      ]
    });
  }
}

export default new PWANotificationService();
