import { useState } from 'react'

// ── CIUDADES POR ESTADO ────────────────────────────────────
const CITIES_BY_STATE = {
  'Alabama': ['Birmingham','Montgomery','Huntsville','Mobile','Tuscaloosa'],
  'Alaska': ['Anchorage','Fairbanks','Juneau','Sitka','Ketchikan'],
  'Arizona': ['Phoenix','Tucson','Mesa','Chandler','Scottsdale','Tempe','Gilbert'],
  'Arkansas': ['Little Rock','Fort Smith','Fayetteville','Springdale','Jonesboro'],
  'California': ['Los Angeles','San Diego','San Jose','San Francisco','Fresno','Sacramento','Long Beach','Oakland','Bakersfield','Anaheim','Santa Ana','Riverside','Irvine'],
  'Colorado': ['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood','Pueblo'],
  'Connecticut': ['Bridgeport','New Haven','Hartford','Stamford','Waterbury','Norwalk'],
  'Delaware': ['Wilmington','Dover','Newark','Middletown','Smyrna'],
  'Florida': ['Jacksonville','Miami','Tampa','Orlando','St. Petersburg','Hialeah','Tallahassee','Fort Lauderdale','Cape Coral','Pembroke Pines'],
  'Georgia': ['Atlanta','Columbus','Savannah','Augusta','Athens','Sandy Springs','Macon'],
  'Hawaii': ['Honolulu','Pearl City','Hilo','Kailua','Kapolei'],
  'Idaho': ['Boise','Meridian','Nampa','Idaho Falls','Pocatello'],
  'Illinois': ['Chicago','Aurora','Rockford','Joliet','Naperville','Springfield','Peoria'],
  'Indiana': ['Indianapolis','Fort Wayne','Evansville','South Bend','Carmel','Fishers'],
  'Iowa': ['Des Moines','Cedar Rapids','Davenport','Sioux City','Iowa City'],
  'Kansas': ['Wichita','Overland Park','Kansas City','Olathe','Topeka'],
  'Kentucky': ['Louisville','Lexington','Bowling Green','Owensboro','Covington'],
  'Louisiana': ['New Orleans','Baton Rouge','Shreveport','Lafayette','Lake Charles'],
  'Maine': ['Portland','Lewiston','Bangor','South Portland','Auburn'],
  'Maryland': ['Baltimore','Frederick','Rockville','Gaithersburg','Bowie','Annapolis'],
  'Massachusetts': ['Boston','Worcester','Springfield','Cambridge','Lowell','Brockton'],
  'Michigan': ['Detroit','Grand Rapids','Warren','Sterling Heights','Ann Arbor','Lansing'],
  'Minnesota': ['Minneapolis','Saint Paul','Rochester','Duluth','Bloomington'],
  'Mississippi': ['Jackson','Gulfport','Southaven','Hattiesburg','Biloxi'],
  'Missouri': ['Kansas City','St. Louis','Springfield','Columbia','Independence'],
  'Montana': ['Billings','Missoula','Great Falls','Bozeman','Butte'],
  'Nebraska': ['Omaha','Lincoln','Bellevue','Grand Island','Kearney'],
  'Nevada': ['Las Vegas','Henderson','Reno','North Las Vegas','Sparks'],
  'New Hampshire': ['Manchester','Nashua','Concord','Derry','Dover'],
  'New Jersey': ['Newark','Jersey City','Paterson','Elizabeth','Edison','Trenton'],
  'New Mexico': ['Albuquerque','Las Cruces','Rio Rancho','Santa Fe','Roswell'],
  'New York': ['New York City','Buffalo','Rochester','Yonkers','Syracuse','Albany','New Rochelle'],
  'North Carolina': ['Charlotte','Raleigh','Greensboro','Durham','Winston-Salem','Fayetteville','Cary'],
  'North Dakota': ['Fargo','Bismarck','Grand Forks','Minot','West Fargo'],
  'Ohio': ['Columbus','Cleveland','Cincinnati','Toledo','Akron','Dayton'],
  'Oklahoma': ['Oklahoma City','Tulsa','Norman','Broken Arrow','Edmond'],
  'Oregon': ['Portland','Salem','Eugene','Gresham','Hillsboro','Beaverton'],
  'Pennsylvania': ['Philadelphia','Pittsburgh','Allentown','Erie','Reading','Scranton'],
  'Rhode Island': ['Providence','Cranston','Warwick','Pawtucket','East Providence'],
  'South Carolina': ['Columbia','Charleston','North Charleston','Mount Pleasant','Rock Hill'],
  'South Dakota': ['Sioux Falls','Rapid City','Aberdeen','Brookings','Watertown'],
  'Tennessee': ['Nashville','Memphis','Knoxville','Chattanooga','Clarksville'],
  'Texas': ['Houston','San Antonio','Dallas','Austin','Fort Worth','El Paso','Arlington','Corpus Christi','Plano','Laredo'],
  'Utah': ['Salt Lake City','West Valley City','Provo','West Jordan','Orem','Sandy'],
  'Vermont': ['Burlington','South Burlington','Rutland','Barre','Montpelier'],
  'Virginia': ['Virginia Beach','Norfolk','Chesapeake','Richmond','Newport News','Alexandria'],
  'Washington': ['Seattle','Spokane','Tacoma','Vancouver','Bellevue','Kirkland'],
  'West Virginia': ['Charleston','Huntington','Morgantown','Parkersburg','Wheeling'],
  'Wisconsin': ['Milwaukee','Madison','Green Bay','Kenosha','Racine'],
  'Wyoming': ['Cheyenne','Casper','Laramie','Gillette','Rock Springs'],
  'Puerto Rico': ['San Juan','Bayamón','Carolina','Ponce','Caguas','Guaynabo','Mayagüez','Arecibo'],
}

