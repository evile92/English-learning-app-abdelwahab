// src/components/Certificate.js
import React, { useRef, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = ({ levelId, userName, onDownload, initialLevels, userStats = {} }) => {
    const certificateRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    
    // معلومات الشهادة
    const certificateData = {
        certificateId: `SS-${levelId.toUpperCase()}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        issueDate: new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        }),
        issueDateEn: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        completionScore: userStats.averageScore || 85,
        totalLessons: userStats.completedLessons || 25,
        studyHours: Math.round((userStats.totalTime || 3600) / 3600) // بالساعات
    };

    const level = initialLevels[levelId] || { name: "المستوى المتقدم" };

    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            const element = certificateRef.current;
            const canvas = await html2canvas(element, { 
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: 1200,
                height: 900,
                scrollX: 0,
                scrollY: 0
            });
            
            const data = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('landscape', 'pt', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`StellarSpeak-Certificate-${userName}-Level-${levelId}.pdf`);
        } catch (error) {
            console.error('خطأ في تحميل PDF:', error);
            alert('حدث خطأ في تحميل الشهادة. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `🎓 حصلت على شهادة من StellarSpeak!`,
                    text: `أكملت مستوى ${level.name} في تعلم اللغة الإنجليزية بنتيجة ${certificateData.completionScore}%`,
                    url: window.location.origin
                });
            } catch (err) {
                console.log('تم إلغاء المشاركة');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            
            {/* الشهادة */}
            <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div 
                    ref={certificateRef} 
                    className="certificate-container certificate-border bg-white w-full aspect-[4/3] min-h-[600px] certificate-padding shadow-2xl"
                    style={{ 
                        minWidth: '800px',
                        fontSize: '16px',
                        lineHeight: '1.5'
                    }}
                >
                    
                    {/* Header الشهادة */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <img 
                                src="/logo192.webp" 
                                alt="StellarSpeak" 
                                className="w-16 h-16 rounded-full shadow-lg border-4 border-gray-200"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div 
                                className="hidden w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-bold text-xl shadow-lg"
                            >
                                S
                            </div>
                            <div className="text-left">
                                <h1 className="certificate-text-4xl font-bold text-slate-800 leading-tight">
                                    StellarSpeak
                                </h1>
                                <p className="certificate-text-xl text-slate-600 mt-1">
                                    English Learning Academy
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* العنوان الرئيسي */}
                    <div className="text-center mb-10">
                        <h2 className="certificate-text-3xl font-bold text-slate-700 mb-2 uppercase tracking-wider">
                            Certificate of Completion
                        </h2>
                        <p className="certificate-text-2xl text-slate-600">
                            شهادة إتمام البرنامج التعليمي
                        </p>
                        <div className="w-32 h-1 bg-slate-400 mx-auto mt-4 rounded"></div>
                    </div>

                    {/* معلومات المتعلم */}
                    <div className="text-center mb-10">
                        <p className="certificate-text-2xl text-slate-700 mb-6">
                            This certifies that
                        </p>
                        
                        <div className="bg-slate-50 border-2 border-slate-300 rounded-lg py-4 px-8 mx-auto max-w-lg mb-6">
                            <h3 className="certificate-text-4xl font-bold text-slate-800 break-words">
                                {userName || 'المتعلم المتميز'}
                            </h3>
                        </div>
                        
                        <p className="certificate-text-2xl text-slate-700 mb-4">
                            has successfully completed
                        </p>
                        <p className="certificate-text-3xl font-bold text-slate-800">
                            مستوى {level.name} - Level {levelId.toUpperCase()}
                        </p>
                        <p className="certificate-text-xl text-slate-600 mt-3">
                            in English Language Learning Program
                        </p>
                    </div>

                    {/* إحصائيات الإنجاز */}
                    <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                        <div className="text-center bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="certificate-text-3xl font-bold text-green-600 mb-2">
                                {certificateData.completionScore}%
                            </div>
                            <p className="text-sm text-slate-600 font-semibold">نسبة النجاح</p>
                        </div>
                        
                        <div className="text-center bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="certificate-text-3xl font-bold text-blue-600 mb-2">
                                {certificateData.totalLessons}
                            </div>
                            <p className="text-sm text-slate-600 font-semibold">درس مكتمل</p>
                        </div>
                        
                        <div className="text-center bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="certificate-text-3xl font-bold text-purple-600 mb-2">
                                {certificateData.studyHours}h
                            </div>
                            <p className="text-sm text-slate-600 font-semibold">ساعة دراسة</p>
                        </div>
                    </div>

                    {/* Footer الرسمي */}
                    <div className="grid grid-cols-3 gap-8 items-end">
                        
                        {/* معلومات الشهادة */}
                        <div className="text-left">
                            <div className="border-b-2 border-slate-400 pb-2 mb-2">
                                <p className="text-lg font-bold text-slate-800">
                                    {certificateData.issueDateEn}
                                </p>
                            </div>
                            <p className="text-sm text-slate-600 font-semibold">Issue Date</p>
                            
                            <div className="mt-4">
                                <p className="text-xs text-slate-500">
                                    Certificate ID: {certificateData.certificateId}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Verify at: stellarspeak.online/verify
                                </p>
                            </div>
                        </div>

                        {/* الختم الرسمي */}
                        <div className="text-center">
                            <div className="certificate-seal w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg mb-2">
                                <div className="text-white font-bold text-center text-xs leading-tight">
                                    OFFICIAL<br/>SEAL
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 font-semibold">الختم الرسمي</p>
                        </div>

                        {/* التوقيع */}
                        <div className="text-right">
                            <div className="border-b-2 border-slate-400 pb-2 mb-2">
                                <p className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                                    StellarSpeak Team
                                </p>
                            </div>
                            <p className="text-sm text-slate-600 font-semibold">Authorized Signature</p>
                            
                            <div className="mt-4">
                                <p className="text-xs text-slate-500">
                                    Certified by StellarSpeak Academy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* أزرار العمل */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={handleShare}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    title="مشاركة الشهادة"
                >
                    <Share2 size={20} />
                </button>
                <button 
                    onClick={onDownload} 
                    className="bg-slate-600 text-white p-3 rounded-full hover:bg-slate-700 transition-colors shadow-lg"
                    title="إغلاق"
                >
                    <X size={20} />
                </button>
            </div>

            {/* زر التحميل */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button 
                    onClick={handleDownloadPdf} 
                    disabled={isLoading}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-xl flex items-center gap-3 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                        <Download size={20} />
                    )}
                    {isLoading ? 'جاري التحميل...' : 'تحميل الشهادة'}
                </button>
            </div>
        </div>
    );
};

export default Certificate;
