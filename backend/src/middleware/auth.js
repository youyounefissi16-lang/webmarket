import jwt from 'jsonwebtoken'

// Verifies the JWT sent as `Authorization: Bearer <token>`.
// Returns 401 when the token is missing, malformed, or invalid.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: missing or invalid token' })
  }

  const token = header.slice('Bearer '.length)
  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET is not set' })
  }

  try {
    const decoded = jwt.verify(token, secret)
    req.user = { id: decoded.id }
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized: invalid or expired token' })
  }
}
