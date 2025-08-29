import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Music4, Mic2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import listeningData from '../data/listeningData'; // Make sure this path is correct

export default function ListeningCenter() {
    const { isDarkMode } = useAppContext();
    const [selectedSong, setSelectedSong] = useState(listeningData[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // Effect to handle audio loading and metadata
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            }
            const setAudioTime = () => setCurrentTime(audio.currentTime);

            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);

            // Set initial duration if audio is already loaded
            if (audio.readyState >= 1) {
                setAudioData();
            }

            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            };
        }
    }, [selectedSong]);

    // Handle song change
    const handleSongSelect = (song) => {
        if (selectedSong.id !== song.id) {
            setSelectedSong(song);
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    // Handle track navigation
    const handleNext = () => {
        const currentIndex = listeningData.findIndex(song => song.id === selectedSong.id);
        const nextIndex = (currentIndex + 1) % listeningData.length;
        handleSongSelect(listeningData[nextIndex]);
    };

    const handlePrev = () => {
        const currentIndex = listeningData.findIndex(song => song.id === selectedSong.id);
        const prevIndex = (currentIndex - 1 + listeningData.length) % listeningData.length;
        handleSongSelect(listeningData[prevIndex]);
    };

    // Handle progress bar interaction
    const handleProgressChange = (e) => {
        const newTime = e.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Format time from seconds to MM:SS
    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds)) return "00:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <Music4 className="mx-auto text-sky-500 mb-2" size={48} />
                <h1 className="text-3xl font-bold">مركز الاستماع</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">حسّن مهارات الاستماع لديك من خلال الأغاني الممتعة.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Content: Player and Lyrics */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                    {/* Audio Player Card */}
                    <div className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold">{selectedSong.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{selectedSong.artist}</p>
                        </div>
                        
                        <audio ref={audioRef} src={selectedSong.src} onEnded={() => setIsPlaying(false)} />

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>{formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleProgressChange}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            <span>{formatTime(duration)}</span>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center items-center gap-6 mt-4">
                            <button onClick={handlePrev} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <Rewind size={24} />
                            </button>
                            <button onClick={togglePlayPause} className="bg-sky-500 text-white p-4 rounded-full shadow-lg hover:bg-sky-600 transition-transform transform hover:scale-105">
                                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                            </button>
                            <button onClick={handleNext} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <FastForward size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Lyrics Card */}
                    <div className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                         <div className="flex items-center mb-4">
                            <Mic2 className="text-sky-500 mr-3" size={24} />
                            <h3 className="text-xl font-bold">كلمات الأغنية</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto pr-4 space-y-2 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            {selectedSong.lyrics.map((line, index) => (
                                <p key={index} dir="ltr" className="text-left">{line}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Song List */}
                <div className="lg:col-span-2">
                    <div className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'} h-full`}>
                        <h3 className="text-xl font-bold mb-4">قائمة الأغاني</h3>
                        <div className="space-y-3">
                            {listeningData.map((song) => (
                                <button
                                    key={song.id}
                                    onClick={() => handleSongSelect(song)}
                                    className={`w-full text-right p-4 rounded-lg flex items-center gap-4 transition-all duration-200
                                        ${selectedSong.id === song.id
                                            ? 'bg-sky-500 text-white shadow-md'
                                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {selectedSong.id === song.id && isPlaying ? (
                                         <div className="flex items-center justify-center w-6 h-6">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                            </span>
                                        </div>
                                    ) : (
                                        <Music4 className={`w-6 h-6 ${selectedSong.id === song.id ? 'text-white' : 'text-sky-500'}`} />
                                    )}
                                   
                                    <div>
                                        <p className="font-semibold">{song.title}</p>
                                        <p className={`text-sm ${selectedSong.id === song.id ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>{song.artist}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
