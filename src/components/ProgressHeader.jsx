import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const totalCount = technologies.length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="progress-header">
      <h1>Трекер изучения технологий</h1>
      <div className="statistics">
        <div className="stat-item">
          <span className="stat-label">Всего технологий:</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Изучено:</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Прогресс:</span>
          <span className="stat-value">{progressPercentage}%</span>
        </div>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage > 0 && `${progressPercentage}%`}
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;
