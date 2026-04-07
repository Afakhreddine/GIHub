import { useState, useEffect } from "react";

// ── SESSION CACHE ─────────────────────────────────────────────────────────────
const sessionCache = {};


const STATIC = {
  guidelines: [
    { org:"AGA", year:"2025", month:"Nov", topic:"Barrett's Esophagus", urgency:"High", title:"AGA Clinical Practice Guideline on Surveillance of Barrett's Esophagus", summary:"Evidence-based recommendations on endoscopic surveillance for Barrett's esophagus using GRADE methodology.", url:"https://www.gastrojournal.org/article/S0016-5085(25)06013-5/fulltext" },
    { org:"AGA", year:"2025", month:"Oct", topic:"Gastroparesis", urgency:"High", title:"AGA Clinical Practice Guideline on Management of Gastroparesis", summary:"Evidence-based recommendations for diagnosis and treatment of idiopathic and diabetic gastroparesis.", url:"https://www.gastrojournal.org/article/S0016-5085(25)05857-3/fulltext" },
    { org:"ACG", year:"2025", month:"Jun", topic:"Ulcerative Colitis", urgency:"High", title:"ACG Clinical Guideline Update: Ulcerative Colitis in Adults", summary:"Updated recommendations for adult UC covering biologics, small molecules, and treat-to-target strategies.", url:"https://pubmed.ncbi.nlm.nih.gov/40701556/" },
    { org:"ACG", year:"2025", month:"Jun", topic:"Crohn's Disease", urgency:"High", title:"ACG Clinical Guideline: Management of Crohn's Disease in Adults", summary:"Comprehensive updated recommendations for adult CD management with GRADE-level evidence assessment.", url:"https://pubmed.ncbi.nlm.nih.gov/40701562/" },
    { org:"ASGE", year:"2025", month:"Feb", topic:"GERD", urgency:"Moderate", title:"ASGE Guideline on the Diagnosis and Management of GERD", summary:"Updates 2014 ASGE GERD guideline addressing post-sleeve gastrectomy and post-POEM populations.", url:"https://pubmed.ncbi.nlm.nih.gov/39692638/" },
    { org:"ACG", year:"2024", month:"Sep", topic:"H. pylori", urgency:"High", title:"ACG Clinical Guideline: Treatment of Helicobacter pylori Infection", summary:"Recommends bismuth quadruple or concomitant therapy as first-line given rising clarithromycin resistance.", url:"https://gi.org/guidelines/" },
  ],
  articles: [
    { journal:"Gastroenterology", date:"Mar 2026", topic:"Pancreatic Cancer", impactLevel:"Practice-changing", title:"Selective Urokinase Inhibition Plus Chemotherapy in PDAC", authors:"AGA Research Group et al.", summary:"Novel strategy combining urokinase inhibition with chemotherapy demonstrates improved survival endpoints.", url:"https://www.gastrojournal.org" },
    { journal:"UEG Journal", date:"Mar 2026", topic:"Colonoscopy", impactLevel:"High Impact", title:"Cold Snare Polypectomy for Colorectal Polyps ≤10mm: TACOS RCT", authors:"Chang LC et al.", summary:"Multicenter RCT evaluating cold snare polypectomy for diminutive polyps with high complete resection rates.", url:"https://onlinelibrary.wiley.com/journal/20506414" },
    { journal:"AJG", date:"Mar 2026", topic:"IBD", impactLevel:"High Impact", title:"Vedolizumab Safety in Pregnancy: OTIS Prospective Cohort", authors:"Chambers CD et al.", summary:"Prospective study of 275 pregnant women found no significant increase in major birth defects with vedolizumab.", url:"https://journals.lww.com/ajg/pages/default.aspx" },
    { journal:"AJG", date:"Mar 2026", topic:"MASLD", impactLevel:"Noteworthy", title:"Cardiovascular Risk Prediction Tools in MASLD: US Cohort Validation", authors:"TARGET-NASH Investigators", summary:"CV risk tools performed poorly in MASLD patients, highlighting need for disease-specific models.", url:"https://journals.lww.com/ajg/pages/default.aspx" },
  ],
  news: [
    { source:"FDA", date:"Mar 16, 2026", category:"FDA Approval", sentiment:"Positive", headline:"FDA Approves Durvalumab + FLOT for Early-Stage Gastric and GEJ Cancers", summary:"First immunotherapy approval in the perioperative setting for resectable gastric and GEJ adenocarcinoma.", url:"https://www.ajmc.com" },
    { source:"AGA/ABIM", date:"Mar 13, 2026", category:"Policy", sentiment:"Positive", headline:"ABIM Launching GI Longitudinal Knowledge Assessment with Hepatology Focus in July 2026", summary:"New GI LKA launches July 2026, allowing hepatology-focused gastroenterologists to earn relevant MOC credit.", url:"https://gastro.org/news/new-lka-with-hepatology-focus-coming-in-2026/" },
    { source:"ACG", date:"Mar 9, 2026", category:"Policy", sentiment:"Mixed", headline:"2026 Medicare GI Reimbursement Shifts: Impact on Endoscopy Payments", summary:"ACG flagged significant Medicare reimbursement changes affecting GI practices in 2026.", url:"https://gi.org/journals-publications/acg-blog/" },
  ],
};

