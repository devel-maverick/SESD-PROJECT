import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

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

  async function checkout() {
    setPaying(true)
    try {
      const { data } = await api.post('/orders')

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'QuickCart',
        description: 'Your Order',
        order_id: data.razorpayOrderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#f97316' },
        handler: async (resp) => {
          try {
            await api.post('/orders/verify-payment', {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            })
            toast.success('🎉 Order placed! Thank you for shopping.')
            loadCart()
          } catch {
            toast.error('Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => toast('Payment cancelled', { icon: 'ℹ️' }),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create order')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
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
        🛍 My Cart <span className="text-gray-400 text-base font-normal">({totalItems} items)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* items */}
        <div className="flex-1 space-y-4">
          {cart.items.map(item => (
            <div key={item.product.id} className="card p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                <p className="text-sm text-gray-500">{item.product.category}</p>
                <p className="text-orange-500 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold">−</button>
                  <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold">+</button>
                </div>
                <p className="text-sm font-semibold text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
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
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={checkout} disabled={paying} className="btn-orange w-full py-3 mt-5">
              {paying ? 'Redirecting...' : '💳 Pay Now'}
            </button>

            <Link to="/" className="block text-center text-sm text-orange-500 hover:underline mt-4">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
