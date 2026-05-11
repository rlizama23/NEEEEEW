import { useState } from "react";

// ── Design tokens (Versión Morada Nutricionista) ───────────────────────────
const C = {
  bg: "#F5F0FA",
  card: "#FFFFFF",
  green: "#6B21A8",      // Morado principal
  greenLight: "#A855F7", // Morado claro
  greenPale: "#EDE9FE",  // Morado pálido
  teal: "#4C1D95",       // Morado oscuro
  accent: "#E76F51",
  accentLight: "#FFF0EB",
  text: "#1A1A2E",
  muted: "#8E9BAE",
  border: "#E9D5FF",
  softGreen: "#F3E8FF",
  purple: "#7C3AED",
  purplePale: "#EDE9FE",
  yellow: "#F4A261",
  yellowPale: "#FEF3E2",
};

const F = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', sans-serif",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  .fade-up  { animation:fadeUp  0.38s ease forwards; }
  .slide-in { animation:slideIn 0.32s ease forwards; }
`;

// ── Data Mock ──────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: 1, name: "María González", type: "Embarazada", age: 28, condition: "Diabetes gestacional", nextControl: "2026-05-18", adherence: 85, weight: 68, glucose: 105, pressure: "118/75", exercise: 3, avatar: "MG", status: "ok" },
  { id: 2, name: "Carlos Ruiz", type: "Adulto", age: 54, condition: "Hipertensión + Dislipidemia", nextControl: "2026-05-14", adherence: 62, weight: 84, glucose: 124, pressure: "142/88", exercise: 1, avatar: "CR", status: "alert" },
  { id: 3, name: "Sofía Mendoza", type: "Adulto Mayor", age: 67, condition: "Diabetes tipo 2", nextControl: "2026-05-20", adherence: 91, weight: 72, glucose: 95, pressure: "128/80", exercise: 4, avatar: "SM", status: "ok" },
  { id: 4, name: "Ana Torres", type: "Nodriza", age: 31, condition: "Seguimiento lactancia", nextControl: "2026-05-16", adherence: 78, weight: 62, glucose: 88, pressure: "110/70", exercise: 2, avatar: "AT", status: "ok" },
  { id: 5, name: "Lucas Pérez", type: "Bebé (mamá)", age: 26, condition: "Alimentación complementaria", nextControl: "2026-05-22", adherence: 70, weight: 58, glucose: 90, pressure: "112/72", exercise: 0, avatar: "LP", status: "pending" },
];

const DOUBTS = [
  { id: 1, patient: "María González", question: "¿Puedo comer fruta en la noche aunque tenga diabetes gestacional?", date: "2026-05-09", answered: false },
  { id: 2, patient: "Carlos Ruiz", question: "¿El aguacate está permitido con mi plan de dislipidemia?", date: "2026-05-08", answered: false },
  { id: 3, patient: "Sofía Mendoza", question: "¿Cuántas porciones de carbohidrato puedo tener en el almuerzo?", date: "2026-05-07", answered: true, answer: "Para tu caso, te recomiendo 2 porciones de carbohidrato de bajo índice glucémico en el almuerzo." },
];

const MATERIALS = [
  { id: 1, title: "Guía de porciones para diabéticos", type: "PDF", category: "ECNT", date: "2026-04-20", downloads: 12 },
  { id: 2, title: "Alimentación durante la lactancia", type: "PDF", category: "Maternidad", date: "2026-04-15", downloads: 8 },
  { id: 3, title: "Lista de alimentos permitidos - HTA", type: "PDF", category: "ECNT", date: "2026-04-10", downloads: 15 },
  { id: 4, title: "Recetas saludables para el adulto mayor", type: "PDF", category: "Adulto Mayor", date: "2026-03-28", downloads: 6 },
];

const HABITS = ["Desayuno completo", "Agua ≥ 8 vasos", "Colaciones planificadas", "Cena ligera", "Sin azúcar añadida", "Frutas/verduras 5 porciones"];

const VALID_CODES = [
  {code:"MG-2847", rut:"12.345.678-9", patientId:1},
  {code:"CR-5512", rut:"8.765.432-1",  patientId:2},
  {code:"SM-9901", rut:"5.111.222-3",  patientId:3},
];

// ── Helpers ────────────────────────────────────────────────────────────────
const statusColor = (s) => ({ ok: C.greenLight, alert: C.accent, pending: C.accentLight }[s] || C.muted);
const typeColor = (t) => ({ Embarazada: "#E0BBE4", Nodriza: "#FFC8A2", Adulto: "#C4B5FD", "Adulto Mayor": "#C7CEEA", "Bebé (mamá)": "#FFDAC1" }[t] || C.greenPale);
const daysUntil = (d) => { const diff = new Date(d) - new Date("2026-05-10"); return Math.ceil(diff / 86400000); };

// ── Components ─────────────────────────────────────────────────────────────
const Logo = ({ height = 40, style = {} }) => (
  <img src="logo-nutrilife.png" alt="NutriLife" style={{ height, objectFit: "contain", ...style }} />
);

const Avatar = ({ initials, bg = C.green, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: F.body, fontWeight: 600, fontSize: size * 0.35, flexShrink: 0 }}>
    {initials}
  </div>
);

const Badge = ({ label, color = C.greenPale, text = C.green }) => (
  <span style={{ background: color, color: text, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, fontFamily: F.body, whiteSpace: "nowrap" }}>{label}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 2px 12px rgba(108,33,168,0.06)", ...style }}>{children}</div>
);

const MetricChip = ({ label, value, unit, color = C.green }) => (
  <div style={{ background: C.greenPale, borderRadius: 12, padding: "8px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{ fontSize: 10, color: C.muted, fontFamily: F.body, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
    <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: F.body }}>{value}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2 }}>{unit}</span></span>
  </div>
);

const ProgressBar = ({ value, color = C.greenLight }) => (
  <div style={{ background: C.border, borderRadius: 8, height: 8, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, borderRadius: 8, transition: "width 0.6s ease" }} />
  </div>
);

const Btn = ({ children, onClick, variant = "primary", disabled = false, full = false, style = {} }) => {
  const v = {
    primary: { background: disabled ? "#C4B5FD" : C.green, color: "#fff" },
    ghost: { background: "none", color: C.muted, border: `1.5px solid ${C.border}` },
    soft: { background: C.softGreen, color: C.green },
    accent: { background: C.accent, color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ border: "none", borderRadius: 12, padding: "11px 18px", fontFamily: F.body, fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", width: full ? "100%" : "auto", ...v[variant], ...style }}>
      {children}
    </button>
  );
};

// ── Views ──────────────────────────────────────────────────────────────────
const Dashboard = ({ setView, setSelectedPatient }) => {
  const alerts = PATIENTS.filter(p => p.status === "alert").length;
  const pending = DOUBTS.filter(d => !d.answered).length;
  const avgAdherence = Math.round(PATIENTS.reduce((a, p) => a + p.adherence, 0) / PATIENTS.length);
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color: C.teal, lineHeight: 1.2 }}>Buenos días ✨</h1>
          <p style={{ color: C.muted, marginTop: 4 }}>Aquí tienes el resumen de tus pacientes para hoy.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👥</div>
          <div>
            <p style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Pacientes</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: C.teal }}>{PATIENTS.length}</p>
          </div>
        </Card>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FDECEA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚠️</div>
          <div>
            <p style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Alertas</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: C.accent }}>{alerts}</p>
          </div>
        </Card>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.softGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💬</div>
          <div>
            <p style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Dudas</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: C.green }}>{pending}</p>
          </div>
        </Card>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📈</div>
          <div>
            <p style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Adherencia</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0369A1" }}>{avgAdherence}%</p>
          </div>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal }}>Pacientes recientes</h3>
            <button onClick={() => setView("patients")} style={{ background: "none", border: "none", color: C.greenLight, fontFamily: F.body, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Ver todos →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PATIENTS.slice(0, 4).map(p => (
              <div key={p.id} onClick={() => { setSelectedPatient(p); setView("patient-detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 12, cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.greenPale}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Avatar initials={p.avatar} bg={C.green} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{p.name}</span>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(p.status) }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <ProgressBar value={p.adherence} color={p.adherence > 75 ? C.greenLight : C.accent} />
                    <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{p.adherence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal }}>Dudas pendientes</h3>
              <button onClick={() => setView("doubts")} style={{ background: "none", border: "none", color: C.greenLight, fontFamily: F.body, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Ver todas →</button>
            </div>
            {DOUBTS.filter(d => !d.answered).map(d => (
              <div key={d.id} style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 12, marginBottom: 12 }}>
                <p style={{ fontWeight: 600, fontSize: 12, color: C.accent }}>{d.patient}</p>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>{d.question.slice(0, 60)}...</p>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal, marginBottom: 14 }}>Próximos controles</h3>
            {PATIENTS.sort((a, b) => new Date(a.nextControl) - new Date(b.nextControl)).slice(0, 3).map(p => {
              const days = daysUntil(p.nextControl);
              return (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar initials={p.avatar} bg={typeColor(p.type)} size={30} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <Badge label={days <= 3 ? `${days}d ⚡` : `${days} días`} color={days <= 3 ? "#FDECEA" : C.greenPale} text={days <= 3 ? C.accent : C.green} />
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
};

const PatientsView = ({ setView, setSelectedPatient }) => {
  const [filter, setFilter] = useState("Todos");
  const types = ["Todos", ...new Set(PATIENTS.map(p => p.type))];
  const filtered = filter === "Todos" ? PATIENTS : PATIENTS.filter(p => p.type === filter);
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: F.display, fontSize: 24, color: C.teal }}>Mis Pacientes</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ background: filter === t ? C.green : C.card, color: filter === t ? "#fff" : C.muted, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", fontFamily: F.body, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {filtered.map(p => (
          <Card key={p.id} style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            onClick={() => { setSelectedPatient(p); setView("patient-detail"); }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <Avatar initials={p.avatar} bg={typeColor(p.type)} size={48} />
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{p.name}</h4>
                <p style={{ fontSize: 12, color: C.muted }}>{p.type} · {p.age} años</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
              <MetricChip label="Peso" value={p.weight} unit="kg" />
              <MetricChip label="Glucosa" value={p.glucose} unit="mg/dL" color={p.glucose > 110 ? C.accent : C.green} />
              <MetricChip label="Ejercicio" value={p.exercise} unit="d/s" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>Adherencia</span>
              <ProgressBar value={p.adherence} color={p.adherence > 75 ? C.greenLight : C.accent} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green, whiteSpace: "nowrap" }}>{p.adherence}%</span>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.muted }}>Próximo control</span>
              <Badge label={`${daysUntil(p.nextControl)} días`} color={daysUntil(p.nextControl) <= 4 ? "#FDECEA" : C.greenPale} text={daysUntil(p.nextControl) <= 4 ? C.accent : C.green} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PatientDetail = ({ patient, onBack }) => {
  const [checklist, setChecklist] = useState(HABITS.map(() => false));
  const toggle = (i) => setChecklist(prev => prev.map((v, idx) => idx === i ? !v : v));
  const done = checklist.filter(Boolean).length;
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.greenLight, fontFamily: F.body, fontSize: 14, cursor: "pointer", fontWeight: 600, alignSelf: "flex-start" }}>← Volver</button>
      <Card style={{ background: C.green, border: "none" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar initials={patient.avatar} bg={C.teal} size={56} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 22, color: "#fff", fontWeight: 700 }}>{patient.name}</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 2 }}>{patient.type} · {patient.age} años · {patient.condition}</p>
          </div>
          <Badge label={`Control en ${daysUntil(patient.nextControl)} días`} color="rgba(255,255,255,0.15)" text="#fff" />
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ fontFamily: F.display, fontSize: 17, color: C.teal, marginBottom: 14 }}>📊 Métricas del día</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MetricChip label="Peso" value={patient.weight} unit="kg" />
            <MetricChip label="Glucosa" value={patient.glucose} unit="mg/dL" color={patient.glucose > 110 ? C.accent : C.green} />
            <MetricChip label="Presión" value={patient.pressure} unit="" />
            <MetricChip label="Ejercicio" value={patient.exercise} unit="d/s" />
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: C.muted }}>Adherencia general</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{patient.adherence}%</span>
            </div>
            <ProgressBar value={patient.adherence} color={patient.adherence > 75 ? C.greenLight : C.accent} />
          </div>
        </Card>
        <Card>
          <h3 style={{ fontFamily: F.display, fontSize: 17, color: C.teal, marginBottom: 4 }}>✅ Checklist de hoy</h3>
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>{done}/{HABITS.length} hábitos completados</p>
          <ProgressBar value={(done / HABITS.length) * 100} color={C.greenLight} />
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {HABITS.map((h, i) => (
              <label key={h} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={checklist[i]} onChange={() => toggle(i)} style={{ accentColor: C.green, width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: checklist[i] ? C.green : C.text, textDecoration: checklist[i] ? "line-through" : "none", transition: "all 0.2s" }}>{h}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const DoubtsView = () => (
  <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <h2 style={{ fontFamily: F.display, fontSize: 24, color: C.teal }}>Dudas de Pacientes</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {DOUBTS.map(d => (
        <Card key={d.id} style={{ borderLeft: `4px solid ${d.answered ? C.greenLight : C.accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{d.patient}</p>
              <p style={{ fontSize: 11, color: C.muted }}>{d.date}</p>
            </div>
            <Badge label={d.answered ? "Respondida" : "Pendiente"} color={d.answered ? C.greenPale : "#FDECEA"} text={d.answered ? C.green : C.accent} />
          </div>
          <p style={{ marginTop: 12, fontSize: 14, color: C.text, lineHeight: 1.5 }}>{d.question}</p>
          {d.answered && (
            <div style={{ marginTop: 12, padding: 12, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", marginBottom: 4 }}>Tu respuesta:</p>
              <p style={{ fontSize: 13, color: C.text }}>{d.answer}</p>
            </div>
          )}
          {!d.answered && (
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <input type="text" placeholder="Escribe tu respuesta..." style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" }} />
              <Btn variant="primary" style={{ padding: "8px 16px" }}>Responder</Btn>
            </div>
          )}
        </Card>
      ))}
    </div>
  </div>
);

