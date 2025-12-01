import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTechnologies } from '../contexts/TechnologyContext';

function Roadmap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { importRoadmap, loading } = useTechnologies();

  const practices = [
    { id: 1, title: 'HTML5/CSS3/JavaScript Основы', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v1-6.html' },
    { id: 2, title: 'Node.js', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v7-8.html' },
    { id: 3, title: 'БЭМ', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v1.html' },
    { id: 4, title: 'Bootstrap', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v12.html' },
    { id: 5, title: 'Контрольная работа 2', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v13.html' },
    { id: 6, title: 'Адаптивная верстка', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v15.html' },
    { id: 7, title: 'Адаптивные изображения', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v16.html' },
    { id: 8, title: 'React Основы', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html' },
    { id: 9, title: 'Продвинутые компоненты React', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html' },
    { id: 10, title: 'Жизненный цикл компонентов', status: 'completed', link: 'https://lilyaka1.github.io/frontend-backend/index/index_v17.html' },
    { id: 11, title: 'React Hooks Основы', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 12, title: 'useEffect Hook', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 13, title: 'useContext Hook', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 14, title: 'React Router Основы', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 15, title: 'React Router Продвинутые', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 16, title: 'Context API', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 17, title: 'useReducer Hook', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 18, title: 'Кастомные хуки', status: 'started', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 19, title: 'React Hook Form', status: 'not-started', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 20, title: 'API интеграция', status: 'completed', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 21, title: 'TypeScript', status: 'not-started', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' },
    { id: 22, title: 'Next.js', status: 'not-started', link: 'https://github.com/lilyaka1/frontend-backend-1-part-2' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'started':
        return '🚧';
      case 'not-started':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'started':
        return 'В процессе';
      case 'not-started':
        return 'Не начато';
      default:
        return 'Неизвестно';
    }
  };

  const handleImportRoadmap = async () => {
    setIsImporting(true);
    try {
      await importRoadmap(practices);
      alert('Роудмап успешно импортирован в технологии!');
    } catch (error) {
      alert('Ошибка при импорте роудмапа: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const completedCount = practices.filter(p => p.status === 'completed').length;
  const totalCount = practices.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="roadmap-section">
      <div className="roadmap-header">
        <h2>🗺️ Роудмап практик</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="roadmap-toggle-btn"
        >
          {isExpanded ? 'Свернуть ▲' : 'Развернуть ▼'}
        </button>
      </div>

      <div className="roadmap-summary">
        <div className="roadmap-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {completedCount} из {totalCount} практик ({progressPercent}%)
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="roadmap-details">
          <div className="roadmap-grid">
            {practices.map(practice => (
              <div key={practice.id} className={`roadmap-item ${practice.status}`}>
                <div className="practice-header">
                  <span className="practice-number">#{practice.id}</span>
                  <span className="practice-status">{getStatusIcon(practice.status)}</span>
                </div>
                <h4 className="practice-title">{practice.title}</h4>
                <p className="practice-status-text">{getStatusText(practice.status)}</p>
                {practice.link && (
                  <a
                    href={practice.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="practice-link"
                  >
                    🔗 Посмотреть
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="roadmap-actions">
            <button
              onClick={handleImportRoadmap}
              className="btn btn-secondary"
              disabled={isImporting || loading}
            >
              {isImporting ? 'Импорт...' : '📥 Импортировать в технологии'}
            </button>
            <Link to="/technologies" className="btn btn-primary">
              📚 Все технологии
            </Link>
            <Link to="/statistics" className="btn btn-secondary">
              📊 Статистика
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roadmap;