import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../redux/slices/posts';
import axios from '../../axios';
import './newpost.scss';
import Chip from '@mui/material/Chip';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
  'C++', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'Rust', 'Dart', 'Markdown', 'Other'
];

const Newpost = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [title, setTitle] = useState('');
  const [postTags, setPostTags] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (isOpen) loadDrafts();
  }, [isOpen]);

  const loadDrafts = () => {
    setLoadingDrafts(true);
    setTimeout(() => {
      try {
        const savedDrafts = JSON.parse(localStorage.getItem('codeDrafts')) || [];
        setDrafts(savedDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
      } finally {
        setLoadingDrafts(false);
      }
    }, 500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Допустимые форматы: JPEG, PNG, GIF');
      return;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Максимальный размер файла: ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
  };

  const handleSaveDraft = () => {
    const newDraft = {
      id: Date.now(),
      title,
      postTags,
      description,
      language: selectedLanguage,
      content,
      file: selectedFile?.name || null,
      createdAt: new Date().toISOString()
    };

    const updatedDrafts = [...drafts, newDraft];
    localStorage.setItem('codeDrafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    alert('Черновик сохранен!');
  };

  const handleSubmitPost = async () => {
    try {
      // 1. Валидация обязательных полей
      if (!title.trim() || !description.trim() || !postTags.trim() || !content.trim()) {
        setModalMessage('Заполните все обязательные поля: заголовок, описание, теги и содержимое');
        setOpenModal(true);
        return;
      }
  
      // 2. Проверка тегов
      const tagsArray = postTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (tagsArray.length === 0) {
        setModalMessage('Добавьте хотя бы один тег через запятую');
        setOpenModal(true);
        return;
      }
  
      setLoading(true);
      let imageUrl = '';
  
      // 3. Загрузка изображения (если выбрано)
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('image', selectedFile);
          
          const { data } = await axios.post('/upload', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data' // Важно для загрузки файлов
            }
          });
          
          if (!data.url) throw new Error('Не удалось получить URL изображения');
          imageUrl = data.url;
        } catch (err) {
          console.error('Ошибка загрузки изображения:', err);
          setModalMessage(err.response?.data?.error || 'Ошибка при загрузке изображения');
          setOpenModal(true);
          return;
        }
      }
  
      // 4. Подготовка данных для отправки
      const postData = {
        title: title.trim(),
        description: description.trim(),
        text: content, // Проверьте название поля на сервере!
        tags: tagsArray,
        language: selectedLanguage,
        imageUrl
      };
  
      // 5. Отправка запроса
      const response = await axios.post('/posts', postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      // 6. Проверка успешного ответа
      if (response.status !== 201) {
        throw new Error('Ошибка сервера при создании поста');
      }
  
      // 7. Сброс формы
      setTitle('');
      setPostTags('');
      setDescription('');
      setContent('');
      setSelectedFile(null);
      setSelectedLanguage('JavaScript');
      
      // 8. Обновление списка постов и закрытие модалки
      dispatch(fetchPosts());
      onClose();
  
    } catch (err) {
      console.error('Полная ошибка:', err);
      setModalMessage(
        err.response?.data?.message || 
        err.message || 
        'Неизвестная ошибка при создании поста'
      );
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  const PostPreview = () => (
    <div className="post-preview">
      <h2>{title || 'Без названия'}</h2>
      <p className="post-description">{description || 'Нет описания'}</p>
      
      {selectedFile && (
        <div className="image-preview">
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Предпросмотр изображения" 
          />
        </div>
      )}
      
      {postTags && (
        <div className="tags-preview">
          {postTags.split(',').map((tag, i) => (
            <Chip
              key={i}
              label={`#${tag.trim()}`}
              size="small"
              variant="outlined"
            />
          ))}
        </div>
      )}
      
      <div className="content-preview">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );

  if (!isOpen) return null;

  // Здесь начинается блок return
  // ... (остальная часть компонента с JSX)

  return (
    <div className="modal-overlay" onClick={onClose}>
      {openModal && (
        <div className="message-modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setOpenModal(false)}>Закрыть</button>
          </div>
        </div>
      )}

      <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal-flex-container">
          <div className="sidebar">
            <div className="form-group">
              <label>
                Заголовок*
                <Tooltip title="Краткое и понятное название поста (макс. 120 символов)" arrow>
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>

            <div className="form-group">
              <label>
                Описание*
                <Tooltip title="Краткое описание поста (макс. 200 символов)" arrow>
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>
                Теги*
                <Tooltip title="Введите теги через запятую (например: javascript, web, react)" arrow>
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </label>
              <input
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                placeholder="javascript, программирование, советы"
              />
            </div>

            <div className="form-group">
              <label>Язык программирования</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Изображение</label>
              <div className="file-upload">
                <label className="upload-label">
                  {selectedFile ? selectedFile.name : 'Выбрать файл'}
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/gif" 
                  />
                </label>
                <span className="file-info">JPEG, PNG, GIF (до 10MB)</span>
              </div>
            </div>

            <div className="drafts-section">
              <h3>Мои черновики</h3>
              {loadingDrafts ? (
                <div className="loading">Загрузка...</div>
              ) : drafts.length === 0 ? (
                <div className="empty">Нет сохраненных черновиков</div>
              ) : (
                <div className="drafts-list">
                  {drafts.map(draft => (
                    <div 
                      key={draft.id}
                      className={`draft-item ${selectedDraft?.id === draft.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDraft(draft);
                        setTitle(draft.title);
                        setPostTags(draft.postTags);
                        setDescription(draft.description);
                        setContent(draft.content);
                      }}
                    >
                      <div className="draft-title">{draft.title || 'Без названия'}</div>
                      <button 
                        className="delete-draft"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrafts(drafts.filter(d => d.id !== draft.id));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="editor-area">
            {showPreview ? (
              <PostPreview />
            ) : (
              <div className="markdown-editor">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="->> Напишите тут текст с использованием Markdown..."
                  rows="20"
                />
               <div className="markdown-tips">
  <h4>Подсказки по Markdown:</h4>
  <ul>
    <li><code># Заголовок 1</code></li>
    <li><code>## Заголовок 2</code></li>
    <li><code>**Жирный текст**</code></li>
    <li><code>*Курсив*</code> или <code>_Курсив_</code></li>
    <li><code>~~Зачеркнутый~~</code></li>
    <li><code>`Встроенный код`</code></li>
    <li><code>``` Блок кода ```</code></li>
    <li><code>- Неупорядоченный список</code></li>
    <li><code>1. Упорядоченный список</code></li>
    <li><code>[Ссылка](https://example.com)</code></li>
    <li><code>![Изображение](alt-text.jpg)</code></li>
    <li><code>---</code> Горизонтальная линия</li>
    <li><code>| Таблица | Синтаксис |</code></li>
    <li><code>|--------|----------|</code></li>
    <li><code>| Ячейка | Пример   |</code></li>
  </ul>
  <div className="advanced-tips">
    <p>Подсказка: Используйте Tab для отступов кода</p>
    <p>Поддерживается подсветка синтаксиса для 150+ языков</p>
  </div>
</div>
              </div>
            )}
          </div>
        </div>

        <div className="actions">
          <button 
            className="preview-btn"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Редактировать' : 'Предпросмотр'}
          </button>
          <button className="cancel" onClick={onClose}>Отмена</button>
          <button className="save-draft" onClick={handleSaveDraft}>Сохранить черновик</button>
          <button 
            className="submit"
            onClick={handleSubmitPost}
            disabled={isLoading}
          >
            {isLoading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newpost;