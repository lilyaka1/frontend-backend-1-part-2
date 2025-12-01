import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  Chip,
  ButtonGroup,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  GitHub as GitHubIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useTechnologies } from '../contexts/TechnologyContext';

function TechnologyDetail() {
  const { techId } = useParams();
  const { getTechnologyById, updateTechnology } = useTechnologies();

  const technology = getTechnologyById(techId);
  
  // Локальное состояние для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(technology?.notes || '');
  const [editedDeadline, setEditedDeadline] = useState(technology?.deadline || '');
  const [saveStatus, setSaveStatus] = useState(null);

  const updateStatus = (newStatus) => {
    updateTechnology(parseInt(techId), { status: newStatus });
  };

  const handleSave = async () => {
    try {
      await updateTechnology(parseInt(techId), {
        notes: editedNotes,
        deadline: editedDeadline || null
      });
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditedNotes(technology?.notes || '');
    setEditedDeadline(technology?.deadline || '');
    setIsEditing(false);
  };

  // Проверка просроченного дедлайна
  const isOverdue = technology?.deadline && 
    new Date(technology.deadline) < new Date() && 
    technology.status !== 'completed';

  if (!technology) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Технология не найдена
            </Typography>
            <Typography variant="body1" paragraph>
              Технология с ID {techId} не существует.
            </Typography>
            <Button
              component={Link}
              to="/technologies"
              variant="contained"
              startIcon={<ArrowBackIcon />}
            >
              Назад к списку
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box mb={3}>
        <Button
          component={Link}
          to="/technologies"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Назад к списку
        </Button>
        <Typography variant="h3" component="h1" fontWeight={600}>
          {technology.title}
        </Typography>
      </Box>

      {/* Описание */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Описание
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {technology.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Статус изучения */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600} mb={2}>
            Статус изучения
          </Typography>
          <ButtonGroup fullWidth>
            <Button
              onClick={() => updateStatus('not-started')}
              variant={technology.status === 'not-started' ? 'contained' : 'outlined'}
              color="default"
            >
              Не начато
            </Button>
            <Button
              onClick={() => updateStatus('in-progress')}
              variant={technology.status === 'in-progress' ? 'contained' : 'outlined'}
              color="warning"
            >
              В процессе
            </Button>
            <Button
              onClick={() => updateStatus('completed')}
              variant={technology.status === 'completed' ? 'contained' : 'outlined'}
              color="success"
            >
              Завершено
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>

      {/* GitHub Link */}
      {technology.githubUrl && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Реализация на GitHub
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Посмотрите практическую реализацию этой технологии:
            </Typography>
            <Button
              href={technology.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<GitHubIcon />}
            >
              Открыть на GitHub Pages
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Дедлайн */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={600}>
              Срок изучения (дедлайн)
            </Typography>
            {!isEditing && (
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <EditIcon />
              </IconButton>
            )}
          </Box>

          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                type="date"
                value={editedDeadline}
                onChange={(e) => setEditedDeadline(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              {technology.deadline ? (
                <>
                  <Chip
                    icon={<CalendarIcon />}
                    label={new Date(technology.deadline).toLocaleDateString('ru-RU')}
                    color={isOverdue ? 'error' : 'default'}
                  />
                  {isOverdue && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Просрочено"
                      color="error"
                      variant="outlined"
                    />
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Дедлайн не установлен
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Заметки */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={600}>
              Мои заметки
            </Typography>
            {!isEditing && (
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <EditIcon />
              </IconButton>
            )}
          </Box>

          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Добавьте свои заметки о технологии..."
                sx={{ mb: 2 }}
              />
              <Box display="flex" gap={2}>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Сохранить
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                >
                  Отмена
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {technology.notes || 'Заметок пока нет. Нажмите кнопку редактирования чтобы добавить.'}
            </Typography>
          )}

          {saveStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Изменения сохранены
            </Alert>
          )}
          {saveStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Ошибка сохранения
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default TechnologyDetail;