import { useEffect, useMemo, useRef } from 'react'
import { PackageSearch, RefreshCw, ServerCrash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryBar from './components/CategoryBar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import Footer from './components/Footer'
import { CATEGORIES } from './data/products'
import { setCategory, setSearch } from './store/uiSlice'
import { fetchProducts } from './store/productsSlice'

export default function App() {
  const dispatch = useDispatch()
  const search = useSelector((state) => state.ui.search)
  const category = useSelector((state) => state.ui.category)
  const sort = useSelector((state) => state.ui.sort)
  const theme = useSelector((state) => state.ui.theme)
  const { items, status, error, usingFallback } = useSelector((state) => state.products)
  const authOpen = useSelector((state) => state.ui.authOpen)
  const authMode = useSelector((state) => state.ui.authMode)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const fetchedOnce = useRef(false)

  useEffect(() => {
    // StrictMode runs effects twice in development; only fetch once.
    if (fetchedOnce.current) return
    fetchedOnce.current = true
    dispatch(fetchProducts())
  }, [dispatch])

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = items.filter((p) => {
      const inCategory = category === 'all' || p.category === category
      const inSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return inCategory && inSearch
    })

    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'rating') sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    return sorted
  }, [items, search, category, sort])

  const loading = status === 'loading' && items.length === 0

  return (
    <div className="app">
      <Header />

      <Hero />

      <main className="container main" id="products">
        <CategoryBar />

        {usingFallback && (
          <div className="api-banner" role="status">
            <ServerCrash size={18} />
            <span>
              <strong>Showing sample data.</strong> {error}
            </span>
            <button
              type="button"
              className="banner-retry"
              onClick={() => dispatch(fetchProducts())}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="card skeleton-card" key={i} aria-hidden="true">
                <div className="skeleton-media" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line medium" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {visibleProducts.length > 0 && (
              <div className="grid-heading">
                <h2>
                  {category === 'all'
                    ? 'All products'
                    : CATEGORIES.find((c) => c.id === category)?.label}
                </h2>
                <span className="count">
                  {visibleProducts.length} item{visibleProducts.length === 1 ? '' : 's'}
                </span>
              </div>
            )}

            {visibleProducts.length > 0 ? (
              <div className="grid">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <PackageSearch size={56} />
                <h2>No products found</h2>
                <p className="muted">Try a different search term or category.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    dispatch(setSearch(''))
                    dispatch(setCategory('all'))
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <CartDrawer />
      <AuthModal key={authOpen ? authMode : 'closed'} />
    </div>
  )
}
