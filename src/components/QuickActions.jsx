import { useState } from 'react';
import './QuickActions.css';
import Modal from './Modal';

function QuickActions({ technologies, setTechnologies }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');
  
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

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      technologies: technologies
    };
    const dataStr = JSON.stringify(data, null, 2);
    setExportData(dataStr);
    setShowExportModal(true);
  };

  const downloadJSON = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        <button 
          className="action-btn export-data"
          onClick={handleExport}
        >
          📤 Экспорт данных
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных трекера"
      >
        <div className="export-modal-content">
          <p>✅ Данные успешно подготовлены для экспорта!</p>
          <div className="export-stats">
            <p><strong>Всего технологий:</strong> {technologies.length}</p>
            <p><strong>Завершено:</strong> {technologies.filter(t => t.status === 'completed').length}</p>
            <p><strong>В процессе:</strong> {technologies.filter(t => t.status === 'in-progress').length}</p>
            <p><strong>Не начато:</strong> {technologies.filter(t => t.status === 'not-started').length}</p>
          </div>
          <div className="export-actions">
            <button className="download-btn" onClick={downloadJSON}>
              💾 Скачать JSON
            </button>
            <button className="close-modal-btn" onClick={() => setShowExportModal(false)}>
              Закрыть
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;
