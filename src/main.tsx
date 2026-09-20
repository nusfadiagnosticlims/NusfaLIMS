import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plus,
  Printer,
  ReceiptIndianRupee,
  Search,
  Settings2,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  Trash2,
  User,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
  X
} from 'lucide-react'
import { supabase } from './lib/supabase'
import './styles.css'

type Page =
  | 'dashboard'
  | 'registration'
  | 'billing'
  | 'bill'
  | 'result'
  | 'referral'
  | 'addReferral'
  | 'patients'
  | 'tests'
  | 'packages'
  | 'analytics'
  | 'users'
  | 'lab'

type ActivityItem = {
  id: number
  name: string
  text: string
  time: string
}

type PatientRecord = {
  id: string
  patient_id: string
  title: string
  first_name: string
  last_name: string
  phone: string
  age: string
  age_mode: 'age' | 'dob'
  gender: string
  address: string
  email: string
}

type BillItem = {
  id: number
  dbId?: string
  serviceId?: string
  name: string
  type: 'Test' | 'Package'
  rate: number
}

type ServiceItem = {
  id: string
  code: string
  name: string
  type: 'Test' | 'Package'
  category: string
  sample: string
  rate: number
  status: 'Active' | 'Inactive'
}

type ResultType =
  | 'Number'
  | 'Decimal'
  | 'Positive / Negative'
  | 'Reactive / Non-Reactive'
  | 'Dropdown'

type TestParameter = {
  id: string
  name: string
  code: string
  unit: string
  resultType: ResultType
  options: string[]
  min: string
  max: string
  referenceText: string
}

type TestParametersMap = Record<string, TestParameter[]>

const initialServices: ServiceItem[] = [
  {
    id: 'TST-001',
    code: 'CBC',
    name: 'CBC (Complete Blood Count)',
    type: 'Test',
    category: 'Hematology',
    sample: 'EDTA Blood',
    rate: 450,
    status: 'Active'
  },
  {
    id: 'TST-002',
    code: 'LFT',
    name: 'Liver Function Test',
    type: 'Test',
    category: 'Biochemistry',
    sample: 'Serum',
    rate: 650,
    status: 'Active'
  },
  {
    id: 'TST-003',
    code: 'KFT',
    name: 'Kidney Function Test',
    type: 'Test',
    category: 'Biochemistry',
    sample: 'Serum',
    rate: 600,
    status: 'Active'
  },
  {
    id: 'TST-004',
    code: 'THY-P',
    name: 'Thyroid Profile',
    type: 'Test',
    category: 'Hormones',
    sample: 'Serum',
    rate: 700,
    status: 'Active'
  },
  {
    id: 'TST-005',
    code: 'HBA1C',
    name: 'HbA1c',
    type: 'Test',
    category: 'Diabetes',
    sample: 'EDTA Blood',
    rate: 500,
    status: 'Active'
  },
  {
    id: 'TST-006',
    code: 'LIPID',
    name: 'Lipid Profile',
    type: 'Test',
    category: 'Biochemistry',
    sample: 'Serum',
    rate: 550,
    status: 'Active'
  },
  {
    id: 'TST-007',
    code: 'VIT-D',
    name: 'Vitamin D',
    type: 'Test',
    category: 'Vitamins',
    sample: 'Serum',
    rate: 900,
    status: 'Active'
  },
  {
    id: 'TST-008',
    code: 'URINE-R',
    name: 'Urine Routine',
    type: 'Test',
    category: 'Clinical Pathology',
    sample: 'Urine',
    rate: 180,
    status: 'Active'
  },
  {
    id: 'PKG-001',
    code: 'FB-BASIC',
    name: 'Full Body Basic',
    type: 'Package',
    category: 'Health Package',
    sample: 'Multiple',
    rate: 2200,
    status: 'Active'
  },
  {
    id: 'PKG-002',
    code: 'EXEC-HP',
    name: 'Executive Health Package',
    type: 'Package',
    category: 'Health Package',
    sample: 'Multiple',
    rate: 3600,
    status: 'Active'
  },
  {
    id: 'PKG-003',
    code: 'DIAB-CARE',
    name: 'Diabetes Care Package',
    type: 'Package',
    category: 'Health Package',
    sample: 'Multiple',
    rate: 1400,
    status: 'Active'
  }
]

const initialTestParameters: TestParametersMap = {
  'TST-001': [
    { id: 'CBC-HB', name: 'Hemoglobin', code: 'HB', unit: 'g/dL', resultType: 'Decimal', options: [], min: '13', max: '17', referenceText: '13–17 g/dL' },
    { id: 'CBC-RBC', name: 'RBC Count', code: 'RBC', unit: 'million/µL', resultType: 'Decimal', options: [], min: '4.5', max: '5.5', referenceText: '4.5–5.5 million/µL' },
    { id: 'CBC-WBC', name: 'Total WBC Count', code: 'WBC', unit: '/µL', resultType: 'Number', options: [], min: '4000', max: '11000', referenceText: '4,000–11,000 /µL' },
    { id: 'CBC-PLT', name: 'Platelet Count', code: 'PLT', unit: '/µL', resultType: 'Number', options: [], min: '150000', max: '450000', referenceText: '150,000–450,000 /µL' },
    { id: 'CBC-NEU', name: 'Neutrophils', code: 'NEU', unit: '%', resultType: 'Decimal', options: [], min: '40', max: '75', referenceText: '40–75 %' },
    { id: 'CBC-LYM', name: 'Lymphocytes', code: 'LYM', unit: '%', resultType: 'Decimal', options: [], min: '20', max: '45', referenceText: '20–45 %' },
    { id: 'CBC-MONO', name: 'Monocytes', code: 'MONO', unit: '%', resultType: 'Decimal', options: [], min: '2', max: '10', referenceText: '2–10 %' },
    { id: 'CBC-EOS', name: 'Eosinophils', code: 'EOS', unit: '%', resultType: 'Decimal', options: [], min: '1', max: '6', referenceText: '1–6 %' },
    { id: 'CBC-BASO', name: 'Basophils', code: 'BASO', unit: '%', resultType: 'Decimal', options: [], min: '0', max: '2', referenceText: '0–2 %' }
  ]
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    name: 'Ananya Sharma',
    text: 'Patient registration successful',
    time: 'Just now'
  },
  {
    id: 2,
    name: 'Rohit Kumar',
    text: 'Bill #NSF-1042 created',
    time: '12 min ago'
  },
  {
    id: 3,
    name: 'Meera Singh',
    text: 'Report marked as completed',
    time: '28 min ago'
  },
  {
    id: 4,
    name: 'Arjun Verma',
    text: 'Patient registration successful',
    time: '46 min ago'
  }
]

const initialBills = [
  {
    id: 'NSF-1042',
    name: 'Rohit Kumar',
    amount: 1250,
    status: 'Paid'
  },
  {
    id: 'NSF-1041',
    name: 'Meera Singh',
    amount: 600,
    status: 'Due ₹150'
  },
  {
    id: 'NSF-1040',
    name: 'Arjun Verma',
    amount: 2200,
    status: 'Paid'
  }
]

function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="brand">
      <img src="/logo.svg" />
      <div className={collapsed ? 'hide-mobile' : ''}>
        <b>Nusfa</b>
        <span>LIMS</span>
      </div>
    </div>
  )
}

