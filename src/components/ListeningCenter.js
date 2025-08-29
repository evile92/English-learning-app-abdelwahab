// src/components/ListeningCenter.js

import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Music, BookOpen, Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { listeningMaterials } from '../data/listeningData';
import { useAppContext } from '../context/AppContext';

const ListeningCenter = () => {
    const { handlePageChange } = useAppContext();
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
    const audioRef = useRef(null);
    const lyricsContainerRef = useRef(null);

    // Effect to handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };
        const setAudioTime = () => setCurrentTime(audio.currentTime);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', onEnded);

        // Auto-play when a new track is selected
        if (selectedTrack) {
            audio.play().catch(e => console.error("Audio play failed:", e));
            setIsPlaying(true);
        }

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', onEnded);
        };
    }, [selectedTrack]); // This effect runs when selectedTrack changes

    // Effect to play/pause audio via button
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Effect to handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);
    
    // Effect for active lyric highlighting and scrolling
    useEffect(() => {
        if (!selectedTrack || !lyricsContainerRef.current) return;
        const newLyricIndex = selectedTrack.lyrics.findIndex((lyric, index) => {
            const nextLyric = selectedTrack.lyrics[index + 1];
            return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
        });
        
        if (newLyricIndex !== activeLyricIndex) {
            setActiveLyricIndex(newLyricIndex);
            const activeElement = document.getElementById(`lyric-${newLyricIndex}`);
            if (activeElement) {
                lyricsContainerRef.current.scrollTo({
                    top: activeElement.offsetTop - (lyricsContainerRef.current.clientHeight / 2) + 20,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentTime, selectedTrack, activeLyricIndex]);


    const handleSelectTrack = (track) => {
        if (selectedTrack && selectedTrack.id === track.id) {
            setIsPlaying(!isPlaying); // Toggle play/pause for the same track
        } else {
            setSelectedTrack(track); // Switch to a new track
        }
    };

    const handleProgressChange = (e) => {
        const newTime = Number(e.target.value);
        if(audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // If a track is selected, render the player view
    if (selectedTrack) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <button onClick={() => {
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.src = ''; // Detach source
                    }
                    setSelectedTrack(null);
                    setIsPlaying(false);
                }} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                    <ArrowLeft size={20} /> العودة إلى قائمة الاستماع
                </button>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            {selectedTrack.type === 'Song' ? <Music size={32} className="text-white" /> : <BookOpen size={32} className="text-white" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedTrack.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{selectedTrack.artist} - المستوى: {selectedTrack.level}</p>
                        </div>
                    </div>

                    <div ref={lyricsContainerRef} className="h-64 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-left space-y-3 scroll-smooth">
                        {selectedTrack.lyrics.map((lyric, index) => (
                            <p key={index} id={`lyric-${index}`} className={`text-xl transition-all duration-300 ${activeLyricIndex === index ? 'font-bold text-sky-500 dark:text-sky-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                {lyric.text}
                            </p>
                        ))}
                    </div>

                    <audio key={selectedTrack.id} ref={audioRef} src={selectedTrack.audioSrc} className="hidden" />
                    
                    <div className="mt-6">
                        <input
                            type="range"
                            value={currentTime}
                            max={duration || 0}
                            onChange={handleProgressChange}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer range-sm"
                        />
                        <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 w-24">
                            <button onClick={() => setVolume(v => Math.max(0, v - 0.1))}><VolumeX size={20} /></button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer range-xs"
                            />
                            <button onClick={() => setVolume(v => Math.min(1, v + 0.1))}><Volume2 size={20} /></button>
                        </div>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                        </button>
                        <div className="w-24"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Otherwise, render the list view
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
                        <Play size={24} className="text-slate-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListeningCenter;
