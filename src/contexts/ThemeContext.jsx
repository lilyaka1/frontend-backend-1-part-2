import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../styles/muiTheme';

// Создаем контекст для темы
const ThemeContext = createContext();

// Хук для использования контекста темы
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Провайдер контекста темы
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  // Загрузка темы из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('appTheme');
    if (saved) {
      setTheme(saved);
    } else {
      // По умолчанию темная тема
      setTheme('dark');
    }
  }, []);

  // Сохранение темы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('appTheme', theme);

    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Функции для работы с темой
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setGreenTheme = () => setTheme('green');

  // Выбираем MUI тему на основе текущей темы
  const muiTheme = theme === 'light' ? lightTheme : darkTheme;

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setGreenTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isGreen: theme === 'green'
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};