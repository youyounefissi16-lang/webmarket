const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h4>WebMarket</h4>
          <p>The marketplace for everything you love. Shop curated tech, fashion, home and more.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="#products">Electronics</a></li>
            <li><a href="#products">Fashion</a></li>
            <li><a href="#products">Home & Living</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {YEAR} WebMarket. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
