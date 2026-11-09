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
  },
})

export const {
  setSearch,
  setCategory,
  setSort,
  openCart,
  closeCart,
  toggleTheme,
} = uiSlice.actions

export default uiSlice.reducer
