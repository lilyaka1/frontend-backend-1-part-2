import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  LinearProgress,
  Chip,
  Container,
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Code as CodeIcon,
  Home as HomeIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  Api as ApiIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTechnologies } from '../contexts/TechnologyContext';

function Navigation() {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const { technologies } = useTechnologies();

  // Вычисляем прогресс
  const totalCount = technologies.length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {/* Лого */}
          <CodeIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              textDecoration: 'none',
              color: 'inherit',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Трекер технологий
          </Typography>

          {/* Навигационные кнопки */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<HomeIcon />}
              variant={isActive('/') ? 'outlined' : 'text'}
            >
              Главная
            </Button>
            <Button
              component={Link}
              to="/technologies"
              color="inherit"
              startIcon={<ListIcon />}
              variant={isActive('/technologies') ? 'outlined' : 'text'}
            >
              Технологии
            </Button>
            <Button
              component={Link}
              to="/statistics"
              color="inherit"
              startIcon={<BarChartIcon />}
              variant={isActive('/statistics') ? 'outlined' : 'text'}
            >
              Статистика
            </Button>
            <Button
              component={Link}
              to="/api-demo"
              color="inherit"
              startIcon={<ApiIcon />}
              variant={isActive('/api-demo') ? 'outlined' : 'text'}
            >
              API Demo
            </Button>
          </Box>

          {/* Прогресс */}
          {totalCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <Chip
                label={`${completedCount}/${totalCount}`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Box sx={{ width: 100, display: { xs: 'none', md: 'block' } }}>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>
                {progressPercent}%
              </Typography>
            </Box>
          )}

          {/* Пользователь */}
          {user ? (
            <Button
              component={Link}
              to="/profile"
              color="inherit"
              startIcon={<PersonIcon />}
              variant={isActive('/profile') ? 'outlined' : 'text'}
            >
              {user.name}
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              color="inherit"
              startIcon={<LoginIcon />}
              variant={isActive('/login') ? 'outlined' : 'text'}
            >
              Войти
            </Button>
          )}

          {/* Настройки */}
          <IconButton
            component={Link}
            to="/settings"
            color="inherit"
            sx={{
              border: isActive('/settings') ? '1px solid currentColor' : 'none',
            }}
          >
            <SettingsIcon />
          </IconButton>

          {/* Переключатель темы */}
          <IconButton onClick={toggleTheme} color="inherit">
            {isDark ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation;