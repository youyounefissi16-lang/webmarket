import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

// Allow the React dev server origin so the frontend can call this API.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
)
app.use(express.json())
app.use('/api', apiLimiter)

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
