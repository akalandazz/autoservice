'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 'diag',   icon: 'Diag',       num: '01', title: 'დიაგნოსტიკა',              desc: 'OBD, შასი, ელექტრიკა და სრული დათვალიერება. ვპოულობთ იმას, რაც დილერმა გამოტოვა.',  price: '₾89-დან',      time: '~1სთ' },
  { id: 'repair', icon: 'Wrench',     num: '02', title: 'ზოგადი რემონტი',           desc: 'მცირე შეკეთებიდან ღვედის შეცვლამდე. პატიოსანი ფასები, ზედმეტი ნაწილების გარეშე.',   price: '₾120-დან',     time: 'იმავე დღეს' },
  { id: 'brakes', icon: 'Suspension', num: '03', title: 'სუსპენზია და მუხრუჭები',  desc: 'კოილოვერები, დამდაბლების კიტები, დიდი მუხრუჭები. ბალანსირებული და განვითარებული.',  price: '₾320-დან',     time: '4–6 სთ' },
  { id: 'body',   icon: 'Body',       num: '04', title: 'ძარა და დაჯახება',         desc: 'პანელის გასწორება, ჩაჭდევნილი ადგილების გამოტანა, შეღებვის მომზადება.',              price: '₾450-დან',     time: '2–5 დღე' },
  { id: 'paint',  icon: 'Paint',      num: '05', title: 'შეღებვა და მფარავი',       desc: 'ფირმის ფერები, შიმერი, კენდი, მარგალიტი. ვინილის მფარავი ყოყმანიანებისთვის.',        price: '₾1,800-დან',   time: '3–7 დღე' },
  { id: 'engine', icon: 'Engine',     num: '06', title: 'ძრავის გადაკეთება',        desc: 'ბლოკები, ჭედილი დეტალები, თავის სამუშაოები. აშენებული, არა ყიდული — ქვითრებით.',    price: '₾3,900-დან',   time: '2–4 კვირა' },
  { id: 'tires',  icon: 'Tire',       num: '07', title: 'საბურავები და დისკები',    desc: 'დაყენება, ბალანსი, განსხვავებული ზომა, სტრეჩი. Road-force მოთხოვნით.',               price: '₾80-დან/თვ',   time: '~45 წთ' },
  { id: 'detail', icon: 'Sparkle',    num: '08', title: 'დეტეილინგი',               desc: 'სრული ლაკის კორექცია, კერამიკული საფარი, სალონის აღდგენა. შოუს დღისთვის.',          price: '₾240-დან',     time: '1–2 დღე' },
]