const US_STATES = Object.keys(CITIES_BY_STATE).sort()

const DEFAULTS = {
  bed: '', bath: '', acre_lot: '', house_size: '',
  zip_code: '', state: '', city: '', status: 'for_sale',
  years_since_last_sale: '2',
}

// ── Input numérico — FUERA del componente para evitar perder foco ──
function NumInput({ value, onChange, placeholder, step, label, hint, error }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        type="number"
        step={step || 1}
        placeholder={placeholder || '0'}
        value={value}
        onChange={onChange}
        style={{ ...s.input, ...(error ? s.inputErr : {}) }}
      />
      {hint  && <span style={s.hint}>{hint}</span>}
      {error && <span style={s.errMsg}>{error}</span>}
    </div>
  )
}

export default function PropertyForm({ onResult, onLoading }) {
  const [v, setV]     = useState(DEFAULTS)
  const [err, setErr] = useState({})

  const set = (k, val) => setV(prev => ({ ...prev, [k]: val }))

  // Al cambiar estado, resetear ciudad
  const handleStateChange = (newState) => {
    setV(prev => ({ ...prev, state: newState, city: '' }))
  }

  const cities = v.state ? (CITIES_BY_STATE[v.state] || []) : []

  const validate = () => {
    const e = {}
    const required = ['bed','bath','acre_lot','house_size','zip_code','state','city']
    required.forEach(k => {
      if (!v[k] || v[k] === '') e[k] = 'Requerido'
    })
    if (v.bed  && Number(v.bed)  <= 0) e.bed  = 'Debe ser > 0'
    if (v.bath && Number(v.bath) <= 0) e.bath = 'Debe ser > 0'
    if (v.house_size && Number(v.house_size) <= 0) e.house_size = 'Debe ser > 0'
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

  return (
    <div style={s.card}>
      <div style={s.cardHead}>
        <div style={s.cardIcon}>📋</div>
        <div>
          <h2 style={s.cardTitle}>Características de la Propiedad</h2>
          <p style={s.cardSub}>Completa los atributos para obtener la clasificación de precio.</p>
        </div>
      </div>

      {/* ── Sección 1: Dimensiones ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}><span style={s.dot}/> Dimensiones físicas</div>
        <div style={s.grid2}>
          <NumInput
            label="Habitaciones" hint="cuartos"
            value={v.bed} onChange={e => set('bed', e.target.value)}
            error={err.bed}
          />
          <NumInput
            label="Baños" hint="baños" step={0.5}
            value={v.bath} onChange={e => set('bath', e.target.value)}
            error={err.bath}
          />
          <NumInput
            label="Área de la casa" hint="sq ft" placeholder="1500"
            value={v.house_size} onChange={e => set('house_size', e.target.value)}
            error={err.house_size}
          />
          <NumInput
            label="Tamaño del lote" hint="acres" step={0.01} placeholder="0.25"
            value={v.acre_lot} onChange={e => set('acre_lot', e.target.value)}
            error={err.acre_lot}
          />
        </div>
      </div>

      {/* ── Sección 2: Ubicación ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}><span style={s.dot}/> Ubicación</div>
        <div style={s.grid2}>

          {/* Estado */}
          <div style={s.field}>
            <label style={s.label}>Estado</label>
            <select
              value={v.state}
              onChange={e => handleStateChange(e.target.value)}
              style={{ ...s.input, ...s.select, ...(err.state ? s.inputErr : {}) }}
            >
              <option value="">Selecciona un estado...</option>
              {US_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            {err.state && <span style={s.errMsg}>{err.state}</span>}
          </div>

          {/* Ciudad — depende del estado */}
          <div style={s.field}>
            <label style={s.label}>Ciudad</label>
            <select
              value={v.city}
              onChange={e => set('city', e.target.value)}
              disabled={!v.state}
              style={{
                ...s.input, ...s.select,
                ...(err.city ? s.inputErr : {}),
                ...(!v.state ? s.selectDisabled : {}),
              }}
            >
              <option value="">
                {v.state ? 'Selecciona una ciudad...' : '← Elige un estado primero'}
              </option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {err.city && <span style={s.errMsg}>{err.city}</span>}
          </div>

          <NumInput
            label="Código ZIP" placeholder="78701"
            value={v.zip_code} onChange={e => set('zip_code', e.target.value)}
            error={err.zip_code}
          />
        </div>
      </div>

      {/* ── Sección 3: Listado ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}><span style={s.dot}/> Estado del listado</div>
        <div style={s.grid2}>
          <div style={s.field}>
            <label style={s.label}>Estado del inmueble</label>
            <div style={s.toggle}>
              {['for_sale', 'sold'].map(opt => (
                <button
                  key={opt}
                  onClick={() => set('status', opt)}
                  style={{ ...s.toggleBtn, ...(v.status === opt ? s.toggleActive : {}) }}
                >
                  {opt === 'for_sale' ? '🏷️ En venta' : '✅ Vendida'}
                </button>
              ))}
            </div>
          </div>
          <NumInput
            label="Años desde última venta" hint="años"
            value={v.years_since_last_sale}
            onChange={e => set('years_since_last_sale', e.target.value)}
            error={err.years_since_last_sale}
          />
        </div>
      </div>

      {/* ── Acciones ── */}
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
    paddingTop: '1rem', borderTop: '1px solid var(--border)',
  },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: '0.72rem', fontWeight: 600,
    color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  dot: {
    width: 7, height: 7, borderRadius: '50%',
    background: 'var(--orange)', flexShrink: 0,
  },

  grid2:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' },
  field:    { display: 'flex', flexDirection: 'column', gap: 4 },
  label:    { fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' },
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
  inputErr:      { borderColor: '#f87171' },
  select:        { cursor: 'pointer', appearance: 'auto' },
  selectDisabled:{ opacity: 0.45, cursor: 'not-allowed' },
  hint:          { fontSize: '0.68rem', color: 'var(--text-light)' },
  errMsg:        { fontSize: '0.68rem', color: '#ef4444' },

  toggle: { display: 'flex', gap: 6 },
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

  actions: {
    display: 'flex', gap: '0.75rem',
    justifyContent: 'flex-end', paddingTop: '0.5rem',
  },
  btnReset: {
    padding: '0.65rem 1.25rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font)',
    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
  },
  btnSubmit: {
    padding: '0.65rem 1.6rem',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, var(--navy), #2d5282)',
    color: '#fff',
    fontFamily: 'var(--font)',
    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
  },
}