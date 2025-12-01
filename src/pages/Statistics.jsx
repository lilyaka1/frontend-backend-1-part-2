import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  List as ListIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  NotStarted as NotStartedIcon,
} from '@mui/icons-material';
import { useTechnologies } from '../contexts/TechnologyContext';

function Statistics() {
  const { technologies } = useTechnologies();

  // Оптимизированные вычисления статистики с useMemo
  const stats = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;

    // Расчет прогресса
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progress
    };
  }, [technologies]);

  // Мемоизированные расчеты для диаграмм
  const barWidths = useMemo(() => ({
    completed: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    inProgress: stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0,
    notStarted: stats.total > 0 ? (stats.notStarted / stats.total) * 100 : 0
  }), [stats]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Typography variant="h3" component="h1" gutterBottom fontWeight={600} mb={4}>
        📊 Статистика прогресса
      </Typography>

      {/* Карточки статистики */}
      <Grid container spacing={3} mb={4}>
        {/* Общий прогресс */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Общий прогресс
              </Typography>
              <Box position="relative" display="inline-flex" my={2}>
                <CircularProgress
                  variant="determinate"
                  value={stats.progress}
                  size={120}
                  thickness={5}
                  sx={{
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.progress}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Всего технологий */}
        <Grid item xs={12} sm={6} md={2}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Всего
              </Typography>
              <Typography variant="h3" fontWeight={700} color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Завершено */}
        <Grid item xs={12} sm={6} md={2}>
          <Card elevation={2} sx={{ height: '100%', bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Завершено
              </Typography>
              <Typography variant="h3" fontWeight={700}>
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* В процессе */}
        <Grid item xs={12} sm={6} md={2}>
          <Card elevation={2} sx={{ height: '100%', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <HourglassEmptyIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                В процессе
              </Typography>
              <Typography variant="h3" fontWeight={700}>
                {stats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Не начато */}
        <Grid item xs={12} sm={6} md={2}>
          <Card elevation={2} sx={{ height: '100%', bgcolor: 'grey.300' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <NotStartedIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Не начато
              </Typography>
              <Typography variant="h3" fontWeight={700}>
                {stats.notStarted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Подробная статистика */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600} mb={3}>
            Подробная статистика
          </Typography>

          {/* Завершено */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1" fontWeight={600}>
                Завершено
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.completed} из {stats.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={barWidths.completed}
              color="success"
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          {/* В процессе */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1" fontWeight={600}>
                В процессе
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.inProgress} из {stats.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={barWidths.inProgress}
              color="warning"
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          {/* Не начато */}
          <Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1" fontWeight={600}>
                Не начато
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.notStarted} из {stats.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={barWidths.notStarted}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <Box display="flex" gap={2} justifyContent="center" mt={4}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          size="large"
        >
          На главную
        </Button>
        <Button
          component={Link}
          to="/technologies"
          variant="outlined"
          startIcon={<ListIcon />}
          size="large"
        >
          К технологиям
        </Button>
      </Box>
    </Container>
  );
}

export default Statistics;