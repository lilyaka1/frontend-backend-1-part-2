import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    rating: ''
  });

  useEffect(() => {
    if (open && mode === 'edit' && product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        rating: product.rating || ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
        rating: ''
      });
    }
  }, [open, mode, product]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim() || !formData.price) {
      alert('Заполните обязательные поля');
      return;
    }

    const payload = {
      ...formData,
      id: product?.id
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Добавить товар' : 'Редактировать товар'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: Ноутбук"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Категория *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Например: Компьютеры"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание товара"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>На складе *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Рейтинг</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="0-5"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? 'Добавить' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
