import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    search: '',
    category: 'all',
    sort: 'featured',
    cartOpen: false,
    authOpen: false,
    authMode: 'login',
    theme: getInitialTheme(),
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
    setSort(state, action) {
      state.sort = action.payload
    },
    openCart(state) {
      state.cartOpen = true
    },
    closeCart(state) {
      state.cartOpen = false
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    openAuth(state, action) {
      state.authMode = action.payload === 'register' ? 'register' : 'login'
      state.authOpen = true
    },
    closeAuth(state) {
      state.authOpen = false
    },
    setAuthMode(state, action) {
      state.authMode = action.payload === 'register' ? 'register' : 'login'
    },
  },
})

export const {
  setSearch,
  setCategory,
  setSort,
  openCart,
  closeCart,
  toggleTheme,
  openAuth,
  closeAuth,
  setAuthMode,
} = uiSlice.actions

export default uiSlice.reducer
