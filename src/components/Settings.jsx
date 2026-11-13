import { useState } from 'react'
import { ADMIN } from '../data'

export default function Settings({ theme, onToggleTheme, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast] = useState('')

  const [centerInfo, setCenterInfo] = useState({
    name: 'Nexus Education Markazi',
    phone: '+998 71 200 00 00',
    address: 'Toshkent sh., Amir Temur shox ko‘chasi, 107-B',
    email: 'info@nexus-education.uz',
  })

  const [adminProfile, setAdminProfile] = useState({
    name: ADMIN.name,
    phone: ADMIN.login,
    role: ADMIN.role,
  })

  const handleSave = (e) => {
    e.preventDefault()
    setToast('✅ Sozlamalar muvaffaqiyatli saqlandi!')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="page">
      {toast && <div className="floating-toast">{toast}</div>}

      <div className="finance-header-bar">
        <div className="tab-pill-group">
          <button
            className={`tab-pill ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user-gear" /> Profil
          </button>
          <button
            className={`tab-pill ${activeTab === 'center' ? 'active' : ''}`}
            onClick={() => setActiveTab('center')}
          >
            <i className="fas fa-building" /> Markaz ma’lumotlari
          </button>
          <button
            className={`tab-pill ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <i className="fas fa-palette" /> Ko‘rinish va Mavzu
          </button>
        </div>
      </div>

      {/* Profil Tab */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="card-head-flex" style={{ marginBottom: 20 }}>
            <div>
              <h3>Administrator Profili</h3>
              <p className="card-sub-desc">Shaxsiy login va administrator hisobi sozlamalari</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <label>
              F.I.Sh. (To‘liq ism)
              <input
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                required
              />
            </label>

            <label>
              Telefon raqami (Login)
              <input
                value={adminProfile.phone}
                onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                required
              />
            </label>

            <label>
              Lavozim
              <input value={adminProfile.role} disabled style={{ opacity: 0.7 }} />
            </label>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-check" /> O‘zgarishlarni saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Markaz Tab */}
      {activeTab === 'center' && (
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="card-head-flex" style={{ marginBottom: 20 }}>
            <div>
              <h3>Markaz Rekvizitlari</h3>
              <p className="card-sub-desc">O‘quv markazining rasmiy manzili va kontaktlari</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <label>
              O‘quv markazi nomi
              <input
                value={centerInfo.name}
                onChange={(e) => setCenterInfo({ ...centerInfo, name: e.target.value })}
                required
              />
            </label>

            <label>
              Aloqa telefoni
              <input
                value={centerInfo.phone}
                onChange={(e) => setCenterInfo({ ...centerInfo, phone: e.target.value })}
                required
              />
            </label>

            <label>
              Bino manzili
              <input
                value={centerInfo.address}
                onChange={(e) => setCenterInfo({ ...centerInfo, address: e.target.value })}
                required
              />
            </label>

            <label>
              Rasmiy email
              <input
                type="email"
                value={centerInfo.email}
                onChange={(e) => setCenterInfo({ ...centerInfo, email: e.target.value })}
                required
              />
            </label>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-check" /> Saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ko'rinish Tab */}
      {activeTab === 'appearance' && (
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="card-head-flex" style={{ marginBottom: 20 }}>
            <div>
              <h3>Tizim Ko‘rinishi</h3>
              <p className="card-sub-desc">Kun va tun rejimini o‘z xohishingizga ko‘ra moslang</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div
              className={`theme-selection-card ${theme === 'light' ? 'active' : ''}`}
              onClick={() => {
                if (theme !== 'light') onToggleTheme()
              }}
            >
              <i className="fas fa-sun text-amber" style={{ fontSize: 24, marginBottom: 10 }} />
              <strong>Kunduzgi rejim</strong>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
                Yorug‘, toza oq va och kulrang interfeys
              </p>
            </div>

            <div
              className={`theme-selection-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => {
                if (theme !== 'dark') onToggleTheme()
              }}
            >
              <i className="fas fa-moon text-purple" style={{ fontSize: 24, marginBottom: 10 }} />
              <strong>Tungi rejim</strong>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
                Qorong‘i, ko‘zga qulay to‘q ko‘k / slate ranglar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
