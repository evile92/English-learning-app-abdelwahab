import React from 'react';
import { FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LevelPrompt() {
    const { userLevel, authStatus, tempUserLevel } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const nonPromptPaths = ['/welcome', '/test', '/nameEntry', '/', '/dashboard'];
    
    if (
        authStatus === 'loading' ||
        userLevel ||
        tempUserLevel ||
        nonPromptPaths.includes(location.pathname)
    ) {
        return null;
    }

    return (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 md:left-auto md:right-8 md:transform-none z-50">
            <div className="animate-fade-in">
                <button
                    onClick={() => navigate('/test')}
                    className="group bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 max-w-sm"
                >
                    <div className="flex items-center gap-2 flex-1">
                        <div className="bg-white/20 p-2 rounded-full">
                            <FileText size={18} className="transition-transform group-hover:scale-110" />
                        </div>
                        
                        <div className="text-right flex-1">
                            <div className="font-semibold text-sm leading-none">حدد مستواك</div>
                            <div className="text-xs opacity-90 mt-1">اختبار سريع</div>
                        </div>
                        
                        <div className="bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                            <span className="text-sm font-medium whitespace-nowrap">ابدأ</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
