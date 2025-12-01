import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTechnologies } from '../contexts/TechnologyContext';
import MuiDashboard from '../components/MuiDashboard';
import Roadmap from '../components/Roadmap';
import './Home.css';
import welcomeVideo from '../assets/code10.mp4';

function Home() {
  const videoRef = useRef(null);
  const { technologies } = useTechnologies();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Скрываем элементы управления принудительно
      video.controls = false;
      video.disablePictureInPicture = true;
      
      // Гарантируем, что видео воспроизводится
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log('Video autoplay failed:', error);
        }
      };
      
      // Запускаем сразу
      playVideo();
      
      // Запускаем при загрузке метаданных
      const handleLoadedMetadata = () => {
        video.controls = false;
        playVideo();
      };
      
      // Запускаем при готовности данных
      const handleLoadedData = () => {
        video.controls = false;
        playVideo();
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedData);
      
      // Повторяем попытку воспроизведения при взаимодействии с пользователем
      const handleUserInteraction = () => {
        video.controls = false;
        playVideo();
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
      
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('loadeddata', handleLoadedData);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, []);

  return (
    <Box>
      {/* Hero Section с видео */}
      <Box className="hero-section" sx={{ position: 'relative', mb: 4 }}>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          className="hero-video"
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <source src={welcomeVideo} type="video/mp4" />
        </video>
        <Box className="hero-content">
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Добро пожаловать в Трекер технологий!
          </Typography>
          <Typography variant="h5" color="inherit">
            Отслеживайте свой прогресс в изучении современных технологий разработки
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Dashboard со статистикой */}
        {technologies.length > 0 && (
          <Box mb={4}>
            <MuiDashboard technologies={technologies} />
          </Box>
        )}

        {/* Feature Cards */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={600} mb={3}>
            Основные функции
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <TrendingUpIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Прогресс изучения
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Отслеживайте статус каждой технологии и общий прогресс
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to="/technologies"
                    endIcon={<ListIcon />}
                  >
                    Посмотреть
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <AddIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Добавление технологий
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Добавляйте новые технологии для изучения
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to="/add-technology"
                    color="success"
                  >
                    Добавить
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <BarChartIcon color="info" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Статистика
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Просматривайте статистику и графики прогресса
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to="/statistics"
                    color="info"
                  >
                    Посмотреть
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <SettingsIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Настройки
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Настройте приложение под свои нужды
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to="/settings"
                    color="secondary"
                  >
                    Открыть
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Roadmap */}
        <Roadmap />
      </Container>
    </Box>
  );
}

export default Home;