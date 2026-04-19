import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function active(path) {
    return location.pathname === path
      ? 'text-slate-900 font-semibold'
      : 'text-slate-400 hover:text-slate-900 transition-colors'
  }

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-slate-900 font-bold text-2xl flex items-center gap-1.5 tracking-tight">
          <span className="text-indigo-600">🛍</span>
          <span>Dukaan</span>
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className={`text-sm ${active('/')}`}>Products</Link>
              <Link to="/cart" className={`text-sm ${active('/cart')}`}>🛍 Cart</Link>
              <Link to="/orders" className={`text-sm ${active('/orders')}`}>📦 Orders</Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-semibold hover:bg-slate-200 transition-colors">
                  ⚙ Admin
                </Link>
              )}
              <div className="border-l border-gray-200 pl-4 flex items-center gap-3">
                <span className="text-slate-500 text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors font-medium">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Login</Link>
              <Link to="/register" className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* mobile toggle */}
        <button className="md:hidden text-slate-900 text-2xl focus:outline-none" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden bg-white px-4 py-4 flex flex-col gap-4 border-t border-gray-100 shadow-inner">
          {user ? (
            <>
              <Link to="/" className="text-slate-700 font-medium text-sm" onClick={() => setOpen(false)}>Products</Link>
              <Link to="/cart" className="text-slate-700 font-medium text-sm" onClick={() => setOpen(false)}>🛍 Cart</Link>
              <Link to="/orders" className="text-slate-700 font-medium text-sm" onClick={() => setOpen(false)}>📦 Orders</Link>
              {isAdmin && <Link to="/admin" className="text-slate-700 font-medium text-sm" onClick={() => setOpen(false)}>⚙ Admin</Link>}
              <button onClick={() => { handleLogout(); setOpen(false); }} className="text-red-600 font-medium text-sm text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 font-medium text-sm" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="text-slate-900 font-medium text-sm" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
