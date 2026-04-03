import { useState } from 'react'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado',
  'Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho',
  'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
  'Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York',
  'North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
  'Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington',
  'West Virginia','Wisconsin','Wyoming','Puerto Rico',
]

const DEFAULTS = {
  bed: '', bath: '', acre_lot: '', house_size: '',
  zip_code: '', state: '', city: '', status: 'for_sale',
  years_since_last_sale: '2',
}

export default function PropertyForm({ onResult, onLoading }) {
  const [v, setV]   = useState(DEFAULTS)
  const [err, setErr] = useState({})

  const set = (k, val) => setV(prev => ({ ...prev, [k]: val }))

  const validate = () => {
    const e = {}
    const required = ['bed','bath','acre_lot','house_size','zip_code','state','city']
    required.forEach(k => {
      if (!v[k] || v[k] === '') e[k] = 'Requerido'
    })
    if (v.bed && Number(v.bed) <= 0)        e.bed   = '> 0'
    if (v.bath && Number(v.bath) <= 0)      e.bath  = '> 0'
    if (v.house_size && Number(v.house_size) <= 0) e.house_size = '> 0'
    setErr(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    onLoading(true)
    try {
      const payload = {
        bed:    parseFloat(v.bed),
        bath:   parseFloat(v.bath),
        acre_lot:   parseFloat(v.acre_lot) || 0.1,
        house_size: parseFloat(v.house_size),
        zip_code:   parseFloat(v.zip_code),
        state:  v.state,
        city:   v.city,
        status: v.status,
        years_since_last_sale: parseFloat(v.years_since_last_sale) || 2,
      }
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      onResult(await res.json())
    } catch (e) {
      onResult({ error: e.message })
    } finally {
      onLoading(false)
    }
  }

  const Input = ({ fkey, label, type='number', placeholder, step=1, hint }) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        step={step}
        placeholder={placeholder || '0'}
        value={v[fkey]}
        onChange={e => set(fkey, e.target.value)}
        style={{ ...s.input, ...(err[fkey] ? s.inputErr : {}) }}
      />
      {hint && <span style={s.hint}>{hint}</span>}
      {err[fkey] && <span style={s.errMsg}>{err[fkey]}</span>}
    </div>
  )

  return (
    <div style={s.card}>
      <div style={s.cardHead}>
        <div style={s.cardIcon}>📋</div>
        <div>
          <h2 style={s.cardTitle}>Características de la Propiedad</h2>
          <p style={s.cardSub}>Completa los atributos para obtener la clasificación de precio.</p>
        </div>
      </div>

      {/* Section 1: Specs */}
      <div style={s.section}>
        <div style={s.sectionLabel}>
          <span style={s.sectionDot}/> Dimensiones físicas
        </div>
        <div style={s.grid2}>
          <Input fkey="bed"        label="Habitaciones"    hint="cuartos"   />
          <Input fkey="bath"       label="Baños"           step={0.5} hint="baños" />
          <Input fkey="house_size" label="Área de la casa" hint="sq ft" placeholder="1500" />
          <Input fkey="acre_lot"   label="Tamaño del lote" step={0.01} hint="acres" placeholder="0.25" />
        </div>
      </div>

      {/* Section 2: Location */}
      <div style={s.section}>
        <div style={s.sectionLabel}>
          <span style={s.sectionDot}/> Ubicación
        </div>
        <div style={s.grid2}>
          {/* State dropdown */}
          <div style={s.field}>
            <label style={s.label}>Estado</label>
            <select
              value={v.state}
              onChange={e => set('state', e.target.value)}
              style={{ ...s.input, ...s.select, ...(err.state ? s.inputErr : {}) }}
            >
              <option value="">Selecciona...</option>
              {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
            {err.state && <span style={s.errMsg}>{err.state}</span>}
          </div>

          {/* City */}
          <div style={s.field}>
            <label style={s.label}>Ciudad</label>
            <input
              type="text"
              placeholder="Ej: Austin"
              value={v.city}
              onChange={e => set('city', e.target.value)}
              style={{ ...s.input, ...(err.city ? s.inputErr : {}) }}
            />
            {err.city && <span style={s.errMsg}>{err.city}</span>}
          </div>

          <Input fkey="zip_code" label="Código ZIP" type="number" placeholder="78701" />
        </div>
      </div>

      {/* Section 3: Listing */}
      <div style={s.section}>
        <div style={s.sectionLabel}>
          <span style={s.sectionDot}/> Estado del listado
        </div>
        <div style={s.grid2}>
          {/* Status toggle */}
          <div style={s.field}>
            <label style={s.label}>Estado del inmueble</label>
            <div style={s.toggle}>
              {['for_sale','sold'].map(opt => (
                <button
                  key={opt}
                  onClick={() => set('status', opt)}
                  style={{
                    ...s.toggleBtn,
                    ...(v.status === opt ? s.toggleActive : {}),
                  }}
                >
                  {opt === 'for_sale' ? '🏷️ En venta' : '✅ Vendida'}
                </button>
              ))}
            </div>
          </div>
          <Input fkey="years_since_last_sale" label="Años desde última venta" step={1} hint="años" />
        </div>
      </div>

      {/* Actions */}
      <div style={s.actions}>
        <button
          onClick={() => { setV(DEFAULTS); setErr({}); onResult(null) }}
          style={s.btnReset}
        >
          Limpiar
        </button>
        <button onClick={handleSubmit} style={s.btnSubmit}>
          Predecir categoría →
        </button>
      </div>
    </div>
  )
}

const s = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow)',
    padding: '1.75rem',
    display: 'flex', flexDirection: 'column', gap: '1.5rem',
  },
  cardHead: { display: 'flex', gap: '0.85rem', alignItems: 'flex-start' },
  cardIcon: {
    width: 42, height: 42, borderRadius: 10,
    background: '#fff7ed', border: '1px solid #fed7aa',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem', flexShrink: 0,
  },
  cardTitle: { fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' },
  cardSub:   { fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 },

  section: {
    display: 'flex', flexDirection: 'column', gap: '0.85rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)',
  },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: '0.72rem', fontWeight: 600,
    color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  sectionDot: {
    width: 7, height: 7, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0,
  },

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' },
  input: {
    padding: '0.6rem 0.85rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontFamily: 'var(--font)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  inputErr: { borderColor: '#f87171' },
  select:   { cursor: 'pointer' },
  hint:     { fontSize: '0.68rem', color: 'var(--text-light)' },
  errMsg:   { fontSize: '0.68rem', color: '#ef4444' },

  toggle: {
    display: 'flex', gap: 6,
  },
  toggleBtn: {
    flex: 1, padding: '0.55rem 0.5rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    fontSize: '0.8rem', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'var(--font)',
  },
  toggleActive: {
    background: '#fff7ed',
    border: '1.5px solid var(--orange)',
    color: '#c2410c', fontWeight: 700,
  },

  actions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' },
  btnReset: {
    padding: '0.65rem 1.25rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font)',
    fontWeight: 600, fontSize: '0.85rem',
    cursor: 'pointer',
  },
  btnSubmit: {
    padding: '0.65rem 1.6rem',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, var(--navy), #2d5282)',
    color: '#fff',
    fontFamily: 'var(--font)',
    fontWeight: 700, fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
  },
}