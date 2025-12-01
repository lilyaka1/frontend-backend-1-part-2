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
  PersonAdd as PersonAddIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time валидация
  useEffect(() => {
    const newErrors = {};

    // Валидация имени
    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация email - убрана строгая проверка, чтобы позволить простые логины
    // if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Введите корректный email адрес';
    // }

    // Валидация пароля
    if (formData.password && formData.password.length < 4) {
      newErrors.password = 'Пароль должен содержать минимум 4 символа';
    }

    // Валидация подтверждения пароля
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Проверяем, существует ли пользователь
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === formData.email);

      if (existingUser) {
        setError('Пользователь с таким email уже существует');
        return;
      }

      // Регистрируем пользователя
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      navigate('/profile');
    } catch (err) {
      setError('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            📝 Регистрация
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Имя"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ваше имя"
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            fullWidth
            label="Логин или Email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin или your@email.com"
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
            placeholder="••••"
            error={!!errors.password}
            helperText={errors.password || 'Минимум 4 символа'}
            required
            inputProps={{ minLength: 4 }}
          />

          <TextField
            fullWidth
            label="Подтверждение пароля"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            inputProps={{ minLength: 4 }}
          />

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
            disabled={loading || Object.keys(errors).length > 0}
            sx={{ mt: 2 }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Уже есть аккаунт?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                Войти
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

export default Register;