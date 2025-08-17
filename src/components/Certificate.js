import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import StellarSpeakLogo from './StellarSpeakLogo';

const Certificate = ({ levelId, userName, onDownload, initialLevels }) => {
    const certificateRef = useRef();

    const handleDownloadPdf = async () => {
        const element = certificateRef.current;
        const canvas = await html2canvas(element, { 
            scale: 3,
            useCORS: true,
            backgroundColor: '#F3F0E9'
        });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('landscape', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / canvasRatio;

        if (finalHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = finalHeight * canvasRatio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(data, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save(`StellarSpeak-Certificate-${userName || 'Student'}-${levelId}.pdf`);
    };

    const level = initialLevels[levelId] || { name: "المستوى المتقدم" };
    const currentDate = new Date().toLocaleDateString('en-GB');

    return (
        <div className="p-4 md:p-8 animate-fade-in flex flex-col items-center justify-center z-50 fixed inset-0 bg-slate-900/80 backdrop-blur-sm">
            
            <div 
                ref={certificateRef} 
                className="w-full max-w-5xl aspect-video bg-[#F3F0E9] text-[#3A3A3A] p-6 shadow-2xl relative font-[Georgia,serif] flex flex-col justify-between"
            >
                {/* Decorative Border */}
                <div className="absolute inset-2 border-2 border-[#C0A975]"></div>
                <div className="absolute inset-4 border border-dashed border-[#C0A975]"></div>
                
                {/* Watermark Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-5">
                    <StellarSpeakLogo />
                </div>

                {/* --- (بداية التعديل النهائي) --- */}
                <div className="flex justify-center items-center relative z-10">
                    <div className="w-16 h-16">
                        <StellarSpeakLogo />
                    </div>
                    <div className="text-center mx-4">
                        <h1 className="text-4xl font-bold text-slate-800">Stellar Speak</h1>
                        <p className="text-lg text-slate-500 whitespace-nowrap">English Learning Academy</p>
                    </div>
                    <div className="w-16 h-16">
                        <StellarSpeakLogo />
                    </div>
                </div>

                <div className="text-center relative z-10 my-auto">
                    <p className="text-2xl text-slate-600 tracking-[0.2em] uppercase">Certificate of Completion</p>
                    <p className="text-5xl font-bold text-[#0D2C54] my-4 px-4 truncate" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{userName || 'Valued Student'}</p>
                    <p className="text-xl text-slate-700">has successfully completed the requirements of</p>
                    <p className="text-3xl font-semibold text-slate-900 mt-2">"{level.name}" - (Level {levelId})</p>
                </div>

                <div className="flex justify-between items-center relative z-10 pt-4">
                    <div className="text-center w-1/3">
                        <p className="text-lg font-semibold border-b-2 border-slate-400 pb-1 mx-auto max-w-[150px]">{currentDate}</p>
                        <p className="text-sm mt-1 text-slate-600">Date of Issue</p>
                    </div>
                    <div className="text-center w-1/3">
                        <div className="w-20 h-20 rounded-full bg-[#C0A975] mx-auto flex items-center justify-center text-white text-xs font-bold text-center p-2">
                           Official Seal
                        </div>
                    </div>
                    <div className="text-center w-1/3">
                        <p className="text-2xl font-semibold border-b-2 border-slate-400 pb-1 mx-auto max-w-[150px] whitespace-nowrap" style={{ fontFamily: "'Brush Script MT', cursive" }}>Stellar Speak</p>
                        <p className="text-sm mt-1 text-slate-600 whitespace-nowrap">Official Signature</p>
                    </div>
                </div>
                {/* --- (نهاية التعديل النهائي) --- */}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6 z-20">
                <button onClick={handleDownloadPdf} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                    <Download size={20} /> تحميل PDF
                </button>
                <button onClick={onDownload} className="bg-slate-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    العودة للمجرة
                </button>
            </div>
        </div>
    );
};

export default Certificate;
