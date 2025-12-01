import { useState, useEffect, useCallback } from 'react';

/**
 * Кастомный хук для работы с API технологий
 * Управляет загрузкой, добавлением, обновлением и удалением технологий
 */
function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock данные для демонстрации (в реальном приложении - реальный API)
  const mockTechnologies = [
    {
      id: 1,
      title: 'React',
      description: 'Библиотека для создания пользовательских интерфейсов',
      category: 'frontend',
      status: 'completed',
      difficulty: 'beginner',
      notes: 'Компоненты, хуки, контекст, Router',
      githubUrl: 'https://github.com/facebook/react',
      resources: ['https://react.dev', 'https://ru.reactjs.org'],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Node.js',
      description: 'Среда выполнения JavaScript на сервере',
      category: 'backend',
      status: 'in-progress',
      difficulty: 'intermediate',
      notes: 'npm, модули, Express, API',
      githubUrl: 'https://github.com/nodejs/node',
      resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'TypeScript',
      description: 'Типизированное надмножество JavaScript',
      category: 'frontend',
      status: 'not-started',
      difficulty: 'intermediate',
      notes: 'Типы, интерфейсы, дженерики',
      githubUrl: 'https://github.com/microsoft/TypeScript',
      resources: ['https://www.typescriptlang.org'],
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: 'MongoDB',
      description: 'NoSQL база данных',
      category: 'backend',
      status: 'not-started',
      difficulty: 'beginner',
      notes: 'Документо-ориентированная БД',
      githubUrl: 'https://github.com/mongodb/mongo',
      resources: ['https://www.mongodb.com'],
      createdAt: new Date().toISOString()
    }
  ];

  // Загрузка технологий из API (или localStorage)
  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Попытка загрузить из localStorage
      const saved = localStorage.getItem('technologies');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setTechnologies(parsedData);
      } else {
        // Если нет сохраненных данных, используем mock
        setTechnologies(mockTechnologies);
        localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
      }
      
    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Добавление новой технологии
  const addTechnology = useCallback(async (techData) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTech = {
        id: Date.now(), // В реальном приложении ID генерируется на сервере
        ...techData,
        createdAt: new Date().toISOString()
      };
      
      setTechnologies(prev => {
        const updated = [...prev, newTech];
        localStorage.setItem('technologies', JSON.stringify(updated));
        return updated;
      });
      
      return newTech;
      
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  }, []);

  // Обновление технологии
  const updateTechnology = useCallback(async (id, updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTechnologies(prev => {
        const updated = prev.map(tech => 
          tech.id === id ? { ...tech, ...updates } : tech
        );
        localStorage.setItem('technologies', JSON.stringify(updated));
        return updated;
      });
      
    } catch (err) {
      throw new Error('Не удалось обновить технологию');
    }
  }, []);

  // Удаление технологии
  const deleteTechnology = useCallback(async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTechnologies(prev => {
        const updated = prev.filter(tech => tech.id !== id);
        localStorage.setItem('technologies', JSON.stringify(updated));
        return updated;
      });
      
    } catch (err) {
      throw new Error('Не удалось удалить технологию');
    }
  }, []);

  // Импорт технологий из JSON
  const importTechnologies = useCallback(async (importedData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTechs = importedData.map((tech, index) => ({
        ...tech,
        id: tech.id || Date.now() + index,
        createdAt: tech.createdAt || new Date().toISOString()
      }));
      
      setTechnologies(prev => {
        const updated = [...prev, ...newTechs];
        localStorage.setItem('technologies', JSON.stringify(updated));
        return updated;
      });
      
      return newTechs.length;
      
    } catch (err) {
      throw new Error('Не удалось импортировать технологии');
    }
  }, []);

  // Экспорт технологий в JSON
  const exportTechnologies = useCallback(() => {
    return technologies;
  }, [technologies]);

  // Загружаем технологии при монтировании
  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    importTechnologies,
    exportTechnologies
  };
}

export default useTechnologiesApi;
