import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Удалить "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-info">
            <span className="price">₽{product.price.toLocaleString('ru-RU')}</span>
            <span className={`stock ${product.stock > 0 ? 'available' : 'unavailable'}`}>
              {product.stock > 0 ? `На складе: ${product.stock}` : 'Нет в наличии'}
            </span>
            {product.rating > 0 && (
              <span className="rating">⭐ {product.rating}</span>
            )}
          </div>
          
          <div className="product-actions">
            <button className="btn btn-edit" onClick={() => onEdit(product)}>
              Редактить
            </button>
            <button className="btn btn-delete" onClick={handleDelete}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
