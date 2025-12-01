import { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст для аутентификации
const AuthContext = createContext();

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер контекста аутентификации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка пользователя из localStorage при монтировании
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Функции для работы с аутентификацией
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (userData) => {
    // В реальном приложении здесь был бы API вызов
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
    };

    // Сохраняем пользователя в "базе данных" (localStorage)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Добавляем пользователя admin, если его еще нет
    const adminExists = users.some(u => u.email === 'admin');
    if (!adminExists) {
      users.push({
        id: 'admin',
        name: 'Администратор',
        email: 'admin',
        password: 'admin',
        createdAt: new Date().toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      });
    }
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    login(newUser);
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Обновляем в "базе данных"
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};