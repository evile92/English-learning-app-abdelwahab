// src/components/admin/AppSettings.js

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Wrench, LoaderCircle } from 'lucide-react';

const AppSettings = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const settingsRef = doc(db, 'app_config', 'settings');
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                setIsMaintenanceMode(docSnap.data().isMaintenanceMode);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleToggle = async () => {
        const newStatus = !isMaintenanceMode;
        setIsMaintenanceMode(newStatus);
        const settingsRef = doc(db, 'app_config', 'settings');
        await setDoc(settingsRef, { isMaintenanceMode: newStatus }, { merge: true });
    };

    if (loading) {
        return <LoaderCircle className="animate-spin" />;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Wrench /> App Settings</h2>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">Maintenance Mode</h3>
                        <p className="text-sm text-slate-500">When enabled, only admins can access the site.</p>
                    </div>
                    <button
                        onClick={handleToggle}
                        className={`w-14 h-8 rounded-full flex items-center transition-colors p-1 ${isMaintenanceMode ? 'bg-green-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'}`}
                    >
                        <span className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppSettings;