const PRICING = [
  { tier: 'დონე 01', name: 'პიტ სტოპი',   price: 149,  per: '/ვიზიტი', badge: null,            featured: false,
    feats: ['სრული დიაგნოსტიკური სკანი', 'ზეთის + ფილტრის შეცვლა', 'მუხრუჭების + სითხეების შემოწმება', 'საბურავების წნევა და როტაცია', '30-წუთიანი გზის ტესტი', 'სახელოსნოს სტიკერი + ყავა'],
    cta: 'პიტ სტოპის ჯავშანი' },
  { tier: 'დონე 02', name: 'სტრიტ ბილდი', price: 1290, per: '/ბილდი',  badge: 'ყველაზე ხშირი', featured: true,
    feats: ['ყველაფერი პიტ სტოპიდან', 'სრული კოილოვერის დაყენება + გასწორება', 'Catback ან axle-back გამონაბოლქვი', 'ECU ფლეში (1-ლი ეტაპი)', 'ახალი სანთლები + ფილტრები', 'დინო ტესტი ამონაბეჭდით', '30-დღიანი ტიუნინგ მხარდაჭერა'],
    cta: 'სტრიტ ბილდის დაწყება' },
  { tier: 'დონე 03', name: 'ტრეკ სპეცი',  price: 4850, per: '/ბილდი',  badge: null,            featured: false,
    feats: ['ყველაფერი სტრიტ ბილდიდან', 'ჭედილი დეტალების ვარიანტი', 'დიდი მუხრუჭების კიტი', 'უსაფრთხოების კარკასის კონსულტაცია', 'კუთხეების ბალანსი + სასწორი', 'სარბოლო გასწორება', '90-დღიანი გარანტია'],
    cta: 'ტრეკ სპეცზე გადასვლა' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

type IconProps = React.SVGProps<SVGSVGElement>

const Icons: Record<string, (p: IconProps) => React.ReactElement> = {
  Wrench: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.5 4.5a4 4 0 0 0-5 5L4 15l-.5 3.5L7 18l5.5-5.5a4 4 0 0 0 5-5l-2 2-2.5-.5-.5-2.5 2-2z"/>
    </svg>
  ),
  Diag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2.5" y="6.5" width="19" height="13" rx="1.5"/>
      <path d="M6 14l2-3 2 4 2-6 2 5h4"/>
      <path d="M8.5 3.5h7"/>
    </svg>
  ),
  Paint: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3.5 10.5l8-6 9 6-9 6-8-6z"/>
      <path d="M11.5 16.5v4"/>
      <circle cx="11.5" cy="20.5" r="1.5"/>
    </svg>
  ),
  Body: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 14l2-4 4-3h8l4 3 2 4v3h-3a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H2v-3z"/>
      <path d="M6 10l2-2h8l2 2"/>
    </svg>
  ),
  Engine: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="9" width="14" height="9" rx="1"/>
      <path d="M17 12h3v3h-3"/>
      <path d="M6 9V6h4v3"/>
      <path d="M13 9V7h3"/>
      <path d="M7 18v2M13 18v2"/>
    </svg>
  ),
  Tire: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3.5"/>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>
    </svg>
  ),
  Suspension: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 4v3M18 4v3M6 17v3M18 17v3"/>
      <path d="M5 7h2M17 7h2M5 17h2M17 17h2"/>
      <path d="M7 8l-2 2 2 2-2 2 2 2M17 8l2 2-2 2 2 2-2 2"/>
      <path d="M9 7h6v10H9z"/>
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>
      <path d="M19 3v2M21 4h-2M5 19v2M5 20H3"/>
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1.5"/>
      <path d="M3 7l9 6 9-6"/>
    </svg>
  ),
  Ig: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="4"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
    </svg>
  ),
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ onBook, onNav, drawerOpen, setDrawerOpen }: {
  onBook: () => void
  onNav: (id: string) => void
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleNav = (id: string) => {
    setDrawerOpen(false)
    onNav(id)
  }

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <a href="#home" className="brand" onClick={e => { e.preventDefault(); handleNav('home') }}>
            <span className="brand-mark">R<span className="brand-x">/</span></span>
            <span>Redline<span className="brand-x">//</span>Garage</span>
          </a>
          <div className="nav-links">
            <a href="#services" onClick={e => { e.preventDefault(); onNav('services') }}>სერვისები</a>
            <a href="#pricing" onClick={e => { e.preventDefault(); onNav('pricing') }}>პაკეტები</a>
            <a href="#book" onClick={e => { e.preventDefault(); onNav('book') }}>ჯავშანი</a>
            <a href="#visit" onClick={e => { e.preventDefault(); onNav('visit') }}>კონტაქტი</a>
          </div>
          <div className="nav-cta">
            <span className="nav-phone">◉ <b>(032) 555-REV8</b></span>
            <button className="btn" onClick={onBook} style={{ padding: '10px 16px', fontSize: 11 }}>
              დაჯავშნა <span className="chev"/>
            </button>
            <button
              type="button"
              className={`nav-burger${drawerOpen ? ' open' : ''}`}
              aria-label="მენიუ"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(o => !o)}
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="nav-drawer-in">
          <a href="#services" onClick={e => { e.preventDefault(); handleNav('services') }}>სერვისები <span className="arr">→</span></a>
          <a href="#pricing" onClick={e => { e.preventDefault(); handleNav('pricing') }}>პაკეტები <span className="arr">→</span></a>
          <a href="#book" onClick={e => { e.preventDefault(); handleNav('book') }}>დაჯავშნე ბოქსი <span className="arr">→</span></a>
          <a href="#visit" onClick={e => { e.preventDefault(); handleNav('visit') }}>მისამართი / საათები <span className="arr">→</span></a>
          <div className="nav-drawer-foot">
            <span>◉ <b>(032) 555-REV8</b></span>
            <span>ალ. ყაზბეგის გამზ. 412 · საბურთალო, თბილისი</span>
            <span>ღია ორშ–პარ 08:00 – 19:00</span>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── RPM Gauge ────────────────────────────────────────────────────────────────

