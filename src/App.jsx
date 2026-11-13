import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useCollection } from './data'
import Login from './components/Login'
import StudentAuth from './components/StudentAuth'
import StudentDashboard from './components/StudentDashboard'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Students from './components/Students'
import Teachers from './components/Teachers'
import Groups from './components/Groups'
import Courses from './components/Courses'
import Attendance from './components/Attendance'
import Finance from './components/Finance'
import Reports from './components/Reports'
import Settings from './components/Settings'
import './App.css'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState(() => sessionStorage.getItem('tom_role') || null)
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('tom_student') || 'null')
    } catch {
      return null
    }
  })

  const [students, setStudents] = useCollection('tom_students')
  const [teachers, setTeachers] = useCollection('tom_teachers')
  const [groups, setGroups] = useCollection('tom_groups')
  const [payments, setPayments] = useCollection('tom_payments')
  const [expenses, setExpenses] = useCollection('tom_expenses')

  const [theme, setTheme] = useState(
    () => localStorage.getItem('tom_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('tom_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const loginAdmin = () => {
    sessionStorage.setItem('tom_role', 'admin')
    setRole('admin')
    navigate('/dashboard')
  }

  const loginStudent = (user) => {
    sessionStorage.setItem('tom_role', 'student')
    sessionStorage.setItem('tom_student', JSON.stringify(user))
    setStudent(user)
    setRole('student')
    navigate('/student/dashboard')
  }

  const logout = () => {
    sessionStorage.removeItem('tom_role')
    sessionStorage.removeItem('tom_student')
    setRole(null)
    setStudent(null)
    navigate('/login')
  }

  const isAuthPage =
    !role ||
    location.pathname === '/login' ||
    location.pathname === '/student/login' ||
    location.pathname === '/'

  // Himoyalangan Admin marshruti
  const AdminRoute = ({ children }) => {
    if (!role) {
      return <Navigate to="/login" replace />
    }
    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />
    }
    return (
      <Layout onLogout={logout} theme={theme} onToggleTheme={toggleTheme}>
        {children}
      </Layout>
    )
  }

  // Himoyalangan O'quvchi marshruti
  const StudentRoute = ({ children }) => {
    if (!role || role !== 'student' || !student) {
      return <Navigate to="/student/login" replace />
    }
    return (
      <div className="layout">
        <div className="main">
          <header className="nexus-topbar student-topbar">
            <div className="sidebar-brand" style={{ padding: 0, border: 'none' }}>
              <div className="nexus-logo-squircle" style={{ width: 38, height: 38, fontSize: 16 }}>
                <i className="fas fa-graduation-cap" />
              </div>
              <div className="brand-title" style={{ fontSize: 15, letterSpacing: '-0.02em' }}>
                STUND LISTEN
              </div>
            </div>
            <h2 style={{ flex: 1, margin: '0 16px', fontSize: 18 }}>O‘quvchi Shaxsiy Kabineti</h2>
            <div className="topbar-right">
              <span className="avatar sm">{student.name?.split(' ').map((w) => w[0]).join('') || 'O'}</span>
              <span className="header-admin-name">{student.name}</span>
              <button
                className="topbar-icon-btn theme-toggle-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
              >
                <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
              </button>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                <i className="fas fa-arrow-right-from-bracket" /> Chiqish
              </button>
            </div>
          </header>
          <main className="content">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Auth sahifalarida yuqori Role almashish tugmasi */}
      {isAuthPage && (
        <div className="auth-switch">
          <button
            className={location.pathname === '/login' || location.pathname === '/' ? 'active' : ''}
            onClick={() => navigate('/login')}
          >
            <i className="fas fa-shield-halved" /> Admin
          </button>
          <button
            className={location.pathname === '/student/login' ? 'active' : ''}
            onClick={() => navigate('/student/login')}
          >
            <i className="fas fa-user-graduate" /> O‘quvchi
          </button>
        </div>
      )}

      <Routes>
        {/* Auth yo'llari */}
        <Route
          path="/login"
          element={
            role === 'admin' ? (
              <Navigate to="/dashboard" replace />
            ) : role === 'student' ? (
              <Navigate to="/student/dashboard" replace />
            ) : (
              <Login onLogin={loginAdmin} />
            )
          }
        />
        <Route
          path="/student/login"
          element={
            role === 'student' ? (
              <Navigate to="/student/dashboard" replace />
            ) : (
              <StudentAuth
                groups={groups}
                students={students}
                setStudents={setStudents}
                setGroups={setGroups}
                onLogin={loginStudent}
              />
            )
          }
        />

        {/* Student kabineti */}
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboard
                user={student}
                groups={groups}
                students={students}
                teachers={teachers}
                payments={payments}
              />
            </StudentRoute>
          }
        />

        {/* Admin yo'llari */}
        <Route
          path="/"
          element={
            role === 'student' ? (
              <Navigate to="/student/dashboard" replace />
            ) : (
              <AdminRoute>
                <Dashboard
                  students={students}
                  teachers={teachers}
                  groups={groups}
                  payments={payments}
                />
              </AdminRoute>
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard
                students={students}
                teachers={teachers}
                groups={groups}
                payments={payments}
              />
            </AdminRoute>
          }
        />

        <Route
          path="/students"
          element={
            <AdminRoute>
              <Students
                students={students}
                setStudents={setStudents}
                groups={groups}
                setGroups={setGroups}
                setPayments={setPayments}
              />
            </AdminRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <AdminRoute>
              <Teachers teachers={teachers} setTeachers={setTeachers} groups={groups} />
            </AdminRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <AdminRoute>
              <Groups
                groups={groups}
                setGroups={setGroups}
                teachers={teachers}
                students={students}
                setStudents={setStudents}
              />
            </AdminRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <AdminRoute>
              <Courses groups={groups} teachers={teachers} />
            </AdminRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <AdminRoute>
              <Attendance groups={groups} students={students} />
            </AdminRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <AdminRoute>
              <Finance
                payments={payments}
                setPayments={setPayments}
                expenses={expenses}
                setExpenses={setExpenses}
                students={students}
                setStudents={setStudents}
                groups={groups}
              />
            </AdminRoute>
          }
        />

        {/* /finance yo'naltiruvchisi /payments ga o'tadi */}
        <Route path="/finance" element={<Navigate to="/payments" replace />} />

        <Route
          path="/reports"
          element={
            <AdminRoute>
              <Reports payments={payments} students={students} groups={groups} />
            </AdminRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <AdminRoute>
              <Settings
                theme={theme}
                onToggleTheme={toggleTheme}
                onLogout={logout}
              />
            </AdminRoute>
          }
        />

        {/* Noma'lum yo'llar */}
        <Route
          path="*"
          element={<Navigate to={role === 'student' ? '/student/dashboard' : '/dashboard'} replace />}
        />
      </Routes>
    </>
  )
}

export default App
