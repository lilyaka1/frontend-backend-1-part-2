# Практическое занятие 8 — JWT-аутентификация

---

## Запуск

### Бэкенд

```bash
cd backend
npm install
npm start
# http://localhost:3000
# Swagger UI: http://localhost:3000/api-docs
```

### Фронтенд

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

---

## Структура проекта

```
pr8/
├── backend/
│   ├── package.json
│   └── server.js          # Express-сервер с bcrypt + JWT
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── api/
        │   └── shop.js    # API-клиент
        └── components/
            ├── ProductCard.jsx
            ├── ProductCard.css
            ├── ProductList.jsx
            ├── ProductList.css
            ├── ProductModal.jsx
            └── ProductModal.css
```

---

## API маршруты

### Аутентификация

| Метод | Маршрут         | Описание                                                  | Защита |
| ---------- | ---------------------- | ----------------------------------------------------------------- | ------------ |
| POST       | `/api/auth/register` | Регистрация (пароль хешируется bcrypt) | —           |
| POST       | `/api/auth/login`    | Вход — возвращает `accessToken` (JWT)            | —           |
| GET        | `/api/auth/me`       | Текущий пользователь по токену         | JWT          |

### Товары

| Метод | Маршрут        | Описание                    | Защита |
| ---------- | --------------------- | ----------------------------------- | ------------ |
| POST       | `/api/products`     | Создать товар           | -            |
| GET        | `/api/products`     | Список товаров         | -            |
| GET        | `/api/products/:id` | Получить товар по id | JWT          |
| PATCH      | `/api/products/:id` | Обновить товар         | JWT          |
| DELETE     | `/api/products/:id` | Удалить товар           | JWT          |

**Поля товара:** `id`, `name`, `category`, `description`, `price`, `stock`, `rating`, `image`

---
