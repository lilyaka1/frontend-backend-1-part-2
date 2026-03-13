import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const productAPI = {
  // Получить все товары
  getAll: async () => {
    const { data } = await api.get('/products')
    return data.data || data
  },

  // Получить один товар
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data.data || data
  },

  // Создать товар
  create: async (product) => {
    const { data } = await api.post('/products', product)
    return data.data || data
  },

  // Обновить товар
  update: async (id, product) => {
    const { data } = await api.patch(`/products/${id}`, product)
    return data.data || data
  },

  // Удалить товар
  delete: async (id) => {
    await api.delete(`/products/${id}`)
  }
}

export default api
