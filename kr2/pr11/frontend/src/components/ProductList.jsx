import ProductCard from './ProductCard'
import './ProductList.css'

export default function ProductList({ products, loading, onEdit, onDelete, userRole }) {
  if (loading) {
    return <div className="loading">Загрузка товаров...</div>
  }

  if (products.length === 0) {
    return <div className="empty">Товаров не найдено</div>
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          userRole={userRole}
        />
      ))}
    </div>
  )
}
