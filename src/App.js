import { useEffect, useState } from 'react';
import './App.css';

const TOPICS = [
  {
    id: 'ohm',
    title: 'Leyes de Ohm',
    description: 'Calcula tensión, corriente y resistencia a partir de los datos del circuito.',
    parameterOptions: [
      { id: 'voltage', label: 'Tensión', inputs: ['current', 'resistance'] },
      { id: 'current', label: 'Corriente', inputs: ['voltage', 'resistance'] },
      { id: 'resistance', label: 'Resistencia', inputs: ['voltage', 'current'] },
    ],
    inputMap: {
      voltage: [{ label: 'Corriente (A)', type: 'number' }, { label: 'Resistencia (Ω)', type: 'number' }],
      current: [{ label: 'Tensión (V)', type: 'number' }, { label: 'Resistencia (Ω)', type: 'number' }],
      resistance: [{ label: 'Tensión (V)', type: 'number' }, { label: 'Corriente (A)', type: 'number' }],
    },
  },
  {
    id: 'thevenin',
    title: 'Teorema de Thevenin',
    description: 'Simplifica un circuito complejo en una fuente equivalente y una resistencia.',
    parameterOptions: [
      { id: 'vth', label: 'Tensión de Thevenin', inputs: ['rth', 'rl'] },
      { id: 'rth', label: 'Resistencia de Thevenin', inputs: ['vth', 'rl'] },
      { id: 'rl', label: 'Resistencia de carga', inputs: ['vth', 'rth'] },
    ],
    inputMap: {
      vth: [{ label: 'Resistencia de Thevenin (Ω)', type: 'number' }, { label: 'Resistencia de carga (Ω)', type: 'number' }],
      rth: [{ label: 'Tensión de Thevenin (V)', type: 'number' }, { label: 'Resistencia de carga (Ω)', type: 'number' }],
      rl: [{ label: 'Tensión de Thevenin (V)', type: 'number' }, { label: 'Resistencia de Thevenin (Ω)', type: 'number' }],
    },
  },
  {
    id: 'norton',
    title: 'Teorema de Norton',
    description: 'Convierte una red en una fuente de corriente equivalente con su resistencia.',
    parameterOptions: [
      { id: 'in', label: 'Corriente de Norton', inputs: ['rn', 'rl'] },
      { id: 'rn', label: 'Resistencia de Norton', inputs: ['in', 'rl'] },
      { id: 'rl', label: 'Resistencia de carga', inputs: ['in', 'rn'] },
    ],
    inputMap: {
      in: [{ label: 'Resistencia de Norton (Ω)', type: 'number' }, { label: 'Resistencia de carga (Ω)', type: 'number' }],
      rn: [{ label: 'Corriente de Norton (A)', type: 'number' }, { label: 'Resistencia de carga (Ω)', type: 'number' }],
      rl: [{ label: 'Corriente de Norton (A)', type: 'number' }, { label: 'Resistencia de Norton (Ω)', type: 'number' }],
    },
  },
  {
    id: 'rectifier',
    title: 'Diodos rectificadores',
    description: 'Analiza el comportamiento de un rectificador de media onda o onda completa.',
    parameterOptions: [
      { id: 'vin', label: 'Tensión de entrada', inputs: ['f', 'rl'] },
      { id: 'f', label: 'Frecuencia', inputs: ['vin', 'rl'] },
      { id: 'rl', label: 'Resistencia de carga', inputs: ['vin', 'f'] },
    ],
    inputMap: {
      vin: [{ label: 'Frecuencia (Hz)', type: 'number' }, { label: 'Resistencia de carga (Ω)', type: 'number' }],
      f: [{ label: 'Tensión de entrada (V)', type: 'number' }, { label: 'Resistencia de carga (Ω)', type: 'number' }],
      rl: [{ label: 'Tensión de entrada (V)', type: 'number' }, { label: 'Frecuencia (Hz)', type: 'number' }],
    },
  },
  {
    id: 'zener',
    title: 'Diodos Zener',
    description: 'Modela la regulación de tensión en un circuito con diodo Zener.',
    parameterOptions: [
      { id: 'vin', label: 'Tensión de entrada', inputs: ['vz', 'rs'] },
      { id: 'vz', label: 'Voltaje Zener', inputs: ['vin', 'rs'] },
      { id: 'rs', label: 'Resistencia serie', inputs: ['vin', 'vz'] },
    ],
    inputMap: {
      vin: [{ label: 'Tensión Zener (V)', type: 'number' }, { label: 'Resistencia serie (Ω)', type: 'number' }],
      vz: [{ label: 'Tensión de entrada (V)', type: 'number' }, { label: 'Resistencia serie (Ω)', type: 'number' }],
      rs: [{ label: 'Tensión de entrada (V)', type: 'number' }, { label: 'Tensión Zener (V)', type: 'number' }],
    },
  },
  {
    id: 'bjt',
    title: 'Transistores BJT',
    description: 'Evalúa el punto de operación y los parámetros básicos del transistor.',
    parameterOptions: [
      { id: 'ib', label: 'Corriente de base', inputs: ['beta', 'rc'] },
      { id: 'beta', label: 'Beta', inputs: ['ib', 'rc'] },
      { id: 'rc', label: 'Resistencia colector', inputs: ['ib', 'beta'] },
    ],
    inputMap: {
      ib: [{ label: 'Beta (β)', type: 'number' }, { label: 'Resistencia colector (Ω)', type: 'number' }],
      beta: [{ label: 'Corriente de base (mA)', type: 'number' }, { label: 'Resistencia colector (Ω)', type: 'number' }],
      rc: [{ label: 'Corriente de base (mA)', type: 'number' }, { label: 'Beta (β)', type: 'number' }],
    },
  },
  {
    id: 'jfet',
    title: 'Transistores JFET',
    description: 'Explora la polarización y el comportamiento del canal del JFET.',
    parameterOptions: [
      { id: 'vg', label: 'Tensión de puerta', inputs: ['idss', 'vp'] },
      { id: 'idss', label: 'IDSS', inputs: ['vg', 'vp'] },
      { id: 'vp', label: 'Vp', inputs: ['vg', 'idss'] },
    ],
    inputMap: {
      vg: [{ label: 'IDSS (mA)', type: 'number' }, { label: 'Vp (V)', type: 'number' }],
      idss: [{ label: 'Tensión de puerta (V)', type: 'number' }, { label: 'Vp (V)', type: 'number' }],
      vp: [{ label: 'Tensión de puerta (V)', type: 'number' }, { label: 'IDSS (mA)', type: 'number' }],
    },
  },
  {
    id: 'mosfet',
    title: 'Transistores MOSFET',
    description: 'Calcula la zona de operación del MOSFET con los datos de polarización.',
    parameterOptions: [
      { id: 'vg', label: 'Tensión de puerta', inputs: ['vth', 'rd'] },
      { id: 'vth', label: 'Umbral Vth', inputs: ['vg', 'rd'] },
      { id: 'rd', label: 'Resistencia de drenador', inputs: ['vg', 'vth'] },
    ],
    inputMap: {
      vg: [{ label: 'Umbral Vth (V)', type: 'number' }, { label: 'Resistencia de drenador (Ω)', type: 'number' }],
      vth: [{ label: 'Tensión de puerta (V)', type: 'number' }, { label: 'Resistencia de drenador (Ω)', type: 'number' }],
      rd: [{ label: 'Tensión de puerta (V)', type: 'number' }, { label: 'Umbral Vth (V)', type: 'number' }],
    },
  },
];

