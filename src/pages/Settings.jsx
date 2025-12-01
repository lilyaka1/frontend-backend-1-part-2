import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import WindowSizeTracker from '../components/WindowSizeTracker';

function Settings() {
  const { theme, setLightTheme, setDarkTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    language: 'ru',
    animations: true,
    soundEffects: false,
    compactView: false,
    showProgress: true,
    tileView: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (name, value) => {
    const newSettings = {
      ...settings,
      [name]: value
    };

    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    if (newTheme === 'light') {
      setLightTheme();
    } else if (newTheme === 'dark') {
      setDarkTheme();
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      notifications: true,
      autoSave: true,
      language: 'ru',
      animations: true,
      soundEffects: false,
      compactView: false,
      showProgress: true,
      tileView: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  };

  const exportData = () => {
    const technologies = localStorage.getItem('technologies') || '[]';
    const settings = localStorage.getItem('appSettings') || '{}';

    const data = {
      exportedAt: new Date().toISOString(),
      technologies: JSON.parse(technologies),
      settings: JSON.parse(settings)
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.technologies && Array.isArray(data.technologies)) {
          localStorage.setItem('technologies', JSON.stringify(data.technologies));
          window.location.reload();
        }
        
        if (data.settings) {
          localStorage.setItem('appSettings', JSON.stringify(data.settings));
          setSettings(data.settings);
        }
        
        alert('Данные успешно импортированы!');
      } catch (error) {
        alert('Ошибка при импорте данных: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const importRoadmap = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const roadmapData = JSON.parse(e.target.result);
        
        if (!roadmapData.technologies || !Array.isArray(roadmapData.technologies)) {
          alert('Неверный формат файла дорожной карты. Ожидается массив технологий.');
          return;
        }

        const currentTechnologies = JSON.parse(localStorage.getItem('technologies') || '[]');
        
        const newTechnologies = roadmapData.technologies.map(tech => ({
          ...tech,
          id: Date.now() + Math.random(),
          status: 'not-started',
          createdAt: new Date().toISOString()
        }));

        const updatedTechnologies = [...currentTechnologies, ...newTechnologies];
        
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
        
        alert(`Дорожная карта успешно импортирована! Добавлено ${newTechnologies.length} технологий.`);
        
        window.location.reload();
      } catch (error) {
        alert('Ошибка при импорте дорожной карты: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight={600} mb={4}>
        ⚙️ Настройки
      </Typography>

      <Grid container spacing={3}>
        {/* Внешний вид */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Внешний вид
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Тема оформления</InputLabel>
                <Select
                  value={theme}
                  onChange={handleThemeChange}
                  label="Тема оформления"
                >
                  <MenuItem value="dark">Темная</MenuItem>
                  <MenuItem value="light">Светлая</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.tileView}
                    onChange={(e) => handleChange('tileView', e.target.checked)}
                  />
                }
                label="Плиточный вид (ширина 2 блока)"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Поведение */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Поведение
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                  />
                }
                label="Включить уведомления"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.animations}
                    onChange={(e) => handleChange('animations', e.target.checked)}
                  />
                }
                label="Включить анимации"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.soundEffects}
                    onChange={(e) => handleChange('soundEffects', e.target.checked)}
                  />
                }
                label="Звуковые эффекты"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.compactView}
                    onChange={(e) => handleChange('compactView', e.target.checked)}
                  />
                }
                label="Компактный вид"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showProgress}
                    onChange={(e) => handleChange('showProgress', e.target.checked)}
                  />
                }
                label="Показывать прогресс"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Язык и регион */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Язык и регион
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth>
                <InputLabel>Язык интерфейса</InputLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  label="Язык интерфейса"
                >
                  <MenuItem value="ru">Русский</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Контакты */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Контакты
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                <strong>Email:</strong> support@techtracker.com
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Телефон:</strong> +7 (999) 999-99-63
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Адрес:</strong> г. Москва
              </Typography>
              <Typography variant="body2">
                <strong>Время работы:</strong> Пн-Пт 19:00-23:00
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Мониторинг системы */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Мониторинг системы
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <WindowSizeTracker />
            </CardContent>
          </Card>
        </Grid>

        {/* Дорожные карты */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Дорожные карты
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
              >
                📥 Импорт дорожной карты
                <input
                  type="file"
                  accept=".json"
                  onChange={importRoadmap}
                  hidden
                />
              </Button>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Импорт дорожной карты добавит новые технологии к существующему списку.
                Файл должен содержать объект с массивом технологий.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Данные и резервное копирование */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Данные и резервное копирование
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={exportData}
                >
                  📤 Экспорт данных
                </Button>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                >
                  📥 Импорт данных
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    hidden
                  />
                </Button>
                
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<RefreshIcon />}
                  onClick={resetSettings}
                >
                  🔄 Сбросить настройки
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Экспорт создаст файл с резервной копией всех технологий и настроек.
                Импорт загрузит данные из JSON файла.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Футер */}
      <Box mt={4} textAlign="center">
        <Button
          component={Link}
          to="/"
          variant="text"
          startIcon={<CodeIcon />}
          size="large"
        >
          ⌖ Трекер технологий
        </Button>
      </Box>
    </Container>
  );
}

export default Settings;
