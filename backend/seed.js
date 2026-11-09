// Seeds the database with sample products so the API can be tested immediately.
// Usage: npm run seed
import 'dotenv/config'
import Product from './src/models/Product.js'
import { connectDB } from './src/config/db.js'
import mongoose from 'mongoose'

const sampleProducts = [
  { name: 'Aurora Wireless Headphones', description: 'Active noise cancelling over-ear', price: 129.99, category: 'electronics', imageUrl: '', stock: 25 },
  { name: 'Pulse Smart Watch', description: 'Heart-rate, GPS and sleep tracking', price: 199.0, category: 'electronics', imageUrl: '', stock: 18 },
  { name: 'Vista 4K Action Camera', description: 'Waterproof 4K60 action capture', price: 249.99, category: 'electronics', imageUrl: '', stock: 12 },
  { name: 'BoomBox Mini Speaker', description: '360° portable speaker', price: 79.99, category: 'electronics', imageUrl: '', stock: 40 },
  { name: 'Strider Running Shoes', description: 'Lightweight knit upper', price: 89.95, category: 'sports', imageUrl: '', stock: 60 },
  { name: 'FlexFlow Yoga Mat', description: '6mm non-slip cushioning', price: 34.99, category: 'sports', imageUrl: '', stock: 75 },
  { name: 'Titan Adjustable Dumbbells', description: '2×5–52.5 kg quick-adjust', price: 149.99, category: 'sports', imageUrl: '', stock: 9 },
  { name: 'Urban Explorer Backpack', description: '25L water-resistant pack', price: 59.99, category: 'fashion', imageUrl: '', stock: 32 },
  { name: 'Retro Round Sunglasses', description: 'UV400 polarized lenses', price: 24.99, category: 'fashion', imageUrl: '', stock: 85 },
  { name: 'Lumen Desk Lamp', description: 'Dimmable LED, warm-to-cool', price: 42.99, category: 'home', imageUrl: '', stock: 48 },
  { name: 'Ember Ceramic Mug Set', description: 'Set of 4 hand-glazed mugs', price: 29.99, category: 'home', imageUrl: '', stock: 64 },
  { name: 'CloudSoft Throw Blanket', description: 'Chunky 50" fleece blanket', price: 39.99, category: 'home', imageUrl: '', stock: 37 },
  { name: 'GlowSkin Serum', description: 'Vitamin C + hyaluronic acid', price: 34.99, category: 'beauty', imageUrl: '', stock: 53 },
  { name: 'Bloom Eau de Parfum', description: '30ml floral signature scent', price: 68.0, category: 'beauty', imageUrl: '', stock: 21 },
  { name: 'The Silent Grove', description: 'Bestselling mystery novel', price: 14.99, category: 'books', imageUrl: '', stock: 110 },
  { name: 'Salt & Smoke Cookbook', description: '240 recipes from the grill', price: 27.99, category: 'books', imageUrl: '', stock: 28 },
]

await connectDB()
await Product.deleteMany({})
const inserted = await Product.insertMany(sampleProducts)
console.log(`Seeded ${inserted.length} products`)
await mongoose.disconnect()
process.exit(0)
