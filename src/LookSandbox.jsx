import { useMemo, useState } from "react";
import "./LookSandbox.css";

const THEMES = [
  {
    id: "coastal",
    name: "Coastal Clinic",
    mood: "Bright, calm, modern",
    notes: "Light background, airy cards, teal/blue accents. Good default candidate if the current site feels too dark.",
    colors: {
      bg: "#f5fbff",
      surface: "rgba(255,255,255,0.88)",
      surface2: "#e8f6fb",
      text: "#17324d",
      muted: "#5d7288",
      faint: "#d5e7f0",
      accent: "#0a8fb5",
      accent2: "#20b486",
      warning: "#f59e0b",
      danger: "#ef5b5b",
      shadow: "0 22px 70px rgba(26, 86, 128, 0.16)",
      hero: "radial-gradient(circle at 20% 10%, #d4f7ff 0, transparent 33%), radial-gradient(circle at 80% 0%, #d8fbe8 0, transparent 28%), linear-gradient(135deg,#f8fdff,#e7f7ff 62%,#f1fff7)",
    },
  },
  {
    id: "journal",
    name: "Warm Journal",
    mood: "Academic, editorial, inviting",
    notes: "Cream paper tones with burgundy/gold accents. Feels less like a dashboard and more like a clinical journal club.",
    colors: {
      bg: "#fffaf0",
      surface: "rgba(255,255,255,0.9)",
      surface2: "#f7eddc",
      text: "#33251b",
      muted: "#7a6755",
      faint: "#eadcc8",
      accent: "#9f3d43",
      accent2: "#c98520",
      warning: "#d97706",
      danger: "#be3b3b",
      shadow: "0 22px 70px rgba(97, 58, 24, 0.14)",
      hero: "radial-gradient(circle at 18% 18%, #ffe6bf 0, transparent 34%), radial-gradient(circle at 82% 0%, #ffd7d7 0, transparent 28%), linear-gradient(135deg,#fffaf0,#fff4df 58%,#fff8ec)",
    },
  },
  {
    id: "clinical",
    name: "Clean Clinical",
    mood: "Minimal, crisp, professional",
    notes: "White/gray interface with strong blue hierarchy. Most conservative option for hospital/academic users.",
    colors: {
      bg: "#f7f9fc",
      surface: "rgba(255,255,255,0.94)",
      surface2: "#edf2f7",
      text: "#172033",
      muted: "#667085",
      faint: "#d9e2ec",
      accent: "#2563eb",
      accent2: "#0f766e",
      warning: "#ca8a04",
      danger: "#dc2626",
      shadow: "0 22px 70px rgba(15, 23, 42, 0.12)",
      hero: "radial-gradient(circle at 22% 10%, #dbeafe 0, transparent 32%), radial-gradient(circle at 78% 8%, #ccfbf1 0, transparent 26%), linear-gradient(135deg,#ffffff,#f1f5f9)",
    },
  },
  {
    id: "midnight",
    name: "Midnight Refresh",
    mood: "Still dark, but richer and less black",
    notes: "Keeps the dark identity while adding warmer gradients, brighter card contrast, and more obvious CTAs.",
    colors: {
      bg: "#101827",
      surface: "rgba(21, 32, 51, 0.92)",
      surface2: "#18263d",
      text: "#eef6ff",
      muted: "#a7b7cc",
      faint: "#2b3d57",
      accent: "#7dd3fc",
      accent2: "#c4b5fd",
      warning: "#fbbf24",
      danger: "#fb7185",
      shadow: "0 24px 80px rgba(0, 0, 0, 0.34)",
      hero: "radial-gradient(circle at 20% 15%, rgba(125,211,252,0.24) 0, transparent 30%), radial-gradient(circle at 82% 4%, rgba(196,181,253,0.22) 0, transparent 30%), linear-gradient(135deg,#101827,#14223a 60%,#101827)",
    },
  },
];

const sampleGuidelines = [
  { org: "ACG", title: "Diagnosis and Management of Celiac Disease", meta: "Guideline · 2026", tag: "Small bowel" },
  { org: "AGA", title: "Clinical Practice Update on AI Tools for GI Research", meta: "Expert review · 2026", tag: "Research" },
  { org: "ASGE", title: "Endoscopic Removal of Colorectal Lesions", meta: "Guideline · 2020", tag: "Colon" },
];

const sampleWeekly = [
  { type: "Research", title: "Novel biologic strategy shows durable response in moderate-to-severe IBD", source: "Gastroenterology", impact: "High Impact" },
  { type: "FDA", title: "FDA clears updated diagnostic platform for upper GI bleeding risk stratification", source: "FDA", impact: "Practice-changing" },
  { type: "News", title: "New national data highlight disparities in colorectal cancer screening completion", source: "AGA News", impact: "Noteworthy" },
];

const schedule = [
  { date: "Oct 7", topic: "Colon Polyps Pathology", speaker: "Pathology Conference", state: "Quiz ready" },
  { date: "Oct 14", topic: "Celiac Disease", speaker: "Core Lecture", state: "Resources ready" },
  { date: "Oct 28", topic: "AI in GI Research", speaker: "Research Seminar", state: "Articles only" },
];

function swatchStyle(theme) {
  return {
    "--sandbox-bg": theme.colors.bg,
    "--sandbox-surface": theme.colors.surface,
    "--sandbox-surface-2": theme.colors.surface2,
    "--sandbox-text": theme.colors.text,
    "--sandbox-muted": theme.colors.muted,
    "--sandbox-faint": theme.colors.faint,
    "--sandbox-accent": theme.colors.accent,
    "--sandbox-accent-2": theme.colors.accent2,
    "--sandbox-warning": theme.colors.warning,
    "--sandbox-danger": theme.colors.danger,
    "--sandbox-shadow": theme.colors.shadow,
    "--sandbox-hero": theme.colors.hero,
  };
}

