# Практические занятия 4-6

---

```bash
cd frontend
npx create-react-app .
npm install axios
npm start
```

### Структура проекта:

```
src/
├── api/
│   └── shop.js           # API клиент
├── components/
│   ├── ProductCard.jsx   # Карточка товара
│   ├── ProductList.jsx   # Список товаров
│   ├── ProductModal.jsx  # Модальное окно (CRUD)
│   └── Cart.jsx          # Корзина (опционально)
├── pages/
│   └── ShopPage.jsx      # Главная страница
├── App.js                # Главный компонент
├── App.css               # Стили
└── index.js              # Входная точка
```

---

## Связь фронтенда и бэкенда

**API файл (src/api/shop.js):**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
```

---

## Компоненты

### ProductCard.jsx

```javascript
export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="description">{product.description}</p>
      <div className="price-stock">
        <span className="price">{product.price}₽</span>
        <span className="stock">На складе: {product.stock}</span>
      </div>
      {product.rating && <span className="rating">⭐ {product.rating}</span>}
      <div className="actions">
        <button onClick={() => onEdit(product)}>Редактировать</button>
        <button onClick={() => onDelete(product.id)}>Удалить</button>
      </div>
    </div>
  );
}
```

---

```
GET    /api/products           - Все товары
GET    /api/products/:id       - Товар по ID
POST   /api/products           - Создать товар
PATCH  /api/products/:id       - Обновить товар
DELETE /api/products/:id       - Удалить товар
```
