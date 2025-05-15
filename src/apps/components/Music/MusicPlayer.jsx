import React, { useState, useEffect, useRef } from 'react';
import { SkipPrevious, SkipNext, PlayArrow, Pause, VolumeUp } from '@mui/icons-material';

const MusicPlayer = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  progress, 
  volume, 
  onProgressChange,
  onVolumeChange
}) => {
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [coverImage, setCoverImage] = useState('');
  const [hasError, setHasError] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const secs = Math.floor(seconds || 0);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const getCoverImageUrl = (track) => {
    if (!track) return '';
    
    try {
      if (track.coverImage) {
        // Удаляем возможные дублирующие слэши
        const cleanPath = track.coverImage
          .replace(/^\/+/, '')
          .replace(/\/+/g, '/');
        
        // Формируем полный URL
        return `https://atomglidedev.ru/uploads/${cleanPath}`;
      }
      return track.image || "https://via.placeholder.com/150";
    } catch (err) {
      console.error('Error processing cover image:', err);
      return "https://via.placeholder.com/150";
    }
  };

  useEffect(() => {
    if (currentTrack) {
      // Обновляем обложку
      const newCoverUrl = getCoverImageUrl(currentTrack);
      setCoverImage(newCoverUrl);
      setHasError(false);

      // Проверяем доступность обложки
      const img = new Image();
      img.onerror = () => {
        console.error('Cover image failed to load:', newCoverUrl);
        setHasError(true);
      };
      img.src = newCoverUrl;

      // Загружаем метаданные аудио
      const audio = new Audio();
      audioRef.current = audio;

      const audioUrl = `https://atomglidedev.ru/uploads/${currentTrack.filePath.replace(/^\/+/, '')}`;
      audio.src = audioUrl;

      const handleLoadedMetadata = () => {
        if (audio.duration) {
          setDuration(formatTime(audio.duration));
        }
      };

      const handleError = () => {
        console.error('Audio load error:', {
          error: audio.error,
          src: audio.src
        });
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);

      // Проверка доступности аудиофайла
      const checkAudio = async () => {
        try {
          const response = await fetch(audioUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.error('Audio file not available:', audioUrl);
          }
        } catch (err) {
          console.error('Audio check failed:', err);
        }
      };
      checkAudio();

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
        audio.src = '';
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack?.duration) {
      setCurrentTime(formatTime(progress * currentTrack.duration));
    }
  }, [progress, currentTrack]);

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    onProgressChange(Math.max(0, Math.min(1, clickPos)));
  };

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, clickPos)));
  };

  if (!currentTrack) return null;

  return (
    <div className="music-player">
      <div className="player-track-info">
   
        <div className="player-info">
          <h3 className="player-title">{currentTrack.title}</h3>
          <p className="player-artist">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="player-controls">
        <button className="player-btn" onClick={onPrevious}>
          <SkipPrevious />
        </button>
        <button className="player-btn play-btn" onClick={onPlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </button>
        <button className="player-btn" onClick={onNext}>
          <SkipNext />
        </button>
      </div>

      <div className="player-progress">
        <span className="progress-time">{currentTime}</span>
        <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
          <div 
            className="progress-fill" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="progress-time">{duration}</span>
      </div>

      <div className="player-volume">
        <VolumeUp style={{ color: '#b3b3b3', fontSize: 20 }} />
        <div className="volume-bar" ref={volumeRef} onClick={handleVolumeClick}>
          <div 
            className="volume-fill" 
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;