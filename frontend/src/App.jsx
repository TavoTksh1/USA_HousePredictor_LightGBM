import { useState } from 'react'
import PropertyForm from './components/PropertyForm'
import ResultPanel from './components/ResultPanel'
import './index.css'

export default function App() {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div style={s.root}>

      {/* ── Top bar ── */}
      <header style={s.topbar}>
        <div style={s.topbarInner}>
          <div style={s.brand}>
            <div style={s.brandIcon}>🏡</div>
            <div>
              <div style={s.brandName}>PropPredict</div>
              <div style={s.brandSub}>Valoración con IA</div>
            </div>
          </div>
          <div style={s.badges}>
            <span style={s.badge}>LightGBM</span>
            <span style={s.badge}>Acc 77.7%</span>
            <span style={{...s.badge, ...s.badgeLive}}>
              <span style={s.liveDot}/>LIVE
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <p style={s.heroEye}>Modelo de Aprendizaje Supervisado · Dataset USA Real Estate</p>
          <h1 style={s.heroTitle}>
            ¿En qué segmento<br/>
            <span style={s.heroHighlight}>cae tu propiedad?</span>
          </h1>
          <p style={s.heroDesc}>
            Ingresa las características del inmueble y obtén en segundos
            una clasificación de precio (<strong>Bajo · Medio · Alto</strong>)
            respaldada por un modelo entrenado en más de 100.000 propiedades reales.
          </p>
        </div>
        {/* Decorative stat cards */}
        <div style={s.stats}>
          {[
            { label: 'Propiedades entrenadas', value: '108K+' },
            { label: 'Accuracy del modelo',    value: '77.7%' },
            { label: 'ROC-AUC',                value: '91.8%' },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={s.statValue}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main grid ── */}
      <main style={s.main}>
        <div style={s.formCol}>
          <PropertyForm onResult={setResult} onLoading={setLoading} />
        </div>
        <div style={s.resultCol}>
          <ResultPanel result={result} loading={loading} />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <span>
          Parcial Corte 2 · Aprendizaje Supervisado ·{' '}
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.75rem'}}>
            FastAPI + React + LightGBM
          </span>
        </span>
      </footer>
    </div>
  )
}

const s = {
  root: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },

  topbar: {
    background: 'var(--navy)',
    position: 'sticky', top: 0, zIndex: 100,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  topbarInner: {
    maxWidth: 1200, margin: '0 auto', padding: '0.9rem 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  brandIcon: {
    width: 38, height: 38, borderRadius: 10,
    background: 'rgba(249,115,22,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem',
  },
  brandName: { color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 },
  brandSub:  { color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' },

  badges: { display: 'flex', gap: '0.5rem' },
  badge: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: 999, padding: '3px 10px',
    fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
  },
  badgeLive: {
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.3)',
    color: '#4ade80',
    display: 'flex', alignItems: 'center', gap: 5,
  },
  liveDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#4ade80',
    animation: 'pulse 1.5s ease infinite',
  },

  hero: {
    background: 'linear-gradient(135deg, var(--navy) 0%, #2d5282 100%)',
    color: '#fff', padding: '3.5rem 2rem 3rem',
  },
  heroInner: { maxWidth: 1200, margin: '0 auto', marginBottom: '2.5rem' },
  heroEye: {
    color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: '1rem',
  },
  heroTitle: {
    fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800,
    lineHeight: 1.1, marginBottom: '1.2rem', letterSpacing: '-0.02em',
  },
  heroHighlight: { color: '#fb923c' },
  heroDesc: {
    color: 'rgba(255,255,255,0.65)', fontSize: '1rem',
    lineHeight: 1.7, maxWidth: 560,
  },
  stats: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', gap: '1rem', flexWrap: 'wrap',
  },
  statCard: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 'var(--radius)', padding: '1rem 1.5rem', minWidth: 150,
  },
  statValue: { fontSize: '1.8rem', fontWeight: 800, color: '#fb923c', lineHeight: 1 },
  statLabel: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 },

  main: {
    maxWidth: 1200, margin: '2rem auto', padding: '0 2rem',
    display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
    gap: '1.5rem', alignItems: 'start', flex: 1,
  },
  formCol:   { animation: 'fadeUp 0.5s ease 0.1s both' },
  resultCol: { animation: 'fadeUp 0.5s ease 0.25s both' },

  footer: {
    borderTop: '1px solid var(--border)',
    textAlign: 'center', padding: '1.5rem',
    color: 'var(--text-muted)', fontSize: '0.8rem',
    marginTop: 'auto',
  },
}