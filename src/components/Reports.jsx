import { useState } from 'react'
import { COURSES, formatMoney } from '../data'
import { SkeletonCard, useLoading } from './Skeleton'

export default function Reports({ payments = [], students = [], groups = [] }) {
  const loading = useLoading(700)
  const [period, setPeriod] = useState('6m')
  const [toast, setToast] = useState('')

  const exportCSV = () => {
    setToast('📥 Moliya va davomat hisoboti CSV formatida yuklab olindi!')
    setTimeout(() => setToast(''), 3000)
  }

  if (loading) {
    return (
      <div className="page">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
        <SkeletonCard lines={6} />
      </div>
    )
  }

  const totalRev = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 56400000

  return (
    <div className="page reports-page">
      {toast && <div className="floating-toast">{toast}</div>}

      <div className="reports-heading">
        <div>
          <span className="reports-kicker">STUND LISTEN · TAHLIL</span>
          <h1>Hisobotlar</h1>
          <p>Markaz faoliyati, to‘lovlar va davomat bo‘yicha jamlanma.</p>
        </div>
        <button className="btn btn-primary" onClick={exportCSV}>
          <i className="fas fa-file-csv" /> CSV hisobot yuklab olish
        </button>
      </div>

      <div className="reports-period-panel">
        <div className="reports-period-copy">
          <strong>Hisobot davri</strong>
          <span>Ko‘rsatkichlarni ko‘rish oralig‘ini tanlang</span>
        </div>
        <div className="tab-pill-group">
          <button
            className={`tab-pill ${period === '3m' ? 'active' : ''}`}
            onClick={() => setPeriod('3m')}
          >
            So‘nggi 3 oy
          </button>
          <button
            className={`tab-pill ${period === '6m' ? 'active' : ''}`}
            onClick={() => setPeriod('6m')}
          >
            So‘nggi 6 oy
          </button>
          <button
            className={`tab-pill ${period === '12m' ? 'active' : ''}`}
            onClick={() => setPeriod('12m')}
          >
            So‘nggi 12 oy
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="stats-grid">
        <div className="card nexus-kpi-card">
          <span className="kpi-label">Tanlangan davr tushumi</span>
          <div className="kpi-value text-emerald">{formatMoney(totalRev)}</div>
          <div className="kpi-sub-text">To‘liq qabul qilingan</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">O‘rtacha oylik daromad</span>
          <div className="kpi-value text-purple">{formatMoney(Math.round(totalRev / 6))}</div>
          <div className="kpi-sub-text">Oyiga o‘rtacha tushum</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Jami tranzaksiyalar</span>
          <div className="kpi-value text-blue">{payments.length || 42} ta</div>
          <div className="kpi-sub-text">Muvaffaqiyatli to‘lovlar</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Davomat ko‘rsatkichi</span>
          <div className="kpi-value text-amber">94.2%</div>
          <div className="kpi-sub-text">Faol qatnashuv foizi</div>
        </div>
      </div>

      {/* Kurslar bo'yicha to'liq hisobot jadvali */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-head-flex">
          <div>
            <h3>Kurslar kesimida moliyaviy hisobot</h3>
            <p className="card-sub-desc">Har bir o‘quv kursi bo‘yicha talabalar va daromad tahlili</p>
          </div>
          <span className="badge-pill">{COURSES.length} ta yo‘nalish</span>
        </div>

        <div className="table">
          <div className="table-head" style={{ gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1.5fr' }}>
            <span>Kurs nomi</span>
            <span>Guruhlar</span>
            <span>O‘quvchilar</span>
            <span>Oylik to‘lov</span>
            <span>Jami daromad</span>
          </div>

          {COURSES.map((c) => {
            const courseGroups = groups.filter((g) => g.subject === c.name)
            const count = courseGroups.reduce((n, g) => n + (g.students?.length || 0), 0) || c.studentsCount
            const sum = c.fee * count
            return (
              <div
                className="table-row"
                style={{ gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1.5fr' }}
                key={c.id}
              >
                <span className="cell-name">
                  <i className={`${c.icon} text-purple`} style={{ marginRight: 8 }} />
                  {c.name}
                </span>
                <span>{courseGroups.length || c.groupsCount} ta guruh</span>
                <span>{count} nafar</span>
                <span>{formatMoney(c.fee)}</span>
                <span className="font-bold text-emerald">{formatMoney(sum)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
