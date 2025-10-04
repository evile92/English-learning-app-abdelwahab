// src/firebase.js - نسخة آمنة ومحسنة

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ التحقق من متغيرات البيئة أولاً
const requiredEnvVars = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// ✅ فحص وجود جميع المتغيرات المطلوبة
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  const errorMsg = `🔥 Firebase Error: Missing environment variables: ${missingVars.join(', ')}`;
  console.error(errorMsg);
  console.error('💡 تأكد من وجود ملف .env مع جميع متغيرات Firebase');
  
  // في development: اظهر رسالة واضحة
  if (process.env.NODE_ENV === 'development') {
    alert('خطأ في تكوين Firebase: تحقق من ملف .env');
  }
  
  throw new Error(errorMsg);
}

// Firebase configuration
const firebaseConfig = requiredEnvVars;

// ✅ تهيئة آمنة لـ Firebase مع معالجة أخطاء
let app;
let auth;
let db;

try {
  console.log('🔥 جاري تهيئة Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('✅ تم تهيئة Firebase بنجاح');
} catch (error) {
  const errorMsg = `❌ فشل في تهيئة Firebase: ${error.message}`;
  console.error(errorMsg, error);
  
  // في development: اظهر رسالة مفصلة
  if (process.env.NODE_ENV === 'development') {
    alert(`خطأ Firebase: ${error.message}`);
  }
  
  throw new Error(errorMsg);
}

// ✅ تهيئة آمنة للخدمات
try {
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ تم تهيئة خدمات Firebase بنجاح');
} catch (error) {
  const errorMsg = `❌ فشل في تهيئة خدمات Firebase: ${error.message}`;
  console.error(errorMsg, error);
  throw new Error(errorMsg);
}

// ✅ دالة للتحقق من حالة Firebase
export const isFirebaseReady = () => {
  return !!(app && auth && db);
};

// ✅ دالة لمعالجة أخطاء Firebase الشائعة
export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  const errorMessages = {
    // Authentication errors
    'auth/user-not-found': 'المستخدم غير موجود',
    'auth/wrong-password': 'كلمة المرور غير صحيحة', 
    'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة',
    'auth/too-many-requests': 'تم تجاوز عدد المحاولات المسموحة',
    
    // Firestore errors  
    'permission-denied': 'ليس لديك صلاحية للوصول لهذه البيانات',
    'unavailable': 'الخدمة غير متاحة حالياً، يرجى المحاولة لاحقاً',
    'not-found': 'البيانات المطلوبة غير موجودة',
    
    // Network errors
    'network-request-failed': 'فشل في الاتصال، تحقق من الإنترنت'
  };
  
  return errorMessages[error.code] || `خطأ غير متوقع: ${error.message}`;
};

// ✅ دالة للتحقق من الاتصال
export const checkFirebaseConnection = async () => {
  try {
    if (!db) throw new Error('Firestore not initialized');
    
    // محاولة قراءة بسيطة للتحقق من الاتصال
    const { collection, getDocs, limit, query } = await import('firebase/firestore');
    const testQuery = query(collection(db, 'test'), limit(1));
    await getDocs(testQuery);
    
    return true;
  } catch (error) {
    console.warn('Firebase connection check failed:', error);
    return false;
  }
};

// ✅ التصدير الآمن
export { auth, db };

// معلومات إضافية للتطوير
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Status:', {
    app: !!app,
    auth: !!auth, 
    db: !!db,
    projectId: firebaseConfig.projectId
  });
}
