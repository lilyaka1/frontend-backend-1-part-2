import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTechnologies } from '../contexts/TechnologyContext';

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { getStats } = useTechnologies();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statistics = await getStats();
        setStats(statistics);
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    };

    loadStats();
  }, [getStats]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleSave = async () => {
    try {
      await updateUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Typography>Пользователь не найден</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          {/* Профиль пользователя */}
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt="Avatar"
              sx={{ width: 100, height: 100 }}
            />
            
            <Box flexGrow={1}>
              {isEditing ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    fullWidth
                    label="Имя"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Имя"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Email"
                  />
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Отмена
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h4" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </Box>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    {user.email}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Редактировать
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Статистика */}
          <Typography variant="h5" gutterBottom fontWeight={600} mb={2}>
            Статистика
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Всего
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    {stats?.total || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ bgcolor: 'success.light' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.contrastText">
                    Завершено
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="success.contrastText">
                    {stats?.completed || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ bgcolor: 'warning.light' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.contrastText">
                    В процессе
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="warning.contrastText">
                    {stats?.inProgress || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined" sx={{ bgcolor: 'grey.300' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    Не начато
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {stats?.notStarted || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;