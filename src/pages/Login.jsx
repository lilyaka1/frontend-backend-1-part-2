import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Login as LoginIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Real-time валидация
  useEffect(() => {
    const newErrors = {};

    // Валидация email

    // Валидация пароля
    if (formData.password && formData.password.length < 4) {
      newErrors.password = 'Пароль должен содержать минимум 4 символа';
    }

    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Проверяем, есть ли ошибки валидации
    if (Object.keys(errors).length > 0) {
      setError('Исправьте ошибки в форме');
      return;
    }

    // Проверяем обязательные поля
    if (!formData.email || !formData.password) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Проверяем пользователя в "базе данных"
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        login(user);
        navigate('/profile');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            🚪 Вход в систему
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Логин"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            error={!!errors.email}
            helperText={errors.email}
            required
          />

          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={!!errors.password}
            helperText={errors.password}
            required
          />

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            disabled={loading || Object.keys(errors).length > 0}
            sx={{ mt: 2 }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Нет аккаунта?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
            fullWidth
            sx={{ mt: 1 }}
          >
            На главную
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;