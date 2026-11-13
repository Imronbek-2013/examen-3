import { useMemo, useState } from 'react'
import { SUBJECTS, formatMoney } from '../data'
import { SkeletonTable, useLoading } from './Skeleton'

const empty = {
  name: '',
  phone: '',
  subject: 'Frontend Dasturlash',
  level: 'Junior',
  parent: '',
  group: '',
  fee: 750000,
  paidAmount: 750000,
  debt: 0,
  paymentStatus: 'paid'
}

export default function Students({ students = [], setStudents, groups = [], setGroups, setPayments }) {
  const loading = useLoading(800)
  const [q, setQ] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [quickPayStudent, setQuickPayStudent] = useState(null)
  const [quickAmount, setQuickAmount] = useState('')

  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return students.filter((x) => {
      const matchSearch =
        x.name.toLowerCase().includes(s) ||
        x.phone.includes(s) ||
        x.subject.toLowerCase().includes(s) ||
        (x.group && x.group.toLowerCase().includes(s))
      const matchSub = filterSubject === 'all' || x.subject === filterSubject
      const matchStatus = filterStatus === 'all' || x.paymentStatus === filterStatus
      return matchSearch && matchSub && matchStatus
    })
  }, [students, q, filterSubject, filterStatus])

  const groupOptions = useMemo(
    () => groups.filter((g) => g.subject === form.subject).map((g) => g.name),
    [groups, form.subject]
  )

  const openAdd = () => {
    setForm({ ...empty, group: '' })
    setModal(true)
  }

  const save = (e) => {
    e.preventDefault()
    const studentId = form.id || Date.now()
    const feeNum = Number(form.fee) || 650000
    const paidNum = Number(form.paidAmount) || 0
    const debtNum = Math.max(0, feeNum - paidNum)
    const paymentStatus = debtNum === 0 ? 'paid' : paidNum > 0 ? 'debt' : 'pending'

    const studentData = {
      ...form,
      id: studentId,
      fee: feeNum,
      paidAmount: paidNum,
      debt: debtNum,
      paymentStatus
    }

    // Guruh bilan bog'liq ishlarni bajarish
    if (form.group) {
      if (form.id) {
        setGroups((p) =>
          p.map((g) => ({
            ...g,
            students: g.students.filter((sid) => sid !== form.id)
          }))
        )
      }

      const existingGroup = groups.find((g) => g.name === form.group)
      if (!existingGroup) {
        setGroups((p) => [
          ...p,
          {
            id: Date.now() + 1,
            name: form.group,
            subject: form.subject,
            teacher: '',
            schedule: '',
            room: '101-xona',
            fee: feeNum,
            students: [studentId]
          }
        ])
      } else if (!existingGroup.students.includes(studentId)) {
        setGroups((p) =>
          p.map((g) =>
            g.id === existingGroup.id
              ? { ...g, students: [...g.students, studentId] }
              : g
          )
        )
      }
    } else if (form.id) {
      setGroups((p) =>
        p.map((g) => ({
          ...g,
          students: g.students.filter((sid) => sid !== form.id)
        }))
      )
    }

    if (form.id) {
      setStudents((p) => p.map((x) => (x.id === form.id ? studentData : x)))
    } else {
      setStudents((p) => [...p, studentData])
      // Yangi o'quvchi to'lov qilgan bo'lsa daromadga ham tushiramiz
      if (paidNum > 0 && setPayments) {
        setPayments((prev) => [
          {
            id: Date.now() + 2,
            studentId,
            studentName: form.name,
            groupName: form.group || 'Guruhsiz',
            subject: form.subject,
            amount: paidNum,
            date: new Date().toISOString().split('T')[0],
            method: 'Naqd',
            status: 'completed',
            receiptNo: `REC-${Math.floor(10000 + Math.random() * 90000)}`
          },
          ...prev
        ])
      }
    }
    setModal(false)
  }

  const remove = (id) => {
    if (confirm('O‘quvchini tizimdan o‘chirishni xohlaysizmi?')) {
      setGroups((p) =>
        p.map((g) => ({
          ...g,
          students: g.students.filter((sid) => sid !== id)
        }))
      )
      setStudents((p) => p.filter((x) => x.id !== id))
    }
  }

  // Tezkor to'lov qabul qilish
  const handleQuickPay = (e) => {
    e.preventDefault()
    if (!quickPayStudent) return
    const amt = Number(quickAmount)
    if (!amt || amt <= 0) return

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === quickPayStudent.id) {
          const newPaid = (s.paidAmount || 0) + amt
          const newDebt = Math.max(0, (s.debt || s.fee || 0) - amt)
          return {
            ...s,
            paidAmount: newPaid,
            debt: newDebt,
            paymentStatus: newDebt === 0 ? 'paid' : 'debt'
          }
        }
        return s
      })
    )

    if (setPayments) {
      setPayments((prev) => [
        {
          id: Date.now(),
          studentId: quickPayStudent.id,
          studentName: quickPayStudent.name,
          groupName: quickPayStudent.group || 'Guruhsiz',
          subject: quickPayStudent.subject,
          amount: amt,
          date: new Date().toISOString().split('T')[0],
          method: 'Payme',
          status: 'completed',
          receiptNo: `REC-${Math.floor(10000 + Math.random() * 90000)}`
        },
        ...prev
      ])
    }

    setQuickPayStudent(null)
    setQuickAmount('')
  }

  if (loading) return <div className="page"><SkeletonTable rows={8} cols={7} /></div>

  return (
    <div className="page">
      {/* Yuqori qidiruv va filtrlash */}
      <div className="toolbar-container">
        <div className="toolbar-filters">
          <input
            className="search"
            placeholder="F.I.Sh., telefon yoki guruh bo‘yicha qidirish..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="all">Barcha Fanlar</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Barcha To‘lov Holatlari</option>
            <option value="paid">To‘langan (Qarzsiz)</option>
            <option value="debt">Qarzdorlar</option>
            <option value="pending">Kutilmoqda</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-user-plus" /> Yangi o‘quvchi qo‘shish
        </button>
      </div>

      <div className="card">
        <div className="table">
          <div className="table-head student-head">
            <span>F.I.Sh.</span>
            <span>Telefon</span>
            <span>Fan va Daraja</span>
            <span>Guruh</span>
            <span>Oylik To‘lov</span>
            <span>To‘lov Holati</span>
            <span></span>
          </div>

          {filtered.map((s) => (
            <div className="table-row student-row" key={s.id}>
              <span>
                <div className="cell-name">{s.name}</div>
                {s.parent && <div className="cell-sub"><i className="fas fa-user-tie" /> {s.parent}</div>}
              </span>
              <span>
                <a href={`tel:${s.phone}`} className="phone-link">
                  <i className="fas fa-phone" style={{ fontSize: 11, marginRight: 4 }} />
                  {s.phone}
                </a>
              </span>
              <span>
                <span className="chip">{s.subject}</span>
                <span className="level-badge">{s.level}</span>
              </span>
              <span>
                <strong>{s.group || '—'}</strong>
              </span>
              <span>
                <div><strong>{formatMoney(s.fee || 650000)}</strong></div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  To‘landi: {formatMoney(s.paidAmount || 0)}
                </div>
              </span>
              <span>
                <span
                  className={`status-pill ${
                    s.paymentStatus === 'paid'
                      ? 'paid'
                      : s.paymentStatus === 'debt'
                      ? 'debt'
                      : 'pending'
                  }`}
                >
                  {s.paymentStatus === 'paid'
                    ? "✓ To'langan"
                    : s.paymentStatus === 'debt'
                    ? `Qarz: ${formatMoney(s.debt)}`
                    : 'To‘lanmagan'}
                </span>
                {s.debt > 0 && (
                  <button
                    className="quick-pay-btn"
                    onClick={() => {
                      setQuickPayStudent(s)
                      setQuickAmount(String(s.debt))
                    }}
                    title="To'lov qabul qilish"
                  >
                    +To‘lov
                  </button>
                )}
              </span>
              <span className="row-actions">
                <button
                  className="link"
                  onClick={() => {
                    setForm(s)
                    setModal(true)
                  }}
                  title="Tahrirlash"
                >
                  <i className="fas fa-pen-to-square" />
                </button>
                <button
                  className="link danger"
                  onClick={() => remove(s.id)}
                  title="O‘chirish"
                >
                  <i className="fas fa-trash-can" />
                </button>
              </span>
            </div>
          ))}

          {!filtered.length && <div className="empty">Hech qanday o‘quvchi topilmadi</div>}
        </div>
      </div>

      {/* Tahrirlash / Yangi o'quvchi modali */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>
              {form.id ? (
                <>
                  <i className="fas fa-user-pen" /> O‘quvchini tahrirlash
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus" /> Yangi o‘quvchi ro‘yxatga olish
                </>
              )}
            </h3>

            <label>
              F.I.Sh. (To‘liq ismi)
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: Sardor Ergashev"
              />
            </label>

            <label>
              Telefon raqami
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </label>

            <label>
              Fan yo‘nalishi
              <select
                value={form.subject}
                onChange={(e) => {
                  const subject = e.target.value
                  setForm({ ...form, subject, group: '' })
                }}
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label>
              Bilim darajasi
              <input
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                placeholder="Junior / Intermediate / B1 / A2"
              />
            </label>

            <label>
              Oylik to‘lov narxi (so‘m)
              <input
                type="number"
                min="0"
                step="50000"
                value={form.fee || 650000}
                onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
              />
            </label>

            <label>
              Hozir to‘lagan summasi (so‘m)
              <input
                type="number"
                min="0"
                step="50000"
                value={form.paidAmount || 0}
                onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
              />
            </label>

            <label>
              Guruh nomi
              <div className="group-input-wrap">
                <input
                  list="group-list"
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                  placeholder="Mavjud guruhni tanlang yoki yangi guruh nomini yozing"
                />
                <datalist id="group-list">
                  {groupOptions.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>
              {groupOptions.length > 0 && (
                <span className="group-hint">
                  <i className="fas fa-info-circle" /> Ushbu fan guruhlari: {groupOptions.join(', ')}
                </span>
              )}
            </label>

            <label>
              Ota-onasi ismi va telefoni
              <input
                value={form.parent || ''}
                onChange={(e) => setForm({ ...form, parent: e.target.value })}
                placeholder="Vali Valiyev (+998 90 999 00 11)"
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setModal(false)}>
                Bekor qilish
              </button>
              <button type="submit" className="btn btn-primary">
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tezkor to'lov modali */}
      {quickPayStudent && (
        <div className="modal-backdrop" onClick={() => setQuickPayStudent(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleQuickPay}>
            <h3>
              <i className="fas fa-money-bill-wave text-emerald" /> To‘lov qabul qilish
            </h3>
            <p style={{ margin: '8px 0 16px', color: 'var(--muted)' }}>
              O‘quvchi: <strong>{quickPayStudent.name}</strong> <br />
              Umumiy qarzdorlik: <strong className="text-danger">{formatMoney(quickPayStudent.debt)}</strong>
            </p>

            <label>
              Qabul qilinayotgan summa (so‘m)
              <input
                type="number"
                required
                min="1000"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setQuickPayStudent(null)}>
                Bekor qilish
              </button>
              <button type="submit" className="btn btn-primary">
                To‘lovni tasdiqlash
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
