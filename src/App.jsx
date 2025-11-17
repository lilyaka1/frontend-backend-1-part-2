import { useState } from 'react'
import './App.css'
import ProgressHeader from './components/ProgressHeader'
import TechnologyCard from './components/TechnologyCard'
import QuickActions from './components/QuickActions'
import FilterButtons from './components/FilterButtons'

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'HTML',
      description: 'Язык разметки для создания структуры веб-страниц',
      status: 'completed'
    },
    {
      id: 2,
      title: 'CSS',
      description: 'Каскадные таблицы стилей для оформления веб-страниц',
      status: 'completed'
    },
    {
      id: 3,
      title: 'JavaScript',
      description: 'Язык программирования для создания интерактивных веб-приложений',
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'React',
      description: 'Библиотека JavaScript для создания пользовательских интерфейсов',
      status: 'in-progress'
    },
    {
      id: 5,
      title: 'Node.js',
      description: 'Среда выполнения JavaScript на стороне сервера',
      status: 'not-started'
    },
    {
      id: 6,
      title: 'TypeScript',
      description: 'Типизированное надмножество JavaScript',
      status: 'not-started'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const updateTechnologyStatus = (id) => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => {
        if (tech.id === id) {
          // Циклическое переключение статусов
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Фильтрация технологий по статусу
  const filteredTechnologies = activeFilter === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.status === activeFilter);

  return (
    <div className="app">
      <ProgressHeader technologies={technologies} />
      <QuickActions technologies={technologies} setTechnologies={setTechnologies} />
      <FilterButtons activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      {filteredTechnologies.length === 0 ? (
        <div className="no-results">
          <p>📭 Технологий с таким статусом не найдено</p>
        </div>
      ) : (
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              onStatusChange={updateTechnologyStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
