import { useState } from 'react'
import { useCollection } from '../data'

export default function StudentAuth({ groups, students, setStudents, setGroups, onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [groupId, setGroupId] = useState(groups[0]?.id || '')
  const [error, setError] = useState('')
  const [users, setUsers] = useCollection('tom_student_users')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'register') {
      if (users.some((u) => u.phone === phone)) {
        setError('Bu telefon raqam allaqachon ro‘yxatdan o‘tgan')
        return
      }
      const userId = Date.now()
      const selectedGroup = groups.find((g) => g.id === +groupId)
      const user = { id: userId, name, phone, password, groupId: +groupId }
      setUsers((p) => [...p, user])

      setStudents((p) => [
        ...p,
        {
          id: userId,
          name,
          phone,
          group: selectedGroup?.name || '',
          subject: selectedGroup?.subject || '',
          level: 'Junior',
          parent: '',
          fee: selectedGroup?.fee || 650000,
          paidAmount: 0,
          debt: selectedGroup?.fee || 650000,
          paymentStatus: 'pending'
        }
      ])

      if (selectedGroup) {
        setGroups((p) =>
          p.map((g) =>
            g.id === selectedGroup.id
              ? { ...g, students: [...new Set([...g.students, userId])] }
              : g
          )
        )
      }

      onLogin(user)
    } else {
      const user = users.find((u) => u.phone === phone && u.password === password)
      if (user) onLogin(user)
      else setError('Telefon raqam yoki parol noto‘g‘ri')
    }
  }

  // Tezkor demo kirish
  const fillStudentDemo = () => {
    setPhone('+998 90 123 45 67')
    setPassword('123')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="auth-tabs">
        <button
          className={mode === 'login' ? 'active' : ''}
          onClick={() => {
            setMode('login')
            setError('')
          }}
        >
          Kirish
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          onClick={() => {
            setMode('register')
            setError('')
          }}
        >
          Ro‘yxatdan o‘tish
        </button>
      </div>

      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">SL</div>
        <h1>STUND LISTEN</h1>
        <p className="login-sub">
          {mode === 'login' ? 'O‘quvchi shaxsiy kabinetiga kirish' : 'Yangi o‘quvchi sifatida ro‘yxatdan o‘tish'}
        </p>

        {mode === 'register' && (
          <label>
            F.I.Sh.
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ism familiyangiz"
            />
          </label>
        )}

        <label>
          Telefon raqam
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 90 123 45 67"
          />
        </label>

        {mode === 'register' && (
          <label>
            Dars guruhi
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.subject})
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Parol
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolingiz"
          />
        </label>

        {error && (
          <div className="login-error">
            <i className="fas fa-triangle-exclamation" /> {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
          {mode === 'login' ? 'Kabinetga kirish' : 'Ro‘yxatdan o‘tish'}
        </button>

        {mode === 'login' && (
          <div className="login-quick-demo">
            <button type="button" className="btn-demo-quick" onClick={fillStudentDemo}>
              <i className="fas fa-user-check" /> Demo O‘quvchi bilan to‘ldirish
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
