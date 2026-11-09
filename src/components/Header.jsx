import { Moon, Search, ShoppingCart, Store, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { openCart, setSearch, toggleTheme } from '../store/uiSlice'
import { selectCartCount } from '../store/cartSlice'
import UserMenu from './UserMenu'

export default function Header() {
  const dispatch = useDispatch()
  const search = useSelector((state) => state.ui.search)
  const theme = useSelector((state) => state.ui.theme)
  const cartCount = useSelector(selectCartCount)

  return (
    <header className="header">
      <div className="container header-inner">
        <a className="logo" href="#" aria-label="WebMarket home">
          <span className="logo-icon">
            <Store size={22} />
          </span>
          <span className="logo-text">
            Web<em>Market</em>
          </span>
        </a>

        <div className="search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search products, brands and categories…"
            aria-label="Search products"
          />
        </div>

        <UserMenu />

        <button
          type="button"
          className="theme-toggle"
          onClick={() => dispatch(toggleTheme())}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          type="button"
          className="cart-button"
          onClick={() => dispatch(openCart())}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}