function Rpm() {
  const [rpm, setRpm] = useState(2400)
  const rafRef = useRef<number>(0)
  const tRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      tRef.current += 0.016
      const base = 3800 + Math.sin(tRef.current * 0.9) * 2200 + Math.sin(tRef.current * 2.3) * 500
      setRpm(Math.max(800, Math.round(base)))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const max = 9000
  const pct = Math.min(1, rpm / max)
  const startAngle = 160
  const endAngle = 380
  const angle = startAngle + (endAngle - startAngle) * pct
  const angleRad = (angle * Math.PI) / 180
  const needleX = 100 + 78 * Math.cos(angleRad)
  const needleY = 100 + 78 * Math.sin(angleRad)

  const arcRad1 = (startAngle * Math.PI) / 180
  const arcRad2 = (endAngle * Math.PI) / 180
  const arcX1 = 100 + 80 * Math.cos(arcRad1)
  const arcY1 = 100 + 80 * Math.sin(arcRad1)
  const arcX2 = 100 + 80 * Math.cos(arcRad2)
  const arcY2 = 100 + 80 * Math.sin(arcRad2)
  const arcEndX = 100 + 80 * Math.cos(angleRad)
  const arcEndY = 100 + 80 * Math.sin(angleRad)
  const largeArc = pct > 180 / (endAngle - startAngle) ? 1 : 0

  const ticks = []
  for (let i = 0; i <= 9; i++) {
    const a = startAngle + ((endAngle - startAngle) * i) / 9
    const rad = (a * Math.PI) / 180
    const x1 = 100 + 86 * Math.cos(rad)
    const y1 = 100 + 86 * Math.sin(rad)
    const x2 = 100 + 74 * Math.cos(rad)
    const y2 = 100 + 74 * Math.sin(rad)
    const tx = 100 + 64 * Math.cos(rad)
    const ty = 100 + 64 * Math.sin(rad)
    const red = i >= 7
    ticks.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={red ? 'var(--neon-mag)' : 'var(--neon-cyan)'} strokeWidth="2" opacity={i === Math.floor(pct * 9) ? 1 : 0.55}/>
        <text x={tx} y={ty + 4} textAnchor="middle" fontFamily="Orbitron,sans-serif" fontWeight="700" fontSize="11" fill={red ? 'var(--neon-mag)' : 'var(--ink-dim)'} style={{ letterSpacing: '0.05em' }}>{i}</text>
      </g>
    )
  }

  return (
    <div className="gauge-card">
      <span className="brk tl"/><span className="brk tr"/><span className="brk bl"/><span className="brk br"/>
      <div className="gauge-head">
        <span><span className="led"/>&nbsp;&nbsp;ლაივი · ბოქსი 03</span>
        <span>SYS/READY</span>
      </div>
      <div className="gauge">
        <svg viewBox="0 0 200 200">
          <path d={`M ${arcX1} ${arcY1} A 80 80 0 1 1 ${arcX2} ${arcY2}`} fill="none" stroke="rgba(0,240,255,0.1)" strokeWidth="3"/>
          <path d={`M ${arcX1} ${arcY1} A 80 80 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`} fill="none" stroke="var(--neon-cyan)" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px var(--neon-cyan))' }}/>
          {ticks}
          <line x1="100" y1="100" x2={needleX} y2={needleY} stroke="var(--neon-mag)" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px var(--neon-mag))' }}/>
          <circle cx="100" cy="100" r="8" fill="#05070c" stroke="var(--neon-mag)" strokeWidth="2"/>
          <circle cx="100" cy="100" r="3" fill="var(--neon-mag)"/>
        </svg>
        <div className="gauge-readout">
          <div className="gauge-rpm">{rpm.toLocaleString()}</div>
          <div className="gauge-unit">rpm · x1000</div>
        </div>
      </div>
      <div className="gauge-info">
        <div><span>ბუსტი</span><span>{(0.6 + pct * 1.4).toFixed(1)} bar</span></div>
        <div><span>AFR</span><span>{(11.2 + (rpm % 100) / 50).toFixed(1)}</span></div>
        <div><span>IAT</span><span>{(38 + pct * 18).toFixed(0)}°C</span></div>
      </div>
    </div>
  )
}

// ─── Telemetry ────────────────────────────────────────────────────────────────

