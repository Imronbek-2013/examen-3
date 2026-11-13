import { useState } from 'react'
import { ADMIN } from '../data'

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // Ham yangi demo (+998901234567 / Admin@2026), ham avvalgi admin loginini qabul qiladi
    const cleanPhone = phone.replace(/\s+/g, '')
    if (
      (cleanPhone === ADMIN.login && password === ADMIN.password) ||
      (phone === ADMIN.altLogin && password === ADMIN.altPassword) ||
      (cleanPhone === '+998901234567' && password === 'Admin@2026')
    ) {
      setError(false)
      onLogin()
    } else {
      setError(true)
    }
  }

  // Nexus uslubidagi "To'ldirish" tugmasi
  const fillDemo = () => {
    setPhone('+998901234567')
    setPassword('Admin@2026')
    setError(false)
  }

  return (
    <div className="login-page nexus-login-surface">
      <div className="login-card nexus-login-card">
        {/* Brand Header */}
        <div className="nexus-brand-header" style={{ marginBottom: 20 }}>
          <div className="nexus-logo-squircle" style={{ margin: '0 auto 12px', width: 56, height: 56, fontSize: 24 }}>
            <i className="fas fa-graduation-cap" />
          </div>
          <div className="brand-title login-brand-title" style={{ fontSize: 22, color: '#fff' }}>
            STUND LISTEN
          </div>
          <div className="brand-subtitle" style={{ letterSpacing: 1.4, fontSize: 10 }}>O‘QUV MARKAZI</div>
        </div>

        {/* Kicker Tag */}
        <div className="login-kicker-tag">ADMINISTRATOR KIRISHI</div>
        <h1 className="login-welcome-title">Xush kelibsiz 👋</h1>
        <p className="login-sub">
          Platformaga kirish uchun administrator hisobingiz ma’lumotlarini kiriting.
        </p>

        {/* Demo hisob kartasi (Nexus Style) */}
        <div className="nexus-demo-callout">
          <div className="demo-callout-text">
            <span className="demo-badge">Demo hisob</span>
            <div className="demo-creds">
              <span>Tel: +998901234567</span>
              <span>Parol: Admin@2026</span>
            </div>
          </div>
          <button type="button" className="demo-fill-btn" onClick={fillDemo}>
            To‘ldirish
          </button>
        </div>

        {error && (
          <div className="login-error">
            <i className="fas fa-circle-exclamation" /> Telefon raqam yoki parol noto‘g‘ri!
          </div>
        )}

        <form onSubmit={submit} style={{ marginTop: 18 }}>
          <label>
            Telefon raqam
            <div className="input-icon-wrap">
              <i className="fas fa-phone input-prefix-icon" />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998901234567"
                autoComplete="username"
              />
            </div>
          </label>

          <label>
            Parol
            <div className="input-icon-wrap">
              <i className="fas fa-lock input-prefix-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'} />
              </button>
            </div>
          </label>

          <button type="submit" className="btn btn-primary btn-block nexus-login-btn">
            <span>Tizimga kirish</span>
            <i className="fas fa-arrow-right" />
          </button>
        </form>
      </div>
    </div>
  )
}
