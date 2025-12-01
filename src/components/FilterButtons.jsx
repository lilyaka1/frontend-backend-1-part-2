function FilterButtons({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'Все', icon: '' },
    { id: 'not-started', label: 'Не начаты', icon: '' },
    { id: 'in-progress', label: 'В процессе', icon: '' },
    { id: 'completed', label: 'Выполнены', icon: '' }
  ];

  return (
    <div className="filter-buttons">
      <h3>Фильтр по статусу:</h3>
      <div className="filter-group">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterButtons;
