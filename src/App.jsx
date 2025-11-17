import { useState, useEffect } from 'react'
import './App.css'
import ProgressHeader from './components/ProgressHeader'
import TechnologyCard from './components/TechnologyCard'
import QuickActions from './components/QuickActions'
import FilterButtons from './components/FilterButtons'
import TechnologyNotes from './components/TechnologyNotes'

// Начальные данные для технологий
const initialTechnologies = [
  {
    id: 1,
    title: 'HTML',
    description: 'Язык разметки для создания структуры веб-страниц',
    status: 'completed',
    notes: ''
  },
  {
    id: 2,
    title: 'CSS',
    description: 'Каскадные таблицы стилей для оформления веб-страниц',
    status: 'completed',
    notes: ''
  },
  {
    id: 3,
    title: 'JavaScript',
    description: 'Язык программирования для создания интерактивных веб-приложений',
    status: 'in-progress',
    notes: ''
  },
  {
    id: 4,
    title: 'React',
    description: 'Библиотека JavaScript для создания пользовательских интерфейсов',
    status: 'in-progress',
    notes: ''
  },
  {
    id: 5,
    title: 'Node.js',
    description: 'Среда выполнения JavaScript на стороне сервера',
    status: 'not-started',
    notes: ''
  },
  {
    id: 6,
    title: 'TypeScript',
    description: 'Типизированное надмножество JavaScript',
    status: 'not-started',
    notes: ''
  }
];

function App() {
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка данных из localStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      try {
        setTechnologies(JSON.parse(saved));
        console.log('✅ Данные загружены из localStorage');
      } catch (error) {
        console.error('Ошибка при загрузке данных из localStorage:', error);
      }
    }
  }, []);

  // Сохранение данных в localStorage при любом изменении
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('💾 Данные сохранены в localStorage');
  }, [technologies]);

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

  // Функция для обновления заметок
  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Фильтрация технологий по статусу и поиску
  const filteredTechnologies = technologies
    .filter(tech => activeFilter === 'all' || tech.status === activeFilter)
    .filter(tech => 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="app">
      <ProgressHeader technologies={technologies} />
      
      {/* Поиск по технологиям */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Поиск технологий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-results">Найдено: {filteredTechnologies.length}</span>
      </div>

      <QuickActions technologies={technologies} setTechnologies={setTechnologies} />
      <FilterButtons activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      {filteredTechnologies.length === 0 ? (
        <div className="no-results">
          <p>📭 Технологий {searchQuery ? 'по данному запросу' : 'с таким статусом'} не найдено</p>
          {searchQuery && (
            <button 
              className="reset-search-btn" 
              onClick={() => setSearchQuery('')}
            >
              Сбросить поиск
            </button>
          )}
        </div>
      ) : (
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <div key={tech.id} className="tech-with-notes">
              <TechnologyCard
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={updateTechnologyStatus}
              />
              <TechnologyNotes
                notes={tech.notes}
                onNotesChange={updateTechnologyNotes}
                techId={tech.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
