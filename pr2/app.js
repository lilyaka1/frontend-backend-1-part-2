const express = require('express');
const app = express();
const port = 3000;

let products = [
  { id: 1, title: 'Ноутбук', price: 50000 },
  { id: 2, title: 'Мышка', price: 1500 },
  { id: 3, title: 'Клавиатура', price: 3000 }
];

app.use(express.json());

// Главная страница
app.get('/', (req, res) => {
  res.json({ message: 'API для товаров. Используй /products' });
});

// получить все товары
app.get('/products', (req, res) => {
  res.json(products);
});

// получить товар по id
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Товар не найден' });
  }
  res.json(product);
});

// добавить новый товар
app.post('/products', (req, res) => {
  const { title, price } = req.body;
  
  if (!title || !price) {
    return res.status(400).json({ message: 'Требуются поля title и price' });
  }
  
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    title,
    price
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// обновить товар
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Товар не найден' });
  }
  
  if (req.body.title) product.title = req.body.title;
  if (req.body.price) product.price = req.body.price;
  
  res.json(product);
});

// удалить товар
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Товар не найден' });
  }
  
  const deletedProduct = products.splice(index, 1);
  res.json(deletedProduct[0]);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
