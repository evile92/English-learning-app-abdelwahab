// src/components/Certificate.js
import React, { useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = ({ levelId, userName, onDownload, initialLevels, userStats = {} }) => {
    const certificateRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    
    const certificateData = {
        certificateId: `SS-${levelId.toUpperCase()}-${Date.now().toString().slice(-6)}`,
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
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const data = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`StellarSpeak-Certificate-${userName}-${levelId}.pdf`);
        } catch (error) {
            alert('خطأ في تحميل الشهادة');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            
            <div className="relative max-w-4xl w-full">
                <div 
                    ref={certificateRef} 
                    className="bg-white w-full h-[600px] p-12 relative border-8 border-yellow-600 shadow-2xl"
                    style={{
                        fontFamily: '"Times New Roman", serif',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                    }}
                >
                    
                    {/* زخارف الزوايا */}
                    <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-yellow-600"></div>
                    <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-yellow-600"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-yellow-600"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-yellow-600"></div>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">StellarSpeak</h1>
                        <p className="text-lg text-slate-600">English Learning Academy</p>
                    </div>

                    {/* العنوان */}
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-bold text-slate-800 mb-2 tracking-widest">CERTIFICATE</h2>
                        <div className="w-32 h-1 bg-yellow-600 mx-auto mb-2"></div>
                        <h3 className="text-2xl font-semibold text-yellow-600 uppercase tracking-wider">OF COMPLETION</h3>
                    </div>

                    {/* المحتوى */}
                    <div className="text-center mb-8">
                        <p className="text-xl text-slate-700 mb-6">This certifies that</p>
                        
                        <div className="mb-6">
                            <h4 className="text-4xl font-bold text-slate-800 border-b-2 border-slate-400 pb-2 inline-block px-8">
                                {userName || 'Student Name'}
                            </h4>
                        </div>
                        
                        <p className="text-lg text-slate-700 mb-4">has successfully completed</p>
                        <h5 className="text-3xl font-bold text-slate-800">{level.name} - Level {levelId.toUpperCase()}</h5>
                        
                        <div className="mt-6 inline-block bg-slate-100 rounded-lg p-4 border border-slate-300">
                            <p className="text-2xl font-bold text-slate-800">{certificateData.completionScore}%</p>
                            <p className="text-sm text-slate-600">Completion Score</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center">
                        
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800 border-b-2 border-slate-400 pb-1 mb-1">
                                {certificateData.issueDate}
                            </p>
                            <p className="text-sm text-slate-600">Date Awarded</p>
                        </div>
                        
                        <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center text-white shadow-lg">
                            <div className="text-center text-xs font-bold">
                                <div>OFFICIAL</div>
                                <div>SEAL</div>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800 border-b-2 border-slate-400 pb-1 mb-1" style={{fontFamily: 'cursive'}}>
                                Director
                            </p>
                            <p className="text-sm text-slate-600">Authorized Signature</p>
                        </div>
                    </div>

                    {/* معرف الشهادة */}
                    <div className="absolute bottom-4 left-4">
                        <p className="text-xs text-slate-500">Certificate ID: {certificateData.certificateId}</p>
                    </div>
                </div>
            </div>

            {/* أزرار */}
            <button 
                onClick={handleDownloadPdf} 
                disabled={isLoading}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
                {isLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                    <Download size={20} />
                )}
                {isLoading ? 'جاري التحميل...' : 'تحميل الشهادة'}
            </button>

            <button 
                onClick={onDownload} 
                className="absolute top-4 right-4 bg-slate-600 text-white p-3 rounded-full hover:bg-slate-700 transition-colors shadow-lg"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default Certificate;
