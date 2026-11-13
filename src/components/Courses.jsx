import { useState, useMemo } from 'react'
import { COURSES, formatMoney } from '../data'
import { SkeletonCard, useLoading } from './Skeleton'

export default function Courses({ groups = [], teachers = [] }) {
  const loading = useLoading(700)
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase()
    return COURSES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.teacher.toLowerCase().includes(q)
    )
  }, [search])

  if (loading) {
    return (
      <div className="page">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
        <div className="cards-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} lines={5} />
          ))}
        </div>
      </div>
    )
  }

  // 4 Asosiy KPI
  const totalCourses = COURSES.length
  const totalGroups = groups.length || 12
  const totalStudents = groups.reduce((sum, g) => sum + (g.students?.length || 0), 0) || 48
  const avgFee = Math.round(
    COURSES.reduce((sum, c) => sum + c.fee, 0) / COURSES.length
  )

  return (
    <div className="page">
      {/* 4 KPI Cards */}
      <div className="stats-grid">
        <div className="card nexus-kpi-card">
          <span className="kpi-label">Jami kurslar</span>
          <div className="kpi-value">{totalCourses}</div>
          <div className="kpi-sub-text">Faol o‘quv dasturlari</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Faol guruhlar</span>
          <div className="kpi-value text-blue">{totalGroups}</div>
          <div className="kpi-sub-text">Barcha yo‘nalishlarda</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">Ta’lim oluvchilar</span>
          <div className="kpi-value text-emerald">{totalStudents}</div>
          <div className="kpi-sub-text">Faol o‘quvchilar</div>
        </div>

        <div className="card nexus-kpi-card">
          <span className="kpi-label">O‘rtacha kurs narxi</span>
          <div className="kpi-value text-purple">{formatMoney(avgFee)}</div>
          <div className="kpi-sub-text">Oylik to‘lov stavkasi</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-container" style={{ marginTop: 24 }}>
        <input
          className="search"
          placeholder="Kurs nomi, dastur yoki ustoz..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="badge-pill">{filteredCourses.length} ta yo‘nalish</span>
      </div>

      {/* Course Cards Grid with vibrant gradients */}
      <div className="cards-grid courses-grid">
        {filteredCourses.map((course) => {
          const courseGroups = groups.filter((g) => g.subject === course.name)
          const enrolled = courseGroups.reduce((n, g) => n + (g.students?.length || 0), 0)
          const monthlyRevenue = course.fee * (enrolled || course.studentsCount)

          return (
            <div className="nexus-course-card" key={course.id}>
              {/* Vibrant Gradient Banner Header */}
              <div
                className="course-card-banner"
                style={{ background: course.gradient }}
              >
                <div className="course-banner-top">
                  <span className="course-code-pill">{course.code}</span>
                  <div className="course-banner-icon">
                    <i className={course.icon} />
                  </div>
                </div>
                <h3 className="course-banner-title">{course.name}</h3>
              </div>

              {/* Course Card Body */}
              <div className="course-card-body">
                <p className="course-desc-text">{course.desc}</p>

                {/* 4-cell stats grid */}
                <div className="course-stats-cell-grid">
                  <div className="course-cell">
                    <span className="cell-lbl">Guruhlar</span>
                    <strong className="cell-val">{courseGroups.length || course.groupsCount} ta</strong>
                  </div>
                  <div className="course-cell">
                    <span className="cell-lbl">O‘quvchilar</span>
                    <strong className="cell-val text-blue">
                      {enrolled || course.studentsCount} nafar
                    </strong>
                  </div>
                  <div className="course-cell">
                    <span className="cell-lbl">Davomiyligi</span>
                    <strong className="cell-val">{course.duration}</strong>
                  </div>
                  <div className="course-cell">
                    <span className="cell-lbl">Oylik to‘lov</span>
                    <strong className="cell-val text-emerald">{formatMoney(course.fee)}</strong>
                  </div>
                </div>

                {/* Footer with teacher and action */}
                <div className="course-card-footer">
                  <div className="course-teacher-info">
                    <i className="fas fa-chalkboard-user text-purple" />
                    <span>{course.teacher}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setSelectedCourse(course)}
                  >
                    Batafsil
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="course-card-banner"
              style={{ background: selectedCourse.gradient, borderRadius: 16, margin: '-10px -10px 18px' }}
            >
              <div className="course-banner-top">
                <span className="course-code-pill">{selectedCourse.code}</span>
                <i className={`${selectedCourse.icon}`} style={{ fontSize: 28, color: '#fff' }} />
              </div>
              <h3 className="course-banner-title" style={{ fontSize: 20 }}>{selectedCourse.name}</h3>
            </div>

            <p style={{ lineHeight: 1.6, color: 'var(--text)' }}>{selectedCourse.desc}</p>

            <div className="student-finance-stats" style={{ margin: '16px 0' }}>
              <div>
                <span className="fee-label">Davomiyligi:</span>
                <strong>{selectedCourse.duration}</strong>
              </div>
              <div>
                <span className="fee-label">Oylik narx:</span>
                <strong className="text-emerald">{formatMoney(selectedCourse.fee)}</strong>
              </div>
              <div>
                <span className="fee-label">Bosh o‘qituvchi:</span>
                <strong>{selectedCourse.teacher}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setSelectedCourse(null)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
