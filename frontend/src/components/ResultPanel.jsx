const CFG = {
  High:   { color: 'var(--high)',   bg: 'var(--high-bg)',   border: 'var(--high-border)',   label: 'PRECIO ALTO',      icon: '🏆', bar: '#7c3aed' },
  Medium: { color: 'var(--medium)', bg: 'var(--medium-bg)', border: 'var(--medium-border)', label: 'PRECIO MEDIO',     icon: '🏠', bar: '#d97706' },
  Low:    { color: 'var(--low)',     bg: 'var(--low-bg)',    border: 'var(--low-border)',    label: 'PRECIO ACCESIBLE', icon: '🔑', bar: '#2563eb' },
}

// ── Probability bar chart ──────────────────────────────────
function ProbChart({ probs }) {
  const entries = Object.entries(probs).sort((a, b) => b[1] - a[1])
  return (
    <div style={ps.chartWrap}>
      <div style={ps.chartTitle}>Distribución de probabilidad</div>
      {entries.map(([cat, p]) => {
        const cfg = CFG[cat] || CFG.Medium
        const pct = (p * 100).toFixed(1)
        return (
          <div key={cat} style={ps.barRow}>
            <div style={ps.barLabel}>
              <span style={ps.barCat}>{cat}</span>
              <span style={{ ...ps.barPct, color: cfg.color }}>{pct}%</span>
            </div>
            <div style={ps.barTrack}>
              <div style={{
                ...ps.barFill,
                width: `${pct}%`,
                background: cfg.bar,
                animation: `fillBar 0.9s ease both`,
              }}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Donut for top probability ──────────────────────────────
function Donut({ pct, color }) {
  const r = 38, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      <circle cx={48} cy={48} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10}/>
      <circle cx={48} cy={48} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x={48} y={52} textAnchor="middle"
        style={{ fontSize: 13, fontWeight: 800, fill: color, fontFamily: 'var(--font)' }}>
        {pct.toFixed(0)}%
      </text>
    </svg>
  )
}

export default function ResultPanel({ result, loading }) {

  if (loading) return (
    <div style={ps.card}>
      <div style={ps.center}>
        <div style={ps.spinner}/>
        <p style={ps.loadText}>Ejecutando modelo LightGBM...</p>
      </div>
    </div>
  )

  if (!result) return (
    <div style={{ ...ps.card, ...ps.emptyCard }}>
      <div style={ps.center}>
        <div style={ps.emptyIcon}>🏘️</div>
        <p style={ps.emptyTitle}>Resultado aparecerá aquí</p>
        <p style={ps.emptySub}>Completa el formulario y presiona <strong>Predecir categoría</strong>.</p>
      </div>
    </div>
  )

  if (result.error) return (
    <div style={ps.card}>
      <div style={{ ...ps.center, gap: '0.6rem' }}>
        <span style={{ fontSize: '2rem' }}>⚠️</span>
        <p style={{ fontWeight: 700, color: '#ef4444' }}>Error de conexión</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{result.error}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
          Verifica que FastAPI esté corriendo: <code>uvicorn main:app --reload</code>
        </p>
      </div>
    </div>
  )

  const cat = result.categoria
  const cfg = CFG[cat] || CFG.Medium
  const topProb = result.probabilidades[cat] * 100

  return (
    <div style={ps.card}>

      {/* ── Category header ── */}
      <div style={{ ...ps.catBanner, background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
        <div style={ps.catLeft}>
          <Donut pct={topProb} color={cfg.bar} />
          <div>
            <div style={{ ...ps.catLabel, color: cfg.color }}>{cfg.label}</div>
            <div style={ps.catName}>{cat}</div>
            <div style={{ ...ps.catConfidence, color: cfg.color }}>
              Confianza: {topProb.toFixed(1)}%
            </div>
          </div>
        </div>
        <div style={ps.catEmoji}>{cfg.icon}</div>
      </div>

      {/* ── Probability chart ── */}
      {result.probabilidades && <ProbChart probs={result.probabilidades} />}

      {/* ── Segmento + acción ── */}
      <div style={ps.actionBox}>
        <div style={ps.actionHead}>
          <span style={ps.actionDot}/>
          <span style={ps.actionTitle}>{result.titulo_segmento}</span>
        </div>
        <p style={ps.actionText}>{result.accion_automatizada}</p>
      </div>

      {/* ── KPI ── */}
      <div style={ps.kpiRow}>
        <div style={ps.kpiIcon}>📈</div>
        <p style={ps.kpiText}>{result.kpi}</p>
      </div>

      {/* ── Alerta opcional ── */}
      {result.alerta && (
        <div style={ps.alertBox}>
          <span>🔔</span>
          <span>{result.alerta}</span>
        </div>
      )}

      {/* ── Footer timestamp ── */}
      <div style={ps.ts}>
        <span style={ps.tsDot}/>
        Predicción generada a las {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

const ps = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow)',
    padding: '1.75rem',
    display: 'flex', flexDirection: 'column', gap: '1.25rem',
    animation: 'fadeUp 0.4s ease both',
  },
  emptyCard: { minHeight: 360 },
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', gap: '0.75rem', flex: 1, padding: '2rem',
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--navy)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadText:  { fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  emptyIcon: { fontSize: '3rem', opacity: 0.25 },
  emptyTitle:{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '1.05rem' },
  emptySub:  { fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.6, maxWidth: 260 },

  catBanner: {
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  catLeft:       { display: 'flex', alignItems: 'center', gap: '1rem' },
  catLabel:      { fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' },
  catName:       { fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 },
  catConfidence: { fontSize: '0.78rem', fontWeight: 600, marginTop: 2 },
  catEmoji:      { fontSize: '2.5rem', opacity: 0.6 },

  chartWrap: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  chartTitle:{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  barRow:    { display: 'flex', flexDirection: 'column', gap: 3 },
  barLabel:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  barCat:    { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' },
  barPct:    { fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' },
  barTrack:  { height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' },
  barFill:   { height: '100%', borderRadius: 99, minWidth: 4 },

  actionBox: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '1rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
  },
  actionHead: { display: 'flex', alignItems: 'center', gap: 7 },
  actionDot:  { width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 },
  actionTitle:{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  actionText: { fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6 },

  kpiRow:  {
    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
  },
  kpiIcon: { fontSize: '1rem', flexShrink: 0 },
  kpiText: { fontSize: '0.85rem', color: '#15803d', fontWeight: 500, lineHeight: 1.5 },

  alertBox: {
    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
    background: '#fff7ed', border: '1px solid #fed7aa',
    borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
    fontSize: '0.83rem', color: '#c2410c', fontWeight: 500,
  },

  ts: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: '0.7rem', color: 'var(--text-light)',
    fontFamily: 'var(--font-mono)',
    paddingTop: '0.25rem', borderTop: '1px solid var(--border)',
  },
  tsDot: { width: 6, height: 6, borderRadius: '50%', background: '#4ade80' },
}