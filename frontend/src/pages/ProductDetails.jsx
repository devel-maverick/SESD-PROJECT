import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function ProductDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.product)
      } catch {
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

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

  // image field is stored as JSON array: ["thumb.webp", "img1.webp", "img2.webp", ...]
  const gallery = useMemo(() => {
    if (!product) return []
    try {
      const parsed = JSON.parse(product.image)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {
      // not JSON, treat as plain URL
    }
    return [product.image]
  }, [product])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          <span className="text-sm">Loading product…</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Product not found.
      </div>
    )
  }

  const mrp = Math.round(product.price * 1.25)
  const discount = mrp - product.price
  const discountPct = Math.round((discount / mrp) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <span>›</span>
        <span className="capitalize hover:text-slate-900 transition-colors cursor-pointer"
          onClick={() => navigate(`/?category=${product.category}`)}>
          {product.category}
        </span>
        <span>›</span>
        <span className="text-slate-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── Image Gallery ──────────────────────────── */}
        <div className="lg:col-span-5">
          <div className="flex gap-3">
            {/* Thumbnail column */}
            <div className="hidden sm:flex flex-col gap-2 w-[72px]">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveImage(idx)}
                  onClick={() => setActiveImage(idx)}
                  className={`w-[72px] h-[72px] rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all
                    ${activeImage === idx
                      ? 'border-slate-800 shadow-md ring-1 ring-slate-800'
                      : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain p-1"
                    onError={e => { e.currentTarget.src = product.image }}
                  />
                </button>
              ))}
            </div>

            {/* Main big image */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden"
              style={{ height: '440px' }}>
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain p-6 transition-all duration-300 hover:scale-105"
                onError={e => { e.currentTarget.src = product.image }}
              />
            </div>
          </div>

          {/* Mobile horizontal thumbnails */}
          <div className="flex gap-2 mt-3 sm:hidden overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 overflow-hidden
                  ${activeImage === idx ? 'border-slate-800' : 'border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1"
                  onError={e => { e.currentTarget.src = product.image }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Details Panel ──────────────────────────── */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 h-full">

            {/* Category pill */}
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-2 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                <span>★</span>
                <span>4.8</span>
              </div>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-400 line-through text-lg">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded">
                  {discountPct}% OFF
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              disabled={adding || product.stock === 0}
              className="w-full py-4 rounded-xl text-lg font-bold transition-all
                bg-slate-900 hover:bg-slate-800 text-white
                disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                active:scale-95 shadow-sm"
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding…
                </span>
              ) : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Delivery info strip */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '🚚', label: 'Free Delivery', sub: 'Above ₹499' },
                { icon: '↩️', label: 'Easy Returns', sub: '7-day policy' },
                { icon: '🔒', label: 'Secure Pay', sub: '100% safe' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.sub}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
