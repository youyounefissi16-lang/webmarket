import { useEffect, useMemo } from 'react'
import { PackageSearch } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryBar from './components/CategoryBar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { CATEGORIES, products } from './data/products'
import { setCategory, setSearch } from './store/uiSlice'

export default function App() {
  const dispatch = useDispatch()
  const search = useSelector((state) => state.ui.search)
  const category = useSelector((state) => state.ui.category)
  const sort = useSelector((state) => state.ui.sort)
  const theme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = products.filter((p) => {
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
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [search, category, sort])

  return (
    <div className="app">
      <Header />

      <Hero />

      <main className="container main" id="products">
        <CategoryBar />

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
            <p className="muted">
              Try a different search term or category.
            </p>
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
      </main>

      <Footer />

      <CartDrawer />
    </div>
  )
}
