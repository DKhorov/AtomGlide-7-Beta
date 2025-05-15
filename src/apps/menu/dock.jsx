import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Grid,
  Paper,
  styled,
  Fade,
  Slide,
  Grow,
  Zoom
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import BugReportIcon from '@mui/icons-material/BugReport';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { keyframes } from '@emotion/react';
import Newpostm from '../new-post/newpost-mob';

// Анимации
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Цветовая схема
const colors = {
  primary: '#9147ff',
  secondary: '#772ce8',
  background: '#0d1117',
  card: '#161b22',
  text: '#c9d1d9',
  accent: '#58a6ff'
};

// Стилизованные компоненты
const FeatureBanner = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  borderRadius: '8px',
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  color: 'white',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: colors.card,
  padding: theme.spacing(1.5),
  borderRadius: '6px',
  overflowX: 'auto',
  fontFamily: 'monospace',
  margin: theme.spacing(1.5, 0),
  fontSize: '0.9rem',
  borderLeft: `3px solid ${colors.accent}`
}));

const MobileSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: colors.primary,
  paddingBottom: '4px',
  borderBottom: `2px solid ${colors.card}`
}));


const FloatingBox = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`
});

const PulsingBox = styled(Box)({
  animation: `${pulseAnimation} 2s ease-in-out infinite`
});

// Компонент бегущей строки
const RunningText = ({ text }) => {
  return (
    <Box sx={{
      width: '100%',
      overflow: 'hidden',
      bgcolor: colors.primary,
      py: 1,
      mb: 3,
      borderRadius: '4px'
    }}>
      <Box sx={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        animation: `${keyframes`
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        `} 15s linear infinite`,
        color: 'white',
        fontWeight: 'bold'
      }}>
        {Array(5).fill(text).join(' ••• ')}
      </Box>
    </Box>
  );
};

// Основной компонент
function Dock() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Упрощенное меню
  const menuSections = [
    { id: 'features', text: 'Обновления', icon: <CodeIcon /> },
    { id: 'quick-start', text: 'Быстрый старт', icon: <RocketLaunchIcon /> },
    { id: 'API', text: 'Праивла', icon: <LinkIcon /> },
    { id: 'social', text: 'Соцсети', icon: <GroupIcon /> },
    { id: 'if-not-work', text: 'Если не работает', icon: <BugReportIcon /> },
    { id: 'thanks', text: 'Благодарности', icon: <GavelIcon /> }
  ];

  // Боковое меню (JSX внутри переменной)
  const drawer = (
    <Box sx={{ 
      width: 260, 
      height: '100vh', 
      bgcolor: colors.background,
      borderRight: `1px solid ${colors.card}`
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${colors.card}`,
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ 
          color: colors.primary,
          fontWeight: 'bold',
          mb: 1
        }}>
          AtomGlide
        </Typography>
        <Typography variant="body2" sx={{ 
          color: colors.text,
          opacity: 0.8
        }}>
          Документация v5.0
        </Typography>
      </Box>
      
      <List sx={{ p: 2 }}>
        {menuSections.map((item) => (
          <ListItem 
            key={item.id} 
            disablePadding
            sx={{
              mb: 1,
              borderRadius: '8px',
              bgcolor: activeSection === item.id ? 'rgba(145, 71, 255, 0.2)' : 'transparent',
              borderLeft: activeSection === item.id ? `3px solid ${colors.primary}` : 'none'
            }}
          >
            <ListItemButton 
              onClick={() => handleSectionChange(item.id)}
              sx={{
                py: 1.5,
                px: 2
              }}
            >
              <Box sx={{ 
                color: activeSection === item.id ? colors.primary : colors.text,
                mr: 2
              }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    color: activeSection === item.id ? colors.primary : colors.text,
                    fontWeight: activeSection === item.id ? '600' : '400'
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

// Основное содержимое
const renderContent = () => {
switch (activeSection) {

  
  case 'features':
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Основные возможности
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 1.0 Релиз",
              items: [
                "Личные чаты",
                "Новые посты",
                "Темы постов",
                "Новый редактор постов"
              ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 1.5",
              items: [
                "Исправлена работа Markdown в постах для корректного отображения форматирования",
                "Выпущена документация версии 3.0",
                "Исправлены ошибки и баги, повышена стабильность работы платформы",
                "Улучшен поиск по контенту для быстрого доступа к нужной информации"
              ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 2.0",
              items: [
                "Новые профили как ТГ",
                "Исправлены баги на главном экране",
                "отображение сколько комментов на посту на главном экране"
              ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 2.5",
              items: [
                "Теперь есть НФТ в профиле",
                "НФТ как в тг",
              ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 3.0",
              items: [
                "Исправлен баг с постами на главной старнице с язком поста",
                "Чаты теперь почти доступны на телефонах",
                "Новая оптимизация для телефонов",
                "Добавил wallet баланс на главном экране",
              ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 4.0",
              items: [
                "Исправлен баг с часами ",
                "Исправлен баг в профиле разделе 'о себе' ",
                "Чаты показывают аву пользователя",
                "Добавлен редатор кода на базе VS Code",
                "Добавил wallet баланс на главном экране",
                "Новый пункт в главном меню 'popular'",
                "Новая дока 4.0",
                "Новые НФТ",
              ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 5.0",
              "items": [
    "Новый интерфейс AtomUI 3",
    "Новая панель меню и шапка сайта",
    "Добавлен Wallet и переводы в сети AtomGlide",
    "Новая логика работы постов: регионы постов",
    "Добавлена новая среда разработки AtomScript Gen 1",
    "Удаление постов в целях безопасности отключено",
    "Новая документация 5.0",
    "Новый профиль AtomGlide News"
  ]
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 5.5",
                items: [
                  "Исправлен баг с созданием постов на телефонах",
                  "Новый главный экран для авторизованных пользователей",
                  "Улучшена лента рекомендаций"
                ]
              
              
            },
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Обновление 6.0",
              
                "items": [
                  "Новый интерфейс AtomUI 3",
                  "Теперь можно скопировать данные про пользователя просто нажав на инфу в профиле",
                  "Теперь можно глянуть превью поста перед отправкой на ПК",
                  "Описание постов при создании на телефоне",
                  "Исправлено 90% багов",
                  "Новый дизайн профиля",
                  "Новая вкладка 'Моя лента'",
                  "Теперь на главном экране в посте описание",
                  "Исправлено разрешение фото в посте на телефоне и ПК",
                  "Новая политика AtomGlide"
                ]
              
              
              
              
            },
          
          
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in timeout={500 + index * 200}>
                <Card sx={{ 
                  bgcolor: colors.card,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ 
                        color: colors.primary,
                        ml: 1
                      }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <ul style={{ 
                      paddingLeft: '20px', 
                      margin: 0,
                      color: colors.text
                    }}>
                      {feature.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  
  case 'quick-start':
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Быстрый старт
        </Typography>
        
        <Typography paragraph sx={{ color: colors.text }}>
          Начните работу с AtomGlide 
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            1. Регистарция 
          </Typography>
          <CodeBlock>
            Чтобы провести регистарцию на сайте на станице входа в аккаунт будет кнпока регистарции нажми на ее и ты попадешь на страницу регистарции. Заполни все поля , ник должен быть с @ в начале и пароль беольше 6 символов
          </CodeBlock>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            2. Создание постов
          </Typography>
          <CodeBlock>
          В появившемся окне заполни все поля ввода — заголовок, описание и сам текст поста. Если что-то пропустишь, сайт не даст завершить создание поста.          </CodeBlock>
          <Typography variant="body2" sx={{ 
            color: colors.text,
            mt: 1,
            opacity: 0.8
          }}>
            
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            3. Чаты 
          </Typography>
          <CodeBlock>
          Чтобы начать чат с пользователем, перейди на страницу чатов, нажми "+", затем введи ID пользователя, который можно найти в его профиле в разделе "Дополнительно", после этого чат откроется, и можно начинать общение. 🚀
          </CodeBlock>
          <Typography variant="body2" sx={{ 
            color: colors.text,
            mt: 1,
            opacity: 0.8
          }}>
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            3. Mini-Apps , API , AtomScript 
          </Typography>
          <CodeBlock>
          AtomScript — внутренняя среда разработки мини-приложений в сети AtomGlide, предоставляющая готовый набор инструментов для работы с API и встроенным хостингом, но не поддерживаемая за пределами платформы. Чтобы создать мини-приложение, нужно открыть AtomCode, создать проект в формате HTML, добавить стили и скрипты, затем опубликовать его как пост с тегом #apps, после чего он сразу станет мини-приложением. На данный момент запуск приложений в AtomScript пока не реализован, а API для интеграции внешних проектов за пределами AtomGlide временно недоступно.
          </CodeBlock>
          <Typography variant="body2" sx={{ 
            color: colors.text,
            mt: 1,
            opacity: 0.8
          }}>
          </Typography>
        </Box>
      </Box>
    );
  
  case 'social':
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Наши соцсети
        </Typography>
        
        <Typography paragraph sx={{ color: colors.text, mb: 3 }}>
          Присоединяйтесь к нашему сообществу в социальных сетях:
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <TelegramIcon sx={{ color: '#0088cc', fontSize: 40 }} />,
              name: "Telegram",
              description: "Официальный канал с анонсами и обсуждениями",
              link: "https://t.me/dkdevelop"
            },
            {
              icon: <GitHubIcon sx={{ color: colors.text, fontSize: 40 }} />,
              name: "GitHub",
              description: "Исходный код Front-end",
              link: "https://github.com/DKhorov"
            },

          ].map((social, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Slide direction="up" in timeout={500 + index * 200}>
                <Card sx={{ 
                  bgcolor: colors.card,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 3 }}>
                      {social.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: colors.primary }}>
                        {social.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
                        {social.description}
                      </Typography>
                      <Typography 
                        component="a" 
                        href={social.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          color: colors.accent,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Перейти →
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  
  case 'if-not-work': // Новый раздел вместо 'contribute'
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Решение распространенных проблем
        </Typography>

        {/* Проблема с фото */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Не грузит фото
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Данная проблема возникает из-за задержки загрузки ресурсов:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Перезагрузите страницу (Ctrl + F5)</li>
              <li>Проверьте подключение к интернету</li>
              <li>Убедитесь, что пост содержит изображение</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с постами */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Не грузятся посты
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Возможные решения:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Проверьте статус сервера в Telegram-канале</li>
              <li>Обновите страницу через 2-3 минуты</li>
              <li>Очистите кеш браузера</li>
              <li>Если посты пропали — обратитесь в поддержку</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с профилем */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Ошибка в профиле
            </Typography>
            <Typography sx={{ color: colors.text }}>
              После регистрации:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Дождитесь завершения инициализации аккаунта (до 5 мин)</li>
              <li>Перезагрузите страницу</li>
              <li>Если проблема сохраняется — войдите повторно</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с лайками */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Ошибка при лайке
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Что можно сделать:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Проверьте статус сайта</li>
              <li>Обновите интерфейс (F5)</li>
              <li>Убедитесь, что не нажали кнопку дважды</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с комментариями */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Нельзя ответить на свой комментарий
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Это ограничение системы:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Ответы на свои комментарии временно отключены</li>
              <li>Функция появится в следующих обновлениях</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с интерфейсом */}
        <Card sx={{ bgcolor: colors.card }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Лаги на мобильных устройствах
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Рекомендации:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Используйте десктопную версию</li>
              <li>Обновите браузер до последней версии</li>
              <li>Активируйте "Версию для ПК" в настройках браузера</li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    );

  case 'thanks': // Обновленный раздел благодарностей
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Благодарности
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              name: "Dmitry Khorov",
              role: "Fullstack разработчик (Frontend, Backend, SEO)",
              contribution: "Архитектура платформы, основная разработка"
            },
            {
              name: "Dmitry Khorov",
              role: "Dart и Kotlin разработчик ",
              contribution: "Порт AtomGlide на Flutter"
            },
            {
              name: "Александр Лукин",
              role: "UI/UX дизайнер",
              contribution: "формы входа и регистарции"
            },
            {
              name: "Егор Смирский (xxlOads)",
              role: "Data analytics",
              contribution: "Настройка сетей AtomWiki "
            },
            {
              name: "kinocide",
              role: "Спонсор, Менеджер сети AtomWiki",
              contribution: "Настройка сетей AtomWiki "
            },
            {
              name: "Community",
              role: "Пользователи платформы",
              contribution: "Идеи и обратная связь"
            }
          ].map((person, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Zoom in timeout={500 + index * 200}>
                <Card sx={{ bgcolor: colors.card }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: colors.primary }}>
                      {person.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text, mt: 1 }}>
                      {person.role}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: colors.text,
                      opacity: 0.8,
                      mt: 1
                    }}>
                      {person.contribution}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  
  default:
    return (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ 
            color: colors.primary, 
            pb: 2,
            borderBottom: `1px solid ${colors.card}`
          }}>
            Правила сервиса
          </Typography>
          
          <Typography paragraph sx={{ color: colors.text }}>
          Мы — свободная платформа, но для сохранения порядка и комфортного общения есть определённые правила, которым стоит следовать. Они помогают создать дружелюбную атмосферу и поддерживать мир внутри сообщества. 🚀
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ 
              color: colors.primary,
              mb: 2
            }}>
              Посты
            </Typography>
            <CodeBlock>
            🔹 Запрещен контент эротического характера — он может быть неприятен пользователям и команде проекта. 🔹 Нельзя публиковать материалы, оскорбляющие религию — администраторы следят за этим и могут принять меры. 🔹 Запрещены экстремистские посты, призывы к свержению власти и оскорбления лидеров государств (безобидные мемы — ок). 🔹 Посты, направленные на вред системе сервиса, также отслеживаются — администрация реагирует на подобные случаи. 🔹 Спам строго запрещен — бессмысленные посты могут привести к блокировке аккаунта или ограничению доступа к сайту.
            </CodeBlock>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ 
              color: colors.primary,
              mb: 2
            }}>
              2. Сбор информации 
            </Typography>
            <CodeBlock>
            Мы не собираем и не передаем ваши данные третьим лицам. Ваши пароли надежно зашифрованы, и даже разработчики не имеют к ним доступа.
Однако модерация действует во всех зонах платформы: посты, темы, чаты — да, даже чаты.
Если вы подали жалобу на собеседника, модераторы могут проверить переписку, но только по запросу. Без причины никто не просматривает личные сообщения, и доступ к ним возможен только после рассмотрения жалобы.   </CodeBlock>
            <Typography variant="body2" sx={{ 
              color: colors.text,
              mt: 1,
              opacity: 0.8
            }}>
              
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h5" sx={{ 
              color: colors.primary,
              mb: 2
            }}>
              3. Тук-Тук Открываем!
            </Typography>
            <CodeBlock>
            Если у нас есть претензии или вас нужно уведомить о чём-то важном, вам придёт сообщение от официального аккаунта модераторов (AtomGlide News, AtomGlide Admin) в личные чаты на сайте.  

Также, если вопрос требует личного обсуждения, разработчик может связаться с вами напрямую через **Telegram**.  
Следите за сообщениями, чтобы не пропустить важную информацию! 🚀
            </CodeBlock>
            <Typography variant="body2" sx={{ 
              color: colors.text,
              mt: 1,
              opacity: 0.8
            }}>
              Это не угроза
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ 
              color: colors.primary,
              mb: 2
            }}>
              3. Все должно быть супер гуд
            </Typography>
            <CodeBlock>
            чтобы ваш профиль выглядел привлекательно и мог даже попасть в новостные баннеры, стоит привести его в порядок.
