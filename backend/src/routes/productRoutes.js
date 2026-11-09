import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public reads
router.get('/', getProducts)
router.get('/:id', getProductById)

// Protected writes — a valid JWT is required
router.post('/', requireAuth, createProduct)
router.put('/:id', requireAuth, updateProduct)
router.delete('/:id', requireAuth, deleteProduct)

export default router
