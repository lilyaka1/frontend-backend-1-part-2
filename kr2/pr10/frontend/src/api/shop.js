import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return Promise.reject(error)
    }

    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data
      setTokens(newAccessToken, newRefreshToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      clearTokens()
      return Promise.reject(refreshError)
    }
  }
)

export const authAPI = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    if (data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken)
    }
    return data
  },

  refresh: async () => {
    const refreshToken = getRefreshToken()
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken)
    }
    return data
  },

  me: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  logout: () => {
    clearTokens()
  }
}

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
    const { data } = await api.put(`/products/${id}`, product)
    return data.data || data
  },

  // Удалить товар
  delete: async (id) => {
    await api.delete(`/products/${id}`)
  }
}

export const tokenStorage = {
  getAccessToken,
  getRefreshToken,
  clearTokens
}

export default api