const EDU_LINKS = [
  { org:"AGA", color:"#1a6dd4", gradient:"linear-gradient(135deg,#0d4a9e,#1a6dd4)", logo:"AGA", name:"AGA Universe", url:"https://www.agauniversity.org/", description:"AGA's comprehensive learning platform offering CME courses, board review, practice guidelines, and GI-focused educational content.", features:["CME Courses","Board Review","Practice Resources","Webinars"] },
  { org:"ACG", color:"#c49a0a", gradient:"linear-gradient(135deg,#8b6508,#d4a017)", logo:"ACG", name:"ACG Education Universe", url:"https://education.gi.org/", description:"Self-assessment programs, case-based learning, MOC resources, and GI fellowship training tools.", features:["Self-Assessment (SAPS)","MOC Resources","Case Studies","Fellowship Tools"] },
  { org:"ASGE", color:"#1a8a5a", gradient:"linear-gradient(135deg,#0e5c3a,#1a8a5a)", logo:"ASGE", name:"ASGE Education", url:"https://www.asge.org/home/education-meetings/educational-offerings", description:"ASGE's hub for endoscopy training, procedural competency, quality benchmarking, and advanced fellowships.", features:["Endoscopy Training","FundamentalsofEndoscopy.org","Quality Metrics","Advanced Fellowships"] },
];

const QUIZ_TOPICS = [
  { id:"General GI",            label:"General GI",            icon:"🫁", color:"#5b8af0" },
  { id:"Advanced Endoscopy",    label:"Advanced Endoscopy",    icon:"🔬", color:"#9c6af0" },
  { id:"IBD",                   label:"IBD",                   icon:"🧬", color:"#e05252" },
  { id:"General Hepatology",    label:"General Hepatology",    icon:"🫀", color:"#e09a2a" },
  { id:"Motility",              label:"Motility",              icon:"⚡", color:"#00b8d4" },
  { id:"Transplant Hepatology", label:"Transplant Hepatology", icon:"🏥", color:"#4caf7d" },
];

const SECTION_META = {
  guidelines: { label:"Clinical Guidelines", icon:"⚕️", color:"#5b8af0" },
  articles:   { label:"Top Articles",        icon:"📄", color:"#9c6af0" },
  news:       { label:"GI News",             icon:"📡", color:"#00b8d4" },
};

const urgencyColor   = { High:"#e05252", Moderate:"#e09a2a", Routine:"#4caf7d" };
const impactColor    = { "Practice-changing":"#5b8af0", "High Impact":"#9c6af0", Noteworthy:"#4caf7d" };
const categoryColor  = { "FDA Approval":"#5b8af0", "Drug News":"#9c6af0", Research:"#4caf7d", Industry:"#e09a2a", Policy:"#e05252", Technology:"#00b8d4" };
const sentimentColor = { Positive:"#4caf7d", Neutral:"#8899aa", Mixed:"#e09a2a", Negative:"#e05252" };