function StatCard({ value, label, tone = "accent" }) {
  return (
    <div className={`look-stat look-stat--${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ResourceCard({ item }) {
  return (
    <article className="look-card look-resource-card">
      <div className="look-card-topline">
        <span>{item.org}</span>
        <em>{item.meta}</em>
      </div>
      <h3>{item.title}</h3>
      <p>Concise fellow-facing summary with guideline relevance, key takeaways, and source links clearly separated from review articles.</p>
      <div className="look-card-actions">
        <span>{item.tag}</span>
        <button type="button">Open source</button>
      </div>
    </article>
  );
}

function WeeklyCard({ item }) {
  return (
    <article className="look-card look-weekly-card">
      <div className="look-pill-row">
        <span className="look-pill">{item.type}</span>
        <span className="look-pill look-pill-soft">{item.impact}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.source} · 2-3 sentence summary with direct study link status and a brief “why it matters” statement.</p>
    </article>
  );
}

function ThemeButton({ theme, active, onClick }) {
  return (
    <button className={`theme-button ${active ? "theme-button-active" : ""}`} type="button" onClick={onClick}>
      <span className="theme-button-swatches" aria-hidden="true">
        <i style={{ background: theme.colors.bg }} />
        <i style={{ background: theme.colors.accent }} />
        <i style={{ background: theme.colors.accent2 }} />
      </span>
      <span>
        <strong>{theme.name}</strong>
        <em>{theme.mood}</em>
      </span>
    </button>
  );
}

export default function LookSandbox() {
  const [themeId, setThemeId] = useState("coastal");
  const [layout, setLayout] = useState("cards");
  const theme = useMemo(() => THEMES.find(item => item.id === themeId) || THEMES[0], [themeId]);

  return (
    <main className="look-sandbox" style={swatchStyle(theme)}>
      <section className="look-shell">
        <aside className="look-controls" aria-label="GIHub look sandbox controls">
          <div>
            <p className="eyebrow">GIHub design sandbox</p>
            <h1>Try brighter looks without touching production</h1>
            <p className="look-intro">Switch palettes and layout density to compare a lighter, more inviting GIHub direction. This page is isolated at <code>/sandbox/look</code>.</p>
          </div>

          <div className="theme-list">
            {THEMES.map(item => (
              <ThemeButton key={item.id} theme={item} active={item.id === theme.id} onClick={() => setThemeId(item.id)} />
            ))}
          </div>

          <div className="layout-toggle" role="group" aria-label="Layout density">
            <button type="button" className={layout === "cards" ? "active" : ""} onClick={() => setLayout("cards")}>Spacious cards</button>
            <button type="button" className={layout === "compact" ? "active" : ""} onClick={() => setLayout("compact")}>Compact clinical</button>
          </div>

          <div className="look-note">
            <strong>{theme.name}</strong>
            <p>{theme.notes}</p>
          </div>
        </aside>

        <section className={`look-preview look-preview-${layout}`} aria-label={`${theme.name} GIHub preview`}>
          <nav className="look-nav">
            <div className="look-brand">
              <span>⚕️</span>
              <div>
                <strong>GIHub</strong>
                <em>Gastroenterology education hub</em>
              </div>
            </div>
            <div className="look-tabs">
              <button type="button" className="active">Guidelines</button>
              <button type="button">Weekly</button>
              <button type="button">Schedule</button>
              <button type="button">Education</button>
            </div>
          </nav>

          <header className="look-hero">
            <div>
              <p className="eyebrow">October curriculum</p>
              <h2>Clinical updates, schedule resources, and quizzes in one cleaner view.</h2>
              <p>Designed for fellows and faculty who need fast scanning, clear source provenance, and less visual fatigue than the current dark interface.</p>
              <div className="look-hero-actions">
                <button type="button">Review this direction</button>
                <button type="button" className="secondary">Compare current site</button>
              </div>
            </div>
            <div className="look-stats-grid">
              <StatCard value="128" label="Guidelines" />
              <StatCard value="10" label="Weekly cards" tone="warm" />
              <StatCard value="6" label="October quizzes" tone="green" />
            </div>
          </header>

          <section className="look-section-head">
            <div>
              <p className="eyebrow">Clinical Guidelines</p>
              <h2>Source-first reference cards</h2>
            </div>
            <label className="look-search">
              <span>Search</span>
              <input value="colon pathology" readOnly />
            </label>
          </section>

          <div className="look-resource-grid">
            {sampleGuidelines.map(item => <ResourceCard key={item.title} item={item} />)}
          </div>

          <div className="look-two-column">
            <section>
              <div className="look-section-head compact-head">
                <div>
                  <p className="eyebrow">Weekly Update</p>
                  <h2>High-yield this week</h2>
                </div>
              </div>
              <div className="look-weekly-list">
                {sampleWeekly.map(item => <WeeklyCard key={item.title} item={item} />)}
              </div>
            </section>

            <section className="look-schedule-panel">
              <div className="look-section-head compact-head">
                <div>
                  <p className="eyebrow">Schedule</p>
                  <h2>Upcoming teaching</h2>
                </div>
              </div>
              <div className="look-timeline">
                {schedule.map(item => (
                  <article key={item.topic}>
                    <time>{item.date}</time>
                    <div>
                      <h3>{item.topic}</h3>
                      <p>{item.speaker}</p>
                    </div>
                    <span>{item.state}</span>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
