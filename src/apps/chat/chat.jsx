import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  Avatar, Button, TextField, Card, CardHeader, CardContent, 
  List, ListItem, ListItemAvatar, ListItemText, Divider, 
  IconButton, Typography, Dialog, DialogTitle, DialogContent, 
  DialogActions, Snackbar, Switch, FormControlLabel, Box, 
  CircularProgress, Badge
} from '@mui/material';
import { 
  Send, AddPhotoAlternate, GroupAdd, DarkMode, 
  LightMode, Close, ErrorOutline 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Стили
const AeroFrutigerCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  color: theme.palette.mode === 'dark' ? '#fff' : '#333',
}));

const AeroTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
  },
});

const GroupChat = () => {
  // Состояния
  const [state, setState] = useState({
    groups: [],
    currentGroup: null,
    messages: [],
    newMessage: '',
    newGroupName: '',
    newGroupDesc: '',
    groupImage: null,
    previewImage: null,
    isPublic: true,
    openCreateDialog: false,
    snackbarOpen: false,
    snackbarMessage: '',
    darkMode: true,
    connectionStatus: 'disconnected', // 'disconnected', 'connecting', 'connected', 'authenticated', 'error'
    authAttempts: 0,
    lastActivity: null,
    unreadMessages: {}
  });

  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);

  // Деструктуризация состояния для удобства
  const {
    groups, currentGroup, messages, newMessage, newGroupName, newGroupDesc,
    previewImage, isPublic, openCreateDialog, snackbarOpen, snackbarMessage,
    darkMode, connectionStatus, unreadMessages
  } = state;

  // Цвета для темы
  const themeColors = darkMode ? {
    background: '#121212',
    text: '#ffffff',
    primary: '#90caf9',
    secondary: '#f48fb1',
  } : {
    background: '#f5f5f5',
    text: '#333333',
    primary: '#1976d2',
    secondary: '#dc004e',
  };

  // Обновление состояния
  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Проверка токена
  const validateToken = (token) => {
    if (!token) {
      console.error('Token is missing');
      return false;
    }
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Token validation error:', err);
      return false;
    }
  };

  // Обработка ошибок аутентификации
  const handleAuthError = (message = 'Ошибка аутентификации') => {
    console.error('Authentication error:', message);
    updateState({
      connectionStatus: 'error',
      snackbarMessage: message,
      snackbarOpen: true
    });
    localStorage.removeItem('token');
    setTimeout(() => window.location.href = '/login', 2000);
  };

  // Инициализация сокета
  const initializeSocket = (token) => {
    console.log('Initializing socket with token:', token);
    
    const socketOptions = {
      withCredentials: true,
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      query: { token },
      timeout: 10000
    };

    const newSocket = io('https://atomglidedev.ru', socketOptions);
    socketRef.current = newSocket;

    // Обработчики событий сокета
    newSocket.on('connect', () => {
      console.log('Socket connected, authenticating...');
      updateState({ connectionStatus: 'connected' });
      reconnectAttempts.current = 0;
      
      newSocket.emit('authenticate', { token }, (response) => {
        if (response?.error) {
          console.error('Authentication failed:', response.error);
          handleAuthError(response.error);
        }
      });
    });

    newSocket.on('authenticated', (userData) => {
      console.log('Socket authenticated:', userData);
      updateState({ 
        connectionStatus: 'authenticated',
        authAttempts: 0 
      });
    });

    newSocket.on('unauthorized', (err) => {
      console.error('Socket unauthorized:', err);
      handleAuthError(err.message || 'Не авторизован');
    });

    newSocket.on('auth_error', (err) => {
      console.error('Socket auth error:', err);
      if (state.authAttempts < 3) {
        updateState({ authAttempts: state.authAttempts + 1 });
        newSocket.emit('authenticate', { token });
      } else {
        handleAuthError('Не удалось аутентифицироваться');
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      updateState({ connectionStatus: 'error' });
      
      if (reconnectAttempts.current < 3) {
        reconnectAttempts.current += 1;
        setTimeout(() => {
          if (newSocket.disconnected) {
            newSocket.connect();
          }
        }, 5000);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      updateState({ connectionStatus: 'disconnected' });
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    // Обработчики чата
    newSocket.on('new_group_message', (data) => {
      if (data.groupId === currentGroup?._id) {
        updateState({ messages: [...messages, data.message] });
      } else {
        // Помечаем непрочитанные сообщения
        updateState({
          unreadMessages: {
            ...unreadMessages,
            [data.groupId]: (unreadMessages[data.groupId] || 0) + 1
          }
        });
      }
    });

    newSocket.on('user_joined', (data) => {
      if (data.groupId === currentGroup?._id) {
        updateState({
          snackbarMessage: `Пользователь присоединился к чату`,
          snackbarOpen: true
        });
      }
    });

    newSocket.on('user_left', (data) => {
      if (data.groupId === currentGroup?._id) {
        updateState({
          snackbarMessage: `Пользователь покинул чат`,
          snackbarOpen: true
        });
      }
    });

    newSocket.on('new_group_created', (group) => {
      updateState({ groups: [group, ...groups] });
    });

    return newSocket;
  };

  // Инициализация при монтировании
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token:', token);
    
    if (!validateToken(token)) {
      handleAuthError('Недействительный токен');
      return;
    }

    updateState({ connectionStatus: 'connecting' });

    // Загрузка данных пользователя
    axios.get('https://atomglidedev.ru/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    })
    .then(response => {
      console.log('User data loaded:', response.data);
      setUser(response.data);
      
      // Инициализация сокета
      const socketInstance = initializeSocket(token);
      setSocket(socketInstance);

      // Загрузка групп
      return axios.get('https://atomglidedev.ru/groups', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
    })
    .then(response => {
      console.log('Groups loaded:', response.data.length);
      updateState({ groups: response.data });
    })
    .catch(error => {
      console.error('Initialization error:', error);
      if (error.response?.status === 401) {
        handleAuthError('Сессия истекла');
      } else {
        handleAuthError('Ошибка загрузки данных');
      }
    });

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket');
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Загрузка сообщений при смене группы
  useEffect(() => {
    if (!currentGroup || !socketRef.current) return;

    console.log('Loading messages for group:', currentGroup._id);
    axios.get(`https://atomglidedev.ru/groups/${currentGroup._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      timeout: 10000
    })
    .then(response => {
      updateState({ 
        messages: response.data.messages || [],
        unreadMessages: {
          ...unreadMessages,
          [currentGroup._id]: 0
        }
      });
      
      // Присоединяемся к комнате группы
      socketRef.current.emit('join_group', currentGroup._id);
    })
    .catch(error => {
      console.error('Error loading messages:', error);
      updateState({
        snackbarMessage: 'Ошибка загрузки сообщений',
        snackbarOpen: true
      });
    });
  }, [currentGroup]);

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Обработчики действий
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      updateState({
        snackbarMessage: 'Введите название группы',
        snackbarOpen: true
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', newGroupName);
    formData.append('description', newGroupDesc);
    formData.append('isPublic', isPublic);
    if (state.groupImage) {
      formData.append('image', state.groupImage);
    }

    axios.post('https://atomglidedev.ru/groups', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 15000
    })
    .then(response => {
      updateState({
        groups: [response.data, ...groups],
        currentGroup: response.data,
        openCreateDialog: false,
        newGroupName: '',
        newGroupDesc: '',
        groupImage: null,
        previewImage: null,
        isPublic: true
      });
      
      if (socketRef.current) {
        socketRef.current.emit('join_group', response.data._id);
      }
    })
    .catch(error => {
      console.error('Error creating group:', error);
      updateState({
        snackbarMessage: 'Ошибка создания группы',
        snackbarOpen: true
      });
    });
  };

  const handleJoinGroup = (groupId) => {
    axios.post(`https://atomglidedev.ru/groups/${groupId}/join`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      timeout: 10000
    })
    .then(response => {
      updateState({ currentGroup: response.data.group });
      
      if (socketRef.current) {
        socketRef.current.emit('join_group', groupId, (response) => {
          if (!response?.success) {
            updateState({
              snackbarMessage: 'Ошибка присоединения к группе',
              snackbarOpen: true
            });
          }
        });
      }
    })
    .catch(error => {
      console.error('Error joining group:', error);
      updateState({
        snackbarMessage: 'Ошибка присоединения к группе',
        snackbarOpen: true
      });
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentGroup || !socketRef.current) return;

    socketRef.current.emit('group_message', { 
      groupId: currentGroup._id, 
      content: newMessage 
    }, (response) => {
      if (!response?.success) {
        updateState({
          snackbarMessage: 'Ошибка отправки сообщения',
          snackbarOpen: true
        });
      } else {
        updateState({ newMessage: '' });
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateState({ groupImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        updateState({ previewImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Индикатор состояния подключения
  const renderConnectionStatus = () => {
    const statusMap = {
      disconnected: { text: 'Отключено', color: 'error', icon: <ErrorOutline /> },
      connecting: { text: 'Подключение...', color: 'warning', icon: <CircularProgress size={14} /> },
      connected: { text: 'Подключено', color: 'info', icon: null },
      authenticated: { text: 'Активно', color: 'success', icon: null },
      error: { text: 'Ошибка', color: 'error', icon: <ErrorOutline /> }
    };

    const status = statusMap[connectionStatus] || statusMap.disconnected;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: `${status.color}.main`,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {status.icon}
          {status.text}
        </Typography>
      </Box>
    );
  };

  // JSX рендеринг
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: themeColors.background,
      color: themeColors.text,
    }}>
      {/* Боковая панель с группами */}
      <Box sx={{ 
        width: '300px', 
        borderRight: `1px solid ${darkMode ? '#333' : '#ddd'}`,
        overflowY: 'auto',
        p: 2,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Групповые чаты</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderConnectionStatus()}
            <IconButton onClick={() => updateState({ darkMode: !darkMode })}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton onClick={() => updateState({ openCreateDialog: true })}>
              <GroupAdd />
            </IconButton>
          </Box>
        </Box>

        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<GroupAdd />}
          onClick={() => updateState({ openCreateDialog: true })}
          sx={{ mb: 2 }}
        >
          Создать группу
        </Button>

        <List>
          {groups.map(group => (
            <React.Fragment key={group._id}>
              <ListItem 
                button 
                onClick={() => handleJoinGroup(group._id)}
                selected={currentGroup?._id === group._id}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge 
                    badgeContent={unreadMessages[group._id] || 0} 
                    color="primary"
                    invisible={!unreadMessages[group._id] || currentGroup?._id === group._id}
                  >
                    <Avatar 
                      src={group.imageUrl ? `https://atomglidedev.ru${group.imageUrl}` : undefined}
                      alt={group.name}
                    >
                      {group.name.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={group.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                        {group.members?.length || 0} участников
                      </Typography>
                      {group.description && (
                        <Typography component="span" variant="body2" sx={{ 
                          display: 'block', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }}>
                          {group.description}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ mx: 0 }} />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Основная область чата */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
      }}>
        {currentGroup ? (
          <>
            {/* Шапка чата */}
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${darkMode ? '#333' : '#ddd'}`,
              display: 'flex',
              alignItems: 'center',
            }}>
              <Avatar 
                src={currentGroup.imageUrl ? `https://atomglidedev.ru${currentGroup.imageUrl}` : undefined}
                alt={currentGroup.name}
                sx={{ mr: 2 }}
              >
                {currentGroup.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{currentGroup.name}</Typography>
                <Typography variant="body2">
                  {currentGroup.members?.length || 0} участников • {currentGroup.isPublic ? 'Публичный' : 'Приватный'}
                </Typography>
              </Box>
            </Box>

            {/* Сообщения */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto',
              p: 2,
              backgroundImage: darkMode 
                ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))' 
                : 'linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))',
            }}>
              {messages.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  color: themeColors.text,
                }}>
                  <Typography variant="body1">Нет сообщений. Начните общение!</Typography>
                </Box>
              ) : (
                messages.map((message, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      flexDirection: message.sender?._id === user?._id ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Avatar 
                      src={message.sender?.avatarUrl ? `https://atomglidedev.ru${message.sender.avatarUrl}` : undefined}
                      alt={message.sender?.username}
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: message.sender?._id === user?._id ? 0 : 1,
                        ml: message.sender?._id === user?._id ? 1 : 0,
                      }}
                    />
                    <AeroFrutigerCard sx={{ 
                      maxWidth: '70%',
                      backgroundColor: message.sender?._id === user?._id 
                        ? themeColors.primary 
                        : darkMode 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)',
                      color: message.sender?._id === user?._id ? '#fff' : themeColors.text,
                    }}>
                      <CardHeader
                        avatar={null}
                        title={message.sender?.username || 'Неизвестный'}
                        subheader={new Date(message.timestamp).toLocaleString()}
                        sx={{ 
                          p: 1, 
                          pb: 0,
                          '& .MuiCardHeader-title': {
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          },
                          '& .MuiCardHeader-subheader': {
                            fontSize: '0.75rem',
                            color: message.sender?._id === user?._id 
                              ? 'rgba(255, 255, 255, 0.7)' 
                              : 'rgba(0, 0, 0, 0.6)',
                          },
                        }}
                      />
                      <CardContent sx={{ p: 1, pt: 0 }}>
                        <Typography variant="body1">{message.content}</Typography>
                      </CardContent>
                    </AeroFrutigerCard>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Поле ввода сообщения */}
            <Box sx={{ 
              p: 2, 
              borderTop: `1px solid ${darkMode ? '#333' : '#ddd'}`,
              display: 'flex',
              alignItems: 'center',
            }}>
              <AeroTextField
                fullWidth
                variant="outlined"
                placeholder="Напишите сообщение..."
                value={newMessage}
                onChange={(e) => updateState({ newMessage: e.target.value })}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                sx={{ mr: 1 }}
              />
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || connectionStatus !== 'authenticated'}
              >
                <Send />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Выберите или создайте группу</Typography>
            <Button 
              variant="contained" 
              startIcon={<GroupAdd />}
              onClick={() => updateState({ openCreateDialog: true })}
            >
              Создать группу
            </Button>
          </Box>
        )}
      </Box>

      {/* Диалог создания группы */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => updateState({ openCreateDialog: false })}
        PaperProps={{
          sx: {
            backgroundColor: themeColors.background,
            color: themeColors.text,
            borderRadius: '12px',
            backgroundImage: darkMode 
              ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))' 
              : 'linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))',
          }
        }}
      >
        <DialogTitle>Создать новую группу</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <label htmlFor="group-image-upload">
                <input
                  id="group-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Avatar
                  src={previewImage}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    cursor: 'pointer',
                    backgroundColor: darkMode ? '#333' : '#ddd',
                  }}
                >
                  <AddPhotoAlternate sx={{ fontSize: 40 }} />
                </Avatar>
              </label>
            </Box>
            
            <AeroTextField
              label="Название группы"
              value={newGroupName}
              onChange={(e) => updateState({ newGroupName: e.target.value })}
              fullWidth
            />
            
            <AeroTextField
              label="Описание (необязательно)"
              value={newGroupDesc}
              onChange={(e) => updateState({ newGroupDesc: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => updateState({ isPublic: e.target.checked })}
                  color="primary"
                />
              }
              label={isPublic ? 'Публичная группа' : 'Приватная группа'}
              sx={{ color: themeColors.text }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => updateState({ openCreateDialog: false })}>
            Отмена
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained"
            disabled={!newGroupName.trim() || connectionStatus !== 'authenticated'}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => updateState({ snackbarOpen: false })}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => updateState({ snackbarOpen: false })}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default GroupChat;