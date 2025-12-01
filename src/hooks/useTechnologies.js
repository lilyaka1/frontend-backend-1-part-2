import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  {
    id: 1,
    title: 'HTML',
    description: 'Язык разметки для создания структуры веб-страниц',
    status: 'completed',
    notes: '',
    category: 'frontend'
  },
  {
    id: 2,
    title: 'CSS',
    description: 'Каскадные таблицы стилей для оформления веб-страниц',
    status: 'completed',
    notes: '',
    category: 'frontend'
  },
  {
    id: 3,
    title: 'JavaScript',
    description: 'Язык программирования для создания интерактивных веб-приложений',
    status: 'in-progress',
    notes: '',
    category: 'frontend'
  },
  {
    id: 4,
    title: 'React',
    description: 'Библиотека JavaScript для создания пользовательских интерфейсов',
    status: 'in-progress',
    notes: '',
    category: 'frontend'
  },
  {
    id: 5,
    title: 'Node.js',
    description: 'Среда выполнения JavaScript на стороне сервера',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 6,
    title: 'TypeScript',
    description: 'Типизированное надмножество JavaScript',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  return {
    technologies,
    updateStatus,
    updateNotes,
    progress: calculateProgress()
  };
}

export default useTechnologies;