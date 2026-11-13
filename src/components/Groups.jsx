import { useState, useMemo } from 'react'
import { SUBJECTS, formatMoney } from '../data'
import { SkeletonTable, useLoading } from './Skeleton'

const empty = {
  name: '',
  subject: 'Frontend Dasturlash',
  teacher: '',
  schedule: '',
  room: '101-xona',
  fee: 750000,
  students: []
}

export default function Groups({ groups = [], setGroups, teachers = [], students = [], setStudents }) {
  const loading = useLoading(800)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [viewStudentsModal, setViewStudentsModal] = useState(null)

  const teachersOf = (subject) => teachers.filter((t) => t.subject === subject).map((t) => t.name)

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase()
    return groups.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(q) ||
        (g.teacher && g.teacher.toLowerCase().includes(q)) ||
        (g.room && g.room.toLowerCase().includes(q))
      const matchSub = subjectFilter === 'all' || g.subject === subjectFilter
      return matchSearch && matchSub
    })
  }, [groups, search, subjectFilter])

  const openAdd = () => {
    setForm(empty)
    setModal(true)
  }

  const save = (e) => {
    e.preventDefault()
    const groupData = {
      ...form,
      fee: Number(form.fee) || 650000
    }

    if (form.id) {
      setGroups((p) => p.map((x) => (x.id === form.id ? { ...x, ...groupData } : x)))
    } else {
      setGroups((p) => [...p, { ...groupData, id: Date.now() }])
    }
    setModal(false)
  }

  const remove = (id) => {
    if (confirm('Ushbu guruhni o‘chirishni xohlaysizmi?')) {
      const g = groups.find((x) => x.id === id)
      if (g && setStudents) {
        setStudents((p) =>
          p.map((s) => (s.group === g.name ? { ...s, group: '' } : s))
        )
      }
      setGroups((p) => p.filter((x) => x.id !== id))
    }
  }

  if (loading) return <div className="page"><SkeletonTable rows={6} cols={5} /></div>

  return (
    <div className="page">
      <div className="toolbar-container">
        <div className="toolbar-filters">
          <input
            className="search"
            placeholder="Guruh nomi, o‘qituvchi yoki xona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="all">Barcha Fanlar</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-layer-group" /> + Yangi guruh ochish
        </button>
      </div>

      <div className="cards-grid">
        {filteredGroups.map((g) => {
          const groupTotalRevenue = (g.fee || 650000) * (g.students?.length || 0)
          return (
            <div className="card group-card" key={g.id}>
              <div className="group-head">
                <span className="chip">{g.subject}</span>
                <span className="group-room">
                  <i className="fas fa-door-open" /> {g.room || 'Xona belgilanmagan'}
                </span>
              </div>

              <h3>{g.name}</h3>

              <p className="group-line">
                <i className="fas fa-chalkboard-user" /> <strong>{g.teacher || 'Ustoz biriktirilmagan'}</strong>
              </p>
              <p className="group-line">
                <i className="fas fa-clock" /> {g.schedule || 'Jadval ko‘rsatilmagan'}
              </p>
              <p className="group-line">
                <i className="fas fa-user-graduate" />{' '}
                <button
                  className="link group-students-btn"
                  onClick={() => setViewStudentsModal(g)}
                >
                  {g.students?.length || 0} nafar o‘quvchi (Ko‘rish)
                </button>
              </p>

              {/* Moliyaviy ko'rsatkich */}
              <div className="group-fee-row">
                <div>
                  <div className="fee-label">Oylik to‘lov:</div>
                  <div className="fee-value">{formatMoney(g.fee || 650000)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="fee-label">Kutilayotgan tushum:</div>
                  <div className="fee-total text-emerald">{formatMoney(groupTotalRevenue)}</div>
                </div>
              </div>

              <div className="row-actions">
                <button
                  className="link"
                  onClick={() => {
                    setForm({ ...g, students: [...(g.students || [])] })
                    setModal(true)
                  }}
                >
                  <i className="fas fa-pen" /> Tahrir
                </button>
                <button className="link danger" onClick={() => remove(g.id)}>
                  <i className="fas fa-trash-can" /> O‘chirish
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Guruh o'quvchilari ro'yxati modali */}
      {viewStudentsModal && (
        <div className="modal-backdrop" onClick={() => setViewStudentsModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              <i className="fas fa-users text-emerald" /> {viewStudentsModal.name} o‘quvchilari
            </h3>
            <div className="mini-student-list-box" style={{ maxHeight: 300, overflowY: 'auto', margin: '14px 0' }}>
              {students
                .filter((s) => s.group === viewStudentsModal.name || viewStudentsModal.students.includes(s.id))
                .map((st, i) => (
                  <div key={st.id} className="mini-student-item">
                    <span>{i + 1}. <strong>{st.name}</strong></span>
                    <span>{st.phone}</span>
                    <span
                      className={`status-pill ${
                        st.paymentStatus === 'paid' ? 'paid' : 'debt'
                      }`}
                    >
                      {st.paymentStatus === 'paid' ? "To'langan" : "Qarz"}
                    </span>
                  </div>
                ))}
              {students.filter((s) => s.group === viewStudentsModal.name || viewStudentsModal.students.includes(s.id)).length === 0 && (
                <div className="empty">Bu guruhga hozircha o‘quvchi biriktirilmagan</div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setViewStudentsModal(null)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tahrir / Yangi guruh modali */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>
              {form.id ? (
                <>
                  <i className="fas fa-pen-to-square" /> Guruhni tahrirlash
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle" /> Yangi dars guruhi
                </>
              )}
            </h3>

            <label>
              Guruh nomi
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: Python Backend — Django Pro"
              />
            </label>

            <label>
              Fan
              <select
                value={form.subject}
                onChange={(e) => {
                  const subject = e.target.value
                  const t = teachers.find((x) => x.subject === subject)
                  setForm({ ...form, subject, teacher: t?.name || '' })
                }}
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label>
              O‘qituvchi
              <select
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              >
                <option value="">— O‘qituvchini tanlang —</option>
                {teachersOf(form.subject).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label>
              Oylik to‘lov kursi narxi (so‘m)
              <input
                type="number"
                min="100000"
                step="50000"
                required
                value={form.fee || 650000}
                onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
              />
            </label>

            <label>
              Dars jadvali va vaqti
              <input
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                placeholder="Dush - Chor - Juma 16:00–18:00"
              />
            </label>

            <label>
              Dars xonasi / Lab
              <input
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="201-IT Lab"
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
