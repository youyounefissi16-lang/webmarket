import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import productsReducer from './productsSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,
  },
})

// Persist the session so a page reload keeps the user signed in.
store.subscribe(() => {
  const { user, token } = store.getState().auth
  try {
    if (token) {
      localStorage.setItem('webmarket.auth', JSON.stringify({ user, token }))
    } else {
      localStorage.removeItem('webmarket.auth')
    }
  } catch {
    // Storage can be unavailable (private mode) — ignore.
  }
})