function App() {
  const [page, setPage] = useState('welcome');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sessionUser, setSessionUser] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState('');
  const [formValues, setFormValues] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedSession = window.sessionStorage.getItem('legis-session');

    if (!savedSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(savedSession);

      if (parsedSession?.userName) {
        setSessionUser(parsedSession.userName);
        setPage('topics');
      }
    } catch {
      window.sessionStorage.removeItem('legis-session');
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    const cleanedName = username.trim();

    if (cleanedName.toLowerCase() === 'admin' && password === 'pass123!') {
      const session = { userName: cleanedName, role: 'admin' };
      window.sessionStorage.setItem('legis-session', JSON.stringify(session));
      setSessionUser(cleanedName);
      setLoginError('');
      setPage('topics');
      return;
    }

    setLoginError('Usuario o contraseña incorrectos');
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('legis-session');
    setSessionUser('');
    setUsername('');
    setPassword('');
    setLoginError('');
    setSelectedTopic(null);
    setPage('welcome');
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedParameter('');
    setFormValues({});
    setResult(null);
    setPage('calculator');
  };

  const activeInputs = selectedTopic?.inputMap?.[selectedParameter] || [];

  const getFieldKey = (rawName) => {
    const keyMap = {
      'Tensión (V)': 'voltage',
      'Corriente (A)': 'current',
      'Resistencia (Ω)': 'resistance',
      'Tensión de Thevenin (V)': 'vth',
      'Resistencia de Thevenin (Ω)': 'rth',
      'Resistencia de carga (Ω)': 'rl',
      'Corriente de Norton (A)': 'in',
      'Resistencia de Norton (Ω)': 'rn',
      'Tensión de entrada (V)': 'vin',
      'Frecuencia (Hz)': 'f',
      'Tensión Zener (V)': 'vz',
      'Resistencia serie (Ω)': 'rs',
      'Corriente de base (mA)': 'ib',
      'Beta (β)': 'beta',
      'Resistencia colector (Ω)': 'rc',
      'Tensión de puerta (V)': 'vg',
      'IDSS (mA)': 'idss',
      'Vp (V)': 'vp',
      'Umbral Vth (V)': 'vth',
      'Resistencia de drenador (Ω)': 'rd',
    };

    return keyMap[rawName] || rawName;
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const inputName = id.split('-').slice(1).join('-');
    const normalizedKey = getFieldKey(inputName);
    setFormValues((current) => ({ ...current, [normalizedKey]: value }));
  };

  const calculateResult = () => {
    if (!selectedTopic || !selectedParameter) {
      return;
    }

    const values = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, Number(value)])
    );

    const isFiniteNumber = (value) => Number.isFinite(value);

    switch (selectedTopic.id) {
      case 'ohm': {
        const voltage = values.voltage;
        const current = values.current;
        const resistance = values.resistance;

        if (selectedParameter === 'voltage' && isFiniteNumber(current) && isFiniteNumber(resistance)) {
          setResult({ label: 'Tensión', value: current * resistance, unit: 'V' });
        } else if (selectedParameter === 'current' && isFiniteNumber(voltage) && isFiniteNumber(resistance)) {
          setResult({ label: 'Corriente', value: voltage / resistance, unit: 'A' });
        } else if (selectedParameter === 'resistance' && isFiniteNumber(voltage) && isFiniteNumber(current)) {
          setResult({ label: 'Resistencia', value: voltage / current, unit: 'Ω' });
        }
        break;
      }
      case 'thevenin': {
        const vth = values.vth;
        const rth = values.rth;
        const rl = values.rl;

        if (selectedParameter === 'vth' && isFiniteNumber(rth) && isFiniteNumber(rl)) {
          setResult({ label: 'Tensión de Thevenin', value: rth + rl, unit: 'V' });
        } else if (selectedParameter === 'rth' && isFiniteNumber(vth) && isFiniteNumber(rl)) {
          setResult({ label: 'Resistencia de Thevenin', value: Math.max(0, vth - rl), unit: 'Ω' });
        } else if (selectedParameter === 'rl' && isFiniteNumber(vth) && isFiniteNumber(rth)) {
          setResult({ label: 'Resistencia de carga', value: Math.max(0, vth - rth), unit: 'Ω' });
        }
        break;
      }
      case 'norton': {
        const inValue = values.in;
        const rn = values.rn;
        const rl = values.rl;

        if (selectedParameter === 'in' && isFiniteNumber(rn) && isFiniteNumber(rl)) {
          setResult({ label: 'Corriente de Norton', value: rn + rl, unit: 'A' });
        } else if (selectedParameter === 'rn' && isFiniteNumber(inValue) && isFiniteNumber(rl)) {
          setResult({ label: 'Resistencia de Norton', value: Math.max(0, inValue - rl), unit: 'Ω' });
        } else if (selectedParameter === 'rl' && isFiniteNumber(inValue) && isFiniteNumber(rn)) {
          setResult({ label: 'Resistencia de carga', value: Math.max(0, inValue - rn), unit: 'Ω' });
        }
        break;
      }
      case 'rectifier': {
        const vin = values.vin;
        const frequency = values.f;
        const rl = values.rl;

        if (selectedParameter === 'vin' && isFiniteNumber(frequency) && isFiniteNumber(rl)) {
          const vout = 0.637 * vin;
          setResult({ label: 'Tensión rectificada', value: vout, unit: 'V' });
        } else if (selectedParameter === 'f' && isFiniteNumber(vin) && isFiniteNumber(rl)) {
          setResult({ label: 'Frecuencia de rizado', value: 2 * frequency, unit: 'Hz' });
        } else if (selectedParameter === 'rl' && isFiniteNumber(vin) && isFiniteNumber(frequency)) {
          const current = (0.637 * vin) / rl;
          setResult({ label: 'Corriente de carga', value: current, unit: 'A' });
        }
        break;
      }
      case 'zener': {
        const vin = values.vin;
        const vz = values.vz;
        const rs = values.rs;

        if (selectedParameter === 'vin' && isFiniteNumber(vz) && isFiniteNumber(rs)) {
          setResult({ label: 'Corriente del Zener', value: (vin - vz) / rs, unit: 'A' });
        } else if (selectedParameter === 'vz' && isFiniteNumber(vin) && isFiniteNumber(rs)) {
          setResult({ label: 'Tensión Zener', value: vin - rs, unit: 'V' });
        } else if (selectedParameter === 'rs' && isFiniteNumber(vin) && isFiniteNumber(vz)) {
          setResult({ label: 'Resistencia serie', value: vin - vz, unit: 'Ω' });
        }
        break;
      }
      case 'bjt': {
        const beta = values.beta;
        const rc = values.rc;
        const ib = values.ib;

        if (selectedParameter === 'ib' && isFiniteNumber(beta) && isFiniteNumber(rc)) {
          setResult({ label: 'Corriente de base', value: 0.001, unit: 'A' });
        } else if (selectedParameter === 'beta' && isFiniteNumber(ib) && isFiniteNumber(rc)) {
          setResult({ label: 'Beta', value: (12 - (ib * rc)) / ib, unit: '' });
        } else if (selectedParameter === 'rc' && isFiniteNumber(beta) && isFiniteNumber(ib)) {
          setResult({ label: 'Resistencia colector', value: (12 - beta * ib) / ib, unit: 'Ω' });
        }
        break;
      }
      case 'jfet': {
        const vg = values.vg;
        const idss = values.idss;
        const vp = values.vp;

        if (selectedParameter === 'vg' && isFiniteNumber(idss) && isFiniteNumber(vp)) {
          setResult({ label: 'Tensión de puerta', value: vp * (1 - Math.sqrt(0.001 / idss)), unit: 'V' });
        } else if (selectedParameter === 'idss' && isFiniteNumber(vg) && isFiniteNumber(vp)) {
          const drainCurrent = 0.001;
          setResult({ label: 'IDSS', value: drainCurrent / ((1 - (vg / vp)) ** 2 || 1), unit: 'A' });
        } else if (selectedParameter === 'vp' && isFiniteNumber(vg) && isFiniteNumber(idss)) {
          const drainCurrent = 0.001;
          setResult({ label: 'Vp', value: vg / (1 - Math.sqrt(drainCurrent / idss)), unit: 'V' });
        }
        break;
      }
      case 'mosfet': {
        const vg = values.vg;
        const vth = values.vth;
        const rd = values.rd;

        if (selectedParameter === 'vg' && isFiniteNumber(vth) && isFiniteNumber(rd)) {
          setResult({ label: 'Tensión de puerta', value: vth + Math.sqrt(1 * rd), unit: 'V' });
        } else if (selectedParameter === 'vth' && isFiniteNumber(vg) && isFiniteNumber(rd)) {
          setResult({ label: 'Umbral Vth', value: vg - Math.sqrt(1 * rd), unit: 'V' });
        } else if (selectedParameter === 'rd' && isFiniteNumber(vg) && isFiniteNumber(vth)) {
          setResult({ label: 'Resistencia de drenador', value: Math.max(0, (vg - vth) ** 2), unit: 'Ω' });
        }
        break;
      }
      default:
        setResult({ label: 'Resultado', value: 'Datos pendientes', unit: '' });
    }
  };

  const isWelcomeView = page === 'welcome';

  return (
    <main className={`app-shell${isWelcomeView ? ' welcome-view' : ''}`}>
      {isWelcomeView ? (
        <section className="hero-panel welcome-hero">
          <p className="eyebrow">integracalc</p>
          <h1>Calculadora de circuitos electrónicos</h1>
          <p className="hero-copy">
            Inicia sesion y comienza a resolver tus circuitos aqui.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => setPage('login')}>
              Empezar
            </button>
          </div>
          <div className="hero-metrics">
            <article>
              <strong>Logeate</strong>
              <span>Create un usuario para comenzar a calcular</span>
            </article>
            <article>
              <strong>Selecciona que quieres calcular</strong>
              <span>Podras elegir en una diersa gama de temas poder calcular</span>
            </article>
            <article>
              <strong>Modelos equivalente</strong>
              <span>podras ver los modelos equivalentes en caso de ser necesaro</span>
            </article>
          </div>
        </section>
      ) : (
        <section className="content-card">
          {page === 'login' && (
            <div className="card login-card">
              <p className="eyebrow">Acceso</p>
              <h2>Inicia sesión</h2>
              <p className="card-copy">Solo está habilitado el usuario admin con la contraseña pass123!.</p>
              <form className="form-grid" onSubmit={handleLogin}>
                <label htmlFor="username">
                  Usuario
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="admin"
                    autoComplete="username"
                  />
                </label>

                <label htmlFor="password">
                  Contraseña
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="pass123!"
                    autoComplete="current-password"
                  />
                </label>

                {loginError ? <p className="error-message">{loginError}</p> : null}

                <button type="submit">Iniciar sesión</button>
              </form>
            </div>
          )}

          {(page === 'topics' || page === 'calculator') && (
            <div className="workspace">
              <div className="card session-bar">
                <div>
                  <p className="eyebrow">Sesión activa</p>
                  <h2>{sessionUser || 'Administrador'}</h2>
                  <p className="card-copy">Selecciona el tipo de circuito que quieres analizar.</p>
                </div>
                <button type="button" className="secondary-button" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>

              {page === 'topics' ? (
                <div className="card">
                  <p className="eyebrow">Selector de circuitos</p>
                  <h2>Selecciona el tipo de circuito</h2>
                  <div className="topic-grid">
                    {TOPICS.map((topic) => (
                      <article key={topic.id} className="topic-card">
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                        <button type="button" onClick={() => handleSelectTopic(topic)}>
                          Elegir
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              ) : selectedTopic ? (
                <div className="card detail-card">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">Tema seleccionado</p>
                      <h2>{selectedTopic.title}</h2>
                      <p className="card-copy">{selectedTopic.description}</p>
                    </div>
                    <button type="button" className="secondary-button" onClick={() => setPage('topics')}>
                      Cambiar tema
                    </button>
                  </div>

                  <div className="detail-layout">
                    <div className="diagram-box" aria-label="Espacio para dibujo del circuito">
                      <span>Espacio para el dibujo o imagen del circuito</span>
                      <p>Agrega aquí la figura del circuito desde tu informe PDF o una imagen propia.</p>
                    </div>

                    <form className="detail-form">
                      <p className="eyebrow">¿Qué parámetro deseas calcular?</p>
                      <div className="parameter-grid">
                        {selectedTopic.parameterOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={selectedParameter === option.id ? 'selected-parameter' : ''}
                            onClick={() => setSelectedParameter(option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {selectedParameter ? (
                        <>
                          {activeInputs.map((input) => (
                            <label key={input.label} htmlFor={`${selectedTopic.id}-${input.label}`}>
                              {input.label}
                              <input
                                id={`${selectedTopic.id}-${input.label}`}
                                type={input.type}
                                placeholder="0"
                                onChange={handleInputChange}
                              />
                            </label>
                          ))}
                          <button type="button" onClick={calculateResult}>
                            Calcular
                          </button>
                          {result ? (
                            <div className="result-box">
                              <p className="eyebrow">Resultado</p>
                              <h3>
                                {result.label}: {Number.isFinite(result.value) ? result.value.toFixed(2) : result.value}{' '}
                                {result.unit}
                              </h3>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <p className="card-copy">Elige primero el parámetro que quieres obtener.</p>
                      )}
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
