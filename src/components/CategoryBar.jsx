import { useDispatch, useSelector } from 'react-redux'
import { CATEGORIES } from '../data/products'
import { setCategory, setSort } from '../store/uiSlice'

export default function CategoryBar() {
  const dispatch = useDispatch()
  const category = useSelector((state) => state.ui.category)
  const sort = useSelector((state) => state.ui.sort)

  return (
    <div className="category-bar">
      <div className="pills" role="tablist" aria-label="Product categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={category === c.id}
            className={`pill ${category === c.id ? 'active' : ''}`}
            onClick={() => dispatch(setCategory(c.id))}
          >
            <span aria-hidden="true">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <label className="sort">
        Sort by
        <select
          value={sort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </label>
    </div>
  )
}
