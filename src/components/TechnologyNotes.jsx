function TechnologyNotes({ notes, onNotesChange, techId }) {
  return (
    <div className="notes-section">
      <h4>📝 Мои заметки:</h4>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(techId, e.target.value)}
        placeholder="Записывайте сюда важные моменты, ресурсы для изучения, прогресс..."
        rows="3"
      />
      <div className="notes-hint">
        {notes.length > 0 
          ? `✅ Заметка сохранена (${notes.length} символов)` 
          : '💡 Добавьте заметку для отслеживания прогресса'}
      </div>
    </div>
  );
}

export default TechnologyNotes;
