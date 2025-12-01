import { useState, useRef } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';
import './RoadmapImporter.css';

/**
 * Компонент для импорта и экспорта дорожных карт технологий
 * Реализует практику 1-24: работа с файлами, JSON, импорт/экспорт данных
 */
function RoadmapImporter() {
  const { technologies, addTechnology } = useTechnologies();
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Экспорт технологий в JSON файл
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(technologies, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `roadmap-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setImportStatus({
        type: 'success',
        message: `Успешно экспортировано ${technologies.length} технологий`
      });

      // Скрываем сообщение через 5 секунд
      setTimeout(() => setImportStatus(null), 5000);

    } catch (error) {
      setImportStatus({
        type: 'error',
        message: `Ошибка экспорта: ${error.message}`
      });
    }
  };

  // Обработка импорта из JSON файла
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Проверяем, что данные - это массив
      if (!Array.isArray(importedData)) {
        throw new Error('Неверный формат файла. Ожидается массив технологий.');
      }

      // Добавляем каждую технологию
      let importedCount = 0;
      for (const tech of importedData) {
        // Проверяем наличие обязательных полей
        if (tech.title && tech.description) {
          await addTechnology({
            ...tech,
            id: Date.now() + importedCount, // Генерируем новый ID
            createdAt: new Date().toISOString()
          });
          importedCount++;
        }
      }

      setImportStatus({
        type: 'success',
        message: `✓ Успешно импортировано ${importedCount} технологий из ${importedData.length}`
      });

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Скрываем сообщение через 5 секунд
      setTimeout(() => setImportStatus(null), 5000);

    } catch (error) {
      setImportStatus({
        type: 'error',
        message: `✗ Ошибка импорта: ${error.message}`
      });
    } finally {
      setImporting(false);
    }
  };

  // Импорт примера дорожной карты
  const handleExampleImport = async () => {
    setImporting(true);
    setImportStatus(null);

    try {
      // Пример данных дорожной карты
      const exampleRoadmap = [
        {
          title: 'HTML5',
          description: 'Язык разметки для создания веб-страниц',
          category: 'frontend',
          status: 'completed',
          notes: 'Семантические теги, формы, мультимедиа',
          githubUrl: '',
          resources: ['https://developer.mozilla.org/ru/docs/Web/HTML']
        },
        {
          title: 'CSS3',
          description: 'Каскадные таблицы стилей для оформления',
          category: 'frontend',
          status: 'completed',
          notes: 'Flexbox, Grid, анимации, переходы',
          githubUrl: '',
          resources: ['https://developer.mozilla.org/ru/docs/Web/CSS']
        },
        {
          title: 'JavaScript ES6+',
          description: 'Современный стандарт JavaScript',
          category: 'frontend',
          status: 'in-progress',
          notes: 'Arrow functions, async/await, modules',
          githubUrl: '',
          resources: ['https://learn.javascript.ru/']
        },
        {
          title: 'Git',
          description: 'Система контроля версий',
          category: 'other',
          status: 'in-progress',
          notes: 'Branches, commits, merge, rebase',
          githubUrl: 'https://github.com/git/git',
          resources: ['https://git-scm.com/']
        }
      ];

      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 1000));

      let importedCount = 0;
      for (const tech of exampleRoadmap) {
        await addTechnology({
          ...tech,
          id: Date.now() + importedCount,
          createdAt: new Date().toISOString()
        });
        importedCount++;
      }

      setImportStatus({
        type: 'success',
        message: `✓ Успешно импортировано ${importedCount} технологий из примера`
      });

      setTimeout(() => setImportStatus(null), 5000);

    } catch (error) {
      setImportStatus({
        type: 'error',
        message: `✗ Ошибка импорта примера: ${error.message}`
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <div className="importer-header">
        <h3>📦 Импорт / Экспорт дорожной карты</h3>
        <p className="importer-subtitle">
          Импортируйте технологии из JSON файла или экспортируйте текущий список
        </p>
      </div>

      <div className="importer-actions">
        <div className="action-group">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="import-button"
            title="Импортировать из JSON файла"
          >
            {importing ? '⏳ Импорт...' : '📥 Импортировать из файла'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>

        <div className="action-group">
          <button 
            onClick={handleExport}
            disabled={technologies.length === 0}
            className="export-button"
            title="Экспортировать в JSON файл"
          >
            📤 Экспортировать ({technologies.length})
          </button>
        </div>

        <div className="action-group">
          <button 
            onClick={handleExampleImport}
            disabled={importing}
            className="example-button"
            title="Импортировать пример дорожной карты"
          >
            ✨ Импорт примера
          </button>
        </div>
      </div>

      {importStatus && (
        <div className={`import-status ${importStatus.type}`}>
          <p>{importStatus.message}</p>
        </div>
      )}

      <div className="importer-info">
        <h4>💡 Информация</h4>
        <ul>
          <li>
            <strong>Импорт:</strong> Загрузите JSON файл с технологиями. 
            Файл должен содержать массив объектов с полями: title, description, category, status.
          </li>
          <li>
            <strong>Экспорт:</strong> Сохраните текущий список технологий в JSON файл 
            для резервного копирования или переноса на другое устройство.
          </li>
          <li>
            <strong>Пример:</strong> Импортируйте готовый пример дорожной карты 
            с базовыми технологиями веб-разработки.
          </li>
        </ul>
      </div>

      <div className="json-example">
        <h4>📝 Пример формата JSON</h4>
        <pre>
{`[
  {
    "title": "React",
    "description": "Библиотека для создания UI",
    "category": "frontend",
    "status": "in-progress",
    "notes": "Компоненты, хуки, контекст",
    "githubUrl": "https://github.com/facebook/react"
  }
]`}
        </pre>
      </div>
    </div>
  );
}

export default RoadmapImporter;
