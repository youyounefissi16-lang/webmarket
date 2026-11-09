import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {}

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    // Never store a plain-text password: hash it first.
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      passwordHash,
    })

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {}

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: String(email).toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.status(200).json({ token: signToken(user._id) })
  } catch (err) {
    next(err)
  }
}
