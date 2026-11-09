import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginRequest, register as registerRequest } from '../api/auth'
import { errorMessage } from '../api/client'

const STORAGE_KEY = 'webmarket.auth'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const saved = loadSaved()

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await loginRequest(credentials)
  } catch (err) {
    return rejectWithValue(errorMessage(err))
  }
})

// The register endpoint does not return a token, so sign in right after.
export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    await registerRequest(payload)
    return await loginRequest({ email: payload.email, password: payload.password })
  } catch (err) {
    return rejectWithValue(errorMessage(err))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved?.user ?? null,
    token: saved?.token ?? null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading'
      state.error = null
    }
    const fulfilled = (state, action) => {
      state.status = 'succeeded'
      state.token = action.payload.token
      state.user = action.payload.user ?? null
      state.error = null
    }
    const rejected = (state, action) => {
      state.status = 'failed'
      state.error = action.payload || 'Authentication failed'
    }

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const selectAuth = (state) => state.auth
export default authSlice.reducer
