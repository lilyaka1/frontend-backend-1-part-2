import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useState } from 'react';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function MuiDashboard({ technologies }) {
  const [tabValue, setTabValue] = useState(0);

  // Статистика
  const stats = {
    total: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.status === 'not-started').length,
  };

  stats.progress = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  // Технологии с дедлайнами
  const upcomingDeadlines = technologies
    .filter(t => t.deadline && t.status !== 'completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  // Недавно добавленные
  const recentTechnologies = technologies
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Просроченные
  const overdueTechnologies = technologies.filter(
    t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed'
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Статистические карточки */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Всего технологий
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Завершено
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.completed}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    В процессе
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {stats.inProgress}
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Не начато
                  </Typography>
                  <Typography variant="h4" component="div" color="text.secondary">
                    {stats.notStarted}
                  </Typography>
                </Box>
                <RadioButtonUncheckedIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Общий прогресс */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6">
              Общий прогресс
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}>
              <LinearProgress 
                variant="determinate" 
                value={stats.progress} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  backgroundColor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                  }
                }}
              />
            </Box>
            <Typography variant="h5" color="primary" fontWeight={600}>
              {stats.progress}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {stats.completed} из {stats.total} технологий изучено
          </Typography>
        </CardContent>
      </Card>

      {/* Табы */}
      <Paper elevation={2}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Активные" />
          <Tab label="Недавние" />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Дедлайны
                {overdueTechnologies.length > 0 && (
                  <Chip 
                    label={overdueTechnologies.length} 
                    size="small" 
                    color="error"
                  />
                )}
              </Box>
            }
          />
        </Tabs>

        {/* Вкладка активных технологий */}
        <TabPanel value={tabValue} index={0}>
          {stats.inProgress > 0 ? (
            <List>
              {technologies.filter(t => t.status === 'in-progress').map((tech, index, arr) => (
                <div key={tech.id}>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={tech.title}
                      secondary={tech.category}
                    />
                    <Chip 
                      label="В процессе"
                      size="small"
                      color="warning"
                    />
                  </ListItem>
                  {index < arr.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                Нет активных технологий
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Начните изучение новой технологии
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Вкладка недавних технологий */}
        <TabPanel value={tabValue} index={1}>
          {recentTechnologies.length > 0 ? (
            <List>
              {recentTechnologies.map((tech, index, arr) => (
                <div key={tech.id}>
                  <ListItem>
                    <ListItemIcon>
                      {tech.status === 'completed' ? (
                        <CheckCircleIcon color="success" />
                      ) : tech.status === 'in-progress' ? (
                        <ScheduleIcon color="warning" />
                      ) : (
                        <RadioButtonUncheckedIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={tech.title}
                      secondary={tech.category}
                    />
                    <Chip 
                      label={
                        tech.status === 'completed' ? 'Завершено' : 
                        tech.status === 'in-progress' ? 'В процессе' : 'Не начато'
                      }
                      size="small"
                      color={
                        tech.status === 'completed' ? 'success' : 
                        tech.status === 'in-progress' ? 'warning' : 'default'
                      }
                      variant="outlined"
                    />
                  </ListItem>
                  {index < arr.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                Нет технологий
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Вкладка дедлайнов */}
        <TabPanel value={tabValue} index={2}>
          {upcomingDeadlines.length > 0 ? (
            <List>
              {upcomingDeadlines.map((tech, index, arr) => {
                const isOverdue = new Date(tech.deadline) < new Date();
                return (
                  <div key={tech.id}>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon color={isOverdue ? 'error' : 'warning'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={tech.title}
                        secondary={
                          <Typography
                            variant="body2"
                            color={isOverdue ? 'error' : 'text.secondary'}
                          >
                            {isOverdue ? '⚠️ Просрочено: ' : 'Срок: '}
                            {new Date(tech.deadline).toLocaleDateString('ru-RU')}
                          </Typography>
                        }
                      />
                      {isOverdue && (
                        <Chip 
                          label="Просрочено"
                          size="small"
                          color="error"
                        />
                      )}
                    </ListItem>
                    {index < arr.length - 1 && <Divider />}
                  </div>
                );
              })}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                Нет технологий с дедлайнами
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Установите дедлайны для отслеживания прогресса
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default MuiDashboard;
