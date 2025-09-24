// src/components/MaintenanceScreen.js

import React from 'react';
import { Wrench } from 'lucide-react';

const MaintenanceScreen = () => {
    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-center p-4 z-50">
            <div>
                <Wrench className="mx-auto text-sky-500 mb-4" size={64} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">الموقع تحت الصيانة</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                    نحن نقوم ببعض التحسينات وسنعود قريباً. شكراً لصبركم!
                </p>
            </div>
        </div>
    );
};

export default MaintenanceScreen;
