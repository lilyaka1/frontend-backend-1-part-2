import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import ProductModal from './ProductModal';
import * as api from './api-shop';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [editingProduct, setEditingProduct] = useState(null);

  // Загрузка товаров при монтировании
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleModalSubmit = async (payload) => {
    try {
      if (modalMode === 'create') {
        // Создание нового товара
        const response = await api.createProduct(payload);
        setProducts([...products, response.data]);
      } else {
        // Обновление товара
        const response = await api.updateProduct(payload.id, payload);
        setProducts(products.map(p => p.id === payload.id ? response.data : p));
      }
      closeModal();
      alert(`Товар ${modalMode === 'create' ? 'добавлен' : 'обновлен'} успешно!`);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка сохранения товара');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      alert('Товар удален!');
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Ошибка удаления товара');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🛍️ Интернет-магазин</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Добавить товар
          </button>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-message">{error}</div>}
        
        <ProductList
          products={products}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        product={editingProduct}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />

      <footer className="footer">
        <p>© 2024 Интернет-магазин. Всего товаров: {products.length}</p>
      </footer>
    </div>
  );
}

export default App;
