import './QuickActions.css';

function QuickActions({ technologies, setTechnologies }) {
  
  const markAllCompleted = () => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const pickRandomNext = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTechs.length === 0) {
      alert('Все технологии уже начаты или завершены!');
      return;
    }

    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech =>
        tech.id === randomTech.id ? { ...tech, status: 'in-progress' } : tech
      )
    );

    alert(`Следующая технология для изучения: ${randomTech.title}`);
  };

  return (
    <div className="quick-actions">
      <h2>Быстрые действия</h2>
      <div className="action-buttons">
        <button 
          className="action-btn complete-all"
          onClick={markAllCompleted}
        >
          ✓ Отметить все выполненными
        </button>
        <button 
          className="action-btn reset-all"
          onClick={resetAllStatuses}
        >
          ↺ Сбросить все статусы
        </button>
        <button 
          className="action-btn random-pick"
          onClick={pickRandomNext}
        >
          🎲 Случайный выбор следующей
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
