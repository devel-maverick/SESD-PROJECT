import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

// SVG icon-based categories matching the screenshot style
const CATEGORIES = [
  {
    label: 'All',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Electronics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="2" y="7" width="16" height="11" rx="2"/>
        <path d="M18 10h3a1 1 0 011 1v3a1 1 0 01-1 1h-3"/>
        <line x1="6" y1="20" x2="12" y2="20"/><line x1="9" y1="18" x2="9" y2="20"/>
      </svg>
    ),
  },
  {
    label: 'Grocery',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M6 3H3l3 9h12l1.5-6H6z"/>
        <circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>
        <path d="M3 3h1.5"/>
      </svg>
    ),
  },
  {
    label: 'Fashion',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 001 .74H6v10a1 1 0 001 1h10a1 1 0 001-1V10h2.15a1 1 0 001-.74l.58-3.57a2 2 0 00-1.35-2.23z"/>
      </svg>
    ),
  },
  {
    label: 'Shoes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M2 17l1-4 4-1 4-6h6l2 3-2 1-1-1-3 5H8l-1 3z"/>
        <path d="M8 17h12a1 1 0 010 2H6"/>
      </svg>
    ),
  },
  {
    label: 'Furniture',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/>
        <path d="M2 11a2 2 0 002 2h16a2 2 0 002-2v-1a1 1 0 00-1-1H3a1 1 0 00-1 1v1z"/>
        <line x1="6" y1="13" x2="6" y2="19"/><line x1="18" y1="13" x2="18" y2="19"/>
        <line x1="4" y1="19" x2="8" y2="19"/><line x1="16" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    label: 'Books',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category !== 'All') params.category = category
      const { data } = await api.get('/products', { params })
      setProducts(data.products)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput)
  }

  function handleCategory(cat) {
    setCategory(cat)
    setSearch('')
    setSearchInput('')
  }

  function clearFilters() {
    setSearch('')
    setSearchInput('')
    setCategory('All')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* banner */}
      <div className="bg-slate-900 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-1">Shop Everything</h1>
        <p className="text-slate-400 text-lg">Electronics, Fashion, Grocery, Furniture &amp; more — all in one place</p>
      </div>

      {/* search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="field flex-1 text-base"
        />
        <button type="submit" className="btn-orange px-6">Search</button>
        {(search || category !== 'All') && (
          <button type="button" onClick={clearFilters} className="btn-outline px-4">Clear</button>
        )}
      </form>

      {/* category icon pills — Zepto / Blinkit style */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => handleCategory(cat.label)}
            className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-w-[72px]
              ${category === cat.label
                ? 'bg-slate-900 text-white border-slate-900 shadow'
                : 'bg-white text-slate-500 border-gray-200 hover:border-slate-400 hover:text-slate-800'
              }`}
          >
            <span className={category === cat.label ? 'text-white' : 'text-slate-500'}>
              {cat.icon}
            </span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* heading */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          {search ? `Results for "${search}"` : category === 'All' ? 'All Products' : category}
        </h2>
        <span className="text-sm text-gray-400">{loading ? '...' : `${products.length} products`}</span>
      </div>

      {/* grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-9 bg-gray-200 rounded-lg mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-gray-700">No products found</p>
          <p className="text-gray-500 mt-2 mb-6">Try a different keyword or category</p>
          <button onClick={clearFilters} className="btn-orange px-6">View All Products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