// ── API CALL ──────────────────────────────────────────────────────────────────
async function apiCall(body) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  return <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:"#fff", background:color||"#334", whiteSpace:"nowrap" }}>{label}</span>;
}

function Spinner({ size=16, color="#5b8af0" }) {
  return <span style={{ display:"inline-block", width:size, height:size, border:`2px solid ${color}33`, borderTop:`2px solid ${color}`, borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }} />;
}

function ContentCard({ item, type }) {
  const [hov, setHov] = useState(false);
  const ac = SECTION_META[type]?.color || "#5b8af0";
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => item.url && window.open(item.url, "_blank")}
      style={{ background:hov?"rgba(255,255,255,0.055)":"rgba(255,255,255,0.025)", border:`1px solid ${hov?ac+"66":"rgba(255,255,255,0.08)"}`, borderLeft:`3px solid ${hov?ac:"rgba(255,255,255,0.12)"}`, borderRadius:12, padding:"20px 22px", display:"flex", flexDirection:"column", gap:10, transform:hov?"translateY(-2px)":"none", transition:"all 0.18s", cursor:item.url?"pointer":"default" }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#5a6a88", fontFamily:"monospace" }}>
          {type==="guidelines" && `${item.org} · ${item.month} ${item.year}`}
          {type==="articles"   && `${item.journal} · ${item.date}`}
          {type==="news"       && `${item.source} · ${item.date}`}
        </span>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {type==="guidelines" && <><Badge label={item.topic} color="#1a2535"/><Badge label={item.urgency} color={urgencyColor[item.urgency]}/></>}
          {type==="articles"   && <><Badge label={item.topic} color="#1a2535"/><Badge label={item.impactLevel} color={impactColor[item.impactLevel]}/></>}
          {type==="news"       && <><Badge label={item.category} color={categoryColor[item.category]}/><Badge label={item.sentiment} color={sentimentColor[item.sentiment]}/></>}
        </div>
      </div>
      <div style={{ fontSize:14.5, fontWeight:600, color:hov?"#e8f0ff":"#c8d8f0", lineHeight:1.5 }}>
        {type==="news" ? item.headline : item.title}
      </div>
      {type==="articles" && item.authors && <div style={{ fontSize:11.5, color:"#445570", fontStyle:"italic" }}>{item.authors}</div>}
      <div style={{ fontSize:13, color:"#6a7a90", lineHeight:1.75 }}>{item.summary}</div>
      {item.url && hov && <div style={{ fontSize:11, color:ac, fontFamily:"monospace", marginTop:2 }}>View source ↗</div>}
    </div>
  );
}

