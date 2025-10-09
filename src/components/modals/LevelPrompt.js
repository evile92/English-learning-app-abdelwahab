import React from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LevelPrompt() {
    const { user, userLevel, authStatus, tempUserLevel } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // المسارات التي لا يجب أن يظهر فيها الزر
    const nonPromptPaths = ['/welcome', '/test', '/nameEntry', '/', '/dashboard'];
    
    // ✅ الحل الصحيح: إخفاء الزر فقط في المسارات المحددة والحالات الخاصة
    if (
        authStatus === 'loading' ||                    // أثناء تحميل Firebase
        userLevel ||                                   // المستخدم له مستوى محدد
        tempUserLevel ||                               // الزائر له مستوى مؤقت
        nonPromptPaths.includes(location.pathname)     // المسارات المستثناة (الصفحة الرئيسية، الترحيب، الاختبار)
    ) {
        return null;
    }

    // ✅ الآن الزر سيظهر فقط في الأقسام الأخرى للمستخدمين الذين لم يحددوا مستواهم
    return (
        <div className="fixed bottom-24 md:bottom-10 right-10 z-50 animate-fade-in">
            <button
                onClick={() => navigate('/test')}
                className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
                {/* تصميم أفقي */}
                <div className="flex items-center gap-4">
                    {/* النص والوصف */}
                    <div className="text-right">
                        <p className="font-semibold text-sm leading-tight">حدد مستواك للبدء!</p>
                        <p className="text-xs opacity-90">اختبار تحديد المستوى</p>
                    </div>
                    
                    {/* الأيقونة والزر */}
                    <div className="flex items-center justify-center gap-2 bg-white/20 rounded-lg py-2 px-3 group-hover:bg-white/30 transition-colors">
                        <FileText 
                            size={16} 
                            className="transition-transform group-hover:scale-110" 
                        />
                        <span className="text-sm font-medium whitespace-nowrap">ابدأ الآن</span>
                    </div>
                </div>
                
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </button>
        </div>
    );
}
