const express = require('express');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth & Products API (JWT)',
      version: '2.0.0',
      description: 'API с JWT-аутентификацией и управлением товарами',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Локальный сервер' }],
    tags: [
      { name: 'Auth', description: 'Регистрация и вход' },
      { name: 'Products', description: 'CRUD товаров' },
      { name: 'Users', description: 'Управление пользователями (admin)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());

// Логгер
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const body = { ...req.body };
      if (body.password) body.password = '***';
      console.log('Body:', body);
    }
  });
  next();
});

// Хранилище в памяти
let users = [];
let products = [];

// ─── JWT ─────────────────────────────────────────────────────────────────────

const ACCESS_SECRET = 'access_secret';
const REFRESH_SECRET = 'refresh_secret';
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';
const refreshTokens = new Set();

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme === 'Bearer' && token) return token;
  return null;
}

function getRefreshTokenFromHeaders(req) {
  const bearer = getBearerToken(req);
  if (bearer) return bearer;
  return req.headers['x-refresh-token'] || req.headers['refresh-token'] || null;
}

function authMiddleware(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload; // { sub, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function rolesMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

// ─── Хелперы ─────────────────────────────────────────────────────────────────

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

function findProductById(id) {
  return products.find(p => p.id === id);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     description: Доступно только гостю
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, first_name, last_name, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Иванов
 *               password:
 *                 type: string
 *                 example: qwerty123
 *               role:
 *                 type: string
 *                 enum: [user, seller]
 *                 example: user
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Некорректные данные
 *       409:
 *         description: Пользователь с таким email уже существует
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, first_name, last_name, password, role } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({ error: 'Все поля обязательны: email, first_name, last_name, password' });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }

  const user = {
    id: nanoid(6),
    email,
    first_name,
    last_name,
    password: await hashPassword(password),
    role: role || 'user',
  };

  users.push(user);

  const { password: _, ...safeUser } = user;
  res.status(201).json(safeUser);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     description: Доступно только гостю
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: Успешный вход
 *       400:
 *         description: Отсутствуют поля
 *       401:
 *         description: Неверные учётные данные
 *       404:
 *         description: Пользователь не найден
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email и password обязательны' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);

  res.status(200).json({ accessToken, refreshToken });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновить пару access/refresh токенов
 *     tags: [Auth]
 *     description: Доступно гостю (по refresh-токену)
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer <refreshToken>
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *       400:
 *         description: Refresh-токен не передан
 *       401:
 *         description: Refresh-токен невалиден или истек
 */
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = getRefreshTokenFromHeaders(req);

  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required in headers' });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = users.find(u => u.id === payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    refreshTokens.delete(refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.add(newRefreshToken);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить текущего пользователя
 *     tags: [Auth]
 *     description: Доступно ролям user, seller, admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные текущего пользователя
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 */
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  const { password: _, ...safeUser } = user;
  res.status(200).json(safeUser);
});

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать товар
 *     tags: [Products]
 *     description: Доступно ролям seller, admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, description, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ноутбук
 *               category:
 *                 type: string
 *                 example: Электроника
 *               description:
 *                 type: string
 *                 example: Мощный ноутбук
 *               price:
 *                 type: number
 *                 example: 99999
 *               stock:
 *                 type: integer
 *                 example: 10
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар создан (роль seller или admin)
 *       400:
 *         description: Некорректные данные запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав (требуется seller или admin)
 */
app.post('/api/products', authMiddleware, rolesMiddleware('seller', 'admin'), (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name || !category || price === undefined || price === null) {
    return res.status(400).json({ error: 'Поля name, category и price обязательны' });
  }

  const product = {
    id: nanoid(6),
    name,
    category,
    description,
    price: Number(price),
    stock: stock !== undefined ? Number(stock) : 0,
    rating: rating !== undefined ? Number(rating) : 0,
    image: image || '',
  };

  products.push(product);
  res.status(201).json(product);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     description: Доступно всем (включая гостя)
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags: [Products]
 *     description: Доступно ролям user, seller, admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', authMiddleware, rolesMiddleware('user', 'seller', 'admin'), (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.status(200).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить товар
 *     tags: [Products]
 *     description: Доступно ролям seller, admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Товар не найден
 */
app.put('/api/products/:id', authMiddleware, rolesMiddleware('seller', 'admin'), (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  const { name, category, description, price, stock, rating, image } = req.body;
  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (image !== undefined) product.image = image;

  res.status(200).json(product);
});

app.patch('/api/products/:id', authMiddleware, rolesMiddleware('seller', 'admin'), (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  const { name, category, description, price, stock, rating, image } = req.body;
  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (image !== undefined) product.image = image;

  res.status(200).json(product);
});

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     description: Доступно только администратору
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 */
app.get('/api/users', authMiddleware, rolesMiddleware('admin'), (req, res) => {
  const safeUsers = users.map(u => {
    const { password: _, ...safe } = u;
    return safe;
  });
  res.status(200).json(safeUsers);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по id
 *     tags: [Users]
 *     description: Доступно только администратору
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
app.get('/api/users/:id', authMiddleware, rolesMiddleware('admin'), (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  const { password: _, ...safeUser } = user;
  res.status(200).json(safeUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновить информацию пользователя
 *     tags: [Users]
 *     description: Доступно только администратору
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *     responses:
 *       200:
 *         description: Информация обновлена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
app.put('/api/users/:id', authMiddleware, rolesMiddleware('admin'), (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

  const { first_name, last_name, role } = req.body;
  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (role !== undefined && ['user', 'seller', 'admin'].includes(role)) {
    user.role = role;
  }

  const { password: _, ...safeUser } = user;
  res.status(200).json(safeUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удалить (заблокировать) пользователя
 *     tags: [Users]
 *     description: Доступно только администратору
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь удалён
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
app.delete('/api/users/:id', authMiddleware, rolesMiddleware('admin'), (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Пользователь не найден' });

  const [removed] = users.splice(idx, 1);
  const { password: _, ...safeUser } = removed;
  res.status(200).json({ message: 'Пользователь удалён', user: safeUser });
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     description: Доступно только администратору
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав (только администратор)
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', authMiddleware, rolesMiddleware('admin'), (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Товар не найден' });

  const [removed] = products.splice(idx, 1);
  res.status(200).json({ message: 'Товар удалён', product: removed });
});

// ─── Запуск ───────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