// ── CONTENT SECTION ───────────────────────────────────────────────────────────
function ContentSection({ type }) {
  const meta = SECTION_META[type];
  const [search, setSearch]         = useState("");
  const [items, setItems]           = useState(STATIC[type]);
  const [loading, setLoading]       = useState(true);
  const [status, setStatus]         = useState("loading");
  const [ageHours, setAgeHours]     = useState(null);

  useEffect(() => {
    async function load() {
      // Return cached data immediately if available
      if (sessionCache[type]) {
        setItems(sessionCache[type].data);
        setAgeHours(sessionCache[type].ageHours);
        setStatus("live");
        setLoading(false);
        return;
      }
      setLoading(true);
      setStatus("loading");
      try {
        const result = await apiCall({ type: "content", section: type });
        console.log(`${type} result:`, result);
        if (Array.isArray(result.data) && result.data.length > 0) {
          sessionCache[type] = { data: result.data, ageHours: result.ageHours };
          setItems(result.data);
          setAgeHours(result.ageHours);
          setStatus("live");
        } else {
          console.warn(`${type}: empty data array, using static fallback`);
          setStatus("error");
        }
      } catch (e) {
        console.error(`${type} fetch failed:`, e.message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type]);

  const filtered = items.filter(i => !search || JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  const statusEl = {
    loading: <><Spinner size={10} color="#5a6a88"/> Loading…</>,
    live:    <><span style={{ color:"#4caf7d", fontWeight:700 }}>● Live</span> · {ageHours !== null ? `Updated ${ageHours}h ago` : "Fresh from web"}</>,
    error:   <><span style={{ color:"#5a6a88", fontWeight:700 }}>● Fallback</span> · Showing curated content · Live data updates daily</>,
  }[status] || null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0" }}>{meta.icon} {meta.label}</h1>
          <p style={{ marginTop:4, fontSize:12, color:"#2e4060", display:"flex", alignItems:"center", gap:8 }}>{statusEl}</p>
        </div>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#2a3a50", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter…"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, color:"#90b0d0", fontSize:12, padding:"8px 12px 8px 28px", outline:"none", width:150 }} />
        </div>
      </div>
      {search && (
        <div style={{ marginBottom:14, fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}" <button onClick={() => setSearch("")} style={{ background:"none", border:"none", color:"#5b8af0", fontSize:12, cursor:"pointer" }}>✕</button>
        </div>
      )}
      {filtered.length === 0
        ? <div style={{ textAlign:"center", padding:"40px 0", color:"#1e2e40" }}>No results for "{search}"</div>
        :         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(440px,1fr))", gap:14 }}>
            {filtered.map((item, i) => <ContentCard key={i} item={item} type={type} />)}
          </div>
      }
    </div>
  );
}

// ── EDUCATION ─────────────────────────────────────────────────────────────────
function EduCard({ edu }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => window.open(edu.url, "_blank")}
      style={{ background:hov?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${hov?edu.color+"88":"rgba(255,255,255,0.08)"}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-3px)":"none", transition:"all 0.2s", boxShadow:hov?`0 8px 28px ${edu.color}22`:"none" }}>
      <div style={{ background:edu.gradient, padding:"20px 22px 16px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", fontFamily:"monospace" }}>{edu.logo}</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{edu.name}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{edu.url.replace("https://","").split("/")[0]}</div>
        </div>
      </div>
      <div style={{ padding:"16px 20px 18px" }}>
        <p style={{ fontSize:13, color:"#7a8aa0", lineHeight:1.7, marginBottom:14 }}>{edu.description}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {edu.features.map(f => <span key={f} style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:edu.color+"22", color:edu.color, border:`1px solid ${edu.color}44`, fontWeight:600 }}>{f}</span>)}
        </div>
        {hov && <div style={{ marginTop:12, fontSize:11, color:edu.color, fontFamily:"monospace" }}>Visit {edu.name} ↗</div>}
      </div>
    </div>
  );
}