✅ Хорошая аватарка — выразительный образ, который показывает вашу индивидуальность.✅ Фон профиля — добавляет стиль и делает аккаунт визуально интереснее.✅ Читаемое имя — без лишних символов и случайного набора букв.
Красивый и ухоженный профиль всегда привлекает внимание!
            </CodeBlock>
       
          </Box>
        </Box>
    
    
    );
}
};

return (
<Box sx={{
display: 'flex',
bgcolor: colors.background,
minHeight: '100vh',
color: colors.text
}}>
{/* Кнопка меню для мобильных */}
<IconButton
color="inherit"
aria-label="open drawer"
edge="start"
onClick={handleDrawerToggle}
sx={{
position: 'fixed',
top: 16,
left: 16,
zIndex: theme.zIndex.drawer + 1,
display: { xs: 'block', md: 'none' },
color: colors.text
}}
>
<MenuIcon />
</IconButton>

  {/* Боковое меню */}
  <Box
    component="nav"
    sx={{ 
      width: { md: 260 },
      flexShrink: { md: 0 }
    }}
  >
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box',
          width: 260,
          bgcolor: colors.background,
          borderRight: `1px solid ${colors.card}`
        },
      }}
    >
      {drawer}
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box',
          width: 260,
          bgcolor: colors.background,
          borderRight: `1px solid ${colors.card}`
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  </Box>
  
  {/* Основное содержимое */}
  <Box
    component="main"
    sx={{ 
      flexGrow: 1,
      p: 3,
      width: { md: `calc(100% - 260px)` },
      maxWidth: 1200,
      margin: '0 auto'
    }}
  >
    <Box sx={{ 
      pt: { xs: 6, md: 3 },
      pb: 3
    }}>
      {renderContent()}
    </Box>
  </Box>
</Box>
);
}

export default Dock;