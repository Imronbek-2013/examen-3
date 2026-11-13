import { useState, useMemo } from 'react'
import { SUBJECTS, formatMoney } from '../data'
import { SkeletonTable, useLoading } from './Skeleton'

const empty = {
  name: '',
  subject: 'Frontend Dasturlash',
  experience: 3,
  phone: '+998 90 000 00 00',
  email: '',
  salary: 12000000,
  rating: 4.8
}

export default function Teachers({ teachers = [], setTeachers, groups = [] }) {
  const loading = useLoading(800)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [search, setSearch] = useState('')

  const filteredTeachers = useMemo(() => {
    const s = search.toLowerCase()
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.subject.toLowerCase().includes(s) ||
        (t.phone && t.phone.includes(s))
    )
  }, [teachers, search])

  const openAdd = () => {
    setForm(empty)
    setModal(true)
  }

  const save = (e) => {
    e.preventDefault()
    const teacherData = {
      ...form,
      experience: Number(form.experience),
      salary: Number(form.salary) || 10000000,
      rating: Number(form.rating) || 4.9
    }

    if (form.id) {
      setTeachers((p) => p.map((x) => (x.id === form.id ? { ...x, ...teacherData } : x)))
    } else {
      setTeachers((p) => [...p, { ...teacherData, id: Date.now() }])
    }
    setModal(false)
  }

  const remove = (id) => {
    if (confirm('Ushbu o‘qituvchini o‘chirishni xohlaysizmi?')) {
      setTeachers((p) => p.filter((x) => x.id !== id))
    }
  }

  if (loading) return <div className="page"><SkeletonTable rows={5} cols={6} /></div>

  return (
    <div className="page">
      <div className="toolbar-container">
        <div className="toolbar-filters">
          <input
            className="search"
            placeholder="O‘qituvchi ismi, fan yoki telefon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge-pill">{teachers.length} nafar o‘qituvchi</span>
        </div>

        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-user-plus" /> + Yangi o‘qituvchi
        </button>
      </div>

      <div className="card">
        <div className="table">
          <div className="table-head teacher-head">
            <span>F.I.Sh.</span>
            <span>Fan Yo‘nalishi</span>
            <span>Tajriba</span>
            <span>Aloqa</span>
            <span>Oylik Maosh</span>
            <span>Reyting</span>
            <span></span>
          </div>

          {filteredTeachers.map((t) => {
            const teacherGroups = groups.filter((g) => g.teacher === t.name)
            return (
              <div className="table-row teacher-row" key={t.id}>
                <span>
                  <div className="cell-name">{t.name}</div>
                  <div className="cell-sub">
                    <i className="fas fa-layer-group" /> {teacherGroups.length} ta guruh
                  </div>
                </span>
                <span>
                  <span className="chip">{t.subject}</span>
                </span>
                <span>{t.experience} yil</span>
                <span>
                  <div>{t.phone}</div>
                  {t.email && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.email}</div>}
                </span>
                <span className="font-bold text-emerald">
                  {formatMoney(t.salary || 10000000)}
                </span>
                <span>
                  <span className="rating-pill">
                    <i className="fas fa-star" style={{ color: '#f59e0b' }} /> {t.rating || 4.9}
                  </span>
                </span>
                <span className="row-actions">
                  <button
                    className="link"
                    onClick={() => {
                      setForm(t)
                      setModal(true)
                    }}
                  >
                    <i className="fas fa-pen" />
                  </button>
                  <button className="link danger" onClick={() => remove(t.id)}>
                    <i className="fas fa-trash-can" />
                  </button>
                </span>
              </div>
            )
          })}

          {!filteredTeachers.length && (
            <div className="empty">Hech qanday o‘qituvchi topilmadi</div>
          )}
        </div>
      </div>

      {/* Tahrirlash / Qo'shish modali */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>
              {form.id ? (
                <>
                  <i className="fas fa-chalkboard-user" /> O‘qituvchini tahrirlash
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus" /> Yangi o‘qituvchi qo‘shish
                </>
              )}
            </h3>

            <label>
              F.I.Sh. (To‘liq ismi)
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Farrux To‘rayev"
              />
            </label>

            <label>
              O‘qitadigan Fani
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label>
              Ish tajribasi (yil)
              <input
                type="number"
                min="0"
                required
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: +e.target.value })}
              />
            </label>

            <label>
              Oylik maoshi (so‘m)
              <input
                type="number"
                min="1000000"
                step="500000"
                value={form.salary || 10000000}
                onChange={(e) => setForm({ ...form, salary: +e.target.value })}
              />
            </label>

            <label>
              Telefon raqami
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </label>

            <label>
              Email manzili
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ustoz@stundlisten.uz"
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
    </div>
  )
}
