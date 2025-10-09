import React from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LevelPrompt() {
    const { userLevel } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const nonPromptPaths = ['/welcome', '/test', '/nameEntry'];
    if (userLevel || nonPromptPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <div className="fixed bottom-24 md:bottom-10 right-10 z-50 animate-fade-in">
            {/* زر مدمج مضغوط */}
            <button
                onClick={() => navigate('/test')}
                className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg max-w-xs hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
                {/* المحتوى المدمج */}
                <div className="text-center">
                    <p className="font-semibold text-sm mb-1">حدد مستواك للبدء!</p>
                    <p className="text-xs opacity-90 mb-3">اختبار تحديد المستوى</p>
                    
                    <div className="flex items-center justify-center gap-2 bg-white/20 rounded-lg py-2 px-3 group-hover:bg-white/30 transition-colors">
                        <FileText 
                            size={16} 
                            className="transition-transform group-hover:scale-110" 
                        />
                        <span className="text-sm font-medium">ابدأ الاختبار</span>
                    </div>
                </div>
                
                {/* تأثير الإضاءة */}
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </button>
        </div>
    );
}
