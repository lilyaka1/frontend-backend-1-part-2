import { createContext, useContext, useReducer, useEffect } from 'react';
import TechnologyAPI from '../services/TechnologyAPI';

// Действия для reducer
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TECHNOLOGIES: 'SET_TECHNOLOGIES',
  ADD_TECHNOLOGY: 'ADD_TECHNOLOGY',
  UPDATE_TECHNOLOGY: 'UPDATE_TECHNOLOGY',
  DELETE_TECHNOLOGY: 'DELETE_TECHNOLOGY',
  SET_ERROR: 'SET_ERROR'
};

// Начальные технологии с описаниями и ссылками на практики
const initialTechnologies = [
  {
    id: 1,
    title: 'HTML5/CSS3/JavaScript Основы',
    description: 'Основы веб-разработки: HTML5, CSS3, JavaScript. Изучены в практиках 1-6.',
    notes: 'HTML5 семантические теги, CSS3 Flexbox/Grid, JavaScript ES6+, DOM API',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v1-6.html',
    createdAt: '2024-01-01T00:00:00.000Z',
    deadline: null
  },
  {
    id: 7,
    title: 'Node.js',
    description: 'JavaScript runtime для серверной разработки. Изучен в практиках 7-8.',
    notes: 'npm, модули, файловый ввод/вывод, HTTP сервер',
    category: 'backend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v7-8.html',
    createdAt: '2024-01-02T00:00:00.000Z',
    deadline: null
  },
  {
    id: 9,
    title: 'БЭМ',
    description: 'Методология БЭМ для организации CSS кода. Изучена в практиках 9-11.',
    notes: 'Блок, Элемент, Модификатор, организация CSS архитектуры',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v1.html',
    createdAt: '2024-01-03T00:00:00.000Z',
    deadline: null
  },
  {
    id: 12,
    title: 'Bootstrap',
    description: 'CSS фреймворк для быстрой адаптивной верстки. Изучен в практике 12.',
    notes: 'Grid система, компоненты, утилиты, адаптивность',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v12.html',
    createdAt: '2024-01-04T00:00:00.000Z',
    deadline: null
  },
  {
    id: 13,
    title: 'Контрольная работа 2',
    description: 'Продвинутая комплексная работа. Выполнена в практиках 13-14.',
    notes: 'React, Node.js, базы данных, полностековое приложение',
    category: 'other',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v13.html',
    createdAt: '2024-01-05T00:00:00.000Z',
    deadline: null
  },
  {
    id: 15,
    title: 'Адаптивная верстка',
    description: 'Создание адаптивных интерфейсов для разных устройств. Изучена в практике 15.',
    notes: 'Media queries, responsive design, mobile-first подход',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v15.html',
    createdAt: '2024-01-06T00:00:00.000Z',
    deadline: null
  },
  {
    id: 16,
    title: 'Адаптивные изображения',
    description: 'Техники работы с изображениями для разных устройств. Изучена в практике 16.',
    notes: 'srcset, sizes, picture element, оптимизация изображений',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v16.html',
    createdAt: '2024-01-07T00:00:00.000Z',
    deadline: null
  },
  {
    id: 17,
    title: 'React Основы',
    description: 'Основы React: компоненты, props, state. Изучено в практике 17.',
    notes: 'JSX, компоненты, props, state, события, условный рендеринг',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html',
    createdAt: '2024-01-08T00:00:00.000Z',
    deadline: null
  },
  {
    id: 18,
    title: 'Продвинутые компоненты React',
    description: 'Продвинутые концепции React компонентов. Изучено в практике 18.',
    notes: 'Компоненты высшего порядка, render props, контекст, refs',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html',
    createdAt: '2024-01-09T00:00:00.000Z',
    deadline: null
  },
  {
    id: 19,
    title: 'Жизненный цикл компонентов',
    description: 'Жизненный цикл React компонентов и управление эффектами. Изучено в практике 19.',
    notes: 'componentDidMount, componentDidUpdate, componentWillUnmount, useEffect',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html',
    createdAt: '2024-01-10T00:00:00.000Z',
    deadline: null
  },
  {
    id: 20,
    title: 'React Hooks Основы',
    description: 'Основы React Hooks: useState, useEffect. Изучено в практике 20.',
    notes: 'useState, useEffect, правила хуков, базовые паттерны',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-11T00:00:00.000Z',
    deadline: null
  },
  {
    id: 21,
    title: 'useEffect Hook',
    description: 'Продвинутые паттерны работы с useEffect. Изучено в практике 21.',
    notes: 'Зависимости эффектов, очистка эффектов, паттерны загрузки данных',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-12T00:00:00.000Z',
    deadline: null
  },
  {
    id: 22,
    title: 'useContext Hook',
    description: 'Работа с контекстом в функциональных компонентах. Изучено в практике 22.',
    notes: 'createContext, useContext, Provider, Consumer, контекстные паттерны',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-13T00:00:00.000Z',
    deadline: null
  },
  {
    id: 23,
    title: 'React Router Основы',
    description: 'Основы маршрутизации в React приложениях. Изучено в практике 23.',
    notes: 'BrowserRouter, Routes, Route, Link, useParams',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-14T00:00:00.000Z',
    deadline: null
  },
  {
    id: 24,
    title: 'React Router Продвинутые',
    description: 'Продвинутые возможности React Router. Изучено в практике 24.',
    notes: 'Nested routes, useNavigate, protected routes, query parameters',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-15T00:00:00.000Z',
    deadline: null
  },
  {
    id: 25,
    title: 'Context API',
    description: 'Управление глобальным состоянием с помощью Context API. Изучено в практике 25.',
    notes: 'createContext, useContext, Provider, Consumer, reducer pattern',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-16T00:00:00.000Z',
    deadline: null
  },
  {
    id: 26,
    title: 'useReducer Hook',
    description: 'Продвинутый хук для управления сложным состоянием. Изучен в практике 26.',
    notes: 'useReducer, actions, reducer functions, state management patterns',
    category: 'frontend',
    status: 'completed',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-17T00:00:00.000Z',
    deadline: null
  },
  {
    id: 27,
    title: 'Кастомные хуки',
    description: 'Создание переиспользуемых хуков: useLocalStorage, useDebounce, useForm. Изучены в практике 27.',
    notes: 'useLocalStorage, useDebounce, useForm, useAsync, хук композиция',
    category: 'frontend',
    status: 'started',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-13T00:00:00.000Z',
    deadline: null
  },
  {
    id: 28,
    title: 'React Hook Form',
    description: 'Профессиональная библиотека для работы с формами в React. Изучена в практике 28.',
    notes: 'useForm, register, handleSubmit, validation, error handling',
    category: 'frontend',
    status: 'not-started',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-14T00:00:00.000Z',
    deadline: null
  },
  {
    id: 29,
    title: 'API интеграция',
    description: 'Работа с REST API, асинхронные запросы, обработка ошибок. Изучена в практике 29.',
    notes: 'fetch API, async/await, error handling, loading states',
    category: 'frontend',
    status: 'not-started',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-15T00:00:00.000Z',
    deadline: null
  },
  {
    id: 30,
    title: 'TypeScript',
    description: 'Статическая типизация для JavaScript. Планируется изучить в следующих практиках.',
    notes: 'Типы, интерфейсы, generics, типизация React компонентов',
    category: 'frontend',
    status: 'not-started',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-16T00:00:00.000Z',
    deadline: null
  },
  {
    id: 31,
    title: 'Next.js',
    description: 'React фреймворк для серверного рендеринга и статической генерации.',
    notes: 'SSR, SSG, API routes, оптимизация производительности',
    category: 'frontend',
    status: 'not-started',
    githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
    createdAt: '2024-01-17T00:00:00.000Z'
  }
];