function Telemetry() {
  const items = [
    'ამჟამად ღიაა · ბოქსი 02 თავისუფალია',
    'შემდეგი სლოტი → სამშ. 10:30',
    'ამჟამად ვტიუნავთ · 2003 NISSAN 350Z',
    'დინო ტესტი დასრულდა · +48 WHP',
    '14-დღიანი გარანტია ყველა ბილდზე',
    'შემოდით 17:00-მდე ჯავშნის გარეშეც',
    '1,240+ დასრულებული ბილდი',
  ]
  const loop = [...items, ...items]
  return (
    <div className="telemetry">
      <span>◉ ლაივი</span>
      <div className="tel-marquee">
        <div className="tel-marquee-inner">
          {loop.map((t, i) => (
            <span key={i}>{t} <b style={{ color: 'var(--neon-mag)' }}>//</b></span>
          ))}
        </div>
      </div>
      <span>LAT 41.6938 · LON 44.8015</span>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="hero" id="home">
      <div className="hero-road"/>
      <div className="hero-glow"/>
      <div className="wrap hero-grid">
        <div>
          <div className="tag" style={{ marginBottom: 18 }}>◤ დაარსდა 2011 · UNDERGROUND CERTIFIED</div>
          <h1 className="hero-title">
            <span className="stroke hero-pulse">მოგვიყვანე</span><br/>
            <span>შენი ჯართი.</span>
            <span className="line2">გაიყვანე მხეცი.</span>
          </h1>
          <p className="hero-copy">
            სრული მომსახურების ტიუნერ ხელოსანი საბურთალოზე. <b>დიაგნოსტიკა, ძარა, შეღებვა, ძრავის ახლად აწყობა, სუსპენზია</b> — ხელით გადანაწილებული, არა ჩვენაობრივი საოცების ბავშვების მიერ. დაჯავშნე ბოქსი ქვემოთ, ან დარეკე და დიზელს დაჯეჭი.
          </p>
          <div className="hero-ctas">
            <button className="btn" onClick={onBook}>დაჯავშნე ბოქსი <span className="chev"/></button>
            <a className="btn btn-mag" href="#pricing">ნახე პაკეტები</a>
          </div>
          <div className="hero-meta">
            <div className="stat"><span className="stat-v">1,240+</span><span className="stat-l">დასრულებული ბილდი</span></div>
            <div className="stat"><span className="stat-v">14 დღე</span><span className="stat-l">ნაწილები + სამუშაო</span></div>
            <div className="stat"><span className="stat-v">4.9★</span><span className="stat-l">287 შეფასება</span></div>
          </div>
        </div>
        <Rpm/>
      </div>
      <Telemetry/>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title">რას<br/>ვ<span className="x">აკეთებთ</span>.</h2>
          <p className="section-sub">ყველა სერვისი ტარდება ჩვენს საბურთალოს ხელოსანში, ოსტატების მიერ რომლებმაც ტექნიკის ხრიდი ჩაიჭირეს. ქვეკონტრაქტორები არ გვყავს, გამოცნობების გარეშე — მხოლოდ დინო-დრო და გასვრილი ხელები.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map(s => {
            const Icon = Icons[s.icon]
            return (
              <div className="svc" key={s.id} onClick={() => onPick(s.id)} style={{ cursor: 'pointer' }}>
                <div className="svc-num">// {s.num}</div>
                <Icon className="svc-icon"/>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
                <div className="svc-price"><span>{s.price}</span><span><b>{s.time}</b></span></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing({ onBook }: { onBook: () => void }) {
  return (
    <section className="section pricing" id="pricing">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title">აირჩიე<br/>შენი <span className="x">სპეცი.</span></h2>
          <p className="section-sub">სამი ფიქსირებული პაკეტი — 80% შემთხვევებისთვის, რასაც ვხვდებით. გჭირდებათ ინდივიდუალური ბილდი? დარეკეთ და საათში მოგცემთ ფასს.</p>
        </div>
        <div className="price-grid">
          {PRICING.map(p => (
            <div className={`price${p.featured ? ' featured' : ''}`} key={p.name}>
              <span className="brk tl"/><span className="brk tr"/><span className="brk bl"/><span className="brk br"/>
              {p.badge && <div className="price-badge">{p.badge}</div>}
              <div className="price-tier">{p.tier}</div>
              <div className="price-name">{p.name}</div>
              <div className="price-amount">
                <span className="cur">₾</span>
                <span className="num">{p.price.toLocaleString()}</span>
                <span className="per">{p.per}</span>
              </div>
              <ul className="price-feats">
                {p.feats.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className={`btn${p.featured ? ' btn-mag' : ''}`} onClick={onBook}>
                {p.cta} <span className="chev"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Booking ──────────────────────────────────────────────────────────────────

interface BookingInfo {
  name: string; phone: string; email: string
  carYear: string; carMake: string; carModel: string; notes: string
}
interface BookingErrors {
  name?: string; phone?: string; email?: string
  carYear?: string; carMake?: string; carModel?: string
}

function Booking({ preSelected, onBookedReset }: { preSelected: string | null; onBookedReset: () => void }) {
  const [step, setStep] = useState(0)
  const [services, setServices] = useState<string[]>(preSelected ? [preSelected] : [])
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [info, setInfo] = useState<BookingInfo>({ name: '', phone: '', email: '', carYear: '', carMake: '', carModel: '', notes: '' })
  const [errors, setErrors] = useState<BookingErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [confirmNum] = useState(() => Math.floor(Math.random() * 90000 + 10000))

  useEffect(() => {
    if (preSelected && !services.includes(preSelected)) {
      setServices(s => [...s, preSelected])
    }
  }, [preSelected]) // eslint-disable-line react-hooks/exhaustive-deps

  const dates = useMemo(() => {
    const out: Date[] = []
    const now = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      out.push(d)
    }
    return out
  }, [])

  const times = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30']
  const isDisabledDate = (d: Date) => d.getDay() === 0
  const isDisabledTime = (t: string, d: Date | null) => {
    if (!d) return false
    return d.getDay() === 6 && parseInt(t) >= 17
  }

  const serviceTotal = services.reduce((sum, id) => {
    const s = SERVICES.find(x => x.id === id)
    if (!s) return sum
    return sum + parseInt(s.price.replace(/\D/g, ''))
  }, 0)

  const validate = () => {
    const e: BookingErrors = {}
    if (!info.name.trim()) e.name = 'სავალდებულო'
    if (!/^[\d\s\-+()]{10,}$/.test(info.phone)) e.phone = 'მიუთითე სწორი ნომერი'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) e.email = 'მიუთითე სწორი ელფოსტა'
    if (!info.carMake.trim()) e.carMake = 'სავალდებულო'
    if (!info.carModel.trim()) e.carModel = 'სავალდებულო'
    if (!/^(19|20)\d{2}$/.test(info.carYear)) e.carYear = '4 ციფრიანი წელი'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const toggle = (id: string) => {
    setServices(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  const next = () => {
    if (step === 0 && services.length === 0) return
    if (step === 1 && (!date || !time)) return
    if (step === 2 && !validate()) return
    setStep(s => Math.min(3, s + 1))
  }

  const lockIn = () => setSubmitted(true)
  const prev = () => setStep(s => Math.max(0, s - 1))

  const reset = () => {
    setStep(0); setServices([]); setDate(null); setTime(null)
    setInfo({ name: '', phone: '', email: '', carYear: '', carMake: '', carModel: '', notes: '' })
    setErrors({}); setSubmitted(false)
    onBookedReset()
  }

  const STEPS = ['სერვისი', 'დრო', 'ინფო', 'დადასტურება']
  const fmtDate = (d: Date | null) => d ? d.toLocaleDateString('ka-GE', { weekday: 'short', month: 'short', day: 'numeric' }) : ''

  return (
    <section className="section booking" id="book" style={{ padding: '80px 0 100px' }}>
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title">დაჯავშნე<br/>ბო<span className="x">ქსი.</span></h2>
          <p className="section-sub">ოთხი სწრაფი ნაბიჯი. დადასტურებას + მომზადების სიას SMS-ით მოგაწვდით. ხშირად ხელმისაწვდომია იმავე დღის სლოტებიც — დარეკე, თუ ვერ პოულობ შესაფერისს.</p>
        </div>
        <div className="book-card">
          <span className="brk tl"/><span className="brk tr"/><span className="brk bl"/><span className="brk br"/>

          <div className="book-steps">
            {STEPS.map((lbl, i) => (
              <div key={lbl} className={`book-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
                <span className="n">{i < step ? '✓' : String(i + 1).padStart(2, '0')}</span>
                <span>{lbl}</span>
              </div>
            ))}
          </div>

          <div className="book-body">
            {step === 0 && (
              <>
                <h3 className="book-h">რას ვაკეთებთ?</h3>
                <p className="book-sub">აირჩიე ერთი ან რამდენიმე. დააწყვილე სერვისები ვიზიტის დაზოგვისთვის.</p>
                <div className="svc-picker">
                  {SERVICES.map(s => {
                    const Icon = Icons[s.icon]
                    const sel = services.includes(s.id)
                    return (
                      <button type="button" key={s.id} className={`svc-chip${sel ? ' sel' : ''}`} onClick={() => toggle(s.id)}>
                        <Icon className="chip-icon"/>
                        <div>
                          <div className="chip-title">{s.title}</div>
                          <div className="chip-sub">{s.price} · {s.time}</div>
                        </div>
                        <span className="chip-check">✓</span>
                      </button>
                    )
                  })}
                </div>
                <div className="book-nav">
                  <span style={{ alignSelf: 'center', color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    {services.length} არჩეული · დაახლ. <b style={{ color: 'var(--neon-cyan)' }}>₾{serviceTotal.toLocaleString()}</b>
                  </span>
                  <button className="btn" disabled={services.length === 0} onClick={next} style={{ opacity: services.length === 0 ? 0.4 : 1 }}>
                    შემდეგი: აირჩიე დრო <span className="chev"/>
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="book-h">როდის შეგიძლია მოსვლა?</h3>
                <p className="book-sub">მომდევნო 14 დღე. შაბათი სწრაფად ივსება — დაჯავშნე ადრე.</p>
                <div className="date-grid">
                  {dates.map((d, i) => {
                    const dis = isDisabledDate(d)
                    const sel = date && d.toDateString() === date.toDateString()
                    return (
                      <button type="button" key={i} className={`date-cell${sel ? ' sel' : ''}${dis ? ' dis' : ''}`} onClick={() => !dis && setDate(d)}>
                        <div className="dow">{d.toLocaleDateString('ka-GE', { weekday: 'short' })}</div>
                        <div className="d">{d.getDate()}</div>
                      </button>
                    )
                  })}
                </div>
                {date && (
                  <>
                    <div style={{ marginTop: 28, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                      ◤ ხელმისაწვდომი დრო · {fmtDate(date)}
                    </div>
                    <div className="time-grid">
                      {times.map(t => {
                        const dis = isDisabledTime(t, date)
                        return (
                          <button type="button" key={t} className={`time-cell${time === t ? ' sel' : ''}${dis ? ' dis' : ''}`} onClick={() => !dis && setTime(t)}>{t}</button>
                        )
                      })}
                    </div>
                  </>
                )}
                <div className="book-nav">
                  <button className="btn btn-ghost" onClick={prev}>← უკან</button>
                  <button className="btn" disabled={!date || !time} onClick={next} style={{ opacity: (!date || !time) ? 0.4 : 1 }}>
                    შემდეგი: შენი ინფო <span className="chev"/>
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="book-h">ვინ ხარ + რაზე ვმუშაობთ?</h3>
                <p className="book-sub">დადასტურებას + მომზადების სიას ქვემოთ მითითებულ ნომერზე გამოგიგზავნით SMS-ით.</p>
                <div className="field-grid">
                  <div className={`field${errors.name ? ' err' : ''}`}>
                    <label>სახელი</label>
                    <input value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} placeholder="შენი სახელი"/>
                    {errors.name && <span className="err-msg">⚠ {errors.name}</span>}
                  </div>
                  <div className={`field${errors.phone ? ' err' : ''}`}>
                    <label>ტელეფონი</label>
                    <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} placeholder="+995 555 12 34 56"/>
                    {errors.phone && <span className="err-msg">⚠ {errors.phone}</span>}
                  </div>
                </div>
                <div className={`field${errors.email ? ' err' : ''}`}>
                  <label>ელფოსტა</label>
                  <input value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} placeholder="you@domain.com"/>
                  {errors.email && <span className="err-msg">⚠ {errors.email}</span>}
                </div>
                <div className="field-grid-3">
                  <div className={`field${errors.carYear ? ' err' : ''}`}>
                    <label>წელი</label>
                    <input value={info.carYear} onChange={e => setInfo({ ...info, carYear: e.target.value })} placeholder="2003"/>
                    {errors.carYear && <span className="err-msg">⚠ {errors.carYear}</span>}
                  </div>
                  <div className={`field${errors.carMake ? ' err' : ''}`}>
                    <label>მარკა</label>
                    <input value={info.carMake} onChange={e => setInfo({ ...info, carMake: e.target.value })} placeholder="Nissan"/>
                    {errors.carMake && <span className="err-msg">⚠ {errors.carMake}</span>}
                  </div>
                  <div className={`field${errors.carModel ? ' err' : ''}`}>
                    <label>მოდელი</label>
                    <input value={info.carModel} onChange={e => setInfo({ ...info, carModel: e.target.value })} placeholder="350Z"/>
                    {errors.carModel && <span className="err-msg">⚠ {errors.carModel}</span>}
                  </div>
                </div>
                <div className="field">
                  <label>კომენტარი (არასავალდებულო)</label>
                  <textarea rows={3} value={info.notes} onChange={e => setInfo({ ...info, notes: e.target.value })} placeholder="უცნაური ხმები, დამატებული მოდები, რა გინდა..."/>
                </div>
                <div className="book-nav">
                  <button className="btn btn-ghost" onClick={prev}>← უკან</button>
                  <button className="btn" onClick={next}>გადახედვა და დადასტურება <span className="chev"/></button>
                </div>
              </>
            )}

            {step === 3 && !submitted && (
              <>
                <h3 className="book-h">დაადასტურე შენი ჯავშანი</h3>
                <p className="book-sub">გადახედე ქვემოთ და დაამოწმე.</p>
                <div className="summary">
                  <h4>◤ ჯავშნის შეჯამება</h4>
                  <div className="sum-row">
                    <span className="k">სერვისები</span>
                    <span className="v">{services.map(id => SERVICES.find(s => s.id === id)?.title ?? id).join(' · ')}</span>
                  </div>
                  <div className="sum-row"><span className="k">როდის</span><span className="v">{fmtDate(date)} · {time}</span></div>
                  <div className="sum-row"><span className="k">კლიენტი</span><span className="v">{info.name}</span></div>
                  <div className="sum-row"><span className="k">კონტაქტი</span><span className="v">{info.phone} · {info.email}</span></div>
                  <div className="sum-row"><span className="k">მანქანა</span><span className="v">{info.carYear} {info.carMake} {info.carModel}</span></div>
                  {info.notes && (
                    <div className="sum-row">
                      <span className="k">კომენტარი</span>
                      <span className="v" style={{ maxWidth: 360, textAlign: 'right', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 14 }}>{info.notes}</span>
                    </div>
                  )}
                  <div className="sum-total"><span className="k">სავარაუდო ფასი იწყება</span><span className="v">₾{serviceTotal.toLocaleString()}-დან</span></div>
                </div>
                <div className="book-nav">
                  <button className="btn btn-ghost" onClick={prev}>← უკან</button>
                  <button className="btn btn-mag" onClick={lockIn}>დადასტურება <span className="chev"/></button>
                </div>
              </>
            )}

            {step === 3 && submitted && (
              <div className="success">
                <div className="success-ring">✓</div>
                <h3>ბოქსი დაჯავშნილია.</h3>
                <p><b style={{ color: 'var(--ink)' }}>{info.phone}</b>-ზე გამოგიგზავნით SMS-ით მომზადების ნაბიჯებს. მოდი 10 წუთით ადრე, რომ მანქანას ერთად დავათვალიეროთ.</p>
                <div className="ticket">
                  <div><div className="t-k">ჯავშნის #</div><div className="t-v">RLG-{confirmNum}</div></div>
                  <div><div className="t-k">ვინ</div><div className="t-v">{info.name}</div></div>
                  <div><div className="t-k">მანქანა</div><div className="t-v">{info.carYear} {info.carMake} {info.carModel}</div></div>
                  <div><div className="t-k">როდის</div><div className="t-v">{fmtDate(date)} · {time}</div></div>
                  <div><div className="t-k">დაახლ.</div><div className="t-v">₾{serviceTotal.toLocaleString()}+</div></div>
                </div>
                <div style={{ marginTop: 32 }}>
                  <button className="btn btn-ghost" onClick={reset}>დაჯავშნე კიდევ →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Visit ────────────────────────────────────────────────────────────────────

function Visit() {
  const days = ['ორშ', 'სამშ', 'ოთხშ', 'ხუთშ', 'პარ', 'შაბ', 'კვ']
  const hrs = ['08:00 – 19:00', '08:00 – 19:00', '08:00 – 19:00', '08:00 – 19:00', '08:00 – 20:00', '09:00 – 17:00', 'დახურულია']
  const today = (new Date().getDay() + 6) % 7

  return (
    <section className="section" id="visit">
      <div className="wrap">
        <div className="section-head">
          <h2 className="section-title">შემო<br/>იარე.</h2>
          <p className="section-sub">სამშაბათ საღამოებით შემოდით შეხვედრებზე — უფასო ყავა, უფასო რჩევა, გაყიდვაზე ზეწოლა არ გელოდებიათ. ქუჩის პარკინგი 18:00-ის შემდეგ.</p>
        </div>
        <div className="visit-grid">
          <div className="hours-card">
            <span className="brk tl"/><span className="brk tr"/><span className="brk bl"/><span className="brk br"/>
            <h3><span className="dot"/> სამუშაო საათები</h3>
            <ul className="hours-list">
              {days.map((d, i) => (
                <li key={d} className={i === today ? 'today' : ''}>
                  <span className="day">{d} {i === today && <span className="now">· ახლა</span>}</span>
                  <span className={`time${hrs[i] === 'დახურულია' ? ' closed' : ''}`}>{hrs[i]}</span>
                </li>
              ))}
            </ul>
            <div className="visit-contact">
              <div className="row"><Icons.Phone className="ic"/><span><b>(032) 555-REV8</b> · ჰკითხეთ დიზელს</span></div>
              <div className="row"><Icons.Mail className="ic"/><span><b>shop@redline.garage</b></span></div>
              <div className="row"><Icons.Pin className="ic"/><span><b>ალ. ყაზბეგის გამზ. 412</b>, საბურთალო, თბილისი 0177</span></div>
              <div className="row"><Icons.Ig className="ic"/><span><b>@redline.underground</b> · 28.4ათ</span></div>
            </div>
          </div>
          <div className="map-card">
            <span className="brk tl"/><span className="brk tr"/><span className="brk bl"/><span className="brk br"/>
            <h3><Icons.Pin style={{ width: 22, height: 22, color: 'var(--neon-mag)' }}/> საბურთალოს ხელოსანი</h3>
            <div className="map">
              <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="gmini" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,240,255,0.08)" strokeWidth="0.5"/>
                  </pattern>
                  <pattern id="gmaj" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,240,255,0.18)" strokeWidth="0.8"/>
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="#020a14"/>
                <rect width="400" height="300" fill="url(#gmini)"/>
                <rect width="400" height="300" fill="url(#gmaj)"/>
                <rect x="40" y="40" width="120" height="70" fill="rgba(0,240,255,0.04)" stroke="rgba(0,240,255,0.2)"/>
                <rect x="40" y="130" width="80" height="60" fill="rgba(0,240,255,0.04)" stroke="rgba(0,240,255,0.2)"/>
                <rect x="140" y="130" width="100" height="60" fill="rgba(0,240,255,0.04)" stroke="rgba(0,240,255,0.2)"/>
                <rect x="260" y="40" width="110" height="90" fill="rgba(0,240,255,0.04)" stroke="rgba(0,240,255,0.2)"/>
                <rect x="260" y="150" width="110" height="100" fill="rgba(0,240,255,0.04)" stroke="rgba(0,240,255,0.2)"/>
                <rect x="40" y="210" width="200" height="60" fill="rgba(255,43,209,0.06)" stroke="rgba(255,43,209,0.25)"/>
                <path d="M0 120 L400 120" stroke="rgba(245,255,60,0.4)" strokeWidth="2" strokeDasharray="8 6"/>
                <path d="M250 0 L250 300" stroke="rgba(245,255,60,0.4)" strokeWidth="2" strokeDasharray="8 6"/>
                <path d="M0 200 L400 200" stroke="rgba(0,240,255,0.3)" strokeWidth="1"/>
                <path d="M0 60 C 150 80, 250 60, 400 80" stroke="rgba(255,43,209,0.5)" strokeWidth="3" fill="none"/>
                <text x="20" y="55" fontFamily="monospace" fontSize="9" fill="rgba(255,43,209,0.7)" letterSpacing="1">თბილისი-რუსთავი ↗</text>
                <text x="130" y="115" fontFamily="monospace" fontSize="9" fill="rgba(245,255,60,0.6)" letterSpacing="1">ყაზბეგის გამზ.</text>
                <text x="200" y="205" fontFamily="monospace" fontSize="8" fill="rgba(0,240,255,0.5)" letterSpacing="1">ვაჟა-ფშაველა</text>
              </svg>
              <div className="map-overlay"/>
              <div className="map-pin">
                <div className="pin-dot"/>
                <div className="pin-label">◤ REDLINE · ყაზბეგის 412</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="#home" className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark">R<span className="brand-x">/</span></span>
              <span>Redline<span className="brand-x">//</span>Garage</span>
            </a>
            <p style={{ color: 'var(--ink-dim)', fontSize: 14, maxWidth: 320, marginTop: 12 }}>
              საბურთალოს ორიგინალური ტიუნერ ხელოსანი. ღიაა 2011 წლიდან — მაინც ოჯახური, მაინც ზეთით ნაცემი.
            </p>
          </div>
          <div>
            <h5>ხელოსანი</h5>
            <ul className="footer-list">
              <li><a href="#services">სერვისები</a></li>
              <li><a href="#pricing">პაკეტები</a></li>
              <li><a href="#book">დაჯავშნე ბოქსი</a></li>
              <li><a href="#visit">საათები</a></li>
            </ul>
          </div>
          <div>
            <h5>კონტაქტი</h5>
            <ul className="footer-list">
              <li>(032) 555-REV8</li>
              <li>shop@redline.garage</li>
              <li>ალ. ყაზბეგის გამზ. 412</li>
              <li>საბურთალო, თბილისი 0177</li>
            </ul>
          </div>
          <div>
            <h5>გამოგვყევით</h5>
            <ul className="footer-list">
              <li><a href="#">@redline.underground</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 Redline Garage · სერტიფიცირებული · ლიც. #B-048291</span>
          <span>◤ აშენდა ქუჩისთვის. მორგდა ტრეკზე. ◥</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Mobile Bottom CTA ───────────────────────────────────────────────────────

function MobileBottomBar({ onBook }: { onBook: () => void }) {
  return (
    <div className="mobile-cta-bar">
      <a href="tel:+995322555738" className="ph" aria-label="დარეკე">
        <Icons.Phone style={{ width: 20, height: 20 }}/>
      </a>
      <button type="button" className="btn btn-mag" onClick={onBook}>
        დაჯავშნე ბოქსი <span className="chev"/>
      </button>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function GarageApp() {
  const [preSelected, setPreSelected] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 60
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  const scrollToBook = useCallback(() => {
    setDrawerOpen(false)
    scrollToSection('book')
  }, [scrollToSection])

  const pickService = (id: string) => {
    setPreSelected(id)
    scrollToBook()
  }

  return (
    <>
      <div className="bp-grid"/>
      <div className="scanlines"/>
      <div className="page">
        <Nav onBook={scrollToBook} onNav={scrollToSection} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
        <Hero onBook={scrollToBook}/>
        <Services onPick={pickService}/>
        <Pricing onBook={scrollToBook}/>
        <Booking preSelected={preSelected} onBookedReset={() => setPreSelected(null)}/>
        <Visit/>
        <Footer/>
      </div>
      <MobileBottomBar onBook={scrollToBook}/>
    </>
  )
}
