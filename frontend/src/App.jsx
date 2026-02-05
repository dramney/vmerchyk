import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      {/* 1. Обгортаємо все в AuthProvider, щоб доступ до юзера був скрізь */}
      <AuthProvider>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
          <Toaster 
             position="top-center"
             toastOptions={{
               style: {
                 background: '#4A3B32',
                 color: '#fff',
               },
               success: {
                 iconTheme: {
                   primary: '#54A0FF',
                   secondary: '#fff',
                 },
               },
               error: {
                 iconTheme: {
                   primary: '#E05666',
                   secondary: '#fff',
                 },
               },
             }}
          />
          {/* 2. Додаємо Хедер, він буде на всіх сторінках */}
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;