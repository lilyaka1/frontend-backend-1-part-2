import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import TechnologyList from './pages/TechnologyList'
import TechnologyDetail from './pages/TechnologyDetail'
import AddTechnology from './pages/AddTechnology'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ApiDemo from './pages/ApiDemo'
import ProtectedRoute from './components/ProtectedRoute'
import { TechnologyProvider } from './contexts/TechnologyContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <TechnologyProvider>
            <Router>
            <div className="app">
              <Navigation />

              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/technologies" element={<TechnologyList />} />
                  <Route path="/technology/:techId" element={<TechnologyDetail />} />
                  <Route path="/api-demo" element={<ApiDemo />} />
                  <Route path="/add-technology" element={
                    <ProtectedRoute>
                      <AddTechnology />
                    </ProtectedRoute>
                  } />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
          </Router>
        </TechnologyProvider>
      </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
