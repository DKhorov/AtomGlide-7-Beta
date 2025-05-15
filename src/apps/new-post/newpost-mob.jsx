import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../../axios';
import './newpost-mon.scss';

const Newpostm = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage] = useState('Markdown');
  const [title, setTitle] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postText, setPostText] = useState('');
  const [description, setDescription] = useState(''); // Добавлено
  const [isLoading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ 
    success: null, 
    message: '' 
  });
  const [lastPostTime, setLastPostTime] = useState(0);

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus({ 
        success: false, 
        message: 'Допустимые форматы: JPEG, PNG, GIF' 
      });
      return;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadStatus({ 
        success: false, 
        message: `Максимальный размер файла: ${maxSizeMB}MB` 
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ 
      success: true, 
      message: 'Файл успешно выбран' 
    });
  };

  const resetForm = () => {
    setTitle('');
    setPostTags('');
    setPostText('');
    setDescription(''); // Добавлено
    setSelectedFile(null);
    setUploadStatus({ success: null, message: '' });
  };

  const handleSubmitPost = async () => {
    try {
      const now = Date.now();
      if (now - lastPostTime < 20000) {
        setModalMessage('Подождите 20 секунд перед созданием нового поста');
        setOpenModal(true);
        return;
      }

      if (!title.trim()) {
        setModalMessage('Введите заголовок поста');
        setOpenModal(true);
        return;
      }

      if (!postText.trim()) {
        setModalMessage('Введите текст поста');
        setOpenModal(true);
        return;
      }

      const tagsArray = postTags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (tagsArray.length === 0) {
        setModalMessage('Добавьте хотя бы один тег');
        setOpenModal(true);
        return;
      }

      setLoading(true);
      setLastPostTime(now);

      let imageUrl = '';
      if (selectedFile) {
        try {
          setUploadStatus({ 
            success: null, 
            message: 'Загрузка изображения...' 
          });
          
          const formData = new FormData();
          formData.append('image', selectedFile);
          
          const { data } = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

          imageUrl = data.url;
          setUploadStatus({ 
            success: true, 
            message: 'Изображение успешно загружено' 
          });
        } catch (err) {
          console.error('Ошибка загрузки изображения:', err);
          setUploadStatus({ 
            success: false, 
            message: err.response?.data?.message || 
                   'Ошибка при загрузке изображения' 
          });
          setLoading(false);
          return;
        }
      }

      await axios.post('/posts', {
        title: title.trim(),
        description: description.trim(), // Исправлено
        text: postText.trim(),
        tags: tagsArray,
        language: selectedLanguage,
        imageUrl: imageUrl || undefined
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      resetForm();
      handleClose();
      window.location.reload();

    } catch (err) {
      console.error('Ошибка создания поста:', err);
      
      let errorMessage = 'Ошибка при создании поста';
      if (err.response) {
        if (err.response.status === 429) {
          errorMessage = 'Слишком много запросов. Подождите 20 секунд.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setModalMessage(errorMessage);
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-m" onClick={handleClose}>
      {openModal && (
        <div className="message-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button 
              className="modal-close-btn"
              onClick={() => setOpenModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className="modal-content-m" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Создать пост</h3>
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Закрыть модальное окно"
          >
            &times;
          </button>
        </div>
        
        <input 
          className="m-p-input" 
          placeholder="Заголовок*" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="m-p-input" // Исправлено с modal-input на m-p-input для единообразия
          placeholder="Описание* (максимум 200 символов)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
        
        <input 
          className="m-p-input" 
          placeholder="Теги* (через запятую)"
          value={postTags}
          onChange={(e) => setPostTags(e.target.value)}
        />
        
        <textarea 
          className="m-p-area" 
          placeholder="Текст поста (Markdown)*"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>

        <div className="button-container-m">
          <label className="add-photo-btn-m">
            Добавить фото
            <input 
              type="file" 
              hidden 
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif"
            />
          </label>
          
          <button 
            className="submit-btn-m" 
            onClick={handleSubmitPost}
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Опубликовать'}
          </button>
        </div>

        {uploadStatus.message && (
          <div className={`upload-status ${
            uploadStatus.success === false ? 'error' : 
            uploadStatus.success ? 'success' : ''
          }`}>
            {uploadStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

Newpostm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Newpostm;