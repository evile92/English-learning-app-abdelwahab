import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import StellarSpeakLogo from './StellarSpeakLogo';

const Certificate = ({ levelId, userName, onDownload, initialLevels }) => {
    const certificateRef = useRef();

    const handleDownloadPdf = async () => {
        const element = certificateRef.current;
        // Increase scale for better resolution
        const canvas = await html2canvas(element, { scale: 3 });
        const data = canvas.toDataURL('image/png');

        // A4 page size in landscape, units in 'pt'
        const pdf = new jsPDF('landscape', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate the ratio to fit the image on the PDF page
        const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
        const imgWidth = canvasWidth * ratio;
        const imgHeight = canvasHeight * ratio;

        // Center the image on the PDF page
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        
        pdf.addImage(data, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`StellarSpeak-Certificate-${userName || 'Student'}-${levelId}.pdf`);
    };

    const level = initialLevels[levelId] || { name: "المستوى المتقدم" };
    const currentDate = new Date().toLocaleDateString('ar-EG-u-nu-latn', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="p-4 md:p-8 animate-fade-in text-center flex flex-col items-center justify-center z-50 fixed inset-0 bg-slate-900/80 backdrop-blur-sm">
            
            {/* Certificate Component */}
            <div ref={certificateRef} className="w-full max-w-4xl bg-white text-black p-8 shadow-2xl relative font-serif transform scale-90 md:scale-100">
                {/* Border */}
                <div className="border-4 border-solid border-slate-800 p-6">
                    {/* Watermark Logo */}
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-64 h-64 opacity-10">
                           <StellarSpeakLogo />
                        </div>
                    </div>
                    
                    <div className="text-center mb-8 relative z-10">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <div className="w-16 h-16">
                                <StellarSpeakLogo />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">Stellar Speak</h1>
                                <p className="text-lg text-slate-500">English Learning Academy</p>
                            </div>
                        </div>
                        <p className="text-3xl font-semibold text-amber-600 mt-6">شهادة إتمام</p>
                        <p className="text-xl text-slate-600">Certificate of Completion</p>
                    </div>

                    <div className="my-10 relative z-10">
                        <p className="text-xl text-slate-700 mb-2">This is to certify that</p>
                        <p className="text-5xl font-bold text-slate-900 tracking-wider my-4">{userName || 'Valued Student'}</p>
                        <p className="text-xl text-slate-700 mt-2">has successfully completed the requirements of</p>
                        <p className="text-3xl font-semibold text-slate-800 mt-2">"{level.name}" - (Level {levelId})</p>
                    </div>

                    <div className="flex justify-between items-end mt-16 pt-4 border-t-2 border-slate-300 relative z-10">
                        <div className="text-center">
                            <p className="text-lg font-semibold border-b-2 border-slate-400 pb-1 px-8">{currentDate}</p>
                            <p className="text-sm mt-1 text-slate-600">Date of Issue</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold border-b-2 border-slate-400 pb-1 px-8" style={{ fontFamily: "'Brush Script MT', cursive" }}>Stellar Speak</p>
                            <p className="text-sm mt-1 text-slate-600">Official Signature</p>
                        </div>
                    </div>
                </div>
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
