import { createSlice, createSelector } from '@reduxjs/toolkit'
import { getProduct } from '../data/products'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {} },
  reducers: {
    addItem(state, action) {
      const id = action.payload
      state.items[id] = Math.min(10, (state.items[id] || 0) + 1)
    },
    removeItem(state, action) {
      delete state.items[action.payload]
    },
    setQty(state, action) {
      const { id, qty } = action.payload
      if (qty <= 0) delete state.items[id]
      else state.items[id] = qty
    },
    clearCart(state) {
      state.items = {}
    },
  },
})

export const { addItem, removeItem, setQty, clearCart } = cartSlice.actions

const selectItemsMap = (state) => state.cart.items

export const selectCartCount = createSelector([selectItemsMap], (items) =>
  Object.values(items).reduce((sum, qty) => sum + qty, 0)
)

export const selectCartItems = createSelector([selectItemsMap], (items) =>
  Object.entries(items)
    .map(([id, qty]) => ({ product: getProduct(id), qty }))
    .filter((item) => item.product)
)

export const selectSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
)

export default cartSlice.reducer
