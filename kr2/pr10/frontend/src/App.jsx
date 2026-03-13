import { useState, useEffect } from 'react'
import ProductList from './components/ProductList'
import ProductModal from './components/ProductModal'
import { authAPI, productAPI, tokenStorage } from './api/shop'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [authMode, setAuthMode] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  })

  const [productIdQuery, setProductIdQuery] = useState('')
  const [productById, setProductById] = useState(null)

  useEffect(() => {
    initSession()
  }, [])

  const initSession = async () => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const me = await authAPI.me()
      setCurrentUser(me)
      setIsAuthenticated(true)
      await loadProducts()
    } catch (err) {
      tokenStorage.clearTokens()
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      setError(null)
      const data = await productAPI.getAll()
      setProducts(data)
    } catch (err) {
      setError('Ошибка загрузки товаров. Убедитесь, что бэкенд запущен на http://localhost:3000')
    }
  }

  const handleAuthInput = (event) => {
    const { name, value } = event.target
    setAuthForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      await authAPI.register({
        email: authForm.email,
        password: authForm.password,
        first_name: authForm.first_name,
        last_name: authForm.last_name,
      })
      setAuthMode('login')
      setAuthForm(prev => ({ ...prev, password: '' }))
    } catch (err) {
      setError(err?.response?.data?.error || 'Ошибка регистрации')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      await authAPI.login({ email: authForm.email, password: authForm.password })
      const me = await authAPI.me()
      setCurrentUser(me)
      setIsAuthenticated(true)
      await loadProducts()
    } catch (err) {
      setError(err?.response?.data?.error || 'Ошибка входа')
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setProducts([])
    setProductById(null)
    setProductIdQuery('')
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
        if (productById?.id === id) {
          setProductById(null)
        }
      } catch (err) {
        setError('Ошибка при удалении товара')
      }
    }
  }

  const handleSaveProduct = async (formData) => {
    try {
      if (selectedProduct) {
        const updated = await productAPI.update(selectedProduct.id, formData)
        setProducts(products.map(p => p.id === selectedProduct.id ? updated : p))
        if (productById?.id === selectedProduct.id) {
          setProductById(updated)
        }
      } else {
        const created = await productAPI.create(formData)
        setProducts([...products, created])
      }
      setIsModalOpen(false)
      setSelectedProduct(null)
    } catch (err) {
      setError('Ошибка при сохранении товара')
    }
  }

  const handleFindById = async () => {
    if (!productIdQuery.trim()) return

    try {
      setError(null)
      const item = await productAPI.getById(productIdQuery.trim())
      setProductById(item)
    } catch (err) {
      setProductById(null)
      setError(err?.response?.data?.error || 'Товар не найден')
    }
  }

  if (loading) {
    return (
      <div className="app">
        <main className="main">Загрузка...</main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>E-Shop Auth</h1>
          </div>
        </header>

        <main className="main auth-main">
          {error && <div className="error-message">{error}</div>}

          <div className="auth-switch">
            <button className="btn" onClick={() => setAuthMode('login')}>Вход</button>
            <button className="btn" onClick={() => setAuthMode('register')}>Регистрация</button>
          </div>

          <form className="auth-form" onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
            {authMode === 'register' && (
              <>
                <input
                  className="auth-input"
                  name="first_name"
                  value={authForm.first_name}
                  onChange={handleAuthInput}
                  placeholder="Имя"
                  required
                />
                <input
                  className="auth-input"
                  name="last_name"
                  value={authForm.last_name}
                  onChange={handleAuthInput}
                  placeholder="Фамилия"
                  required
                />
              </>
            )}

            <input
              className="auth-input"
              type="email"
              name="email"
              value={authForm.email}
              onChange={handleAuthInput}
              placeholder="Email"
              required
            />

            <input
              className="auth-input"
              type="password"
              name="password"
              value={authForm.password}
              onChange={handleAuthInput}
              placeholder="Пароль"
              required
            />

            <button className="btn btn-primary" type="submit">
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>E-Shop</h1>
          <div className="header-actions">
            <span className="user-email">{currentUser?.email}</span>
            <button className="btn btn-primary" onClick={handleAddProduct}>Добавить товар</button>
            <button className="btn" onClick={handleLogout}>Выйти</button>
          </div>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-message">{error}</div>}

        <div className="find-by-id">
          <input
            className="auth-input"
            value={productIdQuery}
            onChange={(event) => setProductIdQuery(event.target.value)}
            placeholder="Введите id товара"
          />
          <button className="btn btn-primary" onClick={handleFindById}>Найти по id</button>
        </div>

        {productById && (
          <div className="by-id-result">
            <h3>Найденный товар</h3>
            <pre>{JSON.stringify(productById, null, 2)}</pre>
          </div>
        )}

        <ProductList
          products={products}
          loading={false}
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
        <p>© 2026 E-Shop</p>
      </footer>
    </div>
  )
}

export default App
