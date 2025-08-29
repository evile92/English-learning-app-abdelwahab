// src/components/ListeningCenter.js

import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Music, BookOpen, PlayCircle, PauseCircle, ArrowLeft } from 'lucide-react';
import { listeningMaterials } from '../data/listeningData';
import { useAppContext } from '../context/AppContext';

const ListeningCenter = () => {
    const { handlePageChange } = useAppContext();
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
    const audioRef = useRef(null);

    // هذا التأثير لمراقبة تحديثات الوقت في الملف الصوتي
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const onEnded = () => {
            setIsPlaying(false);
            setActiveLyricIndex(-1);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', onEnded);
        };
    }, [selectedTrack]);

    // هذا التأثير لتحديد أي سطر من الكلمات يجب تظليله
    useEffect(() => {
        if (!selectedTrack || !isPlaying) return;
        
        const currentLyric = selectedTrack.lyrics.findIndex((lyric, index) => {
            const nextLyric = selectedTrack.lyrics[index + 1];
            return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
        });
        
        setActiveLyricIndex(currentLyric);
    }, [currentTime, selectedTrack, isPlaying]);

    // دالة لتشغيل وإيقاف الصوت
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    // دالة لاختيار أغنية من القائمة
    const handleSelectTrack = (track) => {
        setSelectedTrack(track);
        // نوقف التشغيل عند اختيار أغنية جديدة لكي لا تعمل تلقائياً
        setIsPlaying(false);
        setCurrentTime(0);
        setActiveLyricIndex(-1);
    };

    // هذا الجزء يعرض المشغل الصوتي عند اختيار أغنية
    if (selectedTrack) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <button onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    setSelectedTrack(null);
                    setIsPlaying(false);
                }} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                    <ArrowLeft size={20} /> العودة إلى قائمة الاستماع
                </button>
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Music size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedTrack.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{selectedTrack.artist} - المستوى: {selectedTrack.level}</p>
                        </div>
                    </div>

                    <div className="h-48 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-center space-y-3 flex flex-col justify-center">
                        {selectedTrack.lyrics.map((lyric, index) => (
                            <p key={index} className={`text-xl transition-all duration-300 ${activeLyricIndex === index ? 'font-bold text-sky-500 scale-110' : 'text-slate-600 dark:text-slate-300'}`}>
                                {lyric.text}
                            </p>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col items-center">
                        <audio ref={audioRef} src={selectedTrack.audioSrc} className="hidden" />
                        <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            {isPlaying ? <PauseCircle size={40} /> : <PlayCircle size={40} />}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // هذا الجزء يعرض قائمة الأغاني والقصص
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                <Headphones /> مركز الاستماع
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
                طور مهارات الاستماع لديك مع الأغاني والقصص الممتعة.
            </p>
            <div className="space-y-4">
                {listeningMaterials.map(track => (
                    <div key={track.id} onClick={() => handleSelectTrack(track)} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/50 rounded-lg flex items-center justify-center">
                                {track.type === 'Song' ? <Music className="text-sky-500" /> : <BookOpen className="text-sky-500" />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-white">{track.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{track.artist} - {track.level}</p>
                            </div>
                        </div>
                        <PlayCircle className="text-slate-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListeningCenter;
