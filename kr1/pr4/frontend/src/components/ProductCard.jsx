import './ProductCard.css'

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-category">{product.category}</span>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-info">
            <span className="price">₽ {product.price.toLocaleString('ru-RU')}</span>
            <span className={`stock ${product.stock > 0 ? 'available' : 'unavailable'}`}>
              {product.stock > 0 ? `${product.stock} шт` : 'Нет в наличии'}
            </span>
            {product.rating && (
              <span className="rating">⭐ {product.rating}</span>
            )}
          </div>
          
          <div className="product-actions">
            <button className="btn btn-edit" onClick={() => onEdit(product)}>
              Редактировать
            </button>
            <button className="btn btn-delete" onClick={() => onDelete(product.id)}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
