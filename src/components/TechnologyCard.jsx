import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, githubUrl, deadline, onStatusChange }) {
  const handleClick = () => {
    // Циклическое переключение статусов
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    onStatusChange(id, nextStatus);
  };

  // Проверка просроченного дедлайна
  const isOverdue = deadline && 
    new Date(deadline) < new Date() && 
    status !== 'completed';

  return (
    <div className={`technology-card ${status} ${isOverdue ? 'overdue' : ''}`}>
      <div className="technology-header" onClick={handleClick}>
        <h3 className="technology-title">{title}</h3>
        <span className={`status-badge ${status}`}>
          {status === 'completed' && '✓ Завершено'}
          {status === 'in-progress' && '⏳ В процессе'}
          {status === 'not-started' && '○ Не начато'}
        </span>
      </div>

      <p className="technology-description">{description}</p>

      {deadline && (
        <div className={`deadline-info ${isOverdue ? 'overdue' : ''}`}>
          <span className="deadline-icon">📅</span>
          <span className="deadline-text">
            {isOverdue ? '⚠️ Просрочено: ' : 'Срок: '}
            {new Date(deadline).toLocaleDateString('ru-RU')}
          </span>
        </div>
      )}

      {githubUrl && (
        <div className="technology-actions">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            onClick={(e) => e.stopPropagation()}
          >
            🔗 Посмотреть на GitHub
          </a>
        </div>
      )}
    </div>
  );
}

export default TechnologyCard;
