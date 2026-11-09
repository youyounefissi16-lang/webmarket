import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { listProducts } from '../api/products'
import { errorMessage } from '../api/client'
import { normalizeProduct } from '../lib/normalizeProduct'
import { products as sampleProducts } from '../data/products'

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listProducts()
      return { items: (data ?? []).map(normalizeProduct), usingFallback: false }
    } catch (err) {
      // Keep the storefront usable when the API is unreachable.
      return rejectWithValue({
        message: errorMessage(err),
        items: sampleProducts.map(normalizeProduct),
      })
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    usingFallback: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.usingFallback = false
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.items = action.payload?.items ?? []
        state.usingFallback = true
        state.error = action.payload?.message ?? 'Failed to load products'
      })
  },
})

export default productsSlice.reducer
