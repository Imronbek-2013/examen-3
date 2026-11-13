import { useState, useMemo } from 'react'
import { SkeletonCard, useLoading } from './Skeleton'

export default function Attendance({ groups = [], students = [] }) {
  const loading = useLoading(700)
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || 1)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [toast, setToast] = useState('')

  // Guruh o'quvchilari
  const activeGroup = groups.find((g) => g.id === Number(selectedGroupId)) || groups[0]

  const groupStudents = useMemo(() => {
    if (!activeGroup) return []
    return students.filter(
      (s) => s.group === activeGroup.name || activeGroup.students?.includes(s.id)
    )
  }, [activeGroup, students])

  // Davomat holati (studentId: 'present' | 'late' | 'absent')
  const [roster, setRoster] = useState(() => {
    const init = {}
    students.forEach((s, idx) => {
      init[s.id] = idx % 5 === 0 ? 'late' : idx % 7 === 0 ? 'absent' : 'present'
    })
    return init
  })

  // Davomatni o'zgartirish
  const setStatus = (id, status) => {
    setRoster((prev) => ({ ...prev, [id]: status }))
  }

  // Hammasi keldi
  const markAllPresent = () => {
    setRoster((prev) => {
      const next = { ...prev }
      groupStudents.forEach((s) => {
        next[s.id] = 'present'
      })
      return next
    })
    setToast('✅ Guruhdagi barcha o‘quvchilar "Keldi" deb belgilandi!')
    setTimeout(() => setToast(''), 3000)
  }

  // Saqlash
  const saveAttendance = () => {
    setToast(`🎉 ${selectedDate} sanasi uchun davomat muvaffaqiyatli saqlandi!`)
    setTimeout(() => setToast(''), 3500)
  }

  // Hisob-kitoblar
  const counts = useMemo(() => {
    let present = 0
    let late = 0
    let absent = 0
    groupStudents.forEach((s) => {
      const st = roster[s.id] || 'present'
      if (st === 'present') present++
      else if (st === 'late') late++
      else if (st === 'absent') absent++
    })
    return {
      total: groupStudents.length,
      present,
      late,
      absent,
      rate: groupStudents.length
        ? Math.round(((present + late * 0.5) / groupStudents.length) * 100)
        : 100,
    }
  }, [groupStudents, roster])

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

  return (
    <div className="page">
      {toast && <div className="floating-toast">{toast}</div>}

      {/* 4 KPI Cards */}
      <div className="stats-grid">
        <div className="card nexus-kpi-card">
          <span className="kpi-label">Guruhdagi jami</span>
          <div className="kpi-value">{counts.total} nafar</div>
          <div className="kpi-sub-text">{activeGroup?.name || 'Guruh'}</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Keldi (Darsda)</span>
          <div className="kpi-value text-emerald">{counts.present}</div>
          <div className="kpi-sub-text">O‘z vaqtida qatnashdi</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Kechikdi</span>
          <div className="kpi-value text-amber">{counts.late}</div>
          <div className="kpi-sub-text">Uzrli kechikish</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Kelmadi (Yo‘q)</span>
          <div className="kpi-value text-danger">{counts.absent}</div>
          <div className="kpi-sub-text">Darsga qatnashmadi</div>
        </div>
      </div>

      {/* Filtrlash va Tanlash Bar */}
      <div className="attendance-filter-bar card" style={{ marginTop: 24, padding: '16px 22px' }}>
        <div className="att-filter-item">
          <label>Dars guruhi:</label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="filter-select"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.teacher || g.subject})
              </option>
            ))}
          </select>
        </div>

        <div className="att-filter-item">
          <label>Dars sanasi:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-select"
          />
        </div>

        <div className="att-actions-wrap" style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={markAllPresent}>
            <i className="fas fa-check-double text-emerald" /> Hammasi keldi
          </button>
          <button className="btn btn-primary" onClick={saveAttendance}>
            <i className="fas fa-floppy-disk" /> Saqlash
          </button>
        </div>
      </div>

      {/* Davomat Jadvali */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head-flex" style={{ marginBottom: 16 }}>
          <div>
            <h3>{activeGroup?.name} davomati</h3>
            <p className="card-sub-desc">
              Xona: {activeGroup?.room} • O‘qituvchi: {activeGroup?.teacher} • Davomat foizi: {counts.rate}%
            </p>
          </div>
          <span className="badge-pill">{groupStudents.length} ta o‘quvchi</span>
        </div>

        <div className="table">
          <div className="table-head attendance-head">
            <span>№</span>
            <span>O‘quvchi F.I.Sh.</span>
            <span>Telefon</span>
            <span>Umumiy davomat</span>
            <span>Bugungi holat</span>
          </div>

          {groupStudents.map((s, idx) => {
            const currentStatus = roster[s.id] || 'present'
            return (
              <div className="table-row attendance-row" key={s.id}>
                <span style={{ fontWeight: 600, color: 'var(--muted)' }}>{idx + 1}</span>
                <span className="cell-name">{s.name}</span>
                <span>{s.phone}</span>
                <span>
                  <div className="att-rate-cell">
                    <span className="att-rate-num">{s.attendance || 95}%</span>
                    <div className="att-mini-bar">
                      <div
                        className="att-mini-fill"
                        style={{ width: `${s.attendance || 95}%` }}
                      />
                    </div>
                  </div>
                </span>
                <span>
                  {/* 3-segmentli Davomat Tugmalari (Nexus Style) */}
                  <div className="attendance-toggle-group">
                    <button
                      type="button"
                      className={`att-pill-btn present ${
                        currentStatus === 'present' ? 'active' : ''
                      }`}
                      onClick={() => setStatus(s.id, 'present')}
                    >
                      <i className="fas fa-check" /> Keldi
                    </button>
                    <button
                      type="button"
                      className={`att-pill-btn late ${
                        currentStatus === 'late' ? 'active' : ''
                      }`}
                      onClick={() => setStatus(s.id, 'late')}
                    >
                      <i className="fas fa-clock" /> Kechikdi
                    </button>
                    <button
                      type="button"
                      className={`att-pill-btn absent ${
                        currentStatus === 'absent' ? 'active' : ''
                      }`}
                      onClick={() => setStatus(s.id, 'absent')}
                    >
                      <i className="fas fa-xmark" /> Kelmadi
                    </button>
                  </div>
                </span>
              </div>
            )
          })}

          {!groupStudents.length && (
            <div className="empty">Bu guruhga hozircha o‘quvchilar biriktirilmagan</div>
          )}
        </div>
      </div>
    </div>
  )
}
