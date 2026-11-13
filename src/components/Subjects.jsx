import { formatMoney } from '../data'
import { useLoading, SkeletonCard } from './Skeleton'

const SUBJECT_DETAILS = [
  {
    name: 'Frontend Dasturlash',
    icon: 'fab fa-react',
    desc: 'Zamonaviy veb-saytlar va ilovalar yaratish: HTML, CSS, JavaScript, React, Tailwind CSS va Next.js.',
    color: '#0284c7',
    badge: 'Top Talabgir'
  },
  {
    name: 'Python & AI',
    icon: 'fab fa-python',
    desc: 'Python asoslari, Django backend, REST API, ma’lumotlar bazasi va sun’iy intellekt integratsiyasi.',
    color: '#8b5cf6',
    badge: 'Sun’iy Intellekt'
  },
  {
    name: 'Ingliz tili (IELTS)',
    icon: 'fas fa-language',
    desc: 'General English va IELTS imtihoniga intensive tayyorgarlik (Speaking, Listening, Reading, Writing).',
    color: '#6366f1',
    badge: 'Xalqaro Sertifikat'
  },
  {
    name: 'Grafik Dizayn',
    icon: 'fas fa-pen-nib',
    desc: 'UI/UX dizayn, Figma, Adobe Photoshop, Illustrator yordamida zamonaviy brending va vizuallar.',
    color: '#ec4899',
    badge: 'Kreativ'
  },
  {
    name: 'Matematika',
    icon: 'fas fa-calculator',
    desc: 'Milliy sertifikat, DTM va xalqaro olimpiadalarga tayyorgarlik. Mantiqiy fikrlashni rivojlantirish.',
    color: '#f59e0b',
    badge: 'Fundamental'
  },
  {
    name: 'Rus tili',
    icon: 'fas fa-earth-europe',
    desc: 'Erkin muloqot, grammatika, audio darslar va xalqaro biznes yozishmalariga tayyorgarlik.',
    color: '#10b981',
    badge: 'So‘zlashuv'
  },
  {
    name: 'SMM & Raqamli Marketing',
    icon: 'fas fa-bullhorn',
    desc: 'Instagram, Telegram marketing, Facebook Ads / Target, kopirayting va mobilografiya.',
    color: '#ef4444',
    badge: 'Daromadli'
  },
  {
    name: 'Robototexnika',
    icon: 'fas fa-robot',
    desc: 'Arduino, datchiklar, sxemotexnika, mexanika va avtomatlashtirilgan aqlli tizimlar yaratish.',
    color: '#14b8a6',
    badge: 'Amaliy Texnologiya'
  }
]

export default function Subjects({ groups = [], teachers = [] }) {
  const loading = useLoading(800)

  if (loading) {
    return (
      <div className="page">
        <div className="stats-grid cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} lines={3} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="toolbar" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>O‘quv Markazi Fan Yo‘nalishlari</h2>
        <span className="badge-pill">{SUBJECT_DETAILS.length} ta yo‘nalish</span>
      </div>

      <div className="cards-grid subjects-grid">
        {SUBJECT_DETAILS.map((s) => {
          const gs = groups.filter((g) => g.subject === s.name)
          const ts = teachers.filter((t) => t.subject === s.name)
          const studentCount = gs.reduce((n, g) => n + (g.students?.length || 0), 0)
          const monthlyIncome = gs.reduce(
            (n, g) => n + (g.fee || 650000) * (g.students?.length || 0),
            0
          )

          return (
            <div className="card subject-card" key={s.name}>
              <div className="subject-top-tag" style={{ background: s.color + '22', color: s.color }}>
                {s.badge}
              </div>

              <div className="subject-icon" style={{ background: s.color }}>
                <i className={s.icon} />
              </div>

              <h3>{s.name}</h3>
              <p className="subject-desc">{s.desc}</p>

              <div className="subject-stats">
                <div>
                  <b>{gs.length}</b>
                  <span>guruh</span>
                </div>
                <div>
                  <b>{ts.length}</b>
                  <span>ustoz</span>
                </div>
                <div>
                  <b>{studentCount}</b>
                  <span>o‘quvchi</span>
                </div>
              </div>

              <div className="subject-revenue-box">
                <span className="s-rev-title">Oylik tushum:</span>
                <span className="s-rev-value text-emerald">{formatMoney(monthlyIncome)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
