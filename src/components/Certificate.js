// src/components/Certificate.js
import React, { useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = ({ levelId, userName, onDownload, initialLevels, userStats = {} }) => {
    const certificateRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const certificateData = {
        certificateId: `SS-${levelId.toUpperCase()}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        issueDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        completionScore: userStats.averageScore || 85,
    };

    const level = initialLevels[levelId] || { name: "Advanced Level" };

    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            const element = certificateRef.current;
            const canvas = await html2canvas(element, { 
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const data = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF(isMobile ? 'portrait' : 'landscape', 'pt', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`StellarSpeak-Certificate-${userName}-${levelId}.pdf`);
        } catch (error) {
            console.error('PDF error:', error);
            alert('خطأ في تحميل الشهادة. حاول مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-auto">
            
            {/* الشهادة */}
            <div className={`relative ${isMobile ? 'cert-mobile-portrait' : 'cert-desktop-landscape'}`}>
                <div 
                    ref={certificateRef} 
                    className="certificate-classic certificate-border-gold certificate-decorative-corners w-full h-full p-8 md:p-12 relative"
                >
                    
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <img 
                                src="/logo192.webp" 
                                alt="StellarSpeak" 
                                className="w-12 h-12 md:w-16 md:h-16"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                }}
                            />
                            <div 
                                className="hidden w-12 h-12 md:w-16 md:h-16 bg-slate-700 text-white font-bold text-lg md:text-2xl rounded-full items-center justify-center"
                            >
                                S
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
                            StellarSpeak
                        </h1>
                        <p className="text-sm md:text-lg text-slate-600">
                            [translate:English Learning Academy]
                        </p>
                    </div>

                    {/* العنوان الرئيسي */}
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-wide">
                            [translate:CERTIFICATE]
                        </h2>
                        <div className="w-24 h-0.5 bg-gold-500 mx-auto mb-4" style={{backgroundColor: '#d4af37'}}></div>
                        <h3 className="text-xl md:text-2xl font-semibold text-gold-600 uppercase tracking-widest" style={{color: '#d4af37'}}>
                            [translate:OF COMPLETION]
                        </h3>
                    </div>

                    {/* المحتوى الرئيسي */}
                    <div className="text-center mb-6 md:mb-10 flex-grow flex flex-col justify-center">
                        <p className="text-lg md:text-2xl text-slate-700 mb-4 md:mb-6">
                            [translate:This is to certify that]
                        </p>
                        
                        <div className="mb-4 md:mb-6">
                            <div className="inline-block border-b-3 border-slate-400 pb-2 px-4">
                                <h4 className="text-2xl md:text-4xl font-bold text-slate-800" style={{fontFamily: '"Brush Script MT", cursive'}}>
                                    {userName || 'Student Name'}
                                </h4>
                            </div>
                        </div>
                        
                        <p className="text-lg md:text-xl text-slate-700 mb-3">
                            [translate:has successfully completed the requirements for]
                        </p>
                        
                        <h5 className="text-xl md:text-3xl font-bold text-slate-800 mb-4">
                            {level.name} - [translate:Level] {levelId.toUpperCase()}
                        </h5>
                        
                        <div className="text-center bg-slate-50 rounded-lg p-3 md:p-4 mx-auto max-w-xs border border-slate-200">
                            <p className="text-lg md:text-xl font-bold text-slate-800">
                                {certificateData.completionScore}%
                            </p>
                            <p className="text-sm text-slate-600">
                                [translate:Completion Score]
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`flex ${isMobile ? 'flex-col gap-4 text-center' : 'justify-between items-end'} mt-auto`}>
                        
                        {/* التاريخ */}
                        <div className="text-center">
                            <div className="border-b-2 border-slate-400 pb-1 mb-2 min-w-[120px] mx-auto">
                                <p className="text-base md:text-lg font-semibold text-slate-800">
                                    {certificateData.issueDate}
                                </p>
                            </div>
                            <p className="text-xs md:text-sm text-slate-600 font-semibold">
                                [translate:Date Awarded]
                            </p>
                        </div>

                        {/* الختم */}
                        <div className="text-center">
                            <div 
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto flex items-center justify-center text-white shadow-lg mb-2"
                                style={{background: 'linear-gradient(135deg, #d4af37 0%, #f7d794 100%)', border: '3px solid #b8941f'}}
                            >
                                <div className="text-center">
                                    <div className="text-xs md:text-sm font-bold">OFFICIAL</div>
                                    <div className="text-xs font-bold">SEAL</div>
                                </div>
                            </div>
                        </div>

                        {/* التوقيع */}
                        <div className="text-center">
                            <div className="border-b-2 border-slate-400 pb-1 mb-2 min-w-[120px] mx-auto">
                                <p className="text-base md:text-lg font-semibold text-slate-800" style={{fontFamily: '"Brush Script MT", cursive'}}>
                                    Director
                                </p>
                            </div>
                            <p className="text-xs md:text-sm text-slate-600 font-semibold">
                                [translate:Authorized Signature]
                            </p>
                        </div>
                    </div>

                    {/* معلومات التحقق */}
                    <div className="absolute bottom-4 left-4 text-xs text-slate-500">
                        [translate:Certificate ID]: {certificateData.certificateId}
                    </div>
                </div>
            </div>

            {/* أزرار العمل */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={handleDownloadPdf} 
                    disabled={isLoading}
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
                    title="تحميل PDF"
                >
                    {isLoading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                        <Download size={20} />
                    )}
                </button>
                <button 
                    onClick={onDownload} 
                    className="bg-slate-600 text-white p-3 rounded-full hover:bg-slate-700 transition-colors shadow-lg"
                    title="إغلاق"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default Certificate;
