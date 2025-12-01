// API сервис для работы с технологиями
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Имитация API для технологий (поскольку у нас нет реального бэкенда)
class TechnologyAPI {
  // Получить все технологии
  static async getTechnologies() {
    try {
      // Имитируем задержку API
      await new Promise(resolve => setTimeout(resolve, 500));

      // В реальном приложении здесь был бы настоящий API вызов
      // return fetch(`${API_BASE_URL}/posts`).then(res => res.json());

      // Пока возвращаем данные из localStorage или начальные данные
      const saved = localStorage.getItem('technologies');
      if (saved) {
        return JSON.parse(saved);
      }

      // Начальные данные
      return [
        {
          id: 1,
          title: 'HTML5/CSS3/JavaScript Основы',
          description: 'Основы веб-разработки: HTML5, CSS3, JavaScript. Изучены в практиках 1-6.',
          notes: 'HTML5 семантические теги, CSS3 Flexbox/Grid, JavaScript ES6+, DOM API',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v1-6.html',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 7,
          title: 'Node.js',
          description: 'JavaScript runtime для серверной разработки. Изучен в практиках 7-8.',
          notes: 'npm, модули, файловый ввод/вывод, HTTP сервер',
          category: 'backend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v7-8.html',
          createdAt: '2024-01-02T00:00:00.000Z'
        },
        {
          id: 9,
          title: 'БЭМ',
          description: 'Методология БЭМ для организации CSS кода. Изучена в практиках 9-11.',
          notes: 'Блок, Элемент, Модификатор, организация CSS архитектуры',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v1.html',
          createdAt: '2024-01-03T00:00:00.000Z'
        },
        {
          id: 12,
          title: 'Bootstrap',
          description: 'CSS фреймворк для быстрой адаптивной верстки. Изучен в практике 12.',
          notes: 'Grid система, компоненты, утилиты, адаптивность',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v12.html',
          createdAt: '2024-01-04T00:00:00.000Z'
        },
        {
          id: 13,
          title: 'Контрольная работа 2',
          description: 'Продвинутая комплексная работа. Выполнена в практиках 13-14.',
          notes: 'React, Node.js, базы данных, полностековое приложение',
          category: 'other',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v13.html',
          createdAt: '2024-01-05T00:00:00.000Z'
        },
        {
          id: 15,
          title: 'Адаптивная верстка',
          description: 'Создание адаптивных интерфейсов для разных устройств. Изучена в практике 15.',
          notes: 'Media queries, responsive design, mobile-first подход',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v15.html',
          createdAt: '2024-01-06T00:00:00.000Z'
        },
        {
          id: 16,
          title: 'Адаптивные изображения',
          description: 'Техники работы с изображениями для разных устройств. Изучена в практике 16.',
          notes: 'srcset, sizes, picture element, оптимизация изображений',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v16.html',
          createdAt: '2024-01-07T00:00:00.000Z'
        },
        {
          id: 17,
          title: 'React Основы',
          description: 'Основы React: компоненты, props, state. Изучено в практике 17.',
          notes: 'JSX, компоненты, props, state, события, условный рендеринг',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html',
          createdAt: '2024-01-08T00:00:00.000Z'
        },
        {
          id: 18,
          title: 'Продвинутые компоненты React',
          description: 'Продвинутые концепции React компонентов. Изучено в практике 18.',
          notes: 'Компоненты высшего порядка, render props, контекст, refs',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html',
          createdAt: '2024-01-09T00:00:00.000Z'
        },
        {
          id: 19,
          title: 'Жизненный цикл компонентов',
          description: 'Жизненный цикл React компонентов и управление эффектами. Изучено в практике 19.',
          notes: 'componentDidMount, componentDidUpdate, componentWillUnmount, useEffect',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html',
          createdAt: '2024-01-10T00:00:00.000Z'
        },
        {
          id: 20,
          title: 'React Hooks Основы',
          description: 'Основы React Hooks: useState, useEffect. Изучено в практике 20.',
          notes: 'useState, useEffect, правила хуков, базовые паттерны',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-11T00:00:00.000Z'
        },
        {
          id: 21,
          title: 'useEffect Hook',
          description: 'Продвинутые паттерны работы с useEffect. Изучено в практике 21.',
          notes: 'Зависимости эффектов, очистка эффектов, паттерны загрузки данных',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-12T00:00:00.000Z'
        },
        {
          id: 22,
          title: 'useContext Hook',
          description: 'Работа с контекстом в функциональных компонентах. Изучено в практике 22.',
          notes: 'createContext, useContext, Provider, Consumer, контекстные паттерны',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-13T00:00:00.000Z'
        },
        {
          id: 23,
          title: 'React Router Основы',
          description: 'Основы маршрутизации в React приложениях. Изучено в практике 23.',
          notes: 'BrowserRouter, Routes, Route, Link, useParams',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-14T00:00:00.000Z'
        },
        {
          id: 24,
          title: 'React Router Продвинутые',
          description: 'Продвинутые возможности React Router. Изучено в практике 24.',
          notes: 'Nested routes, useNavigate, protected routes, query parameters',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
          id: 25,
          title: 'Context API',
          description: 'Управление глобальным состоянием с помощью Context API. Изучено в практике 25.',
          notes: 'createContext, useContext, Provider, Consumer, reducer pattern',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-16T00:00:00.000Z'
        },
        {
          id: 26,
          title: 'useReducer Hook',
          description: 'Продвинутый хук для управления сложным состоянием. Изучен в практике 26.',
          notes: 'useReducer, actions, reducer functions, state management patterns',
          category: 'frontend',
          status: 'completed',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-17T00:00:00.000Z'
        },
        {
          id: 27,
          title: 'Кастомные хуки',
          description: 'Создание переиспользуемых хуков: useLocalStorage, useDebounce, useForm. Изучены в практике 27.',
          notes: 'useLocalStorage, useDebounce, useForm, useAsync, хук композиция',
          category: 'frontend',
          status: 'started',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-13T00:00:00.000Z'
        },
        {
          id: 28,
          title: 'React Hook Form',
          description: 'Профессиональная библиотека для работы с формами в React. Изучена в практике 28.',
          notes: 'useForm, register, handleSubmit, validation, error handling',
          category: 'frontend',
          status: 'not-started',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-14T00:00:00.000Z'
        },
        {
          id: 29,
          title: 'API интеграция',
          description: 'Работа с REST API, асинхронные запросы, обработка ошибок. Изучена в практике 29.',
          notes: 'fetch API, async/await, error handling, loading states',
          category: 'frontend',
          status: 'not-started',
          githubUrl: 'https://github.com/lilyaka1/frontend-backend-1-part-2',
          createdAt: '2024-01-15T00:00:00.000Z'
        }
      ];
    } catch (error) {
      throw new Error('Ошибка загрузки технологий: ' + error.message);
    }
  }

