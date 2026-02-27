const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const https = require('https');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Swagger определение
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Shop API',
      version: '1.0.0',
      description: 'REST API для интернет-магазина с документацией Swagger'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер'
      }
    ]
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Кэш изображений от waifu.pics
let waifuCache = [];

// Функция получения изображения от waifu.pics
async function getWaifuImage() {
  return new Promise((resolve, reject) => {
    https.get('https://api.waifu.pics/sfw/waifu', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.url);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Предзагрузка изображений при запуске
async function preloadWaifuImages() {
  try {
    for (let i = 0; i < 15; i++) {
      const imageUrl = await getWaifuImage();
      waifuCache.push(imageUrl);
    }
    console.log(`Предзагружено ${waifuCache.length} изображений от waifu.pics`);
  } catch (err) {
    console.warn('Не удалось загрузить изображения от waifu.pics:', err.message);
  }
}

// Функция получения изображения из кэша или API
async function getRandomWaifuImage() {
  if (waifuCache.length > 0) {
    return waifuCache[Math.floor(Math.random() * waifuCache.length)];
  }
  try {
    return await getWaifuImage();
  } catch (err) {
    return 'https://api.waifu.pics/sfw/waifu';
  }
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
  });
  next();
});

// База данных товаров
let products = [
  {
    id: nanoid(6),
    name: 'Ноутбук ASUS VivoBook',
    category: 'Компьютеры',
    description: 'Легкий портативный ноутбук с мощным процессором Intel i7',
    price: 75000,
    stock: 5,
    rating: 4.5,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Монитор Samsung 27"',
    category: 'Мониторы',
    description: '4K монитор с отличной цветопередачей для работников и дизайнеров',
    price: 25000,
    stock: 12,
    rating: 4.7,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Клавиатура Mechanical RGB',
    category: 'Периферия',
    description: 'Механическая игровая клавиатура с RGB подсветкой',
    price: 8500,
    stock: 20,
    rating: 4.3,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Мышка Logitech Pro',
    category: 'Периферия',
    description: 'Профессиональная беспроводная мышь для геймеров и дизайнеров',
    price: 5500,
    stock: 30,
    rating: 4.6,
    image: null
  },
  {
    id: nanoid(6),
    name: 'SSD Kingston 1TB',
    category: 'Накопители',
    description: 'Быстрый SSD накопитель с гарантией 5 лет',
    price: 9000,
    stock: 15,
    rating: 4.8,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Наушники Sony WH-1000XM5',
    category: 'Аудио',
    description: 'Премиум наушники с шумоподавлением и отличным звуком',
    price: 42000,
    stock: 8,
    rating: 4.9,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Веб-камера Logitech 4K',
    category: 'Аксессуары',
    description: '4K веб-камера для стриминга и видеоконференций',
    price: 12000,
    stock: 10,
    rating: 4.4,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Видеокарта RTX 4070',
    category: 'Комплектующие',
    description: 'Мощная видеокарта для 4K-гейминга и работы с видео',
    price: 95000,
    stock: 3,
    rating: 4.7,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Процессор Intel i9',
    category: 'Комплектующие',
    description: 'Топовый процессор для профессиональной работы',
    price: 68000,
    stock: 4,
    rating: 4.8,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Материнская плата ASUS ROG',
    category: 'Комплектующие',
    description: 'Игровая материнская плата с премиум компонентами',
    price: 28000,
    stock: 6,
    rating: 4.6,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Охлаждение Noctua NH-D15',
    category: 'Охлаждение',
    description: 'Мощное воздушное охлаждение для высокопроизводительных ПК',
    price: 11500,
    stock: 9,
    rating: 4.9,
    image: null
  },
  {
    id: nanoid(6),
    name: 'Блок питания Corsair 850W',
    category: 'Блоки питания',
    description: 'Надежный модульный блок питания с сертификацией Gold',
    price: 18000,
    stock: 7,
    rating: 4.5,
    image: null
  }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Подробное описание товара
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *         stock:
 *           type: integer
 *           description: Количество товара на складе
 *         rating:
 *           type: number
 *           description: Рейтинг товара от 0 до 5
 *         image:
 *           type: string
 *           description: URL изображения товара
 *       example:
 *         id: "abc123"
 *         name: "Ноутбук ASUS VivoBook"
 *         category: "Компьютеры"
 *         description: "Легкий портативный ноутбук с мощным процессором Intel i7"
 *         price: 75000
 *         stock: 5
 *         rating: 4.5
 *         image: "https://i.waifu.pics/ZPXy_XG.jpg"
 */

// Функция поиска товара
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Товар не найден" });
    return null;
  }
  return product;
}

// ===== API ROUTES =====

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET все товары
app.get("/api/products", async (req, res) => {
  const productsWithImages = await Promise.all(
    products.map(async (p) => ({
      ...p,
      image: p.image || await getRandomWaifuImage()
    }))
  );
  res.json(productsWithImages);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
// GET товар по ID
app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  
  const productWithImage = {
    ...product,
    image: product.image || await getRandomWaifuImage()
  };
  res.json(productWithImage);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
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
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
// POST создать товар
app.post("/api/products", async (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name || !category || !price || stock === undefined) {
    return res.status(400).json({ error: "Заполните обязательные поля" });
  }

  const imageUrl = image || await getRandomWaifuImage();

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description?.trim() || '',
    price: Number(price),
    stock: Number(stock),
    rating: rating ? Number(rating) : 0,
    image: imageUrl
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
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
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
// PATCH обновить товар
app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  const { name, category, description, price, stock, rating } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
// DELETE товар
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  
  if (!exists) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Ошибка:", err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// Запуск сервера
app.listen(port, async () => {
  console.log(`Бэкенд магазина запущен на http://localhost:${port}`);
  console.log(`Товаров в БД: ${products.length}`);
  console.log(`Загрузка изображений от waifu.pics...`);
  await preloadWaifuImages();
});
