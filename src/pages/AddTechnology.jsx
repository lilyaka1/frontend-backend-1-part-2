import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTechnologies } from '../contexts/TechnologyContext';
import { useForm, useDebounce } from '../hooks/useLocalStorage';

function AddTechnology() {
  const navigate = useNavigate();
  const { addTechnology } = useTechnologies();

  // Используем кастомный хук useForm
  const { values, handleChange, reset, setField } = useForm({
    title: '',
    description: '',
    category: 'frontend',
    deadline: ''
  });

  // Debounced значение для проверки уникальности названия
  const debouncedTitle = useDebounce(values.title, 500);

  // Состояние для валидации
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!values.title.trim()) {
      newErrors.title = 'Название обязательно для заполнения';
    } else if (values.title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    }

    if (!values.description.trim()) {
      newErrors.description = 'Описание обязательно для заполнения';
    } else if (values.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Имитация асинхронной операции (например, API вызов)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Создаем новую технологию через контекст
      const newTechnology = {
        title: values.title.trim(),
        description: values.description.trim(),
        notes: '',
        category: values.category,
        deadline: values.deadline || null
      };

      addTechnology(newTechnology);

      // Сброс формы
      reset();

      // Перенаправляем на список технологий
      navigate('/technologies');
    } catch (error) {
      console.error('Error adding technology:', error);
      setErrors({ submit: 'Ошибка при добавлении технологии' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Проверка уникальности названия (debounced)
  const isTitleUnique = debouncedTitle.length > 0 && !errors.title;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600} mb={3}>
          Добавить новую технологию
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Название */}
          <TextField
            fullWidth
            label="Название технологии"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Например: Vue.js"
            error={!!errors.title}
            helperText={
              errors.title || 
              (isTitleUnique && debouncedTitle.length >= 2 && '✓ Название доступно')
            }
            required
          />

          {/* Описание */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Краткое описание технологии..."
            error={!!errors.description}
            helperText={
              errors.description || 
              `${values.description.length}/500 символов`
            }
            inputProps={{ maxLength: 500 }}
            required
          />

          {/* Категория */}
          <TextField
            fullWidth
            select
            label="Категория"
            name="category"
            value={values.category}
            onChange={handleChange}
          >
            <MenuItem value="frontend">Frontend</MenuItem>
            <MenuItem value="backend">Backend</MenuItem>
            <MenuItem value="database">Базы данных</MenuItem>
            <MenuItem value="devops">DevOps</MenuItem>
            <MenuItem value="other">Другое</MenuItem>
          </TextField>

          {/* Дедлайн */}
          <TextField
            fullWidth
            type="date"
            label="Срок изучения (дедлайн)"
            name="deadline"
            value={values.deadline}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
            helperText="📅 Необязательно. Установите дату, до которой планируете изучить эту технологию."
          />

          {/* Ошибка отправки */}
          {errors.submit && (
            <Alert severity="error">{errors.submit}</Alert>
          )}

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/technologies')}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Добавление...' : 'Добавить технологию'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddTechnology;