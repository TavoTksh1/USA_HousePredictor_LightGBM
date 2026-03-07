const categoryConfig = {
  High: {
    color: 'var(--high)',
    bg: 'rgba(200,241,53,0.06)',
    border: 'rgba(200,241,53,0.2)',
    icon: '▲',
    label: 'HIGH VALUE',
  },
  Medium: {
    color: 'var(--medium)',
    bg: 'rgba(245,197,24,0.06)',
    border: 'rgba(245,197,24,0.2)',
    icon: '◆',
    label: 'MID RANGE',
  },
  Low: {
    color: 'var(--low)',
    bg: 'rgba(255,107,107,0.06)',
    border: 'rgba(255,107,107,0.2)',
    icon: '▼',
    label: 'REDUCED PRICE',
  },
}

export default function ResultCard({ result }) {
  if (!result) return null

  if (result.error) {
    return (
      <div style={{ ...styles.card, borderColor: 'rgba(255,107,107,0.3)' }}>
        <div style={styles.errorState}>
          <span style={styles.errorIcon}>⚠</span>
          <p style={styles.errorTitle}>Prediction Failed</p>
          <p style={styles.errorMsg}>{result.error}</p>
          <p style={styles.errorHint}>Make sure the FastAPI server is running on port 8000.</p>
        </div>
      </div>
    )
  }

  const cat = result.categoria
  const cfg = categoryConfig[cat] || categoryConfig['Medium']

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.tag}>RESULT</span>
        <h2 style={styles.title}>Prediction Output</h2>
      </div>

      {/* Category badge */}
      <div style={{ ...styles.badge, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
        <span style={{ ...styles.badgeIcon, color: cfg.color }}>{cfg.icon}</span>
        <div>
          <p style={{ ...styles.badgeLabel, color: cfg.color }}>{cfg.label}</p>
          <p style={styles.badgeCategory}>{cat}</p>
        </div>
        <div style={{ ...styles.pulse, background: cfg.color }} />
      </div>

      {/* Action */}
      <div style={styles.actionBox}>
        <p style={styles.actionTitle}>Automated Action</p>
        <p style={styles.actionText}>{result.accion_automatizada}</p>
      </div>

      {/* Status */}
      <div style={styles.statusRow}>
        <span style={styles.statusDot} />
        <span style={styles.statusText}>Status: {result.status}</span>
        <span style={styles.timestamp}>{new Date().toLocaleTimeString()}</span>
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
    gap: '1.25rem',
    animation: 'fadeUp 0.4s ease both',
  },
  header: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  tag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    color: 'var(--accent2)',
    background: 'rgba(91,91,214,0.1)',
    border: '1px solid rgba(91,91,214,0.25)',
    padding: '2px 8px',
    borderRadius: '4px',
    width: 'fit-content',
  },
  title: { fontSize: '1.4rem', fontWeight: 700 },
  badge: {
    borderRadius: '10px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  badgeIcon: { fontSize: '1.8rem', lineHeight: 1 },
  badgeLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    marginBottom: '2px',
  },
  badgeCategory: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' },
  pulse: {
    position: 'absolute',
    right: '-20px',
    top: '-20px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    opacity: 0.07,
    filter: 'blur(20px)',
  },
  actionBox: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  actionTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  actionText: { fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)' },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingTop: '0.25rem',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--high)',
    flexShrink: 0,
  },
  statusText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  timestamp: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    marginLeft: 'auto',
    opacity: 0.6,
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.5rem',
    padding: '1rem',
  },
  errorIcon: { fontSize: '2rem' },
  errorTitle: { fontWeight: 700, color: 'var(--low)', fontSize: '1rem' },
  errorMsg: { fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' },
  errorHint: { fontSize: '0.78rem', color: 'var(--text-muted)', opacity: 0.7 },
}