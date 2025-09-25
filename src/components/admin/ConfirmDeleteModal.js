// src/components/admin/ConfirmDeleteModal.js

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-lg font-bold">هل أنت متأكد؟</h3>
                <p className="text-sm text-slate-500 my-2">لا يمكنك التراجع عن هذا الإجراء.</p>
                <div className="flex justify-center gap-4 mt-6">
                    <button onClick={onCancel} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">إلغاء</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-500 text-white rounded-lg">نعم، احذف</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
