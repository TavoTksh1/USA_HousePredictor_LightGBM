import { useState } from 'react'
import PropertyForm from './components/PropertyForm'
import ResultCard from './components/ResultCard'
import './index.css'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoMark}>⬡</span>
            <span style={styles.logoText}>PropPredict</span>
          </div>
          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            <span style={styles.statusLabel}>API Connected</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <p style={styles.heroEyebrow}>Real Estate · ML Powered</p>
        <h1 style={styles.heroTitle}>
          Price Category
          <br />
          <span style={styles.heroAccent}>Predictor</span>
        </h1>
        <p style={styles.heroSub}>
          Enter property attributes below and get an instant price category prediction
          powered by a Random Forest model.
        </p>
      </section>

      {/* Main layout */}
      <main style={styles.main}>
        <div style={styles.formCol}>
          <PropertyForm onResult={setResult} onLoading={setLoading} />
        </div>

        <div style={styles.resultCol}>
          {loading ? (
            <div style={styles.loadingCard}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Running model...</p>
            </div>
          ) : result ? (
            <ResultCard result={result} />
          ) : (
            <div style={styles.emptyCard}>
              <span style={styles.emptyIcon}>◎</span>
              <p style={styles.emptyTitle}>Awaiting Input</p>
              <p style={styles.emptySub}>Fill in the form and hit Run Prediction to see the result here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>FastAPI · scikit-learn · React · Vite</span>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  header: {
    borderBottom: '1px solid var(--border)',
    padding: '1rem 0',
    marginBottom: '3rem',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoMark: { fontSize: '1.3rem', color: 'var(--accent)' },
  logoText: { fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '999px',
    padding: '4px 12px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--high)',
  },
  statusLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  hero: {
    marginBottom: '2.5rem',
    animation: 'fadeUp 0.5s ease both',
  },
  heroEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    marginBottom: '1rem',
  },
  heroAccent: { color: 'var(--accent)' },
  heroSub: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    maxWidth: '480px',
    lineHeight: 1.7,
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    flex: 1,
    alignItems: 'start',
  },
  formCol: { animation: 'fadeUp 0.5s ease 0.1s both' },
  resultCol: { animation: 'fadeUp 0.5s ease 0.2s both' },
  loadingCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '2px solid var(--border)',
    borderTop: '2px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  emptyCard: {
    background: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius)',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.75rem',
  },
  emptyIcon: { fontSize: '2rem', color: 'var(--text-muted)', opacity: 0.4 },
  emptyTitle: { fontWeight: 700, color: 'var(--text-muted)', fontSize: '1rem' },
  emptySub: { fontSize: '0.82rem', color: 'var(--text-muted)', opacity: 0.6, lineHeight: 1.6, maxWidth: '240px' },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '1.25rem 0',
    marginTop: '3rem',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    opacity: 0.5,
  },
}