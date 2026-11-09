import { useEffect, useRef, useState } from 'react'
import { LogOut, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { openAuth } from '../store/uiSlice'

export default function UserMenu() {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [menuOpen])

  if (!token) {
    return (
      <button
        type="button"
        className="signin-btn"
        onClick={() => dispatch(openAuth('login'))}
        aria-label="Sign in"
      >
        <User size={18} />
        <span>Sign in</span>
      </button>
    )
  }

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="user-menu" ref={wrapRef}>
      <button
        type="button"
        className="user-btn"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user?.name || user?.email || 'user'}`}
      >
        <span className="user-avatar">{initial}</span>
      </button>

      {menuOpen && (
        <div className="user-popover" role="menu">
          <div className="user-popover-head">
            <strong>{user?.name || 'Signed in'}</strong>
            {user?.email && <span className="muted">{user.email}</span>}
          </div>
          <button
            type="button"
            role="menuitem"
            className="user-popover-item"
            onClick={() => {
              setMenuOpen(false)
              dispatch(logout())
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