  // Создать новую технологию
  static async createTechnology(technology) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Имитируем API вызов
      const newTech = {
        ...technology,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      // Сохраняем в localStorage (имитация сохранения на сервере)
      const technologies = await this.getTechnologies();
      technologies.push(newTech);
      localStorage.setItem('technologies', JSON.stringify(technologies));

      return newTech;
    } catch (error) {
      throw new Error('Ошибка создания технологии: ' + error.message);
    }
  }

  // Обновить технологию
  static async updateTechnology(id, updates) {
    try {
      // Уменьшаем задержку для быстрых операций как изменение статуса
      const delay = updates.status ? 50 : 300;
      await new Promise(resolve => setTimeout(resolve, delay));

      const technologies = await this.getTechnologies();
      const index = technologies.findIndex(tech => tech.id === id);

      if (index === -1) {
        throw new Error('Технология не найдена');
      }

      technologies[index] = { ...technologies[index], ...updates };
      localStorage.setItem('technologies', JSON.stringify(technologies));

      return technologies[index];
    } catch (error) {
      throw new Error('Ошибка обновления технологии: ' + error.message);
    }
  }

  // Удалить технологию
  static async deleteTechnology(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const technologies = await this.getTechnologies();
      const filtered = technologies.filter(tech => tech.id !== id);

      if (filtered.length === technologies.length) {
        throw new Error('Технология не найдена');
      }

      localStorage.setItem('technologies', JSON.stringify(filtered));
      return true;
    } catch (error) {
      throw new Error('Ошибка удаления технологии: ' + error.message);
    }
  }

  // Получить статистику
  static async getStatistics() {
    try {
      const technologies = await this.getTechnologies();

      const total = technologies.length;
      const completed = technologies.filter(t => t.status === 'completed').length;
      const inProgress = technologies.filter(t => t.status === 'in-progress').length;
      const notStarted = technologies.filter(t => t.status === 'not-started').length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        total,
        completed,
        inProgress,
        notStarted,
        progress
      };
    } catch (error) {
      throw new Error('Ошибка получения статистики: ' + error.message);
    }
  }
}

export default TechnologyAPI;