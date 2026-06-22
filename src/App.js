import { useEffect, useMemo, useState } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topology, setTopology] = useState('series');
  const [voltage, setVoltage] = useState('');
  const [resistors, setResistors] = useState('');

  useEffect(() => {
    const savedSession = window.sessionStorage.getItem('legis-session');

    if (!savedSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(savedSession);

      if (parsedSession?.userName && parsedSession?.role) {
        setUserName(parsedSession.userName);
        setRole(parsedSession.role);
        setIsLoggedIn(true);
      }
    } catch {
      window.sessionStorage.removeItem('legis-session');
    }
  }, []);

  const resistorValues = useMemo(() => {
    return resistors
      .split(',')
      .map((value) => Number.parseFloat(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0);
  }, [resistors]);

  const numericVoltage = Number.parseFloat(voltage);
  const hasValidInputs = resistorValues.length > 0 && Number.isFinite(numericVoltage) && numericVoltage > 0;

  const calculations = useMemo(() => {
    if (!hasValidInputs) {
      return null;
    }

    if (topology === 'series') {
      const totalResistance = resistorValues.reduce((sum, resistor) => sum + resistor, 0);
      const current = numericVoltage / totalResistance;
      const voltageDrops = resistorValues.map((resistor) => current * resistor);

      return {
        totalResistance,
        current,
        voltageDrops,
        totalPower: numericVoltage * current,
      };
    }

    const inverseTotal = resistorValues.reduce((sum, resistor) => sum + 1 / resistor, 0);
    const totalResistance = 1 / inverseTotal;
    const totalCurrent = numericVoltage / totalResistance;
    const branchCurrents = resistorValues.map((resistor) => numericVoltage / resistor);

    return {
      totalResistance,
      current: totalCurrent,
      branchCurrents,
      totalPower: numericVoltage * totalCurrent,
    };
  }, [hasValidInputs, numericVoltage, resistorValues, topology]);

  const handleLogin = (event) => {
    event.preventDefault();

    const cleanedName = userName.trim();

    if (!cleanedName) {
      return;
    }

    const session = { userName: cleanedName, role };
    window.sessionStorage.setItem('legis-session', JSON.stringify(session));
    setUserName(cleanedName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('legis-session');
    setIsLoggedIn(false);
    setResistors('');
    setVoltage('');
  };

  const roleLabel = role === 'student' ? 'Estudiante' : 'Profesional';

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">MVP de circuitos básicos</p>
        <h1>Calculadora en React para circuitos simples</h1>
        <p className="hero-copy">
          Inicia sesión, elige tu perfil y calcula resistencias equivalentes, corriente total y potencia.
        </p>
        <div className="hero-metrics">
          <article>
            <strong>Login local</strong>
            <span>Estudiante o profesional</span>
          </article>
          <article>
            <strong>Serie y paralelo</strong>
            <span>Con resistencias y tensión</span>
          </article>
          <article>
            <strong>Resultados claros</strong>
            <span>Lectura rápida para el MVP</span>
          </article>
        </div>
      </section>

      {!isLoggedIn ? (
        <section className="card login-card">
          <h2>Acceso</h2>
          <form className="form-grid" onSubmit={handleLogin}>
            <label>
              Nombre
              <input
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </label>

            <div className="role-group">
              <span>Perfil</span>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                />
                Estudiante
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="professional"
                  checked={role === 'professional'}
                  onChange={() => setRole('professional')}
                />
                Profesional
              </label>
            </div>

            <button type="submit">Entrar</button>
          </form>
        </section>
      ) : (
        <section className="workspace">
          <div className="card session-bar">
            <div>
              <p className="eyebrow">Sesión activa</p>
              <h2>{userName}</h2>
              <span>{roleLabel}</span>
            </div>
            <button type="button" className="secondary-button" onClick={handleLogout}>
              Salir
            </button>
          </div>

          <section className="card calculator-card">
            <div className="section-header">
              <h2>Calculadora de circuito</h2>
              <p>Ingresa las resistencias separadas por coma y una tensión de fuente.</p>
            </div>

            <div className="form-grid two-columns">
              <label>
                Tipo de circuito
                <select value={topology} onChange={(event) => setTopology(event.target.value)}>
                  <option value="series">Serie</option>
                  <option value="parallel">Paralelo</option>
                </select>
              </label>

              <label>
                Tensión de fuente (V)
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={voltage}
                  onChange={(event) => setVoltage(event.target.value)}
                  placeholder="Ej. 12"
                />
              </label>

              <label className="full-width">
                Resistencias (ohmios)
                <textarea
                  value={resistors}
                  onChange={(event) => setResistors(event.target.value)}
                  placeholder="Ej. 100, 220, 330"
                  rows="4"
                />
              </label>
            </div>

            {calculations ? (
              <div className="results-grid">
                <article>
                  <span>Resistencia equivalente</span>
                  <strong>{calculations.totalResistance.toFixed(2)} Ω</strong>
                </article>
                <article>
                  <span>{topology === 'series' ? 'Corriente del circuito' : 'Corriente total'}</span>
                  <strong>{calculations.current.toFixed(4)} A</strong>
                </article>
                <article>
                  <span>Potencia total</span>
                  <strong>{calculations.totalPower.toFixed(2)} W</strong>
                </article>
                <article className="wide-result">
                  <span>{topology === 'series' ? 'Caídas de tensión' : 'Corrientes por rama'}</span>
                  <strong>
                    {topology === 'series'
                      ? calculations.voltageDrops.map((drop) => `${drop.toFixed(2)} V`).join(' | ')
                      : calculations.branchCurrents.map((branch) => `${branch.toFixed(4)} A`).join(' | ')}
                  </strong>
                </article>
              </div>
            ) : (
              <p className="helper-text">
                Completa una tensión positiva y al menos una resistencia positiva para ver el cálculo.
              </p>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
