// src/components/modals/AnnouncementModal.js

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Megaphone, X } from 'lucide-react';

const AnnouncementModal = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                // جلب آخر إعلان فقط
                const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const latestAnnouncement = querySnapshot.docs[0].data();
                    const announcementId = querySnapshot.docs[0].id;

                    // التحقق مما إذا كان المستخدم قد رأى هذا الإعلان من قبل
                    const seenId = localStorage.getItem('seenAnnouncementId');
                    if (seenId !== announcementId) {
                        setAnnouncement(latestAnnouncement);
                        setIsVisible(true);
                        // حفظ معرف الإعلان الذي تمت رؤيته
                        localStorage.setItem('seenAnnouncementId', announcementId);
                    }
                }
            } catch (error) {
                console.error("Error fetching announcement: ", error);
            }
        };

        // تأخير ظهور النافذة قليلاً لتحسين تجربة المستخدم
        const timer = setTimeout(() => {
            fetchAnnouncement();
        }, 3000); // تظهر بعد 3 ثوانٍ من تحميل الصفحة

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible || !announcement) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center border border-sky-500/50">
                <Megaphone className="mx-auto text-sky-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{announcement.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6 whitespace-pre-wrap">
                    {announcement.message}
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all"
                >
                    فهمت
                </button>
            </div>
        </div>
    );
};

export default AnnouncementModal;