function EducationSection() {
  return (
    <div>
      <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0", marginBottom:6 }}>🎓 Education Hubs</h1>
      <p style={{ fontSize:12.5, color:"#2e4060", marginBottom:28 }}>Official learning platforms from ACG, AGA, and ASGE — CME, board review, endoscopy training, and more.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
        {EDU_LINKS.map(edu => <EduCard key={edu.org} edu={edu} />)}
      </div>
    </div>
  );
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
function QuizSection() {
  const [sel, setSel]             = useState(null);
  const [question, setQuestion]   = useState(null);
  const [answer, setAnswer]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [history, setHistory]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("gihub_quiz_history") || "[]"); } catch { return []; }
  });

  const ti = QUIZ_TOPICS.find(t => t.id === sel);

  async function generate(topicId) {
    setSel(topicId);
    setQuestion(null);
    setAnswer(null);
    setSubmitted(false);
    setError(null);
    setLoading(true);
    try {
      const result = await apiCall({ type: "quiz", topic: topicId });
      if (Array.isArray(result.data) && result.data.length > 0) {
        setQuestion(result.data[0]);
      } else {
        setError("Could not generate question. Please try again.");
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  function submit() {
    if (!answer) return;
    setSubmitted(true);
    const correct = answer === question.correct;
    const entry = { topic: sel, correct, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    try { localStorage.setItem("gihub_quiz_history", JSON.stringify(updated)); } catch {}
  }

  const correctCount = history.filter(h => h.correct).length;
  const pct = history.length ? Math.round(correctCount / history.length * 100) : null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0" }}>🧠 GI Quiz</h1>
          <p style={{ fontSize:12.5, color:"#2e4060", marginTop:4 }}>AI-generated board-style MCQ · Fresh question every time · Powered by Claude</p>
        </div>
        {pct !== null && (
          <div style={{ background:"rgba(91,138,240,0.08)", border:"1px solid rgba(91,138,240,0.2)", borderRadius:10, padding:"8px 16px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:700, color:"#5b8af0" }}>{pct}%</div>
            <div style={{ fontSize:10, color:"#3a5070", fontFamily:"monospace" }}>AVG SCORE</div>
          </div>
        )}
      </div>

      {/* Topic buttons */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, margin:"20px 0 28px" }}>
        {QUIZ_TOPICS.map(t => (
          <button key={t.id} onClick={() => generate(t.id)} disabled={loading}
            style={{ background:sel===t.id?t.color+"33":"rgba(255,255,255,0.04)", border:`1px solid ${sel===t.id?t.color:"rgba(255,255,255,0.1)"}`, color:sel===t.id?t.color:"#4a6080", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:7, cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1, transition:"all 0.18s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <Spinner size={32} color="#5b8af0" />
          <div style={{ marginTop:16, fontSize:14, color:"#3a5878" }}>Generating question…</div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ background:"rgba(224,82,82,0.08)", border:"1px solid #e0525244", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#e05252", marginBottom:4 }}>Error</div>
          <div style={{ fontSize:12, color:"#a05050", fontFamily:"monospace" }}>{error}</div>
        </div>
      )}

      {/* Result banner */}
      {submitted && question && (
        <div style={{ background:answer===question.correct?"rgba(76,175,61,0.1)":"rgba(224,82,82,0.1)", border:`1px solid ${answer===question.correct?"#4caf7d":"#e05252"}55`, borderRadius:12, padding:"16px 22px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontSize:18, fontWeight:700, color:answer===question.correct?"#4caf7d":"#e05252" }}>
            {answer === question.correct ? "Correct! 🎉" : "Incorrect 📚"}
          </div>
          <button onClick={() => generate(sel)} style={{ background:"rgba(91,138,240,0.12)", border:"1px solid rgba(91,138,240,0.3)", color:"#8aafff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            New Question →
          </button>
        </div>
      )}

      {/* Question */}
      {!loading && question && (
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"20px 22px" }}>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            <span style={{ background:ti?.color+"33", color:ti?.color, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>Q</span>
            <div style={{ fontSize:14, color:"#c8d8f0", lineHeight:1.7 }}>{question.question}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, paddingLeft:40 }}>
            {question.options.map((opt, oi) => {
              const letter = ["A","B","C","D"][oi];
              const isChosen = answer === letter;
              const isRight  = letter === question.correct;
              let bg = "rgba(255,255,255,0.03)", border = "rgba(255,255,255,0.08)", color = "#8898b0";
              if (submitted) {
                if (isRight)       { bg = "rgba(76,175,61,0.12)";  border = "#4caf7d55"; color = "#4caf7d"; }
                else if (isChosen) { bg = "rgba(224,82,82,0.1)";   border = "#e0525255"; color = "#e05252"; }
              } else if (isChosen) { bg = ti?.color+"22"; border = ti?.color+"88"; color = ti?.color; }
              return (
                <div key={oi} onClick={() => !submitted && setAnswer(letter)}
                  style={{ background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"10px 14px", fontSize:13, color, cursor:submitted?"default":"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontWeight:700, fontFamily:"monospace", fontSize:11, minWidth:14 }}>{letter}</span>
                  <span>{opt.replace(/^[A-D][\.\)]\s*/i, "")}</span>
                  {submitted && isRight  && <span style={{ marginLeft:"auto" }}>✓</span>}
                  {submitted && isChosen && !isRight && <span style={{ marginLeft:"auto" }}>✗</span>}
                </div>
              );
            })}
          </div>
          {!submitted && (
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}>
              <button onClick={submit} disabled={!answer}
                style={{ background:!answer?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#3a6fd8,#7c4af0)", border:"none", color:!answer?"#2a3a50":"#fff", padding:"11px 26px", borderRadius:10, fontSize:14, fontWeight:700, cursor:!answer?"not-allowed":"pointer", transition:"all 0.2s" }}>
                Submit
              </button>
            </div>
          )}
          {submitted && question.explanation && (
            <div style={{ marginTop:16, paddingLeft:40 }}>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"12px 14px" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:"#4a6a8a", fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>EXPLANATION</div>
                <div style={{ fontSize:13, color:"#6a8aaa", lineHeight:1.7 }}>{question.explanation}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !question && !error && (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <div style={{ fontSize:40, marginBottom:14 }}>🧠</div>
          <div style={{ fontSize:15, color:"#2a3a50" }}>Select a topic above to generate a question</div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#8898b8" }}>📊 Score History</h2>
            <button onClick={() => { setHistory([]); try { localStorage.removeItem("gihub_quiz_history"); } catch {} }}
              style={{ background:"none", border:"1px solid rgba(255,255,255,0.07)", color:"#3a5070", fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
              Clear
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10 }}>
            {history.map((h, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:"#3a5070", fontFamily:"monospace" }}>{h.date} · {h.time}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#6a8aaa", marginTop:3 }}>{h.topic}</div>
                <div style={{ fontSize:16, fontWeight:700, color:h.correct?"#4caf7d":"#e05252", marginTop:6 }}>{h.correct ? "✓ Correct" : "✗ Incorrect"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const TABS = [
  { id:"guidelines", label:"Clinical Guidelines", icon:"⚕️" },
  { id:"articles",   label:"Top Articles",        icon:"📄" },
  { id:"news",       label:"GI News",             icon:"📡" },
  { id:"education",  label:"Education",           icon:"🎓" },
  { id:"quiz",       label:"Quiz",                icon:"🧠" },
];

export default function GIHub() {
  const [active, setActive] = useState("guidelines");
  return (
    <div style={{ minHeight:"100vh", background:"#080f1e", color:"#d0e0ff", fontFamily:"Georgia,'Times New Roman',serif", paddingBottom:80 }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        button, input { font-family:inherit; }
        ::placeholder { color:#2a3a50; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#1a2a3a; border-radius:3px; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,15,30,0.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0 10px", gap:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#3a6fd8,#7c4af0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 16px rgba(91,138,240,0.25)" }}>⚕️</div>
              <div>
                <div style={{ fontSize:20, fontWeight:700, color:"#e0eeff" }}>
                  GI<span style={{ color:"#5b8af0" }}>Hub</span>{" "}
                  <span style={{ fontSize:11, background:"linear-gradient(135deg,#3a6fd8,#7c4af0)", color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:700, fontFamily:"monospace", verticalAlign:"middle" }}>AI</span>
                </div>
                <div style={{ fontSize:9.5, color:"#2a4060", letterSpacing:1.4, textTransform:"uppercase", fontFamily:"monospace" }}>Gastroenterology Educational Hub</div>
              </div>
            </div>
            <div style={{ fontSize:11, color:"#1a2e42", fontFamily:"monospace" }}>
              {new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" })}
            </div>
          </div>
          <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.04)", overflowX:"auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                style={{ background:active===t.id?"rgba(91,138,240,0.07)":"transparent", border:"none", borderBottom:`2px solid ${active===t.id?"#5b8af0":"transparent"}`, color:active===t.id?"#90b8ff":"#3a5070", padding:"11px 18px", fontSize:13, fontWeight:600, transition:"all 0.18s", whiteSpace:"nowrap", cursor:"pointer" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 32px 0" }}>
        {active==="guidelines" && <ContentSection key="guidelines" type="guidelines" />}
        {active==="articles"   && <ContentSection key="articles"   type="articles" />}
        {active==="news"       && <ContentSection key="news"       type="news" />}
        {active==="education"  && <EducationSection />}
        {active==="quiz"       && <QuizSection />}
      </div>

      {/* Footer */}
      <div style={{ maxWidth:1100, margin:"52px auto 0", padding:"16px 32px 0", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ fontSize:10.5, color:"#141e2c", textAlign:"center", lineHeight:2, fontFamily:"monospace" }}>
          GIHub is a curated educational reference tool for gastroenterologists. AI content generated via Claude with web search.<br />
          Always verify against official society sources. Quiz questions are for educational purposes only. Not a substitute for clinical judgment.
        </p>
      </div>
    </div>
  );
}