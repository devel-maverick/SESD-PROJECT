import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

const statusStyle = {
  pending:   'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped:   'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const statusEmoji = {
  pending: '⏳', confirmed: '✅', shipped: '🚚', delivered: '📦', cancelled: '❌',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-7xl mb-5">📦</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8">Place your first order and it will appear here</p>
        <Link to="/" className="btn-orange px-8 py-3">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📦 My Orders</h1>

      <div className="space-y-5">
        {orders.map(order => (
          <div key={order.id} className="card overflow-hidden">
            {/* header */}
            <div className="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100">
              <div className="flex gap-4 items-center">
                <span className="font-mono text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle[order.status]}`}>
                  {statusEmoji[order.status]} {order.status}
                </span>
                <span className={`text-xs font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  ● {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* items */}
            <div className="px-5 py-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.product?.image
                      ? <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xl">📦</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product?.name || item.name || 'Product'}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-400">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
