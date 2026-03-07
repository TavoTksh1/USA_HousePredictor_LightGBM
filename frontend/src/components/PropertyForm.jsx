import { useState } from 'react'

const fields = [
  { key: 'bed',        label: 'Bedrooms',       unit: 'rooms',  step: 1,   min: 0 },
  { key: 'bath',       label: 'Bathrooms',      unit: 'rooms',  step: 0.5, min: 0 },
  { key: 'acre_lot',   label: 'Lot Size',       unit: 'acres',  step: 0.01,min: 0 },
  { key: 'house_size', label: 'House Size',     unit: 'sq ft',  step: 10,  min: 0 },
]

const defaultValues = { bed: '', bath: '', acre_lot: '', house_size: '' }

export default function PropertyForm({ onResult, onLoading }) {
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState(null)

  const validate = () => {
    const e = {}
    fields.forEach(f => {
      if (values[f.key] === '' || isNaN(Number(values[f.key]))) {
        e[f.key] = 'Required'
      } else if (Number(values[f.key]) < 0) {
        e[f.key] = 'Must be ≥ 0'
      }
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    onLoading(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, parseFloat(v)])
      )
      const res = await fetch('http://ec2-44-220-152-125.compute-1.amazonaws.com :8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      onResult(data)
    } catch (err) {
      onResult({ error: err.message })
    } finally {
      onLoading(false)
    }
  }

  const handleReset = () => {
    setValues(defaultValues)
    setErrors({})
    onResult(null)
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.tag}>INPUT</span>
        <h2 style={styles.cardTitle}>Property Details</h2>
        <p style={styles.cardSub}>Fill in the property attributes to get a price category prediction.</p>
      </div>

      <div style={styles.grid}>
        {fields.map((f, i) => (
          <div key={f.key} style={{ ...styles.fieldWrap, animationDelay: `${i * 60}ms` }}>
            <label style={styles.label}>{f.label}</label>
            <div style={{
              ...styles.inputWrap,
              ...(focused === f.key ? styles.inputWrapFocused : {}),
              ...(errors[f.key] ? styles.inputWrapError : {}),
            }}>
              <input
                type="number"
                step={f.step}
                min={f.min}
                value={values[f.key]}
                onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused(null)}
                placeholder="0"
                style={styles.input}
              />
              <span style={styles.unit}>{f.unit}</span>
            </div>
            {errors[f.key] && <span style={styles.error}>{errors[f.key]}</span>}
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <button onClick={handleReset} style={styles.btnReset}>Reset</button>
        <button onClick={handleSubmit} style={styles.btnSubmit}>
          <span>Run Prediction</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cardHeader: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  tag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    color: 'var(--accent)',
    background: 'rgba(200,241,53,0.08)',
    border: '1px solid rgba(200,241,53,0.2)',
    padding: '2px 8px',
    borderRadius: '4px',
    width: 'fit-content',
  },
  cardTitle: { fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' },
  cardSub: { fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    animation: 'fadeUp 0.4s ease both',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputWrapFocused: {
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px rgba(200,241,53,0.12)',
  },
  inputWrapError: {
    borderColor: 'var(--low)',
    boxShadow: '0 0 0 3px rgba(255,107,107,0.1)',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.95rem',
    padding: '0.6rem 0.8rem',
    width: '100%',
  },
  unit: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    padding: '0 0.7rem',
    borderLeft: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  error: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--low)',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  btnReset: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.85rem',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
  btnSubmit: {
    background: 'var(--accent)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0f',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    padding: '0.6rem 1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'opacity 0.2s, transform 0.1s',
  },
}