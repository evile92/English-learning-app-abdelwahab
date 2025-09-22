// src/components/ReadingCenter.js (الإصدار المبسط)

import React, { useState } from 'react';
import MaterialCard from './reading/MaterialCard';
import MaterialReader from './reading/MaterialReader';
import GenerationButtons from './reading/GenerationButtons';
import { useMaterialGeneration } from '../hooks/useMaterialGeneration';
import { initialReadingMaterials } from '../data/lessons';

const ReadingCenter = () => {
    const [materials, setMaterials] = useState(initialReadingMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    
    const { isGenerating, error, generationType, handleGenerate } = useMaterialGeneration();

    if (selectedMaterial) {
        return (
            <MaterialReader
                material={selectedMaterial}
                onBack={() => setSelectedMaterial(null)}
            />
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        📖 مركز القراءة والتأمل
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300">
                        اقرأ محتوى متنوعًا، أو قم بتوليد محتوى جديد بنفسك.
                    </p>
                </div>
                
                <GenerationButtons
                    onGenerate={(type) => handleGenerate(type, setMaterials, setSelectedMaterial)}
                    isGenerating={isGenerating}
                    generationType={generationType}
                />
            </div>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(material => (
                    <MaterialCard
                        key={material.id}
                        material={material}
                        onClick={setSelectedMaterial}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReadingCenter;
