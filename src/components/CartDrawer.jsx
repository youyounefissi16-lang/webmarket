import { useState } from 'react'
import { CheckCircle, Minus, Plus, ShoppingCart, Trash2, Truck, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { formatPrice, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from '../data/products'
import {
  clearCart,
  removeItem,
  selectCartItems,
  selectSubtotal,
  setQty,
} from '../store/cartSlice'
import { closeCart } from '../store/uiSlice'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.cartOpen)
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectSubtotal)
  const [placed, setPlaced] = useState(false)

  if (!open) return null

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
  const total = subtotal + shipping
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  const handleCheckout = () => {
    setPlaced(true)
    dispatch(clearCart())
  }

  const close = () => {
    setPlaced(false)
    dispatch(closeCart())
  }

  return (
    <div className="drawer-overlay" onClick={close}>
      <aside
        className="drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="drawer-header">
          <h2>
            <ShoppingCart size={20} /> Your Cart
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {placed ? (
          <div className="drawer-success">
            <CheckCircle size={56} className="success-icon" />
            <h3>Order placed!</h3>
            <p className="muted">Thanks for shopping with WebMarket. A confirmation was sent to your email.</p>
            <button type="button" className="btn-primary" onClick={close}>
              Continue shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="drawer-empty">
            <ShoppingCart size={48} />
            <h3>Your cart is empty</h3>
            <p className="muted">Looks like you haven't added anything yet.</p>
            <button type="button" className="btn-primary" onClick={close}>
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="drawer-item">
                  <span
                    className="drawer-thumb"
                    style={{
                      background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`,
                    }}
                  >
                    {product.emoji}
                  </span>
                  <div className="drawer-item-info">
                    <strong>{product.name}</strong>
                    <span className="muted">{formatPrice(product.price)} each</span>
                    <div className="qty">
                      <button
                        type="button"
                        onClick={() => dispatch(setQty({ id: product.id, qty: qty - 1 }))}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(setQty({ id: product.id, qty: qty + 1 }))}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="drawer-item-right">
                    <strong>{formatPrice(product.price * qty)}</strong>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => dispatch(removeItem(product.id))}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              {subtotal > 0 && (
                <div className="ship-progress">
                  <p>
                    <Truck size={14} /> {remaining > 0 ? (
                      <>Add <strong>{formatPrice(remaining)}</strong> more for free shipping</>
                    ) : (
                      <><strong>You've unlocked free shipping!</strong> 🎉</>
                    )}
                  </p>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="totals">
                <div>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button type="button" className="btn-primary btn-block" onClick={handleCheckout}>
                Checkout · {formatPrice(total)}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
