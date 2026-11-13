import { useNavigate } from 'react-router-dom'
import { formatMoney, ADMIN } from '../data'
import { SkeletonCard, useLoading } from './Skeleton'

export default function Dashboard({ students = [], teachers = [], groups = [], payments = [] }) {
  const loading = useLoading(700)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="page dashboard-page">
        <SkeletonCard lines={3} />
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 20 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
      </div>
    )
  }

  // Hisob-kitoblar
  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalDebt = students.reduce((sum, s) => sum + (Number(s.debt) || 0), 0)
  const avgAttendance = 94.2

  // 8 ta KPI ko'rsatkichlar (Nexus Education Style)
  const kpiStats = [
    {
      label: 'Jami o‘quvchilar',
      value: students.length ? students.length + 33 : 48,
      change: '+12%',
      positive: true,
      icon: 'fas fa-graduation-cap',
      iconBg: 'rgba(99, 102, 241, 0.12)',
      iconColor: '#6366f1',
    },
    {
      label: 'Faol guruhlar',
      value: groups.length || 12,
      change: '+2 yangi',
      positive: true,
      icon: 'fas fa-table-cells-large',
      iconBg: 'rgba(59, 130, 246, 0.12)',
      iconColor: '#3b82f6',
    },
    {
      label: 'O‘qituvchilar',
      value: teachers.length || 8,
      change: 'Faol ustozlar',
      positive: true,
      icon: 'fas fa-user-group',
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconColor: '#a855f7',
    },
    {
      label: 'Oylik tushum',
      value: formatMoney(totalRevenue || 56400000),
      change: '+8.5%',
      positive: true,
      icon: 'fas fa-sack-dollar',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#10b981',
      isCurrency: true,
    },
    {
      label: 'Yangi o‘quvchilar',
      value: 18,
      change: '+4 bu hafta',
      positive: true,
      icon: 'fas fa-user-plus',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      iconColor: '#06b6d4',
    },
    {
      label: 'O‘rtacha davomat',
      value: `${avgAttendance}%`,
      change: '+1.4% yuqori',
      positive: true,
      icon: 'fas fa-chart-line',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconColor: '#f59e0b',
    },
    {
      label: 'Qarzdorlik miqdori',
      value: formatMoney(totalDebt || 12800000),
      change: `${students.filter((s) => s.debt > 0).length || 6} ta hisob`,
      positive: false,
      icon: 'fas fa-hand-holding-dollar',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#ef4444',
      isCurrency: true,
    },
    {
      label: 'Kurslar soni',
      value: 8,
      change: '8 ta yo‘nalish',
      positive: true,
      icon: 'fas fa-book-open',
      iconBg: 'rgba(236, 72, 153, 0.12)',
      iconColor: '#ec4899',
    },
  ]

  // Oylik daromad dinamikasi ma'lumotlari
  const monthlyData = [
    { month: 'Iyun', revenue: 32.4, height: 45 },
    { month: 'Iyul', revenue: 38.0, height: 55 },
    { month: 'Avgust', revenue: 42.5, height: 65 },
    { month: 'Sentabr', revenue: 48.2, height: 75 },
    { month: 'Oktabr', revenue: 51.6, height: 82 },
    { month: 'Noyabr', revenue: 56.4, height: 95 },
  ]

  return (
    <div className="page dashboard-page">
      {/* 1. WELCOME BANNER (Nexus Education Style) */}
      <div className="nexus-welcome-banner">
        <div className="welcome-banner-content">
          <div className="welcome-tag">
            <span className="online-indicator-dot" /> Boshqaruv Markazi
          </div>
          <h1>Xush kelibsiz, {ADMIN.name}! 👋</h1>
          <p>
            Bugungi dars jadvali, talabalar davomati va markazning moliyaviy oylik ko‘rsatkichlari bilan tanishing.
          </p>
          <div className="welcome-actions">
            <button className="btn btn-primary" onClick={() => navigate('/groups')}>
              <i className="fas fa-calendar-days" /> Dars jadvali
            </button>
            <button className="btn btn-outline-white" onClick={() => navigate('/reports')}>
              <i className="fas fa-file-arrow-down" /> Hisobot yuklash
            </button>
          </div>
        </div>
        <div className="welcome-banner-illustration">
          <div className="illustration-squircle">
            <i className="fas fa-chart-pie" />
          </div>
        </div>
      </div>

      {/* 2. 8 TA KPI STATISTIKA KARTALARI (2x4 Grid) */}
      <div className="kpi-stats-grid">
        {kpiStats.map((kpi, idx) => (
          <div className="nexus-kpi-card" key={idx}>
            <div className="kpi-top-row">
              <span className="kpi-label">{kpi.label}</span>
              <div
                className="kpi-icon-container"
                style={{ background: kpi.iconBg, color: kpi.iconColor }}
              >
                <i className={kpi.icon} />
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-bottom-row">
              <span
                className={`kpi-change-pill ${kpi.positive ? 'positive' : 'negative'}`}
              >
                <i
                  className={kpi.positive ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'}
                />{' '}
                {kpi.change}
              </span>
              <span className="kpi-sub-text">o‘tgan oydan</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. VIZUAL GRAFIKLAR BLOKI (2 Ustun) */}
      <div className="stats-grid cols-2" style={{ marginTop: 24 }}>
        {/* Oylik tushum dinamikasi */}
        <div className="card nexus-chart-card">
          <div className="card-head-flex">
            <div>
              <h3>Oylik tushum dinamikasi</h3>
              <p className="card-sub-desc">So‘nggi 6 oylik jami to‘lovlar oqimi (mln so‘m)</p>
            </div>
            <div className="chart-legend-badge">
              <span className="legend-dot" style={{ background: 'var(--accent)' }} /> Tushum
            </div>
          </div>

          <div className="bar-chart-visual-wrapper">
            <div className="chart-bars-container">
              {monthlyData.map((d) => (
                <div className="chart-bar-column" key={d.month}>
                  <div className="bar-tooltip">{d.revenue} mln</div>
                  <div className="bar-pillar-wrap">
                    <div
                      className="bar-pillar-fill"
                      style={{ height: `${d.height}%` }}
                    />
                  </div>
                  <span className="bar-x-axis-label">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* To'lov holati taqsimoti (Donut visual) */}
        <div className="card nexus-chart-card">
          <div className="card-head-flex">
            <div>
              <h3>To‘lov holati taqsimoti</h3>
              <p className="card-sub-desc">O‘quvchilarning oylik kurs to‘lovlari ulushi</p>
            </div>
            <span className="badge-pill">Joriy oy</span>
          </div>

          <div className="payment-ratio-box">
            <div className="donut-visual-container">
              <div className="donut-circle">
                <div className="donut-inner-content">
                  <span className="donut-inner-val">78%</span>
                  <span className="donut-inner-lbl">To‘langan</span>
                </div>
              </div>
            </div>

            <div className="ratio-legend-list">
              <div className="ratio-legend-item">
                <span className="status-dot-emerald" />
                <div className="ratio-item-meta">
                  <span className="ratio-title">To‘liq to‘langan</span>
                  <span className="ratio-val text-emerald">78% (38 o‘quvchi)</span>
                </div>
              </div>
              <div className="ratio-legend-item">
                <span className="status-dot-amber" />
                <div className="ratio-item-meta">
                  <span className="ratio-title">Qisman to‘langan</span>
                  <span className="ratio-val text-amber">14% (6 o‘quvchi)</span>
                </div>
              </div>
              <div className="ratio-legend-item">
                <span className="status-dot-red" />
                <div className="ratio-item-meta">
                  <span className="ratio-title">Qarzdorlik mavjud</span>
                  <span className="ratio-val text-danger">8% (4 o‘quvchi)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TEZKOR AMALLAR (Quick Action Tiles) */}
      <div className="quick-actions-bar" style={{ marginTop: 24 }}>
        <div className="quick-tile" onClick={() => navigate('/students')}>
          <div className="quick-tile-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <i className="fas fa-user-plus" />
          </div>
          <div>
            <strong>Yangi o‘quvchi qo‘shish</strong>
            <p>Ro‘yxatdan o‘tkazish va guruhga biriktirish</p>
          </div>
          <i className="fas fa-chevron-right quick-tile-arrow" />
        </div>

        <div className="quick-tile" onClick={() => navigate('/payments')}>
          <div className="quick-tile-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <i className="fas fa-credit-card" />
          </div>
          <div>
            <strong>To‘lov qabul qilish</strong>
            <p>Kvitansiya yaratish va hisobni to‘ldirish</p>
          </div>
          <i className="fas fa-chevron-right quick-tile-arrow" />
        </div>

        <div className="quick-tile" onClick={() => navigate('/groups')}>
          <div className="quick-tile-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <i className="fas fa-calendar-check" />
          </div>
          <div>
            <strong>Dars jadvalini ko‘rish</strong>
            <p>Haftalik xonalar va dars vaqtlari</p>
          </div>
          <i className="fas fa-chevron-right quick-tile-arrow" />
        </div>

        <div className="quick-tile" onClick={() => navigate('/attendance')}>
          <div className="quick-tile-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
            <i className="fas fa-clipboard-user" />
          </div>
          <div>
            <strong>Davomatni belgilash</strong>
            <p>Bugungi guruhlar qatnashuvi</p>
          </div>
          <i className="fas fa-chevron-right quick-tile-arrow" />
        </div>
      </div>

      {/* 5. SO'NGGI TRANZAKSIYALAR VA SO'NGGI TALABALAR */}
      <div className="stats-grid cols-2" style={{ marginTop: 24 }}>
        {/* So'nggi to'lovlar */}
        <div className="card">
          <div className="card-head-flex">
            <h3>So‘nggi to‘lovlar</h3>
            <button className="link" onClick={() => navigate('/payments')}>
              Hammasi ({payments.length}) <i className="fas fa-arrow-right" />
            </button>
          </div>

          <ul className="nexus-trans-list">
            {payments.slice(0, 5).map((p) => (
              <li key={p.id}>
                <div
                  className="trans-method-icon"
                  style={{
                    background:
                      p.method === 'Payme'
                        ? 'rgba(2, 132, 199, 0.12)'
                        : p.method === 'Click'
                        ? 'rgba(22, 163, 74, 0.12)'
                        : 'rgba(245, 158, 11, 0.12)',
                    color:
                      p.method === 'Payme'
                        ? '#0284c7'
                        : p.method === 'Click'
                        ? '#16a34a'
                        : '#d97706',
                  }}
                >
                  <i
                    className={
                      p.method === 'Payme'
                        ? 'fas fa-mobile-screen'
                        : p.method === 'Click'
                        ? 'fas fa-bolt'
                        : 'fas fa-money-bill-wave'
                    }
                  />
                </div>
                <div className="trans-meta">
                  <div className="trans-name">{p.studentName}</div>
                  <div className="trans-sub">
                    {p.groupName} • {p.date}
                  </div>
                </div>
                <div className="trans-amount text-emerald">+{formatMoney(p.amount)}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Yangi o'quvchilar ro'yxati */}
        <div className="card">
          <div className="card-head-flex">
            <h3>Yangi qo‘shilgan o‘quvchilar</h3>
            <button className="link" onClick={() => navigate('/students')}>
              Hammasi ({students.length}) <i className="fas fa-arrow-right" />
            </button>
          </div>

          <ul className="nexus-students-list">
            {students.slice(0, 5).map((s) => (
              <li key={s.id}>
                <div className="nexus-avatar-pill">
                  {s.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </div>
                <div className="student-list-meta">
                  <div className="student-name">{s.name}</div>
                  <div className="student-sub">{s.group || s.subject}</div>
                </div>
                <span
                  className={`status-pill ${
                    s.paymentStatus === 'paid' ? 'paid' : 'debt'
                  }`}
                >
                  {s.paymentStatus === 'paid' ? 'To‘langan' : `Qarz: ${formatMoney(s.debt)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
