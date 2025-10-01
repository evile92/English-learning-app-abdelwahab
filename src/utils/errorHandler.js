// src/utils/errorHandler.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export class AppError extends Error {
    constructor(message, code, severity = 'medium', context = {}) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.severity = severity;
        this.context = context; // ✅ إضافة السياق
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
    RENDER_ERROR: 'RENDER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// ✅ جلب معلومات أكثر عن المستخدم
const getCurrentUserInfo = () => {
    try {
        // الأولوية لبيانات المستخدم المسجل
        const loggedInUserName = localStorage.getItem('currentUserName');
        const loggedInUserLevel = localStorage.getItem('currentUserLevel');
        const loggedInUserEmail = localStorage.getItem('currentUserEmail');

        return {
            id: localStorage.getItem('currentUserId') || 'anonymous',
            name: loggedInUserName || localStorage.getItem('stellarSpeakTempName') || 'غير معروف',
            email: loggedInUserEmail || 'no-email',
            level: loggedInUserLevel || localStorage.getItem('stellarSpeakTempLevel') || 'unknown',
            isGuest: !localStorage.getItem('currentUserId')
        };
    } catch (e) {
        return {
            id: 'anonymous',
            name: 'غير معروف',
            email: 'no-email',
            level: 'unknown',
            isGuest: true
        };
    }
};

// إرسال تقرير الخطأ
const sendErrorReport = async (errorLog) => {
    try {
        await addDoc(collection(db, 'error_reports'), errorLog);
        console.log('✅ تم إرسال تقرير الخطأ المفصل إلى Firebase');

        // عرض الخطأ في Console للمطور
        console.group(`🚨 ${errorLog.severity.toUpperCase()} ERROR`);
        console.error('الرسالة:', errorLog.message);
        console.error('المكان:', errorLog.context);
        console.error('المستخدم:', errorLog.user.name, `(${errorLog.user.id})`);
        console.error('المكون:', errorLog.errorDetails.componentName);
        console.error('الإجراء:', errorLog.errorDetails.action);
        console.error('التوقيت:', errorLog.timestamp);
        if (errorLog.errorDetails.stack) {
            console.error('Stack Trace:', errorLog.errorDetails.stack);
        }
        console.groupEnd();

    } catch (e) {
        console.error('فشل في إرسال تقرير الخطأ:', e);
    }
};

// معالج الأخطاء الرئيسي
export const errorHandler = {
    handle: async (error, context = 'Unknown', additionalInfo = {}) => {
        const userInfo = getCurrentUserInfo();
        
        // ✅ بنية محسّنة للتقرير
        const errorLog = {
            message: error.message || 'خطأ غير محدد',
            code: error.code || ErrorCodes.UNKNOWN_ERROR,
            severity: error.severity || 'medium',
            context: context,
            
            user: {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                level: userInfo.level,
                isGuest: userInfo.isGuest,
            },

            environment: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language,
                isOnline: navigator.onLine,
                platform: navigator.platform,
            },

            errorDetails: {
                stack: error.stack || 'Not available',
                errorType: error.name || 'Error',
                ...additionalInfo,
            },
            
            timestamp: new Date().toISOString(),
            reportStatus: {
                reportedAt: serverTimestamp(),
                isResolved: false
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
            'auth/user-not-found': { message: 'المستخدم غير موجود', code: ErrorCodes.FIREBASE_PERMISSION_DENIED, severity: 'medium' },
            'auth/wrong-password': { message: 'كلمة المرور غير صحيحة', code: ErrorCodes.FIREBASE_PERMISSION_DENIED, severity: 'low' },
            'permission-denied': { message: 'ليس لديك صلاحية لهذا الإجراء', code: ErrorCodes.FIREBASE_PERMISSION_DENIED, severity: 'high' },
            'quota-exceeded': { message: 'تم تجاوز الحد المسموح، حاول لاحقاً', code: ErrorCodes.FIREBASE_QUOTA_EXCEEDED, severity: 'critical' },
            'unavailable': { message: 'الخدمة غير متاحة مؤقتاً', code: ErrorCodes.FIREBASE_NETWORK_ERROR, severity: 'high' }
        };

        const errorInfo = firebaseErrors[error.code] || { message: 'خطأ في الخدمة', code: ErrorCodes.UNKNOWN_ERROR, severity: 'medium' };

        const appError = new AppError(errorInfo.message, errorInfo.code, errorInfo.severity);
        appError.stack = error.stack; // ✅ نسخ الـ stack من خطأ Firebase
        return appError;
    },

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

// ✅ دالة محسّنة لالتقاط أخطاء React
export const logReactError = async (error, errorInfo, componentName = 'Unknown Component') => {
    const reactError = new AppError(
        `خطأ في عرض المكون: ${error.message}`,
        ErrorCodes.RENDER_ERROR,
        'critical'
    );

    return await logError(reactError, `React Component - ${componentName}`, {
        componentStack: errorInfo?.componentStack || 'Not available',
        stack: error.stack || 'Not available',
        errorBoundary: true,
        componentName: componentName,
        action: 'Rendering'
    });
};
