import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    try {
      const { data } = await api.get('/cart')
      setCart(data.cart)
    } catch {
      toast.error('Could not load cart')
    } finally {
      setLoading(false)
    }
  }

  async function removeItem(productId) {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`)
      setCart(data.cart)
      toast.success('Removed from cart')
    } catch {
      toast.error('Could not remove item')
    }
  }

  async function updateQty(productId, qty) {
    if (qty < 1) return removeItem(productId)
    try {
      const { data } = await api.patch(`/cart/quantity/${productId}`, { quantity: qty })
      setCart(data.cart)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Stock limit reached')
    }
  }

  async function placeOrder() {
    setPlacing(true)
    try {
      await api.post('/orders')
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add something to get started!</p>
        <Link to="/" className="btn-orange px-8 py-3 text-base">Start Shopping</Link>
      </div>
    )
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        My Cart <span className="text-gray-400 text-base font-normal">({totalItems} items)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* items */}
        <div className="flex-1 space-y-4">
          {cart.items.map(item => {
            const thumbnailSrc = (() => {
              try {
                const parsed = JSON.parse(item.product.image)
                return Array.isArray(parsed) ? parsed[0] : item.product.image
              } catch {
                return item.product.image
              }
            })()

            return (
              <div key={item.product.id} className="card p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {thumbnailSrc ? (
                    <img src={thumbnailSrc} alt={item.product.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-sm text-gray-400">{item.product.category}</p>
                  <p className="text-slate-900 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-600 text-lg leading-none">✕</button>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold">−</button>
                    <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold">+</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* summary */}
        <div className="lg:w-80">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full mt-5 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {placing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : 'Place Order'}
            </button>

            <Link to="/" className="block text-center text-sm text-gray-400 hover:text-slate-700 mt-4">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
