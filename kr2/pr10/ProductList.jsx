import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  if (!products.length) {
    return <div className="empty">Товаров нет</div>;
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
