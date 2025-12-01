import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Map as MapIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import UserList from '../components/UserList';
import ProductSearch from '../components/ProductSearch';
import PostList from '../components/PostList';
import TechnologySearch from '../components/TechnologySearch';
import RoadmapImporter from '../components/RoadmapImporter';
import Roadmap from '../components/Roadmap';

function ApiDemo() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'roadmap',
      title: 'Roadmap Technologies',
      subtitle: 'Дорожная карта + Поиск + Импорт/Экспорт',
      icon: <MapIcon />,
      description: 'Полный трекер технологий: визуализация, поиск и управление данными',
      features: [
        'Интерактивная дорожная карта технологий',
        'Поиск по технологиям с debounce',
        'Импорт и экспорт данных в JSON',
        'Работа с localStorage'
      ]
    },
    {
      id: 'users',
      title: 'UserList',
      subtitle: 'Базовый fetch',
      icon: <PeopleIcon />,
      description: 'Стандартный fetch API с useState и useEffect',
      features: [
        'Обработка состояний loading и error',
        'Повторная загрузка при ошибке',
        'Grid layout для отображения',
        'Работа с JSONPlaceholder API'
      ]
    },
    {
      id: 'products',
      title: 'ProductSearch',
      subtitle: 'Поиск с debounce',
      icon: <SearchIcon />,
      description: 'Оптимизированный поиск с задержкой и отменой запросов',
      features: [
        'Debounce (500ms задержка)',
        'AbortController для отмены запросов',
        'useRef для хранения таймера',
        'Динамический поиск при вводе'
      ]
    },
    {
      id: 'posts',
      title: 'PostList',
      subtitle: 'Кастомный хук useApi',
      icon: <ArticleIcon />,
      description: 'Переиспользуемый хук для работы с API',
      features: [
        'Кастомный хук useApi с useCallback',
        'AbortController встроен в хук',
        'Функция refetch для обновления',
        'Автоматическая очистка при размонтировании'
      ]
    }
  ];

  const currentTab = tabs[activeTab];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
          Работа с API
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Демонстрация различных подходов к работе с внешними API
        </Typography>
      </Box>

      {/* Вкладки */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              icon={tab.icon}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {tab.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tab.subtitle}
                  </Typography>
                </Box>
              }
              sx={{ minHeight: 80 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Информация о текущей вкладке */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box sx={{ fontSize: 40 }}>{currentTab.icon}</Box>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {currentTab.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTab.subtitle}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            {currentTab.description}
          </Typography>
          <List dense>
            {currentTab.features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Содержимое вкладок */}
      <Box>
        {activeTab === 0 && (
          <Box>
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  🗺️ Дорожная карта технологий
                </Typography>
                <Roadmap />
              </CardContent>
            </Card>
            
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  🔎 Поиск технологий
                </Typography>
                <TechnologySearch />
              </CardContent>
            </Card>
            
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  📦 Импорт и экспорт данных
                </Typography>
                <RoadmapImporter />
              </CardContent>
            </Card>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Card elevation={2}>
            <CardContent>
              <UserList />
            </CardContent>
          </Card>
        )}
        
        {activeTab === 2 && (
          <Card elevation={2}>
            <CardContent>
              <ProductSearch />
            </CardContent>
          </Card>
        )}
        
        {activeTab === 3 && (
          <Card elevation={2}>
            <CardContent>
              <PostList />
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default ApiDemo;
