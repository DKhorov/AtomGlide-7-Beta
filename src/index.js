import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import theme from './apps/sys-tool/theme';
import AppRouter from './Router';
import { NotificationProvider } from './apps/tools/ui-menu/pushbar/pushbar';
import store from './redux/store';
import { GlobalStyles } from '@mui/material';

// Инициализация темы при загрузке
const initTheme = () => {
  const savedTheme = localStorage.getItem('selectedTheme');
  const customUrl = localStorage.getItem('customThemeUrl');
  
  if (savedTheme === 'Custom' && customUrl) {
    applyTheme(customUrl);
  } else if (savedTheme) {
    const defaultThemes = {
      'Classic': 'https://example.com/classic.jpg',
      'Fruiter Aero': 'https://atomglidedev.ru/uploads/1747260633817-703941042.png',
      'Dark Aero': 'https://frutiger-aero.org/img/dark-aurora.webp',
      'Windows Vista': 'https://atomglidedev.ru/uploads/1747260730232-445972766.jpg',
      'MacOS 9': 'https://preview.redd.it/old-macos-9-wallpapers-remastered-to-the-new-finder-logo-v0-mf89d4qu7u4e1.png'
    };
    
    if (defaultThemes[savedTheme]) {
      applyTheme(defaultThemes[savedTheme]);
    }
  }
};

const applyTheme = (imageUrl) => {
  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
  document.body.style.transition = 'background-image 0.5s ease';
};

// Применяем тему сразу при запуске
initTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
          body: {
            margin: 0,
            padding: 0,
          }
        }} />
        <BrowserRouter>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);