import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Music4, Mic2, ListMusic } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import listeningData from '../data/listeningData.js';

// --- Component for the visual equalizer effect ---
const MusicEqualizer = () => (
    <div className="flex items-end gap-1 h-4">
        <span className="w-1 h-2 bg-sky-300 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></span>
        <span className="w-1 h-4 bg-sky-300 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-1 h-3 bg-sky-300 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></span>
        <span className="w-1 h-2 bg-sky-300 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></span>
    </div>
);

export default function ListeningCenter() {
    const { isDarkMode } = useAppContext();
    const songs = listeningData.songs;
    const [selectedSong, setSelectedSong] = useState(songs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeTab, setActiveTab] = useState('lyrics'); // 'lyrics' or 'playlist'
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            };
            const setAudioTime = () => setCurrentTime(audio.currentTime);
            const handleSongEnd = () => {
                setIsPlaying(false);
                // Optional: handleNext(); // Uncomment to automatically play the next song
            };

            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);
            audio.addEventListener('ended', handleSongEnd);

            if (audio.readyState >= 1) setAudioData();
            
            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
                audio.removeEventListener('ended', handleSongEnd);
            };
        }
    }, [selectedSong]);

    const handleSongSelect = (song) => {
        if (selectedSong.id !== song.id) {
            setSelectedSong(song);
            setIsPlaying(false);
            setCurrentTime(0);
            // Switch back to lyrics tab when a new song is selected
            setActiveTab('lyrics'); 
            
            // Wait a moment for the state to update, then play
            setTimeout(() => {
                audioRef.current.play();
                setIsPlaying(true);
            }, 150);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    const handleNext = () => {
        const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        handleSongSelect(songs[nextIndex]);
    };

    const handlePrev = () => {
        const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        handleSongSelect(songs[prevIndex]);
    };

    const handleProgressChange = (e) => {
        const newTime = e.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

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
                <p className="text-slate-500 dark:text-slate-400 mt-1">انغمس في اللغة الإنجليزية مع أغاني مختارة بعناية.</p>
            </div>
            
            <div className={`max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden
                ${isDarkMode ? 'bg-slate-800/80 backdrop-blur-sm border border-slate-700' : 'bg-white'}`}>
                
                {/* --- Player Header --- */}
                <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
                    <div className="flex items-center gap-5">
                        <div className={`w-24 h-24 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg
                            ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                            <Music4 size={48} className="text-sky-500" />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold">{selectedSong.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{selectedSong.artist}</p>
                            <audio ref={audioRef} src={selectedSong.src} preload="metadata" />
                        </div>
                    </div>
                    
                    {/* --- Progress Bar --- */}
                    <div className="mt-4">
                         <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* --- Controls --- */}
                    <div className="flex justify-center items-center gap-6 mt-3">
                        <button onClick={handlePrev} className="p-3 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors">
                            <Rewind size={24} />
                        </button>
                        <button onClick={togglePlayPause} className="bg-sky-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-sky-600 transition-all transform hover:scale-105 flex justify-center items-center">
                            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                        </button>
                        <button onClick={handleNext} className="p-3 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors">
                            <FastForward size={24} />
                        </button>
                    </div>
                </div>

                {/* --- Tabs (Lyrics / Playlist) --- */}
                <div className="p-2 bg-slate-100 dark:bg-slate-900">
                    <div className="flex items-center justify-center gap-2">
                        <TabButton 
                            icon={Mic2} 
                            label="كلمات الأغنية" 
                            isActive={activeTab === 'lyrics'} 
                            onClick={() => setActiveTab('lyrics')} 
                        />
                        <TabButton 
                            icon={ListMusic} 
                            label="قائمة التشغيل" 
                            isActive={activeTab === 'playlist'} 
                            onClick={() => setActiveTab('playlist')} 
                        />
                    </div>
                </div>

                {/* --- Content Area --- */}
                <div className="p-6 h-96 overflow-y-auto">
                    {activeTab === 'lyrics' && (
                        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-lg leading-relaxed animate-fade-in-fast">
                            {selectedSong.lyrics.map((line, index) => (
                                <p key={index} dir="ltr" className="text-left">{line || <br />}</p>
                            ))}
                        </div>
                    )}
                    
                    {activeTab === 'playlist' && (
                        <div className="space-y-2 animate-fade-in-fast">
                            {songs.map((song) => (
                                <button
                                    key={song.id}
                                    onClick={() => handleSongSelect(song)}
                                    className={`w-full text-right p-3 rounded-lg flex items-center gap-4 transition-all duration-200
                                        ${selectedSong.id === song.id
                                            ? 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                    {selectedSong.id === song.id && isPlaying ? (
                                        <MusicEqualizer />
                                    ) : (
                                        <span className="text-slate-400 font-mono text-sm">{String(song.id).padStart(2, '0')}</span>
                                    )}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${selectedSong.id === song.id ? '' : 'text-slate-800 dark:text-slate-200'}`}>{song.title}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{song.artist}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Adding the wave animation for the equalizer */}
            <style jsx global>{`
                @keyframes wave {
                    0%, 100% { height: 0.5rem; }
                    50% { height: 1rem; }
                }
                .animate-wave {
                    animation: wave 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

// --- Tab Button Component ---
const TabButton = ({ icon: Icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-semibold transition-colors
                ${isActive
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
        >
            <Icon size={16} />
            <span>{label}</span>
        </button>
    );
};
