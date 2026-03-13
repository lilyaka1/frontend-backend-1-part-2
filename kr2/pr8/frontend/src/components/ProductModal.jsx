import { useState, useEffect } from 'react'
import './ProductModal.css'

// Функция получения изображения от waifu.pics
async function getWaifuImage() {
  try {
    const response = await fetch('https://api.waifu.pics/sfw/waifu')
    const data = await response.json()
    return data.url
  } catch (err) {
    console.error('Ошибка загрузки изображения:', err)
    return 'https://api.waifu.pics/sfw/waifu'
  }
}

export default function ProductModal({ isOpen, product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    rating: 5,
    image: ''
  })
  const [loadingImage, setLoadingImage] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: 0,
        stock: 0,
        rating: 5,
        image: ''
      })
    }
  }, [product, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'rating' 
        ? parseFloat(value) 
        : value
    }))
  }

  const handleGetRandomImage = async () => {
    setLoadingImage(true)
    const imageUrl = await getWaifuImage()
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }))
    setLoadingImage(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Редактировать товар' : 'Новый товар'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Аниме девушка"
              required
            />
          </div>

          <div className="form-group">
            <label>Категория *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Коллекция"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Краткое описание товара"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цена (руб) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Количество *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Рейтинг</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Изображение</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                disabled={loadingImage}
              />
              <button
                type="button"
                onClick={handleGetRandomImage}
                disabled={loadingImage}
                style={{
                  padding: '10px 16px',
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loadingImage ? 'not-allowed' : 'pointer',
                  opacity: loadingImage ? 0.6 : 1,
                  whiteSpace: 'nowrap'
                }}
              >
                {loadingImage ? 'Загрузка...' : 'Случайное'}
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
