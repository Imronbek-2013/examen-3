import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ADMIN } from '../data'

const SECTIONS = [
  {
    title: 'ASOSIY',
    items: [
      { path: '/dashboard', label: 'Boshqaruv paneli', icon: 'fas fa-house' },
      { path: '/students', label: 'O‘quvchilar', icon: 'fas fa-graduation-cap' },
      { path: '/teachers', label: 'O‘qituvchilar', icon: 'fas fa-user-group' },
    ]
  },
  {
    title: 'TA\'LIM',
    items: [
      { path: '/groups', label: 'Guruhlar', icon: 'fas fa-table-cells-large' },
      { path: '/courses', label: 'Kurslar', icon: 'fas fa-book-open' },
      { path: '/attendance', label: 'Davomat', icon: 'fas fa-calendar-check' },
    ]
  },
  {
    title: 'MOLIYA',
    items: [
      { path: '/payments', label: 'To‘lovlar & Moliya', icon: 'fas fa-receipt', badge: 'Moliya' },
    ]
  },
  {
    title: 'BOSHQARUV',
    items: [
      { path: '/reports', label: 'Hisobotlar', icon: 'fas fa-chart-column' },
      { path: '/settings', label: 'Sozlamalar', icon: 'fas fa-gear' },
    ]
  }
]

export default function Layout({ onLogout, theme, onToggleTheme, children }) {
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Barcha marshrutlar
  const allItems = SECTIONS.flatMap((s) => s.items)
  const currentItem = allItems.find(
    (n) => location.pathname === n.path || (location.pathname === '/' && n.path === '/dashboard')
  )

  // Ctrl+K qidiruv klavishasi
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="layout">
      {/* SIDEBAR (Nexus Education Style) */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="nexus-logo-squircle">
            <i className="fas fa-graduation-cap" />
          </div>
          <div className="nexus-brand-text">
            <div className="brand-title">STUND LISTEN</div>
            <div className="brand-subtitle">O‘QUV MARKAZI</div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="sidebar-scrollable-nav">
          {SECTIONS.map((section) => (
            <div className="nav-section-group" key={section.title}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nexus-nav-item ${
                      isActive || (location.pathname === '/' && item.path === '/dashboard')
                        ? 'active'
                        : ''
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <i className={`nav-icon-glyph ${item.icon}`} />
                  <span className="nav-item-text">{item.label}</span>
                  {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Profile */}
        <div className="sidebar-user-footer">
          <div className="footer-profile-card">
            <div className="footer-avatar">AI</div>
            <div className="footer-user-meta">
              <div className="footer-name">{ADMIN.name}</div>
              <div className="footer-role">
                <span className="online-indicator-dot" /> {ADMIN.role}
              </div>
            </div>
            <button className="footer-logout-btn" onClick={onLogout} title="Chiqish">
              <i className="fas fa-arrow-right-from-bracket" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      {/* MAIN CONTENT AREA */}
      <div className="main">
        {/* TOPBAR (Nexus Style) */}
        <header className="nexus-topbar">
          <div className="topbar-left">
            <button className="nexus-burger" onClick={() => setOpen(!open)} aria-label="Menyu">
              <i className="fas fa-bars" />
            </button>
            <div className="breadcrumb-box">
              <span className="breadcrumb-root">Boshqaruv paneli</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">{currentItem?.label || 'Bosh sahifa'}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Global Search Button */}
            <button className="topbar-search-btn" onClick={() => setSearchOpen(true)}>
              <i className="fas fa-magnifying-glass" />
              <span>Qidirish...</span>
              <kbd>Ctrl K</kbd>
            </button>

            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                className="topbar-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Bildirishnomalar"
              >
                <i className="far fa-bell" />
                <span className="notification-badge-dot">3</span>
              </button>

              {notifOpen && (
                <div className="notification-dropdown-box">
                  <div className="notif-header">
                    <h4>Bildirishnomalar</h4>
                    <span className="badge-pill">3 ta yangi</span>
                  </div>
                  <ul className="notif-list">
                    <li>
                      <i className="fas fa-circle-check text-emerald" />
                      <div>
                        <strong>To‘lov qabul qilindi</strong>
                        <p>Ali Valiyev 750,000 so‘m to‘ladi (Payme)</p>
                      </div>
                    </li>
                    <li>
                      <i className="fas fa-user-plus text-blue" />
                      <div>
                        <strong>Yangi o‘quvchi ro‘yxatdan o‘tdi</strong>
                        <p>Shohruh Nazarov (Python Backend)</p>
                      </div>
                    </li>
                    <li>
                      <i className="fas fa-clock-rotate-left text-amber" />
                      <div>
                        <strong>Dars jadvali eslatmasi</strong>
                        <p>Frontend Guruhi F1 darsi 16:00 da boshlanadi</p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              className="topbar-icon-btn theme-toggle-btn"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
            </button>

            {/* Admin Avatar Header Pill */}
            <div className="header-admin-pill" onClick={() => navigate('/settings')}>
              <div className="header-avatar">AI</div>
              <span className="header-admin-name">{ADMIN.name}</span>
              <i className="fas fa-chevron-down" style={{ fontSize: 10, color: 'var(--muted)' }} />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="content">{children}</main>
      </div>

      {/* Quick Search Modal (Ctrl+K) */}
      {searchOpen && (
        <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="quick-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quick-search-input-wrap">
              <i className="fas fa-magnifying-glass" />
              <input
                autoFocus
                placeholder="Sahifalar, o‘quvchilar, guruhlar yoki to‘lovlar..."
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
              />
              <kbd onClick={() => setSearchOpen(false)}>ESC</kbd>
            </div>
            <div className="quick-search-results">
              <div className="quick-search-category">Tezkor sahifalar:</div>
              {allItems.map((item) => (
                <div
                  key={item.path}
                  className="quick-search-item"
                  onClick={() => {
                    navigate(item.path)
                    setSearchOpen(false)
                  }}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                  <i className="fas fa-arrow-turn-down-left" style={{ marginLeft: 'auto', fontSize: 11 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
