// src/utils/errorHandler.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// أنواع الأخطاء
export class AppError extends Error {
    constructor(message, code, severity = 'medium') {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.severity = severity;
        this.timestamp = new Date().toISOString();
    }
}

// رموز الأخطاء
export const ErrorCodes = {
    FIREBASE_PERMISSION_DENIED: 'FIREBASE_PERMISSION_DENIED',
    FIREBASE_NETWORK_ERROR: 'FIREBASE_NETWORK_ERROR',
    FIREBASE_QUOTA_EXCEEDED: 'FIREBASE_QUOTA_EXCEEDED',
    API_TIMEOUT: 'API_TIMEOUT',
    API_RATE_LIMIT: 'API_RATE_LIMIT',
    API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
    API_SERVER_ERROR: 'API_SERVER_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RENDER_ERROR: 'RENDER_ERROR', // خطأ في عرض الواجهة
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// جلب معلومات المستخدم
const getCurrentUserInfo = () => {
    try {
        return {
            id: localStorage.getItem('currentUserId') || 'anonymous',
            level: localStorage.getItem('stellarSpeakTempLevel') || 'unknown',
            name: localStorage.getItem('stellarSpeakTempName') || 'غير معروف'
        };
    } catch (e) {
        return {
            id: 'anonymous',
            level: 'unknown',
            name: 'غير معروف'
        };
    }
};

// إرسال تقرير الخطأ
const sendErrorReport = async (errorLog) => {
    try {
        // إرسال جميع الأخطاء للFirebase
        await addDoc(collection(db, 'error_reports'), errorLog);
        console.log('✅ تم إرسال تقرير الخطأ المفصل إلى Firebase');

        // عرض الخطأ في Console للمطور
        console.group(`🚨 خطأ ${errorLog.severity}`);
        console.error('الرسالة:', errorLog.message);
        console.error('المكان:', errorLog.context);
        console.error('المستخدم:', errorLog.user?.id);
        console.error('التوقيت:', errorLog.timestamp);
        console.groupEnd();

    } catch (e) {
        console.error('فشل في إرسال تقرير الخطأ:', e);
    }
};

// معالج الأخطاء الرئيسي
export const errorHandler = {
    // معالجة عامة للأخطاء
    handle: async (error, context = 'Unknown', additionalInfo = {}) => {
        const userInfo = getCurrentUserInfo();
        
        // تم تحديث بنية التقرير هنا
        const errorLog = {
            message: error.message || 'خطأ غير محدد',
            context: context,
            severity: error.severity || 'medium',
            code: error.code || ErrorCodes.UNKNOWN_ERROR,
            timestamp: new Date().toISOString(),
            url: window.location.href,

            // معلومات المستخدم
            user: {
                id: userInfo.id,
                name: userInfo.name,
                level: userInfo.level,
            },

            // معلومات بيئة التشغيل
            environment: {
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language,
                isOnline: navigator.onLine,
                platform: navigator.platform,
            },

            // تفاصيل الخطأ التقنية
            errorDetails: {
                stack: error.stack || 'Not available',
                ...additionalInfo
            },
            
            // معلومات إدارية للتقرير
            reportStatus: {
                reportedAt: serverTimestamp(),
                isResolved: false,
            }
        };

        await sendErrorReport(errorLog);

        return {
            message: errorHandler.getUserFriendlyMessage(error),
            code: errorLog.code,
            severity: errorLog.severity
        };
    },

    // معالج أخطاء Firebase
    firebase: (error) => {
        const firebaseErrors = {
            'auth/user-not-found': {
                message: 'المستخدم غير موجود',
                code: ErrorCodes.FIREBASE_PERMISSION_DENIED,
                severity: 'medium'
            },
            'auth/wrong-password': {
                message: 'كلمة المرور غير صحيحة',
                code: ErrorCodes.FIREBASE_PERMISSION_DENIED,
                severity: 'low'
            },
            'permission-denied': {
                message: 'ليس لديك صلاحية لهذا الإجراء',
                code: ErrorCodes.FIREBASE_PERMISSION_DENIED,
                severity: 'high'
            },
            'quota-exceeded': {
                message: 'تم تجاوز الحد المسموح، حاول لاحقاً',
                code: ErrorCodes.FIREBASE_QUOTA_EXCEEDED,
                severity: 'critical'
            },
            'unavailable': {
                message: 'الخدمة غير متاحة مؤقتاً',
                code: ErrorCodes.FIREBASE_NETWORK_ERROR,
                severity: 'high'
            }
        };

        const errorInfo = firebaseErrors[error.code] || {
            message: 'خطأ في الخدمة',
            code: ErrorCodes.UNKNOWN_ERROR,
            severity: 'medium'
        };

        return new AppError(errorInfo.message, errorInfo.code, errorInfo.severity);
    },

    // رسائل واضحة للمستخدم
    getUserFriendlyMessage: (error) => {
        if (error instanceof AppError) {
            return error.message;
        }
        return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
    }
};

// دالة سريعة لتسجيل الأخطاء
export const logError = async (error, context, additionalInfo = {}) => {
    return await errorHandler.handle(error, context, additionalInfo);
};

// دالة خاصة لالتقاط أخطاء React
export const logReactError = async (error, errorInfo, componentName = 'Unknown Component') => {
    const reactError = new AppError(
        `خطأ في عرض المكون: ${error.message}`,
        ErrorCodes.RENDER_ERROR,
        'critical' // أخطاء React دائماً حرجة
    );

    return await logError(reactError, `React Component - ${componentName}`, {
        componentStack: errorInfo?.componentStack || 'Not available',
        stack: error.stack || 'Not available',
        errorBoundary: true
    });
};