// Начальное состояние
const initialState = {
  technologies: [],
  loading: false,
  error: null
};

// Reducer функция
function technologyReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_TECHNOLOGIES:
      return { ...state, technologies: action.payload, loading: false, error: null };

    case ACTIONS.ADD_TECHNOLOGY:
      return {
        ...state,
        technologies: [...state.technologies, action.payload]
      };

    case ACTIONS.UPDATE_TECHNOLOGY:
      return {
        ...state,
        technologies: state.technologies.map(tech =>
          tech.id === action.payload.id ? { ...tech, ...action.payload.updates } : tech
        )
      };

    case ACTIONS.DELETE_TECHNOLOGY:
      return {
        ...state,
        technologies: state.technologies.filter(tech => tech.id !== action.payload)
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

// Создаем контекст для технологий
const TechnologyContext = createContext();

// Хук для использования контекста технологий
export const useTechnologies = () => {
  const context = useContext(TechnologyContext);
  if (!context) {
    throw new Error('useTechnologies must be used within a TechnologyProvider');
  }
  return context;
};

// Провайдер контекста технологий
export const TechnologyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(technologyReducer, initialState);

  // Загрузка технологий из API
  const loadTechnologies = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const technologies = await TechnologyAPI.getTechnologies();
      dispatch({ type: ACTIONS.SET_TECHNOLOGIES, payload: technologies });
    } catch (error) {
      console.error('Error loading technologies:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Ошибка загрузки данных' });
    }
  };

  // Загрузка технологий из API при монтировании
  useEffect(() => {
    loadTechnologies();
  }, []);

  // Функции для работы с технологиями
  const addTechnology = async (technology) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const newTech = await TechnologyAPI.createTechnology(technology);
      dispatch({ type: ACTIONS.ADD_TECHNOLOGY, payload: newTech });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateTechnology = async (id, updates) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const updatedTech = await TechnologyAPI.updateTechnology(id, updates);
      dispatch({ type: ACTIONS.UPDATE_TECHNOLOGY, payload: { id, updates: updatedTech } });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const deleteTechnology = async (id) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await TechnologyAPI.deleteTechnology(id);
      dispatch({ type: ACTIONS.DELETE_TECHNOLOGY, payload: id });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const getTechnologyById = (id) => {
    return state.technologies.find(tech => tech.id === parseInt(id));
  };

  // Статистика
  const getStats = async () => {
    try {
      return await TechnologyAPI.getStatistics();
    } catch (error) {
      console.error('Error getting statistics:', error);
      // Fallback to local calculation
      const total = state.technologies.length;
      const completed = state.technologies.filter(t => t.status === 'completed').length;
      const inProgress = state.technologies.filter(t => t.status === 'in-progress').length;
      const notStarted = state.technologies.filter(t => t.status === 'not-started').length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        total,
        completed,
        inProgress,
        notStarted,
        progress
      };
    }
  };

  const updateTechnologyStatus = async (id, status) => {
    try {
      // Оптимистичное обновление UI без loading состояния
      dispatch({ type: ACTIONS.UPDATE_TECHNOLOGY, payload: { id, updates: { status } } });

      // Синхронизация с API в фоне
      await TechnologyAPI.updateTechnology(id, { status });
    } catch (error) {
      console.error('Error updating technology status:', error);
      // В случае ошибки можно откатить изменения или показать уведомление
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Ошибка обновления статуса' });
    }
  };

  // Импорт роудмапа практик
  const importRoadmap = async (practices) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      const technologiesToAdd = practices.map(practice => ({
        title: practice.title,
        description: `Практика #${practice.id}: ${practice.title}`,
        notes: `Изучено в практике ${practice.id}`,
        category: 'frontend',
        status: practice.status,
        githubUrl: practice.link || '',
        createdAt: new Date().toISOString(),
        deadline: null
      }));

      // Добавляем все технологии через API
      for (const tech of technologiesToAdd) {
        await TechnologyAPI.createTechnology(tech);
      }

      // Перезагружаем список технологий
      const updatedTechnologies = await TechnologyAPI.getTechnologies();
      dispatch({ type: ACTIONS.SET_TECHNOLOGIES, payload: updatedTechnologies });

    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const value = {
    ...state,
    addTechnology,
    updateTechnology,
    updateTechnologyStatus,
    deleteTechnology,
    getTechnologyById,
    getStats,
    importRoadmap
  };

  return (
    <TechnologyContext.Provider value={value}>
      {children}
    </TechnologyContext.Provider>
  );
};