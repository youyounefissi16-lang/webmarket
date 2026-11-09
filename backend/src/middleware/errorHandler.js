// Central error handler. Keeps the API error format consistent:
// every error response is JSON of the shape { "message": "..." }.
export function notFound(req, res) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, _next) {
  // Mongoose validation errors — invalid input (e.g. missing required fields)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
    return res.status(400).json({ message })
  }

  // Mongoose CastError — e.g. a malformed ObjectId in the URL
  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Resource not found' })
  }

  // MongoDB duplicate key — e.g. registering an existing email
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Resource already exists' })
  }

  console.error(err)
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal Server Error' })
}
