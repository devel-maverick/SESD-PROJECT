import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// fallback emoji if image fails
const categoryEmoji = {
  Electronics: '📱',
  Grocery: '🥦',
  Fashion: '👗',
  Books: '📚',
  Furniture: '🛋',
  Shoes: '👟',
}

const categoryBadge = {
  Electronics: 'bg-blue-50 text-blue-700',
  Grocery:     'bg-green-50 text-green-700',
  Fashion:     'bg-pink-50 text-pink-700',
  Books:       'bg-amber-50 text-amber-700',
  Furniture:   'bg-purple-50 text-purple-700',
  Shoes:       'bg-teal-50 text-teal-700',
}

export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)

  // image field is stored as JSON array string: ["thumb.webp", "img1.webp", ...]
  const thumbnailSrc = (() => {
    try {
      const parsed = JSON.parse(product.image)
      return Array.isArray(parsed) ? parsed[0] : product.image
    } catch {
      return product.image
    }
  })()

  async function addToCart() {
    if (!user) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      await api.post('/cart/add', { productId: product.id, quantity: 1 })
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  const outOfStock = product.stock === 0

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow">
      {/* image area */}
      <Link to={`/product/${product.id}`} className="relative h-48 bg-gray-50 rounded-t-xl overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity">
        {thumbnailSrc && !imgError ? (
          <img
            src={thumbnailSrc}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-6xl">{categoryEmoji[product.category] ?? '📦'}</span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryBadge[product.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {product.category}
          </span>
          <span className="text-xs text-gray-400">{product.stock > 0 ? `${product.stock} left` : 'Unavailable'}</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-1 hover:underline">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">{product.description}</p>

        <p className="text-xl font-bold text-gray-900 mt-3">
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        {isAdmin ? (
          <div className="flex gap-2 mt-3">
            <button onClick={() => onEdit(product)} className="btn-outline flex-1 text-sm py-1.5">
              Edit
            </button>
            <button onClick={() => onDelete(product.id)} className="btn-red flex-1 text-sm py-1.5">
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={addToCart}
            disabled={outOfStock || adding}
            className="btn-orange w-full mt-3 text-sm py-2"
          >
            {adding ? 'Adding...' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}
