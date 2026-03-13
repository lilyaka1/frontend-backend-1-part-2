# Практическое занятие 7 — Базовые методы аутентификации

---

## Запуск

### Бэкенд

```bash
cd backend
npm install
npm start
# http://localhost:3000
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
pr7/
├── backend/
│   ├── package.json
│   └── server.js          # Express-сервер с bcrypt-аутентификацией
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

## API

### Аутентификация

| Метод | Маршрут         | Описание                                                                           |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| POST       | `/api/auth/register` | Регистрация пользователя (пароль хешируется bcrypt) |
| POST       | `/api/auth/login`    | Вход по email и паролю                                                        |

**Поля пользователя:** `id`, `email`, `first_name`, `last_name`, `password`

**Пример регистрации:**

```json
{
  "email": "ivan@example.com",
  "first_name": "Иван",
  "last_name": "Иванов",
  "password": "qwerty123"
}
```

**Пример входа:**

```json
{
  "email": "ivan@example.com",
  "password": "qwerty123"
}
```

---

### Товары

| Метод | Маршрут        | Описание                             |
| ---------- | --------------------- | -------------------------------------------- |
| POST       | `/api/products`     | Создать товар                    |
| GET        | `/api/products`     | Получить список товаров |
| GET        | `/api/products/:id` | Получить товар по id          |
| PATCH      | `/api/products/:id` | Обновить товар                  |
| DELETE     | `/api/products/:id` | Удалить товар                    |

**Поля товара:** `id`, `name`, `category`, `description`, `price`, `stock`, `rating`, `image`

**Пример создания товара:**

```json
{
  "name": "Ноутбук",
  "category": "Электроника",
  "description": "Мощный ноутбук",
  "price": 99999,
  "stock": 10,
  "rating": 4.5
}
```
