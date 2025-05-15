// components/Music/PopularMusic.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axios';

import { CircularProgress } from '@mui/material';
import '../../style/work/work.scss';
import MusicItem from '../components/Music/MusicItem';
import MusicPlayer from '../components/Music/MusicPlayer';
const PopularMusic = () => {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    fetchPopularMusic();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime / audioRef.current.duration || 0);
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const fetchPopularMusic = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/music?sort=popular');
      setMusicList(data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке популярной музыки:', err);
      setLoading(false);
    }
  };

  // Функции для управления плеером (аналогичны Music.jsx)
  const playMusic = async (music) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audioUrl = `https://atomglidedev.ru/uploads${music.filePath}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onerror = () => {
        console.error('Ошибка воспроизведения:', audio.error);
        alert(`Ошибка: ${audio.error.message}`);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      await audio.play();
      setIsPlaying(true);
      setCurrentTrack(music);
    } catch (err) {
      console.error('Ошибка воспроизведения:', err);
      alert(`Не удалось воспроизвести: ${err.message}`);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (newProgress) => {
    if (!audioRef.current) return;
    
    setProgress(newProgress);
    audioRef.current.currentTime = newProgress * audioRef.current.duration;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="mu">
          <div className='ad-music'>
        <h1 className='ad-music-title'>Топ чарты</h1>
        <h4 className="ad-music-subtitle">
        На этой странице представлен список самых популярных треков в AtomGlide. Наши серверы с помощью специального алгоритма отбирают треки на основе их прослушиваний.
        </h4>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="recommendations-container">
          {musicList.length > 0 ? (
            musicList.map((music) => (
              <MusicItem
                key={music._id}
                item={music}
                onPlay={playMusic}
                isCurrent={currentTrack?._id === music._id}
                isPlaying={isPlaying && currentTrack?._id === music._id}
                showPlays={true}
              />
            ))
          ) : (
            <p className="no-music" style={{ color: '#b3b3b3', textAlign: 'center', gridColumn: '1 / -1' }}>
              Нет данных о популярных треках
            </p>
          )}
        </div>
      )}

      <MusicPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={togglePlayPause}
        progress={progress}
        volume={volume}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default PopularMusic;