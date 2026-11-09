import { Router } from 'express'
import { register, login } from '../controllers/authController.js'
import { loginLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/register', register)
router.post('/login', loginLimiter, login)

export default router
