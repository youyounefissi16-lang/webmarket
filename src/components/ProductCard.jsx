import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { formatPrice } from '../data/products'
import { addItem } from '../store/cartSlice'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const [wished, setWished] = useState(false)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <article className="card">
      <div
        className="card-media"
        style={{
          background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`,
        }}
      >
        {product.badge && (
          <span className={`badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
            {product.badge}
          </span>
        )}
        <button
          type="button"
          className={`wishlist ${wished ? 'active' : ''}`}
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
        </button>
        <span className="card-emoji" aria-hidden="true">
          {product.emoji}
        </span>
      </div>

      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-tagline">{product.tagline}</p>
        <div className="card-rating">
          <Star size={14} fill="currentColor" />
          <strong>{product.rating.toFixed(1)}</strong>
          <span className="muted">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="card-footer">
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice && <s>{formatPrice(product.originalPrice)}</s>}
            {discount > 0 && <span className="save-chip">−{discount}%</span>}
          </div>
          <button
            type="button"
            className="add-btn"
            onClick={() => dispatch(addItem(product.id))}
          >
            <ShoppingCart size={15} /> Add
          </button>
        </div>
      </div>
    </article>
  )
}
