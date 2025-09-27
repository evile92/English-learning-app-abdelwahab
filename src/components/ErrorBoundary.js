// src/components/ErrorBoundary.js

import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 🆕 إرسال مباشر لـ Firebase
  sendReactErrorToFirebase = async (error, errorInfo) => {
    try {
        const errorData = {
            message: `خطأ React: ${error.message || error.toString()}`,
            code: 'RENDER_ERROR',
            severity: 'critical',
            context: 'React ErrorBoundary',
            userId: localStorage.getItem('currentUserId') || 'anonymous',
            userName: localStorage.getItem('stellarSpeakTempName') || 'غير معروف',
            userLevel: localStorage.getItem('stellarSpeakTempLevel') || 'unknown',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            stack: error.stack || 'غير متوفر',
            componentStack: errorInfo?.componentStack || 'غير متوفر',
            errorBoundary: true,
            reportedAt: serverTimestamp(),
            resolved: false
        };
        
        await addDoc(collection(db, 'error_reports'), errorData);
        console.log('✅ تم إرسال خطأ React لـ Firebase');
        
    } catch (e) {
        console.error('❌ فشل إرسال خطأ React لـ Firebase:', e);
    }
  };

  componentDidCatch(error, errorInfo) {
    console.error('خطأ تم التقاطه في ErrorBoundary:', error, errorInfo);
    
    // 🆕 إرسال مباشر
    this.sendReactErrorToFirebase(error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });
  }

  handleGoHome = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    if (this.props.onGoHome) {
      this.props.onGoHome();
    }
  }

  render() {
    if (this.state.hasError) {
      const isDarkMode = this.props.isDarkMode || true;
      
      return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
          isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-gray-800'
        }`}>
          <div className={`max-w-lg w-full text-center p-8 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            
            <h2 className="text-2xl font-bold mb-4">
              {this.props.title || 'حدث خطأ غير متوقع'}
            </h2>
            
            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {this.props.message || 'نعتذر، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.'}
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              
              {this.props.showHomeButton && (
                <button
                  onClick={this.handleGoHome}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-red-500 mb-2">
                  تفاصيل الخطأ (وضع التطوير)
                </summary>
                <pre className="text-xs bg-red-50 text-red-800 p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
