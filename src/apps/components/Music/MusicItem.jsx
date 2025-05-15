import React, { useState, useEffect, useRef } from 'react';
import { MoreVert, Favorite, FavoriteBorder, PlaylistAdd, Report, Share } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MusicItem = ({ item, onPlay, isCurrent, isPlaying, onAddToFavorites, isFavorite, showArtist }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCoverImage = () => {
    if (item.coverImage) {
      // Удаляем возможные дубли пути /music/
      const cleanPath = item.coverImage
        .replace(/^\/?uploads\/?/, '')
        .replace(/^\/?music\/?/, '');
      
      // Формируем полный URL с кэширующим параметром
      return `https://atomglidedev.ru/uploads/music/${cleanPath}?v=${new Date().getTime()}`;
    }
    return "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";
  };
  return (
    <div className={`recommendation-item ${isCurrent ? 'active' : ''}`} onClick={() => onPlay(item)}>
      <div className="cover-container">
        <img 
          src={getCoverImage()} 
          alt={item.title} 
          className="recommendation-cover"
          onError={(e) => {
            e.target.src = "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";
          }}
        />
        {isCurrent && isPlaying && (
          <div className="playing-indicator">
            <div className="wave">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>
      <div className="recommendation-info">
        <h3 className="recommendation-title">{item.title}</h3>
        {showArtist && item.artist && (
          <Link 
            to={`/artist/${encodeURIComponent(item.artist)}`} 
            className="recommendation-artist"
            onClick={(e) => e.stopPropagation()}
          >
            {item.artist}
          </Link>
        )}
        <p className="recommendation-genre">{item.artist}</p>
      </div>
      <div className="context-menu" ref={menuRef}>
    
      
      </div>
    </div>
  );
};

export default MusicItem;