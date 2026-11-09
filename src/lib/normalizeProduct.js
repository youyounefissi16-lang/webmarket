// Maps a backend product document to the shape the storefront components use.
// The API only stores name/description/price/category/imageUrl/stock, so visual
// extras (emoji, gradient) are derived from the category.

const CATEGORY_META = {
  electronics: { emoji: '🎧', gradient: ['#e0e7ff', '#ede9fe'] },
  fashion: { emoji: '👕', gradient: ['#e2e8f0', '#f1f5f9'] },
  home: { emoji: '🏠', gradient: ['#fef9c3', '#fefce8'] },
  sports: { emoji: '⚽', gradient: ['#dcfce7', '#f0fdf4'] },
  beauty: { emoji: '💄', gradient: ['#fae8ff', '#f5d0fe'] },
  books: { emoji: '📚', gradient: ['#ede9fe', '#f5f3ff'] },
}

const DEFAULT_META = { emoji: '📦', gradient: ['#e7e5e4', '#f5f5f4'] }

export function normalizeProduct(p) {
  const meta = CATEGORY_META[p.category] ?? DEFAULT_META
  const outOfStock = p.stock === 0

  return {
    id: p.id ?? p._id,
    name: p.name,
    tagline: p.tagline ?? p.description ?? '',
    description: p.description ?? p.tagline ?? '',
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating ?? null,
    reviews: p.reviews ?? null,
    emoji: p.emoji ?? meta.emoji,
    gradient: p.gradient ?? meta.gradient,
    category: p.category,
    imageUrl: p.imageUrl ?? '',
    stock: p.stock,
    badge: p.badge ?? (outOfStock ? 'Out of Stock' : undefined),
  }
}