function Sidebar({
  page,
  setPage,
  collapsed,
  setCollapsed
}: {
  page: Page
  setPage: (p: Page) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {
  const nav = [
    { p: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { p: 'registration' as Page, label: 'New Registration', icon: UserPlus },
    { p: 'patients' as Page, label: 'Patients', icon: Users },
    { p: 'tests' as Page, label: 'Tests', icon: TestTube2 },
    { p: 'packages' as Page, label: 'Packages', icon: Package },
    { p: 'referral' as Page, label: 'Referral', icon: Stethoscope },
    { p: 'analytics' as Page, label: 'Business Analytics', icon: BarChart3 },
    { p: 'users' as Page, label: 'User Management', icon: UserCog },
    { p: 'lab' as Page, label: 'Lab Management', icon: Building2 }
  ]

  return (
    <aside className={'sidebar ' + (collapsed ? 'collapsed' : '')}>
      <div className="side-top">
        <Logo collapsed={collapsed} />

        <button
          className="icon-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <nav>
        {nav.map(({ p, label, icon: Icon }) => (
          <button
            key={p}
            className={'nav-item ' + (page === p ? 'active' : '')}
            onClick={() => setPage(p)}
            title={collapsed ? label : ''}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="side-spacer" />

      <div className="support-card">
        <ShieldCheck />
        <div>
          <b>Secure workspace</b>
          <small>Your lab data stays protected</small>
        </div>
      </div>

      <button className="nav-item logout" onClick={() => void supabase.auth.signOut()}>
        <LogOut />
        <span>Logout</span>
      </button>
    </aside>
  )
}

function Header({
  page,
  setPage
}: {
  page: Page
  setPage: (p: Page) => void
}) {
  const labels: Record<Page, string> = {
    dashboard: 'Dashboard',
    registration: 'New Registration',
    billing: 'Billing',
    bill: 'Bill Preview',
    result: 'Enter Result',
    referral: 'Referral',
    addReferral: 'Add Referral',
    patients: 'Patients',
    tests: 'Tests',
    packages: 'Packages',
    analytics: 'Business Analytics',
    users: 'User Management',
    lab: 'Lab Management'
  }

  return (
    <header className="topbar">
      <div className="mobile-logo">
        <Logo />
      </div>

      <div className="crumb">
        <span>Workspace</span>
        <ChevronDown />
        <b>{labels[page]}</b>
      </div>

      <div className="top-actions">
        <div className="global-search">
          <Search />
          <input placeholder="Search patient, ID, phone…" />
        </div>

        <button className="icon-btn notif">
          <Bell />
          <i />
        </button>

        <div className="profile">
          <div className="avatar">SA</div>
          <div className="profile-text">
            <b>Saleem Ahmed</b>
            <span>Administrator</span>
          </div>
          <ChevronDown />
        </div>
      </div>
    </header>
  )
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  tone,
  onClick
}: {
  title: string
  value: string
  sub: string
  icon: any
  tone: string
  onClick?: () => void
}) {
  return (
    <button className="stat-card" onClick={onClick}>
      <div className="stat-head">
        <span>{title}</span>
        <div className={'stat-icon ' + tone}>
          <Icon />
        </div>
      </div>

      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>

      <div className="card-arrow">
        <ArrowRight />
      </div>
    </button>
  )
}

function Dashboard({
  setPage,
  activities,
  bills,
  stats,
  onViewBill
}: {
  setPage: (p: Page) => void
  activities: ActivityItem[]
  bills: any[]
  stats: {
    registrationsToday: number
    ongoingReports: number
    completedThisMonth: number
    reportsArchive: number
  }
  onViewBill: (id: string) => void
}) {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">GOOD MORNING, SALEEM</p>
          <h1>Lab overview</h1>
          <p>Everything important from your laboratory, in one place.</p>
        </div>

        <div className="date-chip">
          <CalendarDays /> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="New Registration"
          value={String(stats.registrationsToday)}
          sub="Patients today"
          icon={UserPlus}
          tone="blue"
          onClick={() => setPage('registration')}
        />

        <StatCard
          title="Ongoing Report"
          value={String(stats.ongoingReports)}
          sub="Awaiting results"
          icon={Clock3}
          tone="amber"
          onClick={() => setPage('tests')}
        />

        <StatCard
          title="Completed Report"
          value={String(stats.completedThisMonth)}
          sub="This month"
          icon={FileCheck2}
          tone="green"
          onClick={() => setPage('tests')}
        />

        <StatCard
          title="Find Reports"
          value={String(stats.reportsArchive)}
          sub="Reports in archive"
          icon={Search}
          tone="violet"
          onClick={() => setPage('tests')}
        />
      </div>

      <div className="section-grid">
        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Recent activities</h2>
              <p>Latest actions across your lab</p>
            </div>

            <button className="text-btn">
              View all <ArrowRight />
            </button>
          </div>

          <div className="activity-list">
            {activities.map((a, i) => (
              <div className="activity" key={a.id}>
                <div
                  className={
                    'activity-icon ' +
                    ['blue', 'green', 'violet', 'amber'][i % 4]
                  }
                >
                  <Check />
                </div>

                <div>
                  <b>{a.name}</b>
                  <span>{a.text}</span>
                </div>

                <time>{a.time}</time>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Recent bills</h2>
              <p>Latest billing activity</p>
            </div>

            <button className="text-btn">
              View all <ArrowRight />
            </button>
          </div>

          <div className="bill-list">
            {bills.map((b: any) => (
              <div className="bill-row" key={b.id}>
                <div className="bill-icon">
                  <ReceiptIndianRupee />
                </div>

                <div className="bill-meta">
                  <b>{b.name}</b>
                  <span>{b.id}</span>
                </div>

                <div className="bill-amount">
                  <b>₹{b.amount.toLocaleString('en-IN')}</b>
                  <span className={b.status === 'Paid' ? 'paid' : 'due'}>
                    {b.status}
                  </span>
                </div>

                <button
                  className="mini-btn"
                  onClick={() => onViewBill(b.id)}
                >
                  View
                </button>

                <button className="mini-icon">
                  <Download />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="quick-strip">
        <div>
          <div className="quick-icon">
            <FlaskConical />
          </div>

          <div>
            <b>Lab operations</b>
            <span>
              Sample collection, testing and reporting are running normally.
            </span>
          </div>
        </div>

        <span className="online">
          <i /> All systems operational
        </span>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = 'text',
  right
}: {
  label: string
  required?: boolean
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  right?: React.ReactNode
}) {
  return (
    <label className="field">
      <span>
        {label} {required && <em>*</em>}
      </span>

      <div className="field-wrap">
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
        {right}
      </div>
    </label>
  )
}

function Registration({
  setPage,
  onRegistered
}: {
  setPage: (p: Page) => void
  onRegistered: (a: ActivityItem) => void
}) {
  const [phone, setPhone] = useState('')
  const [title, setTitle] = useState('Mr.')
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [age, setAge] = useState('')
  const [ageMode, setAgeMode] = useState<'age' | 'dob'>('age')
  const [gender, setGender] = useState('Male')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [patientId, setPatientId] = useState('')
  const [found, setFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const lookup = async () => {
    const cleanPhone = phone.trim()
    if (cleanPhone.length < 10) {
      alert('Please enter a valid mobile number.')
      return
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (error) {
      alert(`Patient lookup failed: ${error.message}`)
      return
    }

    if (data) {
      const p = data as PatientRecord
      setPatientId(p.patient_id || '')
      setTitle(p.title || 'Mr.')
      setFirst(p.first_name || '')
      setLast(p.last_name || '')
      setAge(p.age || '')
      setAgeMode(p.age_mode === 'dob' ? 'dob' : 'age')
      setGender(p.gender || 'Male')
      setAddress(p.address || '')
      setEmail(p.email || '')
      setFound(true)
    } else {
      setPatientId('')
      setFound(false)
      alert('No patient found. You can register this number as a new patient.')
    }
  }

  useEffect(() => {
    if (['Mrs.', 'Miss.', 'Ms.'].includes(title)) {
      setGender('Female')
    } else if (title === 'Mr.') {
      setGender('Male')
    }
  }, [title])

  const go = async () => {
    const cleanPhone = phone.trim()
    const cleanFirst = first.trim()
    if (!cleanPhone || !cleanFirst) {
      alert('Please enter Mobile Number and First Name.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        patient_id: patientId || '',
        title,
        first_name: cleanFirst,
        last_name: last.trim(),
        phone: cleanPhone,
        age: age.trim(),
        age_mode: ageMode,
        gender,
        address: address.trim(),
        email: email.trim()
      }

      const { data, error } = await supabase
        .from('patients')
        .upsert(payload, { onConflict: 'patient_id' })
        .select('*')
        .single()

      if (error) {
        // New patients have an empty patient_id so the trigger generates it.
        // If the empty value conflicts with a strict unique setup, retry without
        // sending patient_id.
        const retry = await supabase
          .from('patients')
          .insert({
            title,
            first_name: cleanFirst,
            last_name: last.trim(),
            phone: cleanPhone,
            age: age.trim(),
            age_mode: ageMode,
            gender,
            address: address.trim(),
            email: email.trim()
          })
          .select('*')
          .single()

        if (retry.error) {
          alert(`Patient save failed: ${retry.error.message}`)
          return
        }

        await finishRegistration(retry.data as PatientRecord)
        return
      }

      await finishRegistration(data as PatientRecord)
    } finally {
      setSaving(false)
    }
  }

  const finishRegistration = async (patient: PatientRecord) => {
    const activity: ActivityItem = {
      id: Date.now(),
      name: `${patient.first_name} ${patient.last_name}`.trim(),
      text: 'Patient registration successful',
      time: 'Just now'
    }

    localStorage.setItem('nusfaPatient', JSON.stringify({
      id: patient.id,
      patientId: patient.patient_id,
      phone: patient.phone,
      title: patient.title,
      first: patient.first_name,
      last: patient.last_name,
      age: patient.age,
      ageMode: patient.age_mode,
      gender: patient.gender,
      address: patient.address,
      email: patient.email
    }))

    onRegistered(activity)
    setPage('billing')
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">PATIENT INTAKE</p>
          <h1>New registration</h1>
          <p>Create a patient record and continue directly to billing.</p>
        </div>

        <div className="stepper">
          <span className="done">1</span><i /><span className="current">2</span><i /><span>3</span>
        </div>
      </div>

      <section className="form-panel">
        <div className="form-section-head">
          <div>
            <h2>Patient information</h2>
            <p>Enter the patient's mobile number first to find an existing record.</p>
          </div>
          <span className="required-note"><em>*</em> Required</span>
        </div>

        <div className="phone-search">
          <Field
            label="Mobile Number"
            required
            value={phone}
            onChange={v => { setPhone(v); setFound(false) }}
            placeholder="+91 98765 43210"
            type="tel"
          />
          <button className="primary-btn lookup" onClick={lookup} disabled={saving}>
            <Search /> Find patient
          </button>
        </div>

        {found && (
          <div className="found-banner">
            <div className="found-check"><Check /></div>
            <div>
              <b>Patient record found · {patientId}</b>
              <span>Existing details have been loaded. You can review and update them.</span>
            </div>
            <button onClick={() => setFound(false)}><X /></button>
          </div>
        )}

        <div className="divider"><span>Personal details</span></div>

        <div className="form-grid four">
          <label className="field">
            <span>Title</span>
            <div className="field-wrap">
              <input list="titles" value={title} onChange={e => setTitle(e.target.value)} placeholder="Select or type title" />
              <datalist id="titles">
                {['Mr.','Mrs.','Miss.','Ms.','Dr.','Prof.','Er.','Adv.','Mx.','Rev.','Sir','Madam','Baby','Master'].map(x => <option key={x}>{x}</option>)}
              </datalist>
            </div>
          </label>

          <Field label="First Name" required value={first} onChange={setFirst} placeholder="Enter first name" />
          <Field label="Last Name" value={last} onChange={setLast} placeholder="Enter last name" />

          <div className="field">
            <span>Age / Date of birth</span>
            <div className="age-wrap">
              <input value={age} onChange={e => setAge(e.target.value)} placeholder={ageMode === 'age' ? 'e.g. 32' : 'DD/MM/YYYY'} />
              <button onClick={() => setAgeMode(ageMode === 'age' ? 'dob' : 'age')}>{ageMode === 'age' ? 'DOB' : 'Age'}</button>
            </div>
          </div>
        </div>

        <div className="form-grid three">
          <div className="field">
            <span>Gender <em>*</em></span>
            <div className="segmented">
              {['Male','Female','Trans'].map(g => (
                <button key={g} className={gender === g ? 'selected' : ''} onClick={() => setGender(g)}>
                  <span className="radio" />{g}
                </button>
              ))}
            </div>
          </div>

          <Field label="Address" value={address} onChange={setAddress} placeholder="Street, locality, city" />
          <Field label="Email" value={email} onChange={setEmail} placeholder="patient@example.com" type="email" />
        </div>

        <div className="form-footer">
          <button className="secondary-btn" onClick={() => setPage('dashboard')}>Cancel</button>
          <button className="primary-btn" onClick={go} disabled={saving}>
            {saving ? 'Saving…' : <>Go to billing <ArrowRight /></>}
          </button>
        </div>
      </section>
    </div>
  )
}

function Billing({
  setPage,
  onBill,
  services
}: {
  setPage: (p: Page) => void
  onBill: (b: any) => void
  services: ServiceItem[]
}) {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<BillItem[]>([])
  const [discount, setDiscount] = useState('')
  const [discountMode, setDiscountMode] = useState<'amount' | 'percent'>('amount')
  const [by, setBy] = useState('Lab')
  const [paid, setPaid] = useState('')
  const [creating, setCreating] = useState(false)

  const patient = JSON.parse(localStorage.getItem('nusfaPatient') || '{}')

  const matches = useMemo(
    () =>
      q
        ? services.filter(
            x =>
              x.status === 'Active' &&
              (
                x.name.toLowerCase().includes(q.toLowerCase()) ||
                x.code.toLowerCase().includes(q.toLowerCase()) ||
                x.category.toLowerCase().includes(q.toLowerCase())
              )
          )
        : [],
    [q, services]
  )

  const subtotal = items.reduce((s, x) => s + x.rate, 0)
  const discountAmount =
    discountMode === 'amount'
      ? Number(discount || 0)
      : subtotal * (Number(discount || 0) / 100)
  const final = Math.max(0, subtotal - discountAmount)
  const due = Math.max(0, final - Number(paid || 0))

  const add = (x: ServiceItem) => {
    setItems(prev =>
      prev.some(i => i.serviceId === x.id || i.name === x.name)
        ? prev
        : [...prev, { id: Date.now(), serviceId: x.id, name: x.name, type: x.type, rate: x.rate }]
    )
    setQ('')
  }

  const create = async () => {
    if (!patient?.id) {
      alert('No saved patient selected. Please register/select a patient first.')
      setPage('registration')
      return
    }
    if (!items.length) {
      alert('Please add at least one test or package.')
      return
    }

    const numericPaid = Number(paid || 0)
    const paymentStatus = due <= 0 ? 'Paid' : numericPaid > 0 ? 'Partial' : 'Due'
    setCreating(true)

    try {
      const billId = `NSF-${Date.now().toString().slice(-8)}`
      const { data: savedBill, error: billError } = await supabase
        .from('bills')
        .insert({
          id: billId,
          patient_id: patient.id,
          subtotal,
          discount_amount: discountAmount,
          discount,
          discount_mode: discountMode,
          referred_by: by,
          final_amount: final,
          paid: numericPaid,
          due,
          payment_status: paymentStatus,
          report_status: 'Pending'
        })
        .select('*')
        .single()

      if (billError) {
        alert(`Bill save failed: ${billError.message}`)
        return
      }

      const billItemRows = items.map(item => ({
        bill_id: billId,
        test_id: item.serviceId,
        name: item.name,
        type: item.type,
        rate: item.rate
      }))

      const { data: savedItems, error: itemError } = await supabase
        .from('bill_items')
        .insert(billItemRows)
        .select('*')

      if (itemError) {
        await supabase.from('bills').delete().eq('id', billId)
        alert(`Bill items save failed: ${itemError.message}`)
        return
      }

      const mappedItems: BillItem[] = items.map((item, index) => ({
        ...item,
        dbId: savedItems?.[index]?.id
      }))

      onBill({
        id: savedBill.id,
        patient,
        items: mappedItems,
        subtotal: Number(savedBill.subtotal),
        discountAmount: Number(savedBill.discount_amount),
        discount: savedBill.discount,
        discountMode: savedBill.discount_mode,
        by: savedBill.referred_by,
        final: Number(savedBill.final_amount),
        paid: Number(savedBill.paid),
        due: Number(savedBill.due),
        createdAt: savedBill.created_at
      })
      setPage('bill')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">BILLING</p>
          <h1>Create bill</h1>
          <p>Add tests or packages, apply discounts and record payment.</p>
        </div>
        <div className="patient-pill">
          <User />
          <span>{patient.first || 'New patient'} {patient.last || ''}</span>
          <small>{patient.patientId || patient.phone || 'No patient ID'}</small>
        </div>
      </div>

      <div className="billing-layout">
        <section className="form-panel">
          <div className="form-section-head">
            <div><h2>Tests & packages</h2><p>Search and add one or multiple services.</p></div>
            <span className="count-badge">{items.length} selected</span>
          </div>

          <div className="search-service">
            <Search />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search test or package name…" />
            <span>⌘ K</span>
          </div>

          {matches.length > 0 && (
            <div className="search-results">
              {matches.map(x => (
                <button key={x.id} onClick={() => add(x)}>
                  <div><b>{x.name}</b><span>{x.code} · {x.type}</span></div>
                  <strong>₹{x.rate.toLocaleString('en-IN')}</strong><Plus />
                </button>
              ))}
            </div>
          )}

          <div className="selected-list">
            {items.length === 0 ? (
              <div className="empty-service"><FlaskConical /><b>No tests added yet</b><span>Search above to add tests or packages.</span></div>
            ) : (
              items.map((x, i) => (
                <div className="selected-row" key={x.id}>
                  <div className="number">{i + 1}</div>
                  <div><b>{x.name}</b><span>{x.type}</span></div>
                  <strong>₹{x.rate.toLocaleString('en-IN')}</strong>
                  <button onClick={() => setItems(prev => prev.filter(y => y.id !== x.id))}><Trash2 /></button>
                </div>
              ))
            )}
          </div>

          <div className="summary-card">
            <div className="summary-line"><span>Subtotal</span><b>₹{subtotal.toLocaleString('en-IN')}</b></div>
            <div className="summary-line"><span>Discount</span><b className="discount">− ₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></div>
            <div className="summary-total"><span>Total amount</span><strong>₹{final.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div>
          </div>
        </section>

        <section className="form-panel payment-panel">
          <div className="form-section-head">
            <div><h2>Payment</h2><p>Apply discount and capture payment.</p></div>
            <WalletCards />
          </div>

          <div className="discount-grid">
            <div className="field">
              <span>Discount</span>
              <div className="toggle-input">
                <input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" />
                <button className={discountMode === 'amount' ? 'active' : ''} onClick={() => setDiscountMode('amount')}>₹</button>
                <button className={discountMode === 'percent' ? 'active' : ''} onClick={() => setDiscountMode('percent')}>%</button>
              </div>
            </div>

            <label className="field">
              <span>Discounted by</span>
              <div className="field-wrap">
                <select value={by} onChange={e => setBy(e.target.value)}>
                  <option>Hospital</option><option>Lab</option><option>Clinic</option><option>Others</option>
                </select>
                <ChevronDown />
              </div>
            </label>
          </div>

          <div className="pay-total"><span>Amount after discount</span><strong>₹{final.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div>

          <Field label="Paid Amount" value={paid} onChange={setPaid} placeholder="Enter amount received" type="number" right={<span className="input-prefix">₹</span>} />

          <div className="due-card">
            <div><span>Due amount</span><small>Outstanding balance</small></div>
            <strong>₹{due.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
          </div>

          <div className="form-footer">
            <button className="secondary-btn" onClick={() => setPage('registration')}><ArrowLeft /> Back</button>
            <button className="primary-btn" onClick={create} disabled={creating}>{creating ? 'Saving…' : <>Create bill <FileText /></>}</button>
          </div>
        </section>
      </div>
    </div>
  )
}

function BillPreview({
  setPage,
  bill
}: {
  setPage: (p: Page) => void
  bill: any
}) {
  if (!bill) {
    return (
      <div className="page">
        <div className="empty-state">
          <ReceiptIndianRupee />
          <h2>No bill selected</h2>

          <button
            className="primary-btn"
            onClick={() => setPage('registration')}
          >
            New registration
          </button>
        </div>
      </div>
    )
  }

  const patient = bill.patient || {}

  const whatsapp = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Nusfa LIMS Bill ${bill.id} for ${
          patient.first || 'Patient'
        } — Total ₹${bill.final}, Paid ₹${bill.paid}, Due ₹${bill.due}`
      )}`,
      '_blank'
    )

  return (
    <div className="page bill-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">BILL GENERATED</p>
          <h1>Bill preview</h1>
          <p>
            Review the generated invoice before sending it to the
            patient.
          </p>
        </div>

        <span className="success-chip">
          <Check /> Created successfully
        </span>
      </div>

      <section className="preview-shell">
        <div className="invoice">
          <div className="invoice-head">
            <div className="invoice-brand">
              <img src="/logo.svg" />

              <div>
                <b>Nusfa LIMS</b>
                <span>
                  Laboratory Information Management System
                </span>
              </div>
            </div>

            <div className="invoice-no">
              <span>Bill ID</span>
              <b>{bill.id}</b>
              <small>{new Date(bill.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
            </div>
          </div>

          <div className="invoice-rule" />

          <div className="patient-invoice">
            <div>
              <span>Bill to</span>
              <b>
                {patient.title || 'Mr.'} {patient.first || 'Patient'}{' '}
                {patient.last || ''}
              </b>
              <small>
                {patient.phone || '—'}{' '}
                {patient.email ? `• ${patient.email}` : ''}
              </small>
            </div>

            <div>
              <span>Payment status</span>
              <b
                className={
                  bill.due ? 'invoice-due' : 'invoice-paid'
                }
              >
                {bill.due ? 'PARTIALLY PAID' : 'PAID'}
              </b>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Type</th>
                <th>Rate</th>
              </tr>
            </thead>

            <tbody>
              {bill.items.map(
                (x: BillItem, i: number) => (
                  <tr key={x.id}>
                    <td>{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <b>{x.name}</b>
                    </td>
                    <td>{x.type}</td>
                    <td>
                      ₹{x.rate.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div className="invoice-bottom">
            <div className="invoice-note">
              <b>
                Thank you for choosing Nusfa Diagnostics.
              </b>

              <span>
                This is a computer-generated bill and does not
                require a signature.
              </span>
            </div>

            <div className="invoice-totals">
              <div>
                <span>Subtotal</span>
                <b>
                  ₹{bill.subtotal.toLocaleString('en-IN')}
                </b>
              </div>

              <div>
                <span>Discount</span>
                <b>
                  − ₹
                  {bill.discountAmount.toLocaleString(
                    'en-IN',
                    {
                      maximumFractionDigits: 0
                    }
                  )}
                </b>
              </div>

              <div className="grand">
                <span>Total</span>
                <strong>
                  ₹
                  {bill.final.toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}
                </strong>
              </div>

              <div>
                <span>Paid</span>
                <b>
                  ₹{bill.paid.toLocaleString('en-IN')}
                </b>
              </div>

              <div className="due">
                <span>Due</span>
                <strong>
                  ₹{bill.due.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="bill-actions">
          <button
            className="action-card"
            onClick={() => setPage('result')}
          >
            <FileCheck2 />
            <b>Enter Result</b>
            <span>Add or verify patient results</span>
          </button>

          <button
            className="action-card"
            onClick={() => window.print()}
          >
            <Printer />
            <b>Download / Print</b>
            <span>Print this bill or save as PDF</span>
          </button>

          <button
            className="action-card"
            onClick={whatsapp}
          >
            <MessageCircle />
            <b>WhatsApp</b>
            <span>Share bill summary</span>
          </button>

          <button
            className="action-card close"
            onClick={() => setPage('dashboard')}
          >
            <X />
            <b>Close</b>
            <span>Return to dashboard</span>
          </button>
        </div>
      </section>
    </div>
  )
}

function Referral({
  setPage
}: {
  setPage: (p: Page) => void
}) {
  /*
   * IMPORTANT:
   * Explicit type added here.
   * This fixes the Vercel TS2322 error caused by
   * Icon/target being inferred as a mixed union.
   */
  const cards: Array<{
    title: string
    sub: string
    Icon: React.ElementType
    target: Page
  }> = [
    {
      title: 'Add Referral',
      sub: 'Register a new doctor or clinic',
      Icon: UserPlus,
      target: 'addReferral'
    },
    {
      title: 'Update Referral Record',
      sub: 'Edit existing referral partners',
      Icon: Settings2,
      target: 'referral'
    },
    {
      title: 'Referral Report',
      sub: 'Track commissions and referrals',
      Icon: FileText,
      target: 'referral'
    },
    {
      title: 'Manage Referral',
      sub: 'Search and manage all partners',
      Icon: Users,
      target: 'referral'
    }
  ]

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">PARTNER NETWORK</p>
          <h1>Referral</h1>
          <p>
            Manage referring doctors, clinics and commission activity.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setPage('addReferral')}
        >
          <Plus /> Add referral
        </button>
      </div>

      <div className="referral-grid">
        {cards.map(({ title, sub, Icon, target }) => (
          <button
            className="ref-card"
            key={title}
            onClick={() => setPage(target)}
          >
            <div className="ref-icon">
              <Icon />
            </div>

            <div>
              <b>{title}</b>
              <span>{sub}</span>
            </div>

            <ArrowRight />
          </button>
        ))}
      </div>

      <div className="section-grid">
        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Recent referral activities</h2>
              <p>Realtime partner activity</p>
            </div>

            <span className="live">
              <i /> Live
            </span>
          </div>

          <div className="activity-list">
            <div className="activity">
              <div className="activity-icon green">
                <Check />
              </div>

              <div>
                <b>Dr. Amit Sharma</b>
                <span>Referral partner added successfully</span>
              </div>

              <time>4 min ago</time>
            </div>

            <div className="activity">
              <div className="activity-icon blue">
                <Activity />
              </div>

              <div>
                <b>City Care Hospital</b>
                <span>3 patients referred today</span>
              </div>

              <time>22 min ago</time>
            </div>

            <div className="activity">
              <div className="activity-icon amber">
                <CircleDollarSign />
              </div>

              <div>
                <b>Dr. Priya Singh</b>
                <span>Commission transaction recorded</span>
              </div>

              <time>1 hr ago</time>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Recent referral transactions</h2>
              <p>Latest commission activity</p>
            </div>

            <button className="text-btn">
              View report <ArrowRight />
            </button>
          </div>

          <div className="transaction-list">
            <div>
              <span className="tx-dot" />

              <div>
                <b>Dr. Amit Sharma</b>
                <small>12 referrals</small>
              </div>

              <strong>₹2,850</strong>
            </div>

            <div>
              <span className="tx-dot" />

              <div>
                <b>City Care Hospital</b>
                <small>8 referrals</small>
              </div>

              <strong>₹1,920</strong>
            </div>

            <div>
              <span className="tx-dot" />

              <div>
                <b>Dr. Priya Singh</b>
                <small>5 referrals</small>
              </div>

              <strong>₹1,150</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function AddReferral({
  setPage
}: {
  setPage: (p: Page) => void
}) {
  const [form, setForm] = useState({
    name: '',
    hospital: '',
    mobile: '',
    email: '',
    address: '',
    commission: ''
  })

  const set = (k: string, v: string) =>
    setForm({ ...form, [k]: v })

  const save = () => {
    if (!form.name || !form.commission) {
      alert('Doctor name and commission are required.')
      return
    }

    alert('Referral saved successfully.')
    setPage('referral')
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">REFERRAL PARTNER</p>
          <h1>Add referral</h1>
          <p>
            Create a professional referral partner record.
          </p>
        </div>
      </div>

      <section className="form-panel narrow">
        <div className="form-section-head">
          <div>
            <h2>Referral details</h2>
            <p>
              Fields marked with an asterisk are mandatory.
            </p>
          </div>
        </div>

        <div className="form-grid two">
          <Field
            label="Doctor's Name"
            required
            value={form.name}
            onChange={v => set('name', v)}
            placeholder="Enter doctor's name"
          />

          <Field
            label="Hospital / Clinic Name"
            value={form.hospital}
            onChange={v => set('hospital', v)}
            placeholder="Hospital or clinic"
          />

          <Field
            label="Mobile Number"
            value={form.mobile}
            onChange={v => set('mobile', v)}
            placeholder="+91 98765 43210"
          />

          <Field
            label="Email"
            value={form.email}
            onChange={v => set('email', v)}
            placeholder="doctor@example.com"
            type="email"
          />
        </div>

        <div className="form-grid two">
          <Field
            label="Address"
            value={form.address}
            onChange={v => set('address', v)}
            placeholder="Full address"
          />

          <Field
            label="Commission %"
            required
            value={form.commission}
            onChange={v => set('commission', v)}
            placeholder="e.g. 10"
            type="number"
            right={<Percent />}
          />
        </div>

        <div className="form-footer">
          <button
            className="secondary-btn"
            onClick={() => setPage('referral')}
          >
            <ArrowLeft /> Back
          </button>

          <button
            className="primary-btn"
            onClick={save}
          >
            <Check /> Save referral
          </button>
        </div>
      </section>
    </div>
  )
}


function TestsPage({
  services,
  setServices,
  parameters,
  setParameters,
  setPage
}: {
  services: ServiceItem[]
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>
  parameters: TestParametersMap
  setParameters: React.Dispatch<React.SetStateAction<TestParametersMap>>
  setPage: (p: Page) => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [parameterDrafts, setParameterDrafts] = useState<TestParameter[]>([])
  const [form, setForm] = useState({ code: '', name: '', category: 'Hematology', sample: 'Serum', rate: '', status: 'Active' as 'Active' | 'Inactive' })
  const [saving, setSaving] = useState(false)

  const testsOnly = services.filter(x => x.type === 'Test')
  const categories = Array.from(new Set(testsOnly.map(x => x.category))).sort()
  const filteredTests = testsOnly.filter(test => {
    const q = query.trim().toLowerCase()
    return (!q || test.name.toLowerCase().includes(q) || test.code.toLowerCase().includes(q) || test.category.toLowerCase().includes(q)) &&
      (category === 'All' || test.category === category) &&
      (status === 'All' || test.status === status)
  })
  const activeCount = testsOnly.filter(x => x.status === 'Active').length
  const inactiveCount = testsOnly.filter(x => x.status === 'Inactive').length

  const blankParameter = (): TestParameter => ({
    id: `PARAM-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '', code: '', unit: '', resultType: 'Number', options: [], min: '', max: '', referenceText: ''
  })

  const resetForm = () => {
    setForm({ code: '', name: '', category: 'Hematology', sample: 'Serum', rate: '', status: 'Active' })
    setEditingId(null)
    setParameterDrafts([])
  }

  const openAdd = () => { resetForm(); setShowForm(true) }

  const openEdit = (test: ServiceItem) => {
    setEditingId(test.id)
    setForm({ code: test.code, name: test.name, category: test.category, sample: test.sample, rate: String(test.rate), status: test.status })
    setParameterDrafts((parameters[test.id] || []).map(x => ({ ...x, options: [...x.options] })))
    setShowForm(true)
  }

  const saveTest = async () => {
    const name = form.name.trim()
    const code = form.code.trim().toUpperCase()
    const rate = Number(form.rate)
    if (!name || !code || !form.category || !form.sample || rate <= 0) {
      alert('Please fill Test Code, Test Name, Category, Sample Type and Price.')
      return
    }

    const duplicate = testsOnly.some(item => item.id !== editingId && item.code.toLowerCase() === code.toLowerCase())
    if (duplicate) { alert('A test with this code already exists.'); return }

    setSaving(true)
    try {
      const savedId = editingId || `TST-${Date.now()}`
      const testRow = {
        id: savedId,
        code,
        name,
        type: 'Test',
        category: form.category,
        sample: form.sample,
        rate,
        status: form.status
      }

      const { data: savedTest, error } = await supabase.from('tests').upsert(testRow).select('*').single()
      if (error) {
        alert(`Test save failed: ${error.message}`)
        return
      }

      const cleanParams = parameterDrafts
        .filter(p => p.name.trim())
        .map((p, index) => ({
          id: p.id,
          test_id: savedId,
          name: p.name.trim(),
          code: p.code.trim().toUpperCase(),
          unit: p.unit.trim(),
          result_type: p.resultType,
          options: p.options.filter(Boolean),
          min_value: p.min,
          max_value: p.max,
          reference_text: p.referenceText,
          sort_order: index + 1
        }))

      if (cleanParams.length) {
        const { error: paramError } = await supabase.from('test_parameters').upsert(cleanParams)
        if (paramError) {
          alert(`Test saved but parameters failed: ${paramError.message}`)
          return
        }
      }

      if (editingId) {
        const keepIds = cleanParams.map(p => p.id)
        if (keepIds.length) {
          await supabase.from('test_parameters').delete().eq('test_id', savedId).not('id', 'in', `(${keepIds.join(',')})`)
        } else {
          await supabase.from('test_parameters').delete().eq('test_id', savedId)
        }
      }

      setServices(prev => {
        const next: ServiceItem = {
          id: savedTest.id,
          code: savedTest.code,
          name: savedTest.name,
          type: savedTest.type,
          category: savedTest.category,
          sample: savedTest.sample,
          rate: Number(savedTest.rate),
          status: savedTest.status
        }
        return editingId ? prev.map(item => item.id === editingId ? next : item) : [...prev, next]
      })
      setParameters(prev => ({ ...prev, [savedId]: parameterDrafts.filter(p => p.name.trim()).map(p => ({ ...p, name: p.name.trim(), code: p.code.trim().toUpperCase(), options: p.options.filter(Boolean) })) }))
      setShowForm(false)
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const deleteTest = async (id: string) => {
    const test = services.find(x => x.id === id)
    if (!test) return
    if (!window.confirm(`Delete "${test.name}"?`)) return

    const { error } = await supabase.from('tests').delete().eq('id', id)
    if (error) { alert(`Delete failed: ${error.message}`); return }
    setServices(prev => prev.filter(item => item.id !== id))
    setParameters(prev => { const next = { ...prev }; delete next[id]; return next })
  }

  const toggleStatus = async (id: string) => {
    const test = services.find(x => x.id === id)
    if (!test) return
    const nextStatus = test.status === 'Active' ? 'Inactive' : 'Active'
    const { error } = await supabase.from('tests').update({ status: nextStatus }).eq('id', id)
    if (error) { alert(`Status update failed: ${error.message}`); return }
    setServices(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item))
  }

  const addParameter = () => setParameterDrafts(prev => [...prev, blankParameter()])
  const removeParameter = (id: string) => setParameterDrafts(prev => prev.filter(p => p.id !== id))
  const updateParameter = (id: string, patch: Partial<TestParameter>) => setParameterDrafts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  const updateOptions = (id: string, value: string) => updateParameter(id, { options: value.split(',').map(x => x.trim()).filter(Boolean) })

  return (
    <div className="page">
      <div className="page-intro">
        <div><p className="eyebrow">LAB CATALOGUE</p><h1>Tests</h1><p>Manage tests and the exact parameters used during result entry.</p></div>
        <button className="primary-btn" onClick={openAdd}><Plus /> Add test</button>
      </div>

      <div className="tests-summary">
        <div className="tests-summary-card"><div className="tests-summary-icon blue"><TestTube2 /></div><div><span>Active tests</span><strong>{activeCount}</strong></div></div>
        <div className="tests-summary-card"><div className="tests-summary-icon green"><Check /></div><div><span>Total tests</span><strong>{testsOnly.length}</strong></div></div>
        <div className="tests-summary-card"><div className="tests-summary-icon amber"><Clock3 /></div><div><span>Inactive</span><strong>{inactiveCount}</strong></div></div>
      </div>

      {showForm && <section className="form-panel test-form-panel">
        <div className="form-section-head"><div><h2>{editingId ? 'Edit test' : 'Add new test'}</h2><p>Configure the test and the exact parameters that will appear during result entry.</p></div><button className="mini-icon" onClick={() => { setShowForm(false); resetForm() }}><X /></button></div>

        <div className="form-grid three">
          <Field label="Test Code" required value={form.code} onChange={v => setForm({ ...form, code: v })} placeholder="e.g. CBC" />
          <Field label="Test Name" required value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="e.g. Complete Blood Count" />
          <label className="field"><span>Category *</span><div className="field-wrap"><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{['Hematology','Biochemistry','Hormones','Diabetes','Vitamins','Clinical Pathology','Microbiology','Immunology','Other'].map(x => <option key={x}>{x}</option>)}</select><ChevronDown /></div></label>
          <label className="field"><span>Sample Type *</span><div className="field-wrap"><select value={form.sample} onChange={e => setForm({ ...form, sample: e.target.value })}>{['Serum','EDTA Blood','Whole Blood','Plasma','Urine','Stool','Swab','Multiple'].map(x => <option key={x}>{x}</option>)}</select><ChevronDown /></div></label>
          <Field label="Price" required value={form.rate} onChange={v => setForm({ ...form, rate: v })} placeholder="e.g. 450" type="number" right={<span className="input-prefix">₹</span>} />
          <label className="field"><span>Status</span><div className="field-wrap"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}><option>Active</option><option>Inactive</option></select><ChevronDown /></div></label>
        </div>

        <div style={{ marginTop: 24, paddingTop: 22, borderTop: '1px solid var(--border, #e8edf3)' }}>
          <div className="form-section-head"><div><h2>Test Parameters</h2><p>These fields are saved with this test and automatically become the result-entry form.</p></div><button className="secondary-btn" onClick={addParameter}><Plus /> Add parameter</button></div>
          {parameterDrafts.length === 0 ? <div className="tests-empty" style={{ padding: 24, marginTop: 12 }}><TestTube2 /><b>No parameters added</b><span>Add parameters such as Hemoglobin, WBC, Platelets, etc.</span></div> : <div style={{ display: 'grid', gap: 14, marginTop: 12 }}>
            {parameterDrafts.map((p, index) => <div key={p.id} style={{ border: '1px solid var(--border, #e8edf3)', borderRadius: 14, padding: 16, background: 'var(--surface, #fff)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}><b>Parameter {index + 1}</b><button className="mini-icon danger" title="Delete parameter" onClick={() => removeParameter(p.id)}><Trash2 /></button></div>
              <div className="form-grid three">
                <Field label="Parameter Name" required value={p.name} onChange={v => updateParameter(p.id, { name: v })} placeholder="e.g. Hemoglobin" />
                <Field label="Parameter Code" value={p.code} onChange={v => updateParameter(p.id, { code: v })} placeholder="e.g. HB" />
                <Field label="Unit" value={p.unit} onChange={v => updateParameter(p.id, { unit: v })} placeholder="e.g. g/dL" />
                <label className="field"><span>Result Type *</span><div className="field-wrap"><select value={p.resultType} onChange={e => updateParameter(p.id, { resultType: e.target.value as ResultType })}><option>Number</option><option>Decimal</option><option>Positive / Negative</option><option>Reactive / Non-Reactive</option><option>Dropdown</option></select><ChevronDown /></div></label>
                <Field label="Min" value={p.min} onChange={v => updateParameter(p.id, { min: v })} placeholder="e.g. 13" type="number" />
                <Field label="Max" value={p.max} onChange={v => updateParameter(p.id, { max: v })} placeholder="e.g. 17" type="number" />
                <Field label="Reference Range" value={p.referenceText} onChange={v => updateParameter(p.id, { referenceText: v })} placeholder="e.g. 13–17 g/dL" />
                {p.resultType === 'Dropdown' && <Field label="Dropdown Options" value={p.options.join(', ')} onChange={v => updateOptions(p.id, v)} placeholder="e.g. Clear, Pale Yellow, Dark Yellow" />}
              </div>
            </div>)}
          </div>}
        </div>
        <div className="form-footer"><button className="secondary-btn" onClick={() => { setShowForm(false); resetForm() }}>Cancel</button><button className="primary-btn" onClick={saveTest} disabled={saving}><Check /> {saving ? 'Saving…' : editingId ? 'Update test' : 'Save test'}</button></div>
      </section>}

      <section className="panel tests-panel">
        <div className="tests-toolbar"><div className="search-service tests-search"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by test name, code or category…" /></div><label className="filter-select"><span>Category</span><select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(x => <option key={x}>{x}</option>)}</select><ChevronDown /></label><label className="filter-select"><span>Status</span><select value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select><ChevronDown /></label></div>
        <div className="tests-table-wrap"><table className="tests-table"><thead><tr><th>Test</th><th>Code</th><th>Category</th><th>Sample</th><th>Price</th><th>Parameters</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredTests.length === 0 ? <tr><td colSpan={8}><div className="tests-empty"><TestTube2 /><b>No tests found</b><span>Try another search or add a new test.</span></div></td></tr> : filteredTests.map(test => <tr key={test.id}><td><div className="test-name-cell"><div className="test-row-icon"><TestTube2 /></div><div><b>{test.name}</b><span>{test.type}</span></div></div></td><td><span className="test-code">{test.code}</span></td><td>{test.category}</td><td>{test.sample}</td><td><strong>₹{test.rate.toLocaleString('en-IN')}</strong></td><td><span className="count-badge">{(parameters[test.id] || []).length}</span></td><td><button className={'status-pill ' + (test.status === 'Active' ? 'active' : 'inactive')} onClick={() => toggleStatus(test.id)}><i />{test.status}</button></td><td><div className="test-actions"><button className="mini-icon" title="Edit test and parameters" onClick={() => openEdit(test)}><Settings2 /></button><button className="mini-icon danger" title="Delete test" onClick={() => deleteTest(test.id)}><Trash2 /></button></div></td></tr>)}</tbody></table></div>
        <div className="tests-footer"><span>Showing <b>{filteredTests.length}</b> of <b>{testsOnly.length}</b> tests</span><button className="text-btn" onClick={() => setPage('billing')}>Open billing <ArrowRight /></button></div>
      </section>
    </div>
  )
}

function ResultEntry({ bill, services, parameters, setPage }: { bill: any; services: ServiceItem[]; parameters: TestParametersMap; setPage: (p: Page) => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const patient = bill?.patient || {}
  const items = (bill?.items || []).filter((x: BillItem) => x.type === 'Test')

  const rows: Array<{ item: BillItem; param: TestParameter }> = items.flatMap((item: BillItem) => {
    const service = services.find(
      (s: ServiceItem) =>
        (item.serviceId && String(s.id) === String(item.serviceId)) ||
        s.name === item.name ||
        s.code === item.name
    )
    return (parameters[service?.id || ''] || []).map((param: TestParameter) => ({ item, param }))
  })

  useEffect(() => {
    const loadResults = async () => {
      if (!bill?.id) return
      setLoading(true)

      const { data, error } = await supabase
        .from('test_results')
        .select('bill_item_id, parameter_id, value')
        .in('bill_item_id', (bill.items || []).map((x: BillItem) => x.dbId).filter(Boolean))

      if (error) {
        alert(`Result load failed: ${error.message}`)
      } else {
        const next: Record<string, string> = {}
        ;(data || []).forEach((row: any) => {
          next[`${row.bill_item_id}-${row.parameter_id}`] = row.value
        })
        setValues(next)
        setSaved((data || []).length > 0)
      }
      setLoading(false)
    }

    loadResults()
  }, [bill?.id])

  const setValue = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }))
    setSaved(false)
  }

  const saveResults = async () => {
    if (!bill) return
    const payload = rows
      .filter(({ item, param }) => item.dbId && values[`${item.dbId}-${param.id}`] !== undefined)
      .map(({ item, param }) => ({
        bill_item_id: item.dbId,
        parameter_id: param.id,
        value: values[`${item.dbId}-${param.id}`] || ''
      }))

    if (!payload.length) {
      alert('Please enter at least one result.')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('test_results')
      .upsert(payload, { onConflict: 'bill_item_id,parameter_id' })

    if (error) {
      alert(`Result save failed: ${error.message}`)
    } else {
      await supabase.from('bills').update({ report_status: 'Completed' }).eq('id', bill.id)
      setSaved(true)
    }
    setLoading(false)
  }

  if (!bill) return <div className="page"><div className="empty-state"><FileCheck2 /><h2>No report selected</h2><button className="primary-btn" onClick={() => setPage('dashboard')}>Back to dashboard</button></div></div>

  return (
    <div className="page">
      <div className="page-intro">
        <div><p className="eyebrow">RESULT ENTRY</p><h1>Enter patient results</h1><p>{patient.first || 'Patient'} {patient.last || ''} · {bill.id}</p></div>
        <span className="success-chip">{saved ? <><Check /> Saved</> : <><FileCheck2 /> Draft</>}</span>
      </div>

      <section className="form-panel">
        <div className="form-section-head"><div><h2>Test results</h2><p>Fields below are generated from the parameters configured for the billed tests.</p></div></div>

        {loading && <div style={{ padding: 12, opacity: .7 }}>Loading…</div>}

        {rows.length === 0 ? (
          <div className="tests-empty" style={{ padding: 30 }}>
            <FileCheck2 /><b>No parameters configured</b>
            <span>Open Tests → Edit test → Test Parameters to add reporting fields.</span>
            <button className="secondary-btn" onClick={() => setPage('tests')}>Configure parameters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {rows.map(({ item, param }) => {
              const key = `${item.dbId || item.id}-${param.id}`
              return (
                <div key={key} style={{ border: '1px solid var(--border, #e8edf3)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,1.2fr) minmax(160px,1fr) minmax(100px,.7fr)', gap: 14, alignItems: 'end' }}>
                    <div><span style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{param.name}</span><small style={{ opacity: .65 }}>{item.name}{param.code ? ` · ${param.code}` : ''}</small></div>
                    <label className="field">
                      <span>Result</span>
                      <div className="field-wrap">
                        {param.resultType === 'Dropdown' ? (
                          <select value={values[key] || ''} onChange={e => setValue(key, e.target.value)}><option value="">Select result</option>{param.options.map(o => <option key={o}>{o}</option>)}</select>
                        ) : param.resultType === 'Positive / Negative' ? (
                          <select value={values[key] || ''} onChange={e => setValue(key, e.target.value)}><option value="">Select</option><option>Positive</option><option>Negative</option></select>
                        ) : param.resultType === 'Reactive / Non-Reactive' ? (
                          <select value={values[key] || ''} onChange={e => setValue(key, e.target.value)}><option value="">Select</option><option>Reactive</option><option>Non-Reactive</option></select>
                        ) : (
                          <input type={param.resultType === 'Number' || param.resultType === 'Decimal' ? 'number' : 'text'} step={param.resultType === 'Decimal' ? 'any' : '1'} value={values[key] || ''} onChange={e => setValue(key, e.target.value)} placeholder={param.resultType} />
                        )}
                      </div>
                    </label>
                    <div style={{ paddingBottom: 8 }}><small style={{ display: 'block', opacity: .65 }}>{param.unit || '—'}</small><b style={{ fontSize: 12 }}>{param.referenceText || (param.min || param.max ? `${param.min || '—'} – ${param.max || '—'}` : 'No range')}</b></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="form-footer">
          <button className="secondary-btn" onClick={() => setPage('bill')}><ArrowLeft /> Back to bill</button>
          {rows.length > 0 && <button className="primary-btn" onClick={saveResults} disabled={loading}>{loading ? 'Saving…' : <><Check /> Save results</>}</button>}
        </div>
      </section>
    </div>
  )
}

function Placeholder({
  title,
  icon: Icon,
  setPage
}: {
  title: string
  icon: any
  setPage: (p: Page) => void
}) {
  return (
    <div className="page">
      <div className="placeholder">
        <div className="placeholder-icon">
          <Icon />
        </div>

        <p className="eyebrow">NUSFA LIMS</p>
        <h1>{title}</h1>

        <p>
          This module is scaffolded for the next implementation phase.
          The visual system, navigation and responsive shell are ready.
        </p>

        <button
          className="primary-btn"
          onClick={() => setPage('dashboard')}
        >
          <ArrowLeft /> Back to dashboard
        </button>
      </div>
    </div>
  )
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!email || !password) {
      alert('Enter your email and password.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(`Login failed: ${error.message}`)
    } else {
      onLogin()
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f6f8fb' }}>
      <section className="form-panel" style={{ width: 'min(440px, 100%)' }}>
        <div className="form-section-head">
          <div>
            <p className="eyebrow">NUSFA LIMS</p>
            <h2>Sign in</h2>
            <p>Use your Supabase Auth account to access the laboratory.</p>
          </div>
        </div>
        <Field label="Email" required value={email} onChange={setEmail} placeholder="admin@yourlab.com" type="email" />
        <div style={{ height: 14 }} />
        <Field label="Password" required value={password} onChange={setPassword} placeholder="Enter password" type="password" />
        <div className="form-footer">
          <span />
          <button className="primary-btn" onClick={login} disabled={loading}>
            {loading ? 'Signing in…' : <>Sign in <ArrowRight /></>}
          </button>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [bills, setBills] = useState<any[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [parameters, setParameters] = useState<TestParametersMap>({})
  const [bill, setBill] = useState<any>(null)
  const [stats, setStats] = useState({
    registrationsToday: 0,
    ongoingReports: 0,
    completedThisMonth: 0,
    reportsArchive: 0
  })

  const loadData = async () => {
    setDataLoading(true)

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      { data: testRows, error: testError },
      { data: parameterRows, error: parameterError },
      { data: activityRows, error: activityError },
      { data: billRows, error: billError },
      { count: registrationsToday, error: registrationsError },
      { count: ongoingReports, error: ongoingError },
      { count: completedThisMonth, error: completedError },
      { count: reportsArchive, error: archiveError }
    ] = await Promise.all([
      supabase.from('tests').select('*').order('created_at', { ascending: true }),
      supabase.from('test_parameters').select('*').order('sort_order', { ascending: true }),
      supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('bills').select('id, patient_id, final_amount, paid, due, payment_status, created_at, patients(first_name,last_name,patient_id)').order('created_at', { ascending: false }).limit(5),
      supabase.from('patients').select('id', { count: 'exact', head: true }).gte('created_at', startOfDay),
      supabase.from('bills').select('id', { count: 'exact', head: true }).eq('report_status', 'Pending'),
      supabase.from('bills').select('id', { count: 'exact', head: true }).eq('report_status', 'Completed').gte('created_at', startOfMonth),
      supabase.from('bills').select('id', { count: 'exact', head: true })
    ])

    const firstError = testError || parameterError || activityError || billError || registrationsError || ongoingError || completedError || archiveError
    if (firstError) {
      alert(`Database load failed: ${firstError.message}`)
    }

    setServices((testRows || []).map((x: any) => ({
      id: String(x.id),
      code: x.code,
      name: x.name,
      type: x.type,
      category: x.category,
      sample: x.sample,
      rate: Number(x.rate),
      status: x.status
    })))

    const grouped: TestParametersMap = {}
    ;(parameterRows || []).forEach((x: any) => {
      if (!grouped[x.test_id]) grouped[x.test_id] = []
      grouped[x.test_id].push({
        id: String(x.id),
        name: x.name,
        code: x.code || '',
        unit: x.unit || '',
        resultType: x.result_type,
        options: Array.isArray(x.options) ? x.options : [],
        min: x.min_value || '',
        max: x.max_value || '',
        referenceText: x.reference_text || ''
      })
    })
    setParameters(grouped)

    setActivities((activityRows || []).map((x: any, index: number) => ({
      id: index + 1,
      name: x.name,
      text: x.text,
      time: new Date(x.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    })))

    setBills((billRows || []).map((x: any) => {
      const patient = Array.isArray(x.patients) ? x.patients[0] : x.patients
      return {
        id: x.id,
        name: `${patient?.first_name || 'Patient'} ${patient?.last_name || ''}`.trim(),
        patientId: patient?.patient_id || '',
        amount: Number(x.final_amount),
        status: x.payment_status === 'Paid' ? 'Paid' : `Due ₹${Number(x.due).toLocaleString('en-IN')}`
      }
    }))

    setStats({
      registrationsToday: registrationsToday || 0,
      ongoingReports: ongoingReports || 0,
      completedThisMonth: completedThisMonth || 0,
      reportsArchive: reportsArchive || 0
    })

    setDataLoading(false)
  }

  useEffect(() => {
    let active = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!active) return
      setAuthenticated(Boolean(data.session))
      setSessionReady(true)
      if (data.session) await loadData()
      else setDataLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return
      setAuthenticated(Boolean(session))
      if (session) {
        await loadData()
      } else {
        setActivities([])
        setBills([])
        setServices([])
        setParameters({})
        setStats({ registrationsToday: 0, ongoingReports: 0, completedThisMonth: 0, reportsArchive: 0 })
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const onViewBill = async (id: string) => {
    const [{ data: billRow, error: billError }, { data: itemRows, error: itemError }] = await Promise.all([
      supabase.from('bills').select('*, patients(*)').eq('id', id).single(),
      supabase.from('bill_items').select('*').eq('bill_id', id).order('created_at', { ascending: true })
    ])

    if (billError || itemError || !billRow) {
      alert(`Bill load failed: ${(billError || itemError)?.message || 'Bill not found'}`)
      return
    }

    const p = Array.isArray(billRow.patients) ? billRow.patients[0] : billRow.patients
    setBill({
      id: billRow.id,
      patient: {
        id: p?.id,
        patientId: p?.patient_id,
        title: p?.title,
        first: p?.first_name,
        last: p?.last_name,
        phone: p?.phone,
        age: p?.age,
        ageMode: p?.age_mode,
        gender: p?.gender,
        address: p?.address,
        email: p?.email
      },
      items: (itemRows || []).map((x: any, index: number) => ({
        id: index + 1,
        dbId: x.id,
        serviceId: x.test_id,
        name: x.name,
        type: x.type,
        rate: Number(x.rate)
      })),
      subtotal: Number(billRow.subtotal),
      discountAmount: Number(billRow.discount_amount),
      discount: billRow.discount,
      discountMode: billRow.discount_mode,
      by: billRow.referred_by,
      final: Number(billRow.final_amount),
      paid: Number(billRow.paid),
      due: Number(billRow.due),
      createdAt: billRow.created_at
    })
    setPage('bill')
  }

  const onRegistered = async (a: ActivityItem) => {
    setActivities(prev => [a, ...prev].slice(0, 6))
    await supabase.from('activities').insert({ name: a.name, text: a.text })
  }

  const onBill = async (b: any) => {
    setBill(b)
    const row = {
      id: b.id,
      name: `${b.patient.first || 'Patient'} ${b.patient.last || ''}`.trim(),
      amount: b.final,
      status: b.due ? `Due ₹${b.due}` : 'Paid',
      patientId: b.patient.patientId || ''
    }
    setBills(prev => [row, ...prev.filter(x => x.id !== row.id)].slice(0, 5))
    const activity = { name: row.name, text: `Bill #${b.id} created` }
    await supabase.from('activities').insert(activity)
  }

  if (!sessionReady || dataLoading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading Nusfa LIMS…</div>
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => { setDataLoading(true); setAuthenticated(true) }} />
  }

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main">
        <Header page={page} setPage={setPage} />

        {page === 'dashboard' && <Dashboard setPage={setPage} activities={activities} bills={bills} stats={stats} onViewBill={onViewBill} />}
        {page === 'registration' && <Registration setPage={setPage} onRegistered={onRegistered} />}
        {page === 'billing' && <Billing setPage={setPage} onBill={onBill} services={services} />}
        {page === 'bill' && <BillPreview setPage={setPage} bill={bill} />}
        {page === 'result' && <ResultEntry bill={bill} services={services} parameters={parameters} setPage={setPage} />}
        {page === 'referral' && <Referral setPage={setPage} />}
        {page === 'addReferral' && <AddReferral setPage={setPage} />}
        {page === 'patients' && <Placeholder title="Patients" icon={Users} setPage={setPage} />}
        {page === 'tests' && <TestsPage services={services} setServices={setServices} parameters={parameters} setParameters={setParameters} setPage={setPage} />}
        {page === 'packages' && <Placeholder title="Packages" icon={Package} setPage={setPage} />}
        {page === 'analytics' && <Placeholder title="Business Analytics" icon={BarChart3} setPage={setPage} />}
        {page === 'users' && <Placeholder title="User Management" icon={UserCog} setPage={setPage} />}
        {page === 'lab' && <Placeholder title="Lab Management" icon={Building2} setPage={setPage} />}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <App />
)