import { useState, useEffect, useRef } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';
import './TechnologySearch.css';

/**
 * Компонент поиска технологий с debounce и AbortController
 * Реализует практику 24: работа с API, debounce, отмена запросов
 */
function TechnologySearch() {
  const { technologies } = useTechnologies();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Используем useRef для хранения таймера и AbortController
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Функция для поиска технологий
  const searchTechnologies = async (query) => {
    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для текущего запроса
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Если поисковый запрос пустой, очищаем результаты
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      // Имитация API запроса с задержкой
      await new Promise(resolve => setTimeout(resolve, 300));

      // Поиск в локальных данных (в реальном приложении - запрос к API)
      const results = technologies.filter(tech => 
        tech.title.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase()) ||
        tech.category.toLowerCase().includes(query.toLowerCase())
      );

      // Проверяем, не был ли запрос отменен
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setSearchResults(results);

    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Ошибка при поиске технологий:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймер для debounce (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

  // Очистка поиска
  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Функция для получения статуса на русском
  const getStatusText = (status) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[status] || status;
  };

  // Функция для получения цвета статуса
  const getStatusClass = (status) => {
    const classMap = {
      'not-started': 'status-not-started',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed'
    };
    return classMap[status] || '';
  };

  return (
    <div className="technology-search">
      <div className="search-header">
        <h2>🔍 Поиск технологий</h2>
        <p className="search-subtitle">
          Используйте поиск с задержкой (debounce) для поиска технологий
        </p>
      </div>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Введите название технологии, описание или категорию..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="search-actions">
          {loading && <span className="search-loading">⌛ Поиск...</span>}
          {searchTerm && (
            <button 
              onClick={handleClear} 
              className="clear-button"
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {searchTerm && !loading && (
        <div className="search-info">
          Найдено результатов: <strong>{searchResults.length}</strong>
        </div>
      )}

      <div className="search-results">
        {searchResults.length > 0 ? (
          <div className="results-grid">
            {searchResults.map(tech => (
              <div key={tech.id} className="result-card">
                <div className="result-header">
                  <h3>{tech.title}</h3>
                  <span className={`status-badge ${getStatusClass(tech.status)}`}>
                    {getStatusText(tech.status)}
                  </span>
                </div>
                
                <p className="result-description">{tech.description}</p>
                
                <div className="result-meta">
                  <span className="category-badge">{tech.category}</span>
                  {tech.githubUrl && (
                    <a 
                      href={tech.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="github-link"
                    >
                      GitHub →
                    </a>
                  )}
                </div>

                {tech.notes && (
                  <div className="result-notes">
                    <strong>Заметки:</strong> {tech.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          searchTerm.trim() && !loading && (
            <div className="no-results">
              <p>📭 Технологии не найдены</p>
              <p className="no-results-hint">
                Попробуйте изменить поисковый запрос
              </p>
            </div>
          )
        )}
      </div>

      {!searchTerm && (
        <div className="search-placeholder">
          <p>💡 Начните вводить текст для поиска технологий</p>
          <p className="placeholder-hint">
            Поиск работает по названию, описанию и категории
          </p>
        </div>
      )}
    </div>
  );
}

export default TechnologySearch;
