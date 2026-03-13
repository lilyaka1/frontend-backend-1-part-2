import { useState, useEffect } from 'react'
import ProductList from './components/ProductList'
import ProductModal from './components/ProductModal'
import { productAPI } from './api/shop'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Загрузка товаров при монтировании компонента
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productAPI.getAll()
      setProducts(data)
    } catch (err) {
      setError('Ошибка загрузки товаров. Убедитесь, что бэкенд запущен на http://localhost:3000')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productAPI.delete(id)
        setProducts(products.filter(p => p.id !== id))
      } catch (err) {
        setError('Ошибка при удалении товара')
        console.error(err)
      }
    }
  }

  const handleSaveProduct = async (formData) => {
    try {
      if (selectedProduct) {
        // Обновление существующего товара
        const updated = await productAPI.update(selectedProduct.id, formData)
        setProducts(products.map(p => p.id === selectedProduct.id ? updated : p))
      } else {
        // Создание нового товара
        const created = await productAPI.create(formData)
        setProducts([...products, created])
      }
      setIsModalOpen(false)
      setSelectedProduct(null)
    } catch (err) {
      setError('Ошибка при сохранении товара')
      console.error(err)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>E-Shop</h1>
          <button className="btn btn-primary" onClick={handleAddProduct}>
            Добавить товар
          </button>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-message">{error}</div>}
        
        <ProductList
          products={products}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </main>

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
      />

      <footer className="footer">
        <p>© 2024 E-Shop</p>
      </footer>
    </div>
  )
}

export default App
