import { useState } from 'react'
import { formatMoney } from '../data'
import { useLoading, SkeletonCard } from './Skeleton'

export default function StudentDashboard({ user, groups = [], students = [], teachers = [], payments = [] }) {
  const loading = useLoading(800)
  const [showReceipt, setShowReceipt] = useState(false)
  const [paySuccessToast, setPaySuccessToast] = useState(false)

  const studentObj = students.find((s) => s.id === user.id || s.name === user.name) || user
  const group = groups.find((g) => g.id === user.groupId || g.name === studentObj.group)
  const teacher = teachers.find((t) => t.name === group?.teacher)
  const classmates = students.filter((s) => s.group === group?.name && s.name !== user.name)
  const myPayments = payments.filter((p) => p.studentId === user.id || p.studentName === user.name)

  if (loading) {
    return (
      <div className="page">
        <div className="stats-grid cols-2">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
        <SkeletonCard lines={5} />
      </div>
    )
  }

  const handleOnlinePay = () => {
    setPaySuccessToast(true)
    setTimeout(() => setPaySuccessToast(false), 4000)
  }

  return (
    <div className="page">
      {paySuccessToast && (
        <div className="floating-toast">
          🎉 Payme/Click to‘lov sahifasi ochilmoqda... Tez orada to‘lov tasdiqlanadi!
        </div>
      )}

      {/* Salomlashish va To'lov holati */}
      <div className="stats-grid cols-2">
        <div className="card student-welcome-card">
          <div className="student-badge">
            <i className="fas fa-graduation-cap" /> O‘quvchi profili
          </div>
          <h2 style={{ margin: '10px 0 6px', fontSize: 24 }}>Salom, {user.name}!</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            O‘quv jarayonidagi natijalaringiz va to‘lov holatlaringiz
          </p>

          <div className="student-group-chip-box">
            <span className="chip" style={{ fontSize: 13, padding: '6px 14px' }}>
              <i className="fas fa-layer-group" /> {group?.name || 'Guruh biriktirilmagan'}
            </span>
            <span className="level-badge" style={{ fontSize: 13 }}>
              {studentObj.level || 'Junior'}
            </span>
          </div>
        </div>

        {/* To'lov va Moliya kartasi */}
        <div className="card">
          <div className="card-head-flex">
            <h3>
              <i className="fas fa-wallet text-emerald" style={{ marginRight: 8 }} />
              To‘lov va Balans Holati
            </h3>
            <span
              className={`status-pill ${
                studentObj.debt > 0 ? 'debt' : 'paid'
              }`}
            >
              {studentObj.debt > 0 ? 'Qarzdorlik mavjud' : "✓ To'langan"}
            </span>
          </div>

          <div className="student-finance-stats">
            <div>
              <div className="fee-label">Kurs narxi:</div>
              <div className="font-bold">{formatMoney(studentObj.fee || group?.fee || 650000)}</div>
            </div>
            <div>
              <div className="fee-label">To‘langan summa:</div>
              <div className="font-bold text-emerald">{formatMoney(studentObj.paidAmount || 0)}</div>
            </div>
            <div>
              <div className="fee-label">Qarzdorlik:</div>
              <div className="font-bold text-danger">{formatMoney(studentObj.debt || 0)}</div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            {studentObj.debt > 0 ? (
              <button className="btn btn-primary btn-block" onClick={handleOnlinePay}>
                <i className="fas fa-credit-card" /> Onlayn to‘lash (Payme / Click)
              </button>
            ) : (
              <div className="paid-thank-msg">
                <i className="fas fa-circle-check text-emerald" /> Ushbu oy uchun to‘lovingiz to‘liq qabul qilingan!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dars jadvali va Ustoz */}
      <div className="stats-grid cols-2">
        <div className="card">
          <h3>
            <i className="fas fa-calendar-days" style={{ color: 'var(--accent)', marginRight: 8 }} />
            Dars Jadvali va Xona
          </h3>
          <div style={{ marginTop: 14 }}>
            <p className="group-line">
              <i className="fas fa-clock" /> <strong>Dars vaqti:</strong> {group?.schedule || 'Belgilanmagan'}
            </p>
            <p className="group-line">
              <i className="fas fa-location-dot" /> <strong>Dars xonasi:</strong> {group?.room || 'Belgilanmagan'}
            </p>
            <p className="group-line">
              <i className="fas fa-book-open" /> <strong>Fan yo‘nalishi:</strong> {group?.subject || studentObj.subject}
            </p>
          </div>
        </div>

        <div className="card">
          <h3>
            <i className="fas fa-chalkboard-user" style={{ color: 'var(--accent2)', marginRight: 8 }} />
            Biriktirilgan Ustoz
          </h3>
          <div style={{ marginTop: 14 }}>
            <p className="group-line">
              <i className="fas fa-user-tie" /> <strong>Ustoz:</strong> {group?.teacher || 'Ustoz belgilanmagan'}
            </p>
            {teacher && (
              <>
                <p className="group-line">
                  <i className="fas fa-phone" /> <strong>Telefon:</strong> {teacher.phone}
                </p>
                <p className="group-line">
                  <i className="fas fa-star" style={{ color: '#f59e0b' }} /> <strong>Reyting:</strong> {teacher.rating} / 5.0
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Guruhdoshlar va To'lovlar tarixi */}
      <div className="stats-grid cols-2">
        <div className="card">
          <h3>
            <i className="fas fa-users" style={{ color: '#0ea5e9', marginRight: 8 }} />
            Guruhdoshlar ({classmates.length + 1} nafar)
          </h3>
          <ul className="mini-list" style={{ marginTop: 12 }}>
            <li>
              <span className="avatar sm">{user.name.split(' ').map((w) => w[0]).join('')}</span>
              <span className="mini-name">
                {user.name} <span className="chip" style={{ marginLeft: 6 }}>Siz</span>
              </span>
              <span className="chip">{studentObj.level || 'Junior'}</span>
            </li>
            {classmates.map((s) => (
              <li key={s.id}>
                <span className="avatar sm">{s.name.split(' ').map((w) => w[0]).join('')}</span>
                <span className="mini-name">{s.name}</span>
                <span className="chip">{s.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>
            <i className="fas fa-receipt" style={{ color: '#10b981', marginRight: 8 }} />
            Mening To‘lovlarim Tarixi
          </h3>
          <ul className="mini-list" style={{ marginTop: 12 }}>
            {myPayments.length > 0 ? (
              myPayments.map((p) => (
                <li key={p.id}>
                  <div className="mini-info">
                    <div className="mini-name">{p.receiptNo || `#${p.id}`}</div>
                    <div className="mini-sub">{p.date} • {p.method}</div>
                  </div>
                  <strong className="text-emerald">{formatMoney(p.amount)}</strong>
                </li>
              ))
            ) : (
              <li className="empty">Hozircha to‘lovlar tarixi mavjud emas</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
