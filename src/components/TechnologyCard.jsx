import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  const handleClick = () => {
    onStatusChange(id);
  };

  return (
    <div 
      className={`technology-card ${status}`}
      onClick={handleClick}
    >
      <h3 className="technology-title">{title}</h3>
      <p className="technology-description">{description}</p>
      <span className={`status-badge ${status}`}>
        {status === 'completed' && '✓ Завершено'}
        {status === 'in-progress' && '⏳ В процессе'}
        {status === 'not-started' && '○ Не начато'}
      </span>
    </div>
  );
}

export default TechnologyCard;
