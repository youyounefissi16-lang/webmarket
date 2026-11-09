import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'] },
    description: { type: String, default: '' },
    price: { type: Number, required: [true, 'Product price is required'], min: [0, 'Price cannot be negative'] },
    category: { type: String, required: [true, 'Product category is required'] },
    imageUrl: { type: String, default: '' },
    stock: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
