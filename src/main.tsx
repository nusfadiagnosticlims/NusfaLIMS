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
import './styles.css'

type Page =
  | 'dashboard'
  | 'registration'
  | 'billing'
  | 'bill'
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

type BillItem = {
  id: number
  name: string
  type: 'Test' | 'Package'
  rate: number
}

const tests = [
  { name: 'CBC (Complete Blood Count)', rate: 450, type: 'Test' as const },
  { name: 'Liver Function Test', rate: 650, type: 'Test' as const },
  { name: 'Kidney Function Test', rate: 600, type: 'Test' as const },
  { name: 'Thyroid Profile', rate: 700, type: 'Test' as const },
  { name: 'HbA1c', rate: 500, type: 'Test' as const },
  { name: 'Lipid Profile', rate: 550, type: 'Test' as const },
  { name: 'Vitamin D', rate: 900, type: 'Test' as const },
  { name: 'Urine Routine', rate: 180, type: 'Test' as const },
  { name: 'Full Body Basic', rate: 2200, type: 'Package' as const },
  { name: 'Executive Health Package', rate: 3600, type: 'Package' as const },
  { name: 'Diabetes Care Package', rate: 1400, type: 'Package' as const }
]

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

      <button className="nav-item logout">
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
  bills
}: {
  setPage: (p: Page) => void
  activities: ActivityItem[]
  bills: any[]
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
          <CalendarDays /> 19 September 2026
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="New Registration"
          value="18"
          sub="Patients today"
          icon={UserPlus}
          tone="blue"
          onClick={() => setPage('registration')}
        />

        <StatCard
          title="Ongoing Report"
          value="27"
          sub="Awaiting results"
          icon={Clock3}
          tone="amber"
          onClick={() => setPage('tests')}
        />

        <StatCard
          title="Completed Report"
          value="142"
          sub="This month"
          icon={FileCheck2}
          tone="green"
          onClick={() => setPage('tests')}
        />

        <StatCard
          title="Find Reports"
          value="1,284"
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
                  onClick={() => setPage('bill')}
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
  const [found, setFound] = useState(false)

  const lookup = () => {
    if (phone.length >= 10) {
      setFound(true)

      if (phone.endsWith('001')) {
        setFirst('Rohit')
        setLast('Kumar')
        setAge('32')
        setGender('Male')
        setEmail('rohit@example.com')
      }
    }
  }

  useEffect(() => {
    if (
      title === 'Mrs.' ||
      title === 'Miss.' ||
      title === 'Ms.'
    ) {
      setGender('Female')
    } else if (title === 'Mr.') {
      setGender('Male')
    }
  }, [title])

  const go = () => {
    if (!phone || !first) {
      alert('Please enter Mobile Number and First Name.')
      return
    }

    onRegistered({
      id: Date.now(),
      name: `${first} ${last}`.trim(),
      text: 'Patient registration successful',
      time: 'Just now'
    })

    localStorage.setItem(
      'nusfaPatient',
      JSON.stringify({
        phone,
        title,
        first,
        last,
        age,
        ageMode,
        gender,
        address,
        email
      })
    )

    setPage('billing')
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">PATIENT INTAKE</p>
          <h1>New registration</h1>
          <p>
            Create a patient record and continue directly to billing.
          </p>
        </div>

        <div className="stepper">
          <span className="done">1</span>
          <i />
          <span className="current">2</span>
          <i />
          <span>3</span>
        </div>
      </div>

      <section className="form-panel">
        <div className="form-section-head">
          <div>
            <h2>Patient information</h2>
            <p>
              Enter the patient's mobile number first to find an existing
              record.
            </p>
          </div>

          <span className="required-note">
            <em>*</em> Required
          </span>
        </div>

        <div className="phone-search">
          <Field
            label="Mobile Number"
            required
            value={phone}
            onChange={v => {
              setPhone(v)
              setFound(false)
            }}
            placeholder="+91 98765 43210"
            type="tel"
          />

          <button className="primary-btn lookup" onClick={lookup}>
            <Search /> Find patient
          </button>
        </div>

        {found && (
          <div className="found-banner">
            <div className="found-check">
              <Check />
            </div>

            <div>
              <b>Patient record found</b>
              <span>
                Existing details have been loaded. You can review and update
                them.
              </span>
            </div>

            <button onClick={() => setFound(false)}>
              <X />
            </button>
          </div>
        )}

        <div className="divider">
          <span>Personal details</span>
        </div>

        <div className="form-grid four">
          <label className="field">
            <span>Title</span>

            <div className="field-wrap">
              <input
                list="titles"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Select or type title"
              />

              <datalist id="titles">
                {[
                  'Mr.',
                  'Mrs.',
                  'Miss.',
                  'Ms.',
                  'Dr.',
                  'Prof.',
                  'Er.',
                  'Adv.',
                  'Mx.',
                  'Rev.',
                  'Sir',
                  'Madam',
                  'Baby',
                  'Master'
                ].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </datalist>
            </div>
          </label>

          <Field
            label="First Name"
            required
            value={first}
            onChange={setFirst}
            placeholder="Enter first name"
          />

          <Field
            label="Last Name"
            value={last}
            onChange={setLast}
            placeholder="Enter last name"
          />

          <div className="field">
            <span>Age / Date of birth</span>

            <div className="age-wrap">
              <input
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder={
                  ageMode === 'age' ? 'e.g. 32' : 'DD/MM/YYYY'
                }
              />

              <button
                onClick={() =>
                  setAgeMode(ageMode === 'age' ? 'dob' : 'age')
                }
              >
                {ageMode === 'age' ? 'DOB' : 'Age'}
              </button>
            </div>
          </div>
        </div>

        <div className="form-grid three">
          <div className="field">
            <span>
              Gender <em>*</em>
            </span>

            <div className="segmented">
              {['Male', 'Female', 'Trans'].map(g => (
                <button
                  key={g}
                  className={gender === g ? 'selected' : ''}
                  onClick={() => setGender(g)}
                >
                  <span className="radio" />
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Address"
            value={address}
            onChange={setAddress}
            placeholder="Street, locality, city"
          />

          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="patient@example.com"
            type="email"
          />
        </div>

        <div className="form-footer">
          <button
            className="secondary-btn"
            onClick={() => setPage('dashboard')}
          >
            Cancel
          </button>

          <button className="primary-btn" onClick={go}>
            Go to billing <ArrowRight />
          </button>
        </div>
      </section>
    </div>
  )
}

function Billing({
  setPage,
  onBill
}: {
  setPage: (p: Page) => void
  onBill: (b: any) => void
}) {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<BillItem[]>([])
  const [discount, setDiscount] = useState('')
  const [discountMode, setDiscountMode] = useState<
    'amount' | 'percent'
  >('amount')
  const [by, setBy] = useState('Lab')
  const [paid, setPaid] = useState('')

  const patient = JSON.parse(
    localStorage.getItem('nusfaPatient') || '{}'
  )

  const matches = useMemo(
    () =>
      q
        ? tests.filter(x =>
            x.name.toLowerCase().includes(q.toLowerCase())
          )
        : [],
    [q]
  )

  const subtotal = items.reduce((s, x) => s + x.rate, 0)

  const discountAmount =
    discountMode === 'amount'
      ? Number(discount || 0)
      : subtotal * (Number(discount || 0) / 100)

  const final = Math.max(0, subtotal - discountAmount)

  const due = Math.max(
    0,
    final - Number(paid || 0)
  )

  const add = (x: any) => {
    setItems(prev =>
      prev.some(i => i.name === x.name)
        ? prev
        : [...prev, { ...x, id: Date.now() }]
    )

    setQ('')
  }

  const changeDiscount = (v: string) => setDiscount(v)

  const create = () => {
    if (!items.length) {
      alert('Please add at least one test or package.')
      return
    }

    const bill = {
      id: `NSF-${Math.floor(1000 + Math.random() * 8999)}`,
      patient,
      items,
      subtotal,
      discountAmount,
      discount,
      discountMode,
      by,
      final,
      paid: Number(paid || 0),
      due
    }

    onBill(bill)
    setPage('bill')
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">BILLING</p>
          <h1>Create bill</h1>
          <p>
            Add tests or packages, apply discounts and record payment.
          </p>
        </div>

        <div className="patient-pill">
          <User />
          <span>
            {patient.first || 'New patient'} {patient.last || ''}
          </span>
          <small>{patient.phone || 'No phone'}</small>
        </div>
      </div>

      <div className="billing-layout">
        <section className="form-panel">
          <div className="form-section-head">
            <div>
              <h2>Tests & packages</h2>
              <p>Search and add one or multiple services.</p>
            </div>

            <span className="count-badge">
              {items.length} selected
            </span>
          </div>

          <div className="search-service">
            <Search />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search test or package name…"
            />
            <span>⌘ K</span>
          </div>

          {matches.length > 0 && (
            <div className="search-results">
              {matches.map(x => (
                <button key={x.name} onClick={() => add(x)}>
                  <div>
                    <b>{x.name}</b>
                    <span>{x.type}</span>
                  </div>

                  <strong>
                    ₹{x.rate.toLocaleString('en-IN')}
                  </strong>

                  <Plus />
                </button>
              ))}
            </div>
          )}

          <div className="selected-list">
            {items.length === 0 ? (
              <div className="empty-service">
                <FlaskConical />
                <b>No tests added yet</b>
                <span>Search above to add tests or packages.</span>
              </div>
            ) : (
              items.map((x, i) => (
                <div className="selected-row" key={x.id}>
                  <div className="number">{i + 1}</div>

                  <div>
                    <b>{x.name}</b>
                    <span>{x.type}</span>
                  </div>

                  <strong>
                    ₹{x.rate.toLocaleString('en-IN')}
                  </strong>

                  <button
                    onClick={() =>
                      setItems(
                        items.filter(y => y.id !== x.id)
                      )
                    }
                  >
                    <Trash2 />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="summary-card">
            <div className="summary-line">
              <span>Subtotal</span>
              <b>₹{subtotal.toLocaleString('en-IN')}</b>
            </div>

            <div className="summary-line">
              <span>Discount</span>
              <b className="discount">
                − ₹
                {discountAmount.toLocaleString('en-IN', {
                  maximumFractionDigits: 0
                })}
              </b>
            </div>

            <div className="summary-total">
              <span>Total amount</span>
              <strong>
                ₹
                {final.toLocaleString('en-IN', {
                  maximumFractionDigits: 0
                })}
              </strong>
            </div>
          </div>
        </section>

        <section className="form-panel payment-panel">
          <div className="form-section-head">
            <div>
              <h2>Payment</h2>
              <p>Apply discount and capture payment.</p>
            </div>

            <WalletCards />
          </div>

          <div className="discount-grid">
            <div className="field">
              <span>Discount</span>

              <div className="toggle-input">
                <input
                  value={discount}
                  onChange={e =>
                    changeDiscount(e.target.value)
                  }
                  placeholder="0"
                />

                <button
                  className={
                    discountMode === 'amount' ? 'active' : ''
                  }
                  onClick={() => setDiscountMode('amount')}
                >
                  ₹
                </button>

                <button
                  className={
                    discountMode === 'percent' ? 'active' : ''
                  }
                  onClick={() => setDiscountMode('percent')}
                >
                  %
                </button>
              </div>
            </div>

            <label className="field">
              <span>Discounted by</span>

              <div className="field-wrap">
                <select
                  value={by}
                  onChange={e => setBy(e.target.value)}
                >
                  <option>Hospital</option>
                  <option>Lab</option>
                  <option>Clinic</option>
                  <option>Others</option>
                </select>

                <ChevronDown />
              </div>
            </label>
          </div>

          <div className="pay-total">
            <span>Amount after discount</span>
            <strong>
              ₹
              {final.toLocaleString('en-IN', {
                maximumFractionDigits: 0
              })}
            </strong>
          </div>

          <Field
            label="Paid Amount"
            value={paid}
            onChange={setPaid}
            placeholder="Enter amount received"
            type="number"
            right={<span className="input-prefix">₹</span>}
          />

          <div className="due-card">
            <div>
              <span>Due amount</span>
              <small>Outstanding balance</small>
            </div>

            <strong>
              ₹
              {due.toLocaleString('en-IN', {
                maximumFractionDigits: 0
              })}
            </strong>
          </div>

          <div className="form-footer">
            <button
              className="secondary-btn"
              onClick={() => setPage('registration')}
            >
              <ArrowLeft /> Back
            </button>

            <button className="primary-btn" onClick={create}>
              Create bill <FileText />
            </button>
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
              <small>19 Sep 2026</small>
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
            onClick={() =>
              alert(
                'Result entry workflow is ready for the next phase.'
              )
            }
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

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const [activities, setActivities] =
    useState<ActivityItem[]>(initialActivities)

  const [bills, setBills] = useState(initialBills)

  const [bill, setBill] = useState<any>(null)

  const onRegistered = (a: ActivityItem) =>
    setActivities(prev => [a, ...prev].slice(0, 6))

  const onBill = (b: any) => {
    setBill(b)

    setBills(prev =>
      [
        {
          id: b.id,
          name: `${b.patient.first || 'Patient'} ${
            b.patient.last || ''
          }`.trim(),
          amount: b.final,
          status: b.due ? `Due ₹${b.due}` : 'Paid'
        },
        ...prev
      ].slice(0, 5)
    )
  }

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="main">
        <Header page={page} setPage={setPage} />

        {page === 'dashboard' && (
          <Dashboard
            setPage={setPage}
            activities={activities}
            bills={bills}
          />
        )}

        {page === 'registration' && (
          <Registration
            setPage={setPage}
            onRegistered={onRegistered}
          />
        )}

        {page === 'billing' && (
          <Billing
            setPage={setPage}
            onBill={onBill}
          />
        )}

        {page === 'bill' && (
          <BillPreview
            setPage={setPage}
            bill={bill}
          />
        )}

        {page === 'referral' && (
          <Referral setPage={setPage} />
        )}

        {page === 'addReferral' && (
          <AddReferral setPage={setPage} />
        )}

        {page === 'patients' && (
          <Placeholder
            title="Patients"
            icon={Users}
            setPage={setPage}
          />
        )}

        {page === 'tests' && (
          <Placeholder
            title="Tests"
            icon={TestTube2}
            setPage={setPage}
          />
        )}

        {page === 'packages' && (
          <Placeholder
            title="Packages"
            icon={Package}
            setPage={setPage}
          />
        )}

        {page === 'analytics' && (
          <Placeholder
            title="Business Analytics"
            icon={BarChart3}
            setPage={setPage}
          />
        )}

        {page === 'users' && (
          <Placeholder
            title="User Management"
            icon={UserCog}
            setPage={setPage}
          />
        )}

        {page === 'lab' && (
          <Placeholder
            title="Lab Management"
            icon={Building2}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <App />
)