import React, { useState, useEffect } from 'react';
import {
  SettingsContainer,
  SettingsSection,
  SectionTitle,
  ThemeGrid,
  ThemeOption,
  ThemePreview,
  ThemeName,
  Button,
  PasswordForm,
  FormGroup,
  ComingSoon,
  SoundOption,
  SoundLabel,
  RadioGroup,
  RadioOption,
  ExportButton,
  CustomThemePanel
} from './settingsStyles';
import styled from '@emotion/styled';

const SettingsPage = () => {
  const [soundSetting, setSoundSetting] = useState('medium');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCustomThemeActive, setIsCustomThemeActive] = useState(false);

   const themes = [
    { 
      name: 'Classic', 
      imgUrl: 'https://example.com/classic.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'Fruiter Aero', 
      imgUrl: 'https://atomglidedev.ru/uploads/1747260633817-703941042.png',
      text: '#FFFFFF' 
    },
    { 
      name: 'Dark Aero', 
      imgUrl: 'https://frutiger-aero.org/img/dark-aurora.webp',
      text: '#FFFFFF' 
    },
    { 
      name: 'Windows Vista', 
      imgUrl: 'https://atomglidedev.ru/uploads/1747260730232-445972766.jpg',
      text: '#000000' 
    },
    { 
      name: 'MacOS 9', 
      imgUrl: 'https://preview.redd.it/old-macos-9-wallpapers-remastered-to-the-new-finder-logo-v0-mf89d4qu7u4e1.png?width=4480&format=png&auto=webp&s=2b74c97789f2f4961879e3f4621bd712dee8db5d',
      text: '#000000' 
    },
      { 
      name: 'Windows XP', 
      imgUrl: 'https://cdn.wallpaperhub.app/cloudcache/c/1/4/5/2/7/c1452724f0c3bb5a9a9a9898b4c0a0cfac091f70.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'macOS Sequoia ', 
      imgUrl: 'https://images.macrumors.com/t/V21I5UD3QqbDolmG1zZM_OAzIS4=/2000x/article-new/2024/08/macos-sequoia-hidden-wallpaper.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'ThinkPad ', 
      imgUrl: 'https://preview.redd.it/8nixmv7qg9g21.png?width=1920&format=png&auto=webp&s=7141b33be2b7a04658dcd99afc860b83b144a46e',
      text: '#FFFFFF' 
    },
     { 
      name: 'Lenovo ', 
      imgUrl: 'https://forums.lenovo.com/uploads/topic/202109/1631504567223.jpeg?aid=264092',
      text: '#FFFFFF' 
    },
    { 
      name: 'Windows 11 Dark', 
      imgUrl: 'https://winblogs.thesourcemediaassets.com/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'Windows 11', 
      imgUrl: 'https://cdn.wallpaperhub.app/cloudcache/2/b/c/3/7/5/2bc375a59ea8bb65dbd995b77ab56cbc3107a651.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'GTA Vice City', 
      imgUrl: 'https://wallpapercat.com/w/full/3/4/9/2154000-1920x1080-desktop-1080p-gta-vice-city-background-photo.jpg',
      text: '#FFFFFF' 
    },
  
     { 
      name: 'Pavel Durov', 
      imgUrl: 'https://wallpapercat.com/w/full/b/9/b/18059-1920x1280-desktop-hd-pavel-durov-wallpaper.jpg',
      text: '#FFFFFF' 
    },
     { 
      name: 'Telegram', 
      imgUrl: 'https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png',
      text: '#FFFFFF' 
    },
    { 
      name: 'GitHub', 
      imgUrl: 'https://preview.redd.it/3840-x-2160-github-link-preview-banner-with-dark-theme-v0-nt29vlmrr3je1.png?auto=webp&s=78e8c8226d49ee07e97cbbe07f6ba79c7fcdb7a7',
      text: '#FFFFFF' 
    },
      { 
      name: 'Deanon', 
      imgUrl: 'https://www.meme-arsenal.com/memes/a81c76e69f20880e5899baf47a1176bc.jpg',
      text: '#FFFFFF' 
    },
     { 
      name: 'Intel', 
      imgUrl: 'https://wallpapercat.com/w/full/0/6/a/2124275-2560x1600-desktop-hd-intel-wallpaper-photo.jpg',
      text: '#FFFFFF' 
    },
    { 
      name: 'Steve Jobs ', 
      imgUrl: 'https://wallpapercat.com/w/full/6/c/b/11251-1920x1080-desktop-1080p-steve-jobs-background-photo.jpg',
      text: '#FFFFFF' 
    },
  
  ];

  // Загрузка сохраненных настроек
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || themes[0].name;
  });

  const [customThemeUrl, setCustomThemeUrl] = useState(() => {
    return localStorage.getItem('customThemeUrl') || '';
  });

  // Применение темы при загрузке
  useEffect(() => {
    applyTheme(selectedTheme);
  }, []);

  const applyTheme = (themeName) => {
    if (themeName === 'Custom' && customThemeUrl) {
      document.body.style.backgroundImage = `url(${customThemeUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      const theme = themes.find(t => t.name === themeName);
      if (theme) {
        document.body.style.backgroundImage = `url(${theme.imgUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
      }
    }
  };

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    localStorage.setItem('selectedTheme', themeName);
    applyTheme(themeName);
  };

  const handleCustomThemeSubmit = (e) => {
    e.preventDefault();
    if (customThemeUrl) {
      localStorage.setItem('customThemeUrl', customThemeUrl);
      localStorage.setItem('selectedTheme', 'Custom');
      applyTheme('Custom');
    }
  };


  return (
    <SettingsContainer>
      
      {/* Theme Selection Section */}
      <SettingsSection>
        <SectionTitle>Темы</SectionTitle>
        <ThemeGrid>
          {themes.map((theme) => (
            <ThemeOption 
              key={theme.name} 
              onClick={() => handleThemeSelect(theme.name)}
              className={selectedTheme === theme.name ? 'selected' : ''}
            >
              <ThemePreview 
                style={{ 
                  backgroundImage: `url(${theme.imgUrl})`,
                  color: theme.text
                }}
              >
                {!theme.imgUrl && theme.name}
              </ThemePreview>
              <ThemeName>{theme.name}</ThemeName>
            </ThemeOption>
          ))}
          <ThemeOption 
            onClick={() => handleThemeSelect('Custom')}
            className={selectedTheme === 'Custom' ? 'selected' : ''}
          >
            <ThemePreview 
              style={{ 
                backgroundImage: customThemeUrl ? `url(${customThemeUrl})` : 'none',
                backgroundColor: '#333',
                color: '#FFF'
              }}
            >
              {!customThemeUrl && 'Custom'}
            </ThemePreview>
            <ThemeName>Кастом</ThemeName>
          </ThemeOption>
        </ThemeGrid>
      </SettingsSection>
      
      {/* Custom Theme Section */}
      <SettingsSection>
        <form onSubmit={handleCustomThemeSubmit}>
          <FormGroup>
            <label htmlFor="customThemeUrl">Фото URL:</label>
            <input
              type="text"
              id="customThemeUrl"
              value={customThemeUrl}
              onChange={(e) => setCustomThemeUrl(e.target.value)}
              placeholder="Enter image URL for background"
            />
          </FormGroup>
          <Button type="submit" disabled={!customThemeUrl}>
            Нажми чтобы создать тему
          </Button>
          {isCustomThemeActive && (
            <Button 
              type="button" 
              style={{ marginLeft: '10px', backgroundColor: '#f44336' }}
              onClick={() => {
                setIsCustomThemeActive(false);
                setSelectedTheme('OLED Black');
                localStorage.setItem('isCustomThemeActive', 'false');
                document.body.style.backgroundImage = `url(${themes[0].imgUrl})`;
              }}
            >
              Отключить порт 
            </Button>
          )}
        </form>
      </SettingsSection>
      
      {/* Password Change Section */}

    </SettingsContainer>
  );
};

export default SettingsPage;