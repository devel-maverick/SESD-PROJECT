import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductDetails from './pages/ProductDetails'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', fontSize: '14px' },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/admin"    element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-100 py-4 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Dukaan - built with ❤️ by Maverick
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