const MaterialsView = () => {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: F.display, fontSize: 24, color: C.teal }}>Material Educativo</h2>
        <Btn onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "ghost" : "primary"}>{showAdd ? "Cancelar" : "+ Subir Material"}</Btn>
      </div>
      {showAdd && (
        <Card className="fade-up">
          <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal, marginBottom: 16 }}>Nuevo Tríptico o Guía</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, color: C.muted }}>Título</label>
              <input type="text" placeholder="Ej: Guía de colaciones" style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, background: C.bg }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, color: C.muted }}>Categoría</label>
              <select style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, background: C.bg }}>
                <option>ECNT</option>
                <option>Maternidad</option>
                <option>Adulto Mayor</option>
                <option>General</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12, border: `2px dashed ${C.greenLight}`, borderRadius: 12, padding: "24px", textAlign: "center", cursor: "pointer" }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>📄</p>
            <p style={{ fontSize: 13, color: C.muted }}>Arrastra tu tríptico aquí o <span style={{ color: C.greenLight, fontWeight: 600 }}>selecciona</span></p>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Solo PDF · Máx. 20MB</p>
          </div>
          <Btn variant="primary" style={{ marginTop: 14 }}>Publicar material</Btn>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {MATERIALS.map(m => (
          <Card key={m.id} style={{ cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 32 }}>📄</span>
              <Badge label={m.category} color={typeColor(m.category)} text={C.teal} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.4 }}>{m.title}</p>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{m.date}</p>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.muted }}>📥 {m.downloads} descargas</span>
              <Badge label="Tríptico PDF" color={C.greenPale} text={C.green} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ControlsView = () => (
  <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <h2 style={{ fontFamily: F.display, fontSize: 24, color: C.teal }}>Controles y Citas</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h3 style={{ fontFamily: F.display, fontSize: 17, color: C.teal }}>Próximos controles</h3>
        {PATIENTS.sort((a, b) => new Date(a.nextControl) - new Date(b.nextControl)).map(p => {
          const days = daysUntil(p.nextControl);
          return (
            <Card key={p.id} style={{ borderLeft: `4px solid ${days <= 3 ? C.accent : C.greenLight}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Avatar initials={p.avatar} bg={typeColor(p.type)} size={36} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: C.muted }}>{p.type} · {p.condition}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge label={days <= 3 ? `¡En ${days} días!` : `${days} días`} color={days <= 3 ? "#FDECEA" : C.greenPale} text={days <= 3 ? C.accent : C.green} />
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{p.nextControl}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <h3 style={{ fontFamily: F.display, fontSize: 17, color: C.teal, marginBottom: 16 }}>📅 Agendar control</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Paciente</label>
            <select style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: F.body, fontSize: 13, background: C.bg, outline: "none" }}>
              <option value="">Selecciona un paciente</option>
              {PATIENTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Fecha y Hora</label>
            <input type="datetime-local" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: F.body, fontSize: 13, background: C.bg, outline: "none" }} />
          </div>
          <Btn variant="primary" full style={{ marginTop: 8 }}>Confirmar Cita</Btn>
        </div>
      </Card>
    </div>
  </div>
);

const PatientLogin = ({ onLogin }) => {
  const [code, setCode] = useState("");
  const [rut, setRut] = useState("");
  const [err, setErr] = useState("");
  const handle = () => {
    const v = VALID_CODES.find(c => c.code === code && c.rut === rut);
    if (v) onLogin(PATIENTS.find(p => p.id === v.patientId));
    else setErr("Código o RUT incorrecto");
  };
  return (
    <div className="fade-up" style={{ maxWidth: 400, margin: "80px auto", padding: 20 }}>
      <Card style={{ padding: 32, textAlign: "center" }}>
        <Logo height={60} style={{ marginBottom: 24 }} />
        <h2 style={{ fontFamily: F.display, fontSize: 24, color: C.teal, marginBottom: 8 }}>Acceso Paciente</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Ingresa tus datos para ver tu plan nutricional</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase" }}>Código de acceso</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Ej: MG-2847" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", marginTop: 6, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase" }}>RUT</label>
            <input type="text" value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", marginTop: 6, outline: "none" }} />
          </div>
          {err && <p style={{ color: C.accent, fontSize: 12, fontWeight: 600 }}>{err}</p>}
          <Btn onClick={handle} full style={{ marginTop: 8 }}>Ingresar</Btn>
          <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer" }}>← Volver al inicio</button>
        </div>
      </Card>
    </div>
  );
};

const PatientPortal = ({ patient, onLogout }) => {
  const [checklist, setChecklist] = useState(HABITS.map(() => false));
  const toggle = (i) => setChecklist(prev => prev.map((v, idx) => idx === i ? !v : v));
  const done = checklist.filter(Boolean).length;
  return (
    <div className="fade-up" style={{ minHeight: "100vh", background: C.bg }}>
      <nav style={{ background: "#fff", padding: "12px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <Logo height={32} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{patient.name}</span>
          <button onClick={onLogout} style={{ background: C.softGreen, border: "none", borderRadius: 8, padding: "6px 12px", color: C.green, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Salir</button>
        </div>
      </nav>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        <Card style={{ background: C.green, border: "none", color: "#fff" }}>
          <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700 }}>¡Hola, {patient.name.split(" ")[0]}! 👋</h2>
          <p style={{ opacity: 0.9, fontSize: 14, marginTop: 4 }}>Tu próximo control es en {daysUntil(patient.nextControl)} días ({patient.nextControl})</p>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal, marginBottom: 16 }}>✅ Mis hábitos de hoy</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {HABITS.map((h, i) => (
                <label key={h} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={checklist[i]} onChange={() => toggle(i)} style={{ accentColor: C.green, width: 18, height: 18 }} />
                  <span style={{ fontSize: 14, color: checklist[i] ? C.green : C.text, textDecoration: checklist[i] ? "line-through" : "none" }}>{h}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Progreso del día: {Math.round((done / HABITS.length) * 100)}%</p>
              <ProgressBar value={(done / HABITS.length) * 100} color={C.greenLight} />
            </div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card>
              <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal, marginBottom: 12 }}>💬 Mensajes de tu Nutri</h3>
              <div style={{ background: C.greenPale, padding: 12, borderRadius: 12, borderLeft: `4px solid ${C.green}` }}>
                <p style={{ fontSize: 13, color: C.teal, lineHeight: 1.4 }}>"¡Excelente avance esta semana! Tu adherencia ha subido un 10%. Sigue así con la hidratación."</p>
                <p style={{ fontSize: 10, color: C.green, marginTop: 6, fontWeight: 700 }}>HACE 2 HORAS</p>
              </div>
            </Card>
            <Card>
              <h3 style={{ fontFamily: F.display, fontSize: 18, color: C.teal, marginBottom: 12 }}>📚 Material para ti</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: C.bg, borderRadius: 12, cursor: "pointer" }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Guía de porciones</p>
                  <p style={{ fontSize: 11, color: C.muted }}>PDF · 2.4 MB</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("landing"); // landing, nutrition, patient-login, patient-portal
  const [view, setView] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggedPatient, setLoggedPatient] = useState(null);

  const renderNutritionView = () => {
    if (view === "patient-detail" && selectedPatient) return <PatientDetail patient={selectedPatient} onBack={() => setView("patients")} />;
    if (view === "patients") return <PatientsView setView={setView} setSelectedPatient={setSelectedPatient} />;
    if (view === "doubts") return <DoubtsView />;
    if (view === "materials") return <MaterialsView />;
    if (view === "controls") return <ControlsView />;
    return <Dashboard setView={setView} setSelectedPatient={setSelectedPatient} />;
  };

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "patients", label: "Pacientes", icon: "👥" },
    { id: "doubts", label: "Dudas", icon: "💬" },
    { id: "materials", label: "Materiales", icon: "📚" },
    { id: "controls", label: "Controles", icon: "📅" },
  ];

  const pendingDoubts = DOUBTS.filter(d => !d.answered).length;

  if (mode === "patient-login") return <PatientLogin onLogin={(p) => { setLoggedPatient(p); setMode("patient-portal"); }} />;
  if (mode === "patient-portal") return <PatientPortal patient={loggedPatient} onLogout={() => setMode("landing")} />;

  if (mode === "nutrition") {
    return (
      <>
        <style>{globalStyle}</style>
        <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
          {/* Sidebar */}
          <div style={{ width: sidebarOpen ? 240 : 80, background: C.teal, display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh", flexShrink: 0, transition: "width 0.25s ease", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", marginBottom: 32 }}>
              {sidebarOpen && <Logo height={32} style={{ filter: "brightness(0) invert(1)" }} />}
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#fff" }}>{sidebarOpen ? "◀" : "▶"}</button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {NAV.map(n => {
                const active = view === n.id || (view === "patient-detail" && n.id === "patients");
                return (
                  <button key={n.id} onClick={() => setView(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 12, border: "none", background: active ? "rgba(255,255,255,0.15)" : "none", color: active ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", transition: "0.2s" }}>
                    <span style={{ fontSize: 20 }}>{n.icon}</span>
                    {sidebarOpen && <span style={{ fontWeight: active ? 600 : 400 }}>{n.label}</span>}
                    {sidebarOpen && n.id === "doubts" && pendingDoubts > 0 && (
                      <span style={{ background: C.accent, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "2px 6px", marginLeft: "auto" }}>{pendingDoubts}</span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar initials="TN" bg={C.greenLight} size={36} />
              {sidebarOpen && (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Tu nombre</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Nutricionista</p>
                </div>
              )}
            </div>
            <button onClick={() => setMode("landing")} style={{ marginTop: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", textAlign: "left", padding: "8px 12px" }}>← Cerrar sesión</button>
          </div>
          {/* Main content */}
          <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
            {renderNutritionView()}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fade-up" style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{globalStyle}</style>
      <Logo height={80} style={{ marginBottom: 32 }} />
      <p style={{ color: C.muted, fontSize: 16, marginBottom: 40, textAlign: "center" }}>Seguimiento nutricional personalizado</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 400 }}>
        <Card onClick={() => setMode("nutrition")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 20, padding: 24, transition: "transform 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          <div style={{ fontSize: 32 }}>👩‍⚕️</div>
          <div>
            <h3 style={{ color: C.teal, fontSize: 18, fontWeight: 700 }}>Soy nutricionista</h3>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Gestiona pacientes, planes y seguimiento →</p>
          </div>
        </Card>
        <Card onClick={() => setMode("patient-login")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 20, padding: 24, transition: "transform 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          <div style={{ fontSize: 32 }}>🧑‍💼</div>
          <div>
            <h3 style={{ color: C.teal, fontSize: 18, fontWeight: 700 }}>Soy paciente</h3>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Ingresa con tu código de acceso →</p>
          </div>
        </Card>
      </div>
      <p style={{ marginTop: 48, fontSize: 12, color: C.muted }}>© 2026 NutriLife. Todos los derechos reservados.</p>
    </div>
  );
}
