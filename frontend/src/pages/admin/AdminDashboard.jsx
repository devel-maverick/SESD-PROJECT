import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import ProductCard from '../../components/ProductCard'

const emptyForm = {
  name: '', description: '', price: '', stock: '', category: 'Electronics', image: '',
}

const CATEGORIES = ['Electronics', 'Grocery', 'Fashion', 'Shoes', 'Furniture', 'Books']

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (tab === 'products') loadProducts()
    if (tab === 'orders') loadOrders()
  }, [tab])

  async function loadProducts() {
    setLoading(true)
    try {
      const { data } = await api.get('/products')
      setProducts(data.products)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function loadOrders() {
    setLoading(true)
    try {
      const { data } = await api.get('/orders/all')
      setOrders(data.orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(product) {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      image: product.image || '',
    })
    setEditId(product.id)
    setTab('form')
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.price || !form.description) return toast.error('Fill all required fields')

    setSaving(true)
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) || 0 }

    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload)
        toast.success('Product updated!')
      } else {
        await api.post('/products', payload)
        toast.success('Product added!')
      }
      setForm(emptyForm)
      setEditId(null)
      setTab('products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function set(key) {
    return e => setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const tabs = [
    { key: 'products', label: '🏪 Products' },
    { key: 'orders',   label: '📦 Orders' },
    { key: 'form',     label: editId ? '✏️ Edit Product' : '➕ Add Product' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage your store</p>
        </div>
        <span className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full text-sm text-orange-700 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Admin
        </span>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-sm text-gray-400">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{products.length} 📦</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{orders.length} 🧾</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-400">Low Stock (&lt;5)</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{products.filter(p => p.stock < 5).length} ⚠️</p>
        </div>
      </div>

      {/* tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); if (t.key !== 'form') setEditId(null) }}
            className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
              ${tab === t.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* products tab */}
      {tab === 'products' && (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card animate-pulse h-64" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No products yet</p>
            <button onClick={() => setTab('form')} className="btn-orange">Add First Product</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} isAdmin onEdit={startEdit} onDelete={handleDelete} />
            ))}
          </div>
        )
      )}

      {/* orders tab */}
      {tab === 'orders' && (
        loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card animate-pulse h-16" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  {['Order ID', 'Items', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-gray-600">{order.items.length} items</td>
                    <td className="px-4 py-3 font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${order.status === 'delivered' ? 'bg-green-50 text-green-700' : order.status === 'confirmed' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* add/edit form */}
      {tab === 'form' && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              {editId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                  <input type="text" value={form.name} onChange={set('name')} className="field" placeholder="iPhone 15 Pro" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <select value={form.category} onChange={set('category')} className="field">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  className="field resize-none"
                  rows={3}
                  placeholder="Describe the product..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={set('price')} className="field" placeholder="999" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                  <input type="number" value={form.stock} onChange={set('stock')} className="field" placeholder="50" min="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <input type="url" value={form.image} onChange={set('image')} className="field" placeholder="https://images.unsplash.com/..." />
                {form.image && (
                  <img src={form.image} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-lg border border-gray-200" onError={e => e.target.style.display = 'none'} />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-orange flex-1 py-2.5">
                  {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={() => { setForm(emptyForm); setEditId(null); setTab('products') }} className="btn-outline px-6">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
