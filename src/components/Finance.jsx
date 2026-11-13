import { useState, useMemo } from 'react'
import { formatMoney } from '../data'
import { SkeletonCard, useLoading } from './Skeleton'

export default function Finance({
  payments = [],
  setPayments,
  expenses = [],
  setExpenses,
  students = [],
  setStudents,
  groups = []
}) {
  const loading = useLoading(800)
  const [activeTab, setActiveTab] = useState('payments') // 'payments' | 'debtors' | 'expenses'
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')

  // Modallar holati
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [receiptModal, setReceiptModal] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  // Yangi to'lov formasi
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    amount: '',
    method: 'Payme',
    note: ''
  })

  // Yangi xarajat formasi
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Ijara'
  })

  // Toast xabar
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Umumiy hisob-kitoblar
  const totalRevenue = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  }, [payments])

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  }, [expenses])

  const totalDebt = useMemo(() => {
    return students.reduce((sum, s) => sum + (Number(s.debt) || 0), 0)
  }, [students])

  const netProfit = totalRevenue - totalExpenses

  // To'lovlarni filtrlash
  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase()
    return payments.filter((p) => {
      const matchSearch =
        p.studentName.toLowerCase().includes(q) ||
        p.groupName.toLowerCase().includes(q) ||
        (p.receiptNo && p.receiptNo.toLowerCase().includes(q))
      const matchMethod = methodFilter === 'all' || p.method === methodFilter
      return matchSearch && matchMethod
    })
  }, [payments, search, methodFilter])

  // Qarzdor o'quvchilar
  const debtors = useMemo(() => {
    return students.filter((s) => (s.debt && s.debt > 0) || s.paymentStatus === 'debt' || s.paymentStatus === 'pending')
  }, [students])

  // Yangi to'lov qabul qilish
  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    const student = students.find((s) => s.id === Number(newPayment.studentId))
    if (!student) return

    const amountNum = Number(newPayment.amount)
    const receiptNo = `REC-${Math.floor(10000 + Math.random() * 90000)}`

    const paymentRecord = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      groupName: student.group || 'Guruhsiz',
      subject: student.subject,
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method,
      status: 'completed',
      receiptNo
    }

    // To'lovlar ro'yxatiga qo'shish
    setPayments((prev) => [paymentRecord, ...prev])

    // O'quvchining to'lov holatini yangilash
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === student.id) {
          const newPaid = (s.paidAmount || 0) + amountNum
          const newDebt = Math.max(0, (s.debt || s.fee || 0) - amountNum)
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

    setShowPaymentModal(false)
    setNewPayment({ studentId: '', amount: '', method: 'Payme', note: '' })
    showToast(`✅ To'lov qabul qilindi! Kvitansiya: ${receiptNo}`)
  }

  // Yangi xarajat qo'shish
  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    const amountNum = Number(newExpense.amount)
    const expenseRecord = {
      id: Date.now(),
      title: newExpense.title,
      amount: amountNum,
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses((prev) => [expenseRecord, ...prev])
    setShowExpenseModal(false)
    setNewExpense({ title: '', amount: '', category: 'Ijara' })
    showToast(`✅ Xarajat qayd etildi: ${formatMoney(amountNum)}`)
  }

  // Xarajatni o'chirish
  const removeExpense = (id) => {
    if (confirm('Ushbu xarajatni o‘chirmoqchimisiz?')) {
      setExpenses((prev) => prev.filter((x) => x.id !== id))
      showToast('Xarajat o‘chirildi')
    }
  }

  // To'lovni o'chirish
  const removePayment = (id) => {
    if (confirm('Ushbu to‘lov yozuvini bekor qilmoqchimisiz?')) {
      setPayments((prev) => prev.filter((x) => x.id !== id))
      showToast('To‘lov o‘chirildi')
    }
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

  return (
    <div className="page">
      {/* Toast bildirishnoma */}
      {toastMessage && <div className="floating-toast">{toastMessage}</div>}

      {/* Moliya ko'rsatkichlari */}
      <div className="stats-grid">
        <div className="card stat stat-income">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <i className="fas fa-wallet" />
          </div>
          <div className="stat-value text-emerald">{formatMoney(totalRevenue)}</div>
          <div className="stat-label">Jami Oylik Tushum</div>
          <div className="stat-sub text-emerald">
            <i className="fas fa-arrow-trend-up" /> +18.4% o‘tgan oyga nisbatan
          </div>
        </div>

        <div className="card stat stat-debt">
          <div className="stat-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <i className="fas fa-hand-holding-dollar" />
          </div>
          <div className="stat-value text-danger">{formatMoney(totalDebt)}</div>
          <div className="stat-label">Kutilayotgan Qarzlar</div>
          <div className="stat-sub">{debtors.length} nafar o‘quvchida qarzdorlik</div>
        </div>

        <div className="card stat">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <i className="fas fa-receipt" />
          </div>
          <div className="stat-value text-amber">{formatMoney(totalExpenses)}</div>
          <div className="stat-label">Oylik Xarajatlar</div>
          <div className="stat-sub">Ijara, marketing, maoshlar</div>
        </div>

        <div className="card stat stat-profit">
          <div className="stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <i className="fas fa-chart-pie" />
          </div>
          <div className="stat-value text-blue">{formatMoney(netProfit)}</div>
          <div className="stat-label">Sof Foyda</div>
          <div className="stat-sub">Tushumdan xarajat ayirilganda</div>
        </div>
      </div>

      {/* Amallar va tablar */}
      <div className="finance-header-bar">
        <div className="tab-pill-group">
          <button
            className={`tab-pill ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fas fa-list-check" /> Barcha To‘lovlar ({payments.length})
          </button>
          <button
            className={`tab-pill ${activeTab === 'debtors' ? 'active' : ''}`}
            onClick={() => setActiveTab('debtors')}
          >
            <i className="fas fa-clock-rotate-left" /> Qarzdorlar ({debtors.length})
          </button>
          <button
            className={`tab-pill ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <i className="fas fa-file-invoice-dollar" /> Xarajatlar ({expenses.length})
          </button>
        </div>

        <div className="action-buttons-wrap">
          <button className="btn btn-outline" onClick={() => setShowExpenseModal(true)}>
            <i className="fas fa-minus" /> Xarajat kiritish
          </button>
          <button className="btn btn-primary" onClick={() => setShowPaymentModal(true)}>
            <i className="fas fa-plus" /> Yangi to‘lov qabul qilish
          </button>
        </div>
      </div>

      {/* 1-TAB: Barcha to'lovlar */}
      {activeTab === 'payments' && (
        <div className="card">
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <input
              className="search"
              placeholder="O‘quvchi, guruh yoki chek raqami..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-select-wrap">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Barcha to‘lov usullari</option>
                <option value="Payme">Payme</option>
                <option value="Click">Click</option>
                <option value="Naqd">Naqd</option>
                <option value="Uzcard/Humo">Uzcard/Humo</option>
              </select>
            </div>
          </div>

          <div className="table">
            <div className="table-head payment-head">
              <span>Kvitansiya</span>
              <span>O‘quvchi</span>
              <span>Guruh / Fan</span>
              <span>To‘lov Usuli</span>
              <span>Sana</span>
              <span>Summa</span>
              <span>Holat</span>
              <span></span>
            </div>
            {filteredPayments.map((p) => (
              <div className="table-row payment-row" key={p.id}>
                <span>
                  <strong className="receipt-tag">{p.receiptNo || `#${p.id}`}</strong>
                </span>
                <span className="cell-name">{p.studentName}</span>
                <span>
                  <div style={{ fontWeight: 600 }}>{p.groupName}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.subject}</div>
                </span>
                <span>
                  <span className={`payment-method-chip ${p.method?.toLowerCase()}`}>
                    <i
                      className={
                        p.method === 'Payme'
                          ? 'fas fa-mobile-screen'
                          : p.method === 'Click'
                          ? 'fas fa-bolt'
                          : p.method === 'Naqd'
                          ? 'fas fa-money-bill-wave'
                          : 'fas fa-credit-card'
                      }
                    />{' '}
                    {p.method}
                  </span>
                </span>
                <span>{p.date}</span>
                <span className="font-bold text-emerald">{formatMoney(p.amount)}</span>
                <span>
                  <span className="status-badge status-paid">
                    <i className="fas fa-circle-check" /> To‘langan
                  </span>
                </span>
                <span className="row-actions">
                  <button
                    className="link"
                    title="Kvitansiyani ko'rish"
                    onClick={() => setReceiptModal(p)}
                  >
                    <i className="fas fa-print" /> Chek
                  </button>
                  <button
                    className="link danger"
                    title="O'chirish"
                    onClick={() => removePayment(p.id)}
                  >
                    <i className="fas fa-trash-can" />
                  </button>
                </span>
              </div>
            ))}
            {!filteredPayments.length && (
              <div className="empty">Hech qanday to‘lov ma’lumoti topilmadi</div>
            )}
          </div>
        </div>
      )}

      {/* 2-TAB: Qarzdorlar */}
      {activeTab === 'debtors' && (
        <div className="card">
          <div className="table">
            <div className="table-head debtor-head">
              <span>O‘quvchi</span>
              <span>Telefon</span>
              <span>Guruh / Fan</span>
              <span>Oylik Narx</span>
              <span>To‘langan</span>
              <span>Qarzdorlik</span>
              <span>Amal</span>
            </div>
            {debtors.map((s) => (
              <div className="table-row debtor-row" key={s.id}>
                <span className="cell-name">{s.name}</span>
                <span>{s.phone}</span>
                <span>
                  <div>{s.group || 'Guruh belgilanmagan'}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.subject}</div>
                </span>
                <span>{formatMoney(s.fee || 650000)}</span>
                <span>{formatMoney(s.paidAmount || 0)}</span>
                <span className="font-bold text-danger">
                  {formatMoney(s.debt || (s.fee || 650000) - (s.paidAmount || 0))}
                </span>
                <span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setNewPayment({
                        studentId: String(s.id),
                        amount: String(s.debt || (s.fee || 650000) - (s.paidAmount || 0)),
                        method: 'Payme',
                        note: ''
                      })
                      setShowPaymentModal(true)
                    }}
                  >
                    <i className="fas fa-hand-holding-dollar" /> To‘lash
                  </button>
                  <button
                    className="link"
                    style={{ marginLeft: 8 }}
                    onClick={() =>
                      showToast(`📩 ${s.name} ga SMS eslatma muvaffaqiyatli yuborildi!`)
                    }
                  >
                    <i className="fas fa-paper-plane" /> Eslatma
                  </button>
                </span>
              </div>
            ))}
            {!debtors.length && (
              <div className="empty">Ajoyib! Barcha o‘quvchilar to‘lovlarni to‘liq amalga oshirgan! 🎉</div>
            )}
          </div>
        </div>
      )}

      {/* 3-TAB: Xarajatlar */}
      {activeTab === 'expenses' && (
        <div className="card">
          <div className="table">
            <div className="table-head expense-head">
              <span>Xarajat Turi</span>
              <span>Kategoriya</span>
              <span>Sana</span>
              <span>Summa</span>
              <span></span>
            </div>
            {expenses.map((e) => (
              <div className="table-row expense-row" key={e.id}>
                <span className="cell-name">{e.title}</span>
                <span>
                  <span className="chip">{e.category}</span>
                </span>
                <span>{e.date}</span>
                <span className="font-bold text-danger">-{formatMoney(e.amount)}</span>
                <span className="row-actions">
                  <button className="link danger" onClick={() => removeExpense(e.id)}>
                    <i className="fas fa-trash-can" /> O‘chirish
                  </button>
                </span>
              </div>
            ))}
            {!expenses.length && (
              <div className="empty">Hozircha hech qanday xarajat kiritilmagan</div>
            )}
          </div>
        </div>
      )}

      {/* To'lov qabul qilish modali */}
      {showPaymentModal && (
        <div className="modal-backdrop" onClick={() => setShowPaymentModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handlePaymentSubmit}>
            <h3>
              <i className="fas fa-money-bill-wave text-emerald" /> Yangi To‘lov Qabul Qilish
            </h3>

            <label>
              O‘quvchini tanlang
              <select
                required
                value={newPayment.studentId}
                onChange={(e) => {
                  const sId = e.target.value
                  const st = students.find((x) => x.id === Number(sId))
                  setNewPayment({
                    ...newPayment,
                    studentId: sId,
                    amount: st?.debt ? String(st.debt) : st?.fee ? String(st.fee) : '650000'
                  })
                }}
              >
                <option value="">— O‘quvchini tanlang —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.group || s.subject}) {s.debt ? `— Qarz: ${formatMoney(s.debt)}` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label>
              To‘lov Summasi (so‘m)
              <input
                type="number"
                min="1000"
                step="10000"
                required
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                placeholder="Masalan: 700000"
              />
            </label>

            <label>
              To‘lov Usuli
              <select
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              >
                <option value="Payme">Payme</option>
                <option value="Click">Click</option>
                <option value="Naqd">Naqd pul</option>
                <option value="Uzcard/Humo">Uzcard / Humo bank kartasi</option>
              </select>
            </label>

            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setShowPaymentModal(false)}>
                Bekor qilish
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-check" /> To‘lovni Saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Xarajat qo'shish modali */}
      {showExpenseModal && (
        <div className="modal-backdrop" onClick={() => setShowExpenseModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleExpenseSubmit}>
            <h3>
              <i className="fas fa-file-invoice-dollar text-amber" /> Yangi Xarajat Kiritish
            </h3>

            <label>
              Xarajat nomi / maqsadi
              <input
                required
                placeholder="Masalan: Bino ijarasi yoki reklama"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              />
            </label>

            <label>
              Xarajat summasi (so‘m)
              <input
                type="number"
                min="1000"
                step="10000"
                required
                placeholder="Masalan: 1500000"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </label>

            <label>
              Kategoriya
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <option value="Ijara">Ijara</option>
                <option value="Maosh">O‘qituvchi va xodimlar maoshi</option>
                <option value="Marketing">Marketing va Reklama</option>
                <option value="Kommunal">Kommunal va Internet</option>
                <option value="Xo‘jalik">Xo‘jalik va Jihozlar</option>
              </select>
            </label>

            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setShowExpenseModal(false)}>
                Bekor qilish
              </button>
              <button type="submit" className="btn btn-primary">
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kvitansiya (Chek) ko'rish modali */}
      {receiptModal && (
        <div className="modal-backdrop" onClick={() => setReceiptModal(null)}>
          <div className="modal receipt-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-paper">
              <div className="receipt-header">
                <div className="login-logo small" style={{ margin: '0 auto 8px' }}>
                  SL
                </div>
                <h3>STUND LISTEN EDUCATION</h3>
                <p>O‘quv markazi to‘lov cheki</p>
                <div className="receipt-barcode">|||||||||||||||||||||||||||||||||</div>
                <div className="receipt-no">{receiptModal.receiptNo || `#${receiptModal.id}`}</div>
              </div>

              <div className="receipt-divider" />

              <div className="receipt-body">
                <div className="receipt-row">
                  <span>O‘quvchi:</span>
                  <strong>{receiptModal.studentName}</strong>
                </div>
                <div className="receipt-row">
                  <span>Guruh:</span>
                  <span>{receiptModal.groupName}</span>
                </div>
                <div className="receipt-row">
                  <span>Fan:</span>
                  <span>{receiptModal.subject}</span>
                </div>
                <div className="receipt-row">
                  <span>To‘lov usuli:</span>
                  <strong>{receiptModal.method}</strong>
                </div>
                <div className="receipt-row">
                  <span>Sana:</span>
                  <span>{receiptModal.date}</span>
                </div>
                <div className="receipt-divider" />
                <div className="receipt-row total-row">
                  <span>Jami to‘landi:</span>
                  <strong className="text-emerald">{formatMoney(receiptModal.amount)}</strong>
                </div>
                <div className="receipt-row">
                  <span>Holati:</span>
                  <span className="text-emerald">Muvaffaqiyatli to‘langan</span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>To‘lovingiz uchun tashakkur!</p>
                <p>Tel: +998 (71) 200-00-00</p>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <i className="fas fa-print" /> Chop etish
              </button>
              <button className="btn" onClick={() => setReceiptModal(null)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
