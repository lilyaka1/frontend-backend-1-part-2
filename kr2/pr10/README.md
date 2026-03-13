# Практическое занятие 10 — Хранение токенов на фронтенде

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

## Что реализовано

- React-фронтенд с экранами входа и регистрации
- Хранение `accessToken` и `refreshToken` в `localStorage`
- Axios `request/response interceptors`
- Автоматическое обновление пары токенов при `401`
- CRUD товаров + просмотр товара по `id`

---

## Структура проекта

```
pr10/
├── backend/
│   ├── package.json
│   └── server.js          # Express-сервер с bcrypt + access/refresh JWT
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
        │   └── shop.js    # axios клиент + interceptors + token storage
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

| Метод | Маршрут              | Описание                                       | Защита |
|-------|----------------------|------------------------------------------------|--------|
| POST  | `/api/auth/register` | Регистрация (пароль хешируется bcrypt)          | —      |
| POST  | `/api/auth/login`    | Вход — возвращает пару access/refresh токенов  | —      |
| POST  | `/api/auth/refresh`  | Обновление пары токенов по refresh-токену      | —      |
| GET   | `/api/auth/me`       | Текущий пользователь по токену                 | JWT    |

**Пример ответа `/api/auth/login`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Использование access-токена:**
```
Authorization: Bearer <accessToken>
```

**Обновление токенов (`POST /api/auth/refresh`):**
```
Authorization: Bearer <refreshToken>
```

---

### Товары

| Метод  | Маршрут              | Описание                | Защита |
|--------|----------------------|-------------------------|--------|
| POST   | `/api/products`      | Создать товар           | —      |
| GET    | `/api/products`      | Список товаров          | —      |
| GET    | `/api/products/:id`  | Получить товар по id    | JWT    |
| PUT    | `/api/products/:id`  | Обновить товар          | JWT    |
| DELETE | `/api/products/:id`  | Удалить товар           | JWT    |

**Поля товара:** `id`, `name`, `category`, `description`, `price`, `stock`, `rating`, `image`

---

## Фронтенд: хранение токенов

Токены хранятся в `localStorage`:

- `accessToken`
- `refreshToken`

Axios автоматически:

- добавляет `Authorization: Bearer <accessToken>` в запросы;
- при `401` отправляет `POST /api/auth/refresh` c `refreshToken`;
- сохраняет новую пару токенов и повторяет исходный запрос.


---
