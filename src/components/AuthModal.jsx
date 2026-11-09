import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, loginUser, registerUser } from '../store/authSlice'
import { closeAuth, setAuthMode } from '../store/uiSlice'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthModal() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.authOpen)
  const mode = useSelector((state) => state.ui.authMode)
  const { status, error } = useSelector((state) => state.auth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const emailRef = useRef(null)

  const loading = status === 'loading'
  const isRegister = mode === 'register'

  // Clear server errors and focus the first field when the dialog (re)mounts.
  // App remounts this component via a key, so local form state starts fresh.
  useEffect(() => {
    if (!open) return
    dispatch(clearAuthError())
    const t = setTimeout(() => emailRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open, dispatch])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') dispatch(closeAuth())
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, dispatch])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (isRegister && !name.trim()) {
      setFormError('Please enter your name.')
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    const action = isRegister
      ? registerUser({ name: name.trim(), email: email.trim(), password })
      : loginUser({ email: email.trim(), password })

    const result = await dispatch(action)
    const fulfilled = isRegister
      ? registerUser.fulfilled.match(result)
      : loginUser.fulfilled.match(result)

    if (fulfilled) {
      setName('')
      setEmail('')
      setPassword('')
      dispatch(closeAuth())
    }
  }

  return (
    <div
      className="auth-overlay"
      onClick={() => {
        if (!loading) dispatch(closeAuth())
      }}
    >
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={isRegister ? 'Create an account' : 'Sign in'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-head">
          <div>
            <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
            <p className="muted">
              {isRegister
                ? 'Register to start shopping with WebMarket.'
                : 'Sign in to your WebMarket account.'}
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(closeAuth())}
            aria-label="Close"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => dispatch(setAuthMode('login'))}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => dispatch(setAuthMode('register'))}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={submit} noValidate>
          {isRegister && (
            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
              />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              disabled={loading}
            />
          </label>

          {(formError || error) && (
            <p className="auth-error" role="alert">
              {formError || error}
            </p>
          )}

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading
              ? isRegister
                ? 'Creating account…'
                : 'Signing in…'
              : isRegister
                ? 'Create account'
                : 'Sign in'}
          </button>

          <p className="auth-switch muted">
            {isRegister ? 'Already have an account?' : 'New to WebMarket?'}{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => dispatch(setAuthMode(isRegister ? 'login' : 'register'))}
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
