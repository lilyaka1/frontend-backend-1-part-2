import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useTechnologies } from '../contexts/TechnologyContext';
import { useDebounce } from '../hooks/useLocalStorage';
import MuiTechnologyCard from '../components/MuiTechnologyCard';
import './TechnologyList.css';

function TechnologyList() {
  const { technologies, loading, updateTechnology, deleteTechnology } = useTechnologies();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Debounced поисковый запрос
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Фильтрация технологий
  const filteredTechnologies = useMemo(() => {
    let filtered = technologies;

    // Фильтр по статусу
    if (activeFilter !== 'all') {
      filtered = filtered.filter(tech => tech.status === activeFilter);
    }

    // Поиск по названию и описанию
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.title.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        tech.notes?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [technologies, activeFilter, debouncedSearchQuery]);

  // Обработчики
  const handleStatusChange = useCallback((techId, newStatus) => {
    updateTechnology(techId, { status: newStatus });
  }, [updateTechnology]);

  const handleEdit = (technology) => {
    window.location.href = `/technology/${technology.id}`;
  };

  const handleDelete = (techId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      deleteTechnology(techId);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" mt={2}>
          Загрузка технологий...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Заголовок и кнопка добавления */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Все технологии
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          component={Link}
          to="/add-technology"
        >
          Добавить технологию
        </Button>
      </Box>

      {/* Поиск */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск технологий по названию, описанию или заметкам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" color="text.secondary" mt={1}>
          Найдено: {filteredTechnologies.length} из {technologies.length}
        </Typography>
      </Box>

      {/* Фильтры */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterListIcon />
          <Typography variant="h6">Фильтр по статусу</Typography>
        </Box>
        <ButtonGroup variant="outlined" size="large">
          <Button
            variant={activeFilter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setActiveFilter('all')}
          >
            Все ({technologies.length})
          </Button>
          <Button
            variant={activeFilter === 'not-started' ? 'contained' : 'outlined'}
            onClick={() => setActiveFilter('not-started')}
          >
            Не начаты ({technologies.filter(t => t.status === 'not-started').length})
          </Button>
          <Button
            variant={activeFilter === 'in-progress' ? 'contained' : 'outlined'}
            onClick={() => setActiveFilter('in-progress')}
            color="warning"
          >
            В процессе ({technologies.filter(t => t.status === 'in-progress').length})
          </Button>
          <Button
            variant={activeFilter === 'completed' ? 'contained' : 'outlined'}
            onClick={() => setActiveFilter('completed')}
            color="success"
          >
            Завершены ({technologies.filter(t => t.status === 'completed').length})
          </Button>
        </ButtonGroup>

        {(searchQuery || activeFilter !== 'all') && (
          <Button
            variant="text"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            sx={{ ml: 2 }}
          >
            Сбросить фильтры
          </Button>
        )}
      </Box>

      {/* Сетка технологий */}
      {filteredTechnologies.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTechnologies.map(tech => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tech.id}>
              <MuiTechnologyCard
                technology={tech}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      ) : technologies.length > 0 ? (
        <Box 
          textAlign="center" 
          py={8}
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom color="text.secondary">
            По вашему запросу ничего не найдено
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Попробуйте изменить поисковый запрос или фильтры
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          >
            Сбросить фильтры
          </Button>
        </Box>
      ) : (
        <Box 
          textAlign="center" 
          py={8}
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom color="text.secondary">
            Технологий пока нет
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Добавьте первую технологию для отслеживания прогресса
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AddIcon />}
            component={Link}
            to="/add-technology"
          >
            Добавить технологию
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default TechnologyList;