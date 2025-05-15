import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axios';
import MusicItem from '../components/Music/MusicItem';
import MusicPlayer from '../components/Music/MusicPlayer';
import UploadDialog from '../components/Music/UploadDialog';
import { CloudUpload } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import '../../style/work/work.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Music = () => {
  const [musicList, setMusicList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [newMusic, setNewMusic] = useState({
    title: '',
    artist: '',
    genre: 'Pop',
    album: '',
    lyrics: '',
    explicit: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    fetchMusic();
    fetchFavorites();
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

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/music');
      setMusicList(data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке музыки:', err);
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('/music/favorites');
      setFavorites(data.map(item => item._id));
    } catch (err) {
      console.error('Ошибка при загрузке избранного:', err);
    }
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleCoverChange = (file) => {
    setSelectedCover(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMusic(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, выберите аудиофайл');
      return;
    }
    
    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const fileExt = selectedFile.name.toLowerCase().slice(
      ((selectedFile.name.lastIndexOf('.') - 1) >>> 0) + 2
    );
    
    if (!validExtensions.includes('.' + fileExt)) {
      alert('Разрешены только: .mp3, .wav, .ogg, .m4a, .aac');
      return;
    }

    // Проверка обложки, если она есть
    if (selectedCover) {
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const imageExt = selectedCover.name.toLowerCase().slice(
        ((selectedCover.name.lastIndexOf('.') - 1) >>> 0) + 2
      );
      
      if (!validImageExtensions.includes('.' + imageExt)) {
        alert('Для обложки разрешены только: .jpg, .jpeg, .png, .gif, .webp');
        return;
      }
    }
  
    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', newMusic.title || selectedFile.name.replace(/\.[^/.]+$/, ""));
    formData.append('artist', newMusic.artist || 'Unknown Artist');
    formData.append('genre', newMusic.genre || 'Other');
    
    if (selectedCover) formData.append('cover', selectedCover);
    if (newMusic.album) formData.append('album', newMusic.album);
    if (newMusic.lyrics) formData.append('lyrics', newMusic.lyrics);
    formData.append('explicit', String(newMusic.explicit));
  
    try {
      setUploading(true);
      const response = await axios.post('/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 60000
      });
  
      if (response.data.success) {
        alert('Файл успешно загружен!');
        fetchMusic();
        setOpenUploadDialog(false);
        resetForm();
      } else {
        throw new Error(response.data.message || 'Ошибка загрузки');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setNewMusic({
      title: '',
      artist: '',
      genre: 'Pop',
      album: '',
      lyrics: '',
      explicit: false
    });
    setSelectedFile(null);
    setSelectedCover(null);
  };

  const playMusic = async (music) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
  
      const audioUrl = `https://atomglidedev.ru/uploads/${music.filePath}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onerror = () => {
        console.error('Playback error:', audio.error);
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
      console.error('Play failed:', err);
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

  const playNext = () => {
    if (!currentTrack || musicList.length === 0) return;
    
    const currentIndex = musicList.findIndex(item => item._id === currentTrack._id);
    const nextIndex = (currentIndex + 1) % musicList.length;
    playMusic(musicList[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack || musicList.length === 0) return;
    
    const currentIndex = musicList.findIndex(item => item._id === currentTrack._id);
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    playMusic(musicList[prevIndex]);
  };

  const addToFavorites = async (musicId) => {
    try {
      const { data } = await axios.post('/music/favorites', { musicId });
      setFavorites(data.favorites);
    } catch (err) {
      console.error('Ошибка при добавлении в избранное:', err);
    }
  };

  return (
    <div className="mu">
      <h1 className='mu-title'>Home</h1>
      
    

      <div className='ad-music'>
        <h1 className='ad-music-title'>Никаких Ограничений</h1>
        <h4 className="ad-music-subtitle">
          AtomGlide Music — совершенно бесплатная платформа без подписок и рекламы. 
          Загружай любую музыку — здесь нет проверки на авторские права и различных ограничений. 
          Слушай музыку в наилучшем качестве с поддержкой Dolby Atmos.
        </h4>
      </div>

      <div className="upload-section">
        <Button 
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setOpenUploadDialog(true)}
          style={{
            background: 'linear-gradient(to right, #4A90E2, #357ABD)',
            color: 'white',
            borderRadius: '20px',
            padding: '10px 20px',
            margin: '20px 30px',
            textTransform: 'none',
            fontWeight: '600'
          }}
        >
          Загрузить музыку
        </Button>
      </div>

     

      <h1 className='mu-title2'>Все треки сообщества</h1>
      <div className="recommendations-container">
        {musicList.length > 0 ? (
          musicList.map((music) => (
            <MusicItem
              key={`community-${music._id}`}
              item={music}
              onPlay={playMusic}
              isCurrent={currentTrack?._id === music._id}
              isPlaying={isPlaying && currentTrack?._id === music._id}
              onAddToFavorites={addToFavorites}
              isFavorite={favorites.includes(music._id)}
            />
          ))
        ) : (
          <p className="no-music" style={{ color: '#b3b3b3', textAlign: 'center', gridColumn: '1 / -1' }}>
            В сообществе пока нет музыки
          </p>
        )}
      </div>

      <UploadDialog
        openUploadDialog={openUploadDialog}
        setOpenUploadDialog={setOpenUploadDialog}
        handleUpload={handleUpload}
        handleFileChange={handleFileChange}
        handleCoverChange={handleCoverChange}
        handleInputChange={handleInputChange}
        newMusic={newMusic}
        selectedFile={selectedFile}
        selectedCover={selectedCover}
        uploading={uploading}
      />

      <MusicPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        progress={progress}
        volume={volume}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default Music;