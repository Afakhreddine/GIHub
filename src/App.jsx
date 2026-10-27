import { useState, useEffect, useRef } from "react";
import { CALENDAR_MONTH, CALENDAR_EVENTS } from "./scheduleConfig.js";
import GUIDELINES from "./data/guidelines.js";
import WEEKLY from "./data/weekly.js";
import weeklyPodcasts from "./data/weeklyPodcasts.js";
import scheduleResources from "./data/scheduleResources.js";
import { isPublicApprovedResource, sanitizeScheduleResourceForPublic } from "./scheduleResourcesModel.js";
import Home from "./Home.jsx";
import { publicTabForPath, publicPathForTab } from "./publicRoutes.js";
import { resolveGuidelineLink } from "./guidelineLinks.js";

// ── SESSION CACHE ─────────────────────────────────────────────────────────────
const sessionCache = {};

// ── STATIC FALLBACK DATA ──────────────────────────────────────────────────────
const STATIC = {
  guidelines: GUIDELINES,
  weekly: WEEKLY.filter(isPublicApprovedResource),
};

const EDU_LINKS = [
  { org:"AGA",  color:"#1a6dd4", gradient:"linear-gradient(135deg,#0d4a9e,#1a6dd4)", logo:"AGA",  name:"AGA Universe",          url:"https://www.agauniversity.org/",                                     description:"AGA's comprehensive learning platform offering CME courses, board review, practice guidelines, and GI-focused educational content.",    features:["CME Courses","Board Review","Practice Resources","Webinars"] },
  { org:"ACG",  color:"#c49a0a", gradient:"linear-gradient(135deg,#8b6508,#d4a017)", logo:"ACG",  name:"ACG Education Universe", url:"https://education.gi.org/",                                          description:"Self-assessment programs, case-based learning, MOC resources, and GI fellowship training tools.",                                          features:["Self-Assessment (SAPS)","MOC Resources","Case Studies","Fellowship Tools"] },
  { org:"ASGE", color:"#1a8a5a", gradient:"linear-gradient(135deg,#0e5c3a,#1a8a5a)", logo:"ASGE", name:"ASGE Education",         url:"https://www.asge.org/home/education-meetings/educational-offerings", description:"ASGE's hub for endoscopy training, procedural competency, quality benchmarking, and advanced fellowships.",                              features:["Endoscopy Training","FundamentalsofEndoscopy.org","Quality Metrics","Advanced Fellowships"] },
];

const QUIZ_TOPICS = [
  { id:"General GI",            label:"General GI",            icon:"🫁", color:"#0b779b" },
  { id:"Advanced Endoscopy",    label:"Advanced Endoscopy",    icon:"🔬", color:"#7051ad" },
  { id:"IBD",                   label:"IBD",                   icon:"🧬", color:"#e05252" },
  { id:"General Hepatology",    label:"General Hepatology",    icon:"🫀", color:"#a66b11" },
  { id:"Motility",              label:"Motility",              icon:"⚡", color:"#0b779b" },
  { id:"Transplant Hepatology", label:"Transplant Hepatology", icon:"🏥", color:"#128566" },
];

const SECTION_META = {
  guidelines: { label:"Clinical Guidelines", icon:"⚕️",  color:"#0b93bb" },
  weekly:     { label:"Weekly Update",       icon:"📰", color:"#a66b11" },
};

const urgencyColor      = { High:"#e05252", Moderate:"#a66b11", Routine:"#128566" };
const impactColor       = { "Practice-changing":"#0b93bb", "High Impact":"#7051ad", Noteworthy:"#128566" };
const weeklyTypeColor   = { Research:"#7051ad", FDA:"#e05252", Guideline:"#0b93bb", News:"#0b779b", Opinion:"#a66b11" };
const SOCIETY_COLORS = {
  ACG:   { color:"#9a5a17", bg:"#fff6ea", border:"#f0d5b5" },
  AGA:   { color:"#0b779b", bg:"#eaf8fc", border:"#c8e8f1" },
  ASGE:  { color:"#7051ad", bg:"#f4f0fc", border:"#ded2f2" },
  AASLD: { color:"#128566", bg:"#eaf9f4", border:"#c3eadc" },
};
const DAY_LABELS     = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function parseDateStr(item) {
  const raw = item.date || (item.month && item.year ? `${item.month} ${item.year}` : null);
  if (!raw) return 0;
  const d = new Date(raw);
  return isNaN(d) ? 0 : d.getTime();
}
function sortByDate(items) { return [...items].sort((a,b) => parseDateStr(b) - parseDateStr(a)); }

async function apiCall(body) {
  const res = await fetch("/api/claude", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

function Badge({ label, color }) {
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:"#fff", background:color==="#0b93bb"?"#0b779b":color||"#17324d", whiteSpace:"nowrap" }}>{label}</span>;
}

function Spinner({ size=16, color="#0b93bb" }) {
  return <span style={{ display:"inline-block", width:size, height:size, border:`2px solid ${color}33`, borderTop:`2px solid ${color}`, borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }} />;
}

function ContentCard({ item, type }) {
  const [hov, setHov] = useState(false);
  const ac = SECTION_META[type]?.color || "#0b93bb";
  const isWeekly = type === "weekly";
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>item.url&&window.open(item.url,"_blank")}
      style={{ background:hov?"#f6fcff":"#fff", border:`1px solid ${hov?"#b9e3ee":"#dcecf1"}`, borderLeft:`3px solid ${hov?ac:"#b9dee8"}`, borderRadius:16, padding:"20px 22px", display:"flex", flexDirection:"column", gap:10, transform:hov?"translateY(-2px)":"none", transition:"all 0.18s", boxShadow:hov?"0 12px 28px rgba(23,50,77,0.09)":"0 4px 18px rgba(23,50,77,0.04)", cursor:item.url?"pointer":"default" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#536b7b", fontFamily:"monospace" }}>
          {type==="guidelines"&&`${item.org} · ${item.month} ${item.year}`}
          {isWeekly&&`${item.source} · ${item.date}`}
        </span>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {type==="guidelines"&&<><Badge label={item.topic} color="#17324d"/><Badge label={item.urgency} color={urgencyColor[item.urgency]}/></>}
          {isWeekly&&<>
            {item.type==="FDA"    &&<Badge label="FDA Approval" color={weeklyTypeColor.FDA}/>}
            {item.type==="Opinion"&&<Badge label="Opinion"      color={weeklyTypeColor.Opinion}/>}
            {item.multiSource     &&<Badge label="High Impact"  color={impactColor["High Impact"]}/>}
          </>}
        </div>
      </div>
      <div style={{ fontSize:14.5, fontWeight:600, color:"#17324d", lineHeight:1.5 }}>{item.title||item.headline}</div>
      {isWeekly&&item.authors&&<div style={{ fontSize:11.5, color:"#536b7b", fontStyle:"italic" }}>{item.authors}</div>}
      <div style={{ fontSize:13, color:"#516779", lineHeight:1.75 }}>{item.summary}</div>
      {isWeekly&&item.studyUrl&&(
        <div style={{ marginTop:4 }}>
          <button onClick={e=>{e.stopPropagation();window.open(item.studyUrl,"_blank");}}
            style={{ background:"#eaf9f4", border:"1px solid #b9e5d7", color:"#128566", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:7, cursor:"pointer", fontFamily:"monospace", letterSpacing:0.3 }}>
            Link to Study ↗
          </button>
        </div>
      )}
      {hov&&item.url&&(
        <div style={{ fontSize:11, color:ac, fontFamily:"monospace", marginTop:2 }}>View source ↗</div>
      )}
    </div>
  );
}

function WeeklyPodcastPanel({ podcasts = weeklyPodcasts }) {
  const [selectedId, setSelectedId] = useState(podcasts[0]?.id || "");
  if (!podcasts.length) return null;

  const selected = podcasts.find(p => p.id === selectedId) || podcasts[0];
  const previous = podcasts.slice(1);

  return (
    <section aria-label="Weekly Update podcasts" style={{ background:"linear-gradient(135deg,#fff 0%,#eaf8fc 75%,#eaf9f4 100%)", border:"1px solid #c8e8f1", borderRadius:18, padding:"20px 22px", marginBottom:22, boxShadow:"0 10px 32px rgba(23,50,77,0.07)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:14, flexWrap:"wrap", alignItems:"flex-start" }}>
        <div style={{ flex:"1 1 320px" }}>
          <div style={{ fontSize:11, fontWeight:800, color:"#a66b11", fontFamily:"monospace", letterSpacing:0.8, textTransform:"uppercase", marginBottom:6 }}>🎧 Weekly Podcast</div>
          <h2 style={{ fontSize:18, color:"#17324d", lineHeight:1.35, marginBottom:6 }}>{selected.title}</h2>
          <p style={{ fontSize:12.5, color:"#516779", lineHeight:1.65, maxWidth:760 }}>{selected.description}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:10 }}>
            <Badge label={selected.displayDate} color="#17324d" />
            <Badge label={`${selected.duration} audio`} color="#a66b11" />
            <Badge label={`${selected.sourceCount} sources`} color="#0b93bb" />
            {selected.relatedPr&&<Badge label={`PR #${selected.relatedPr}`} color="#128566" />}
          </div>
        </div>
        {previous.length > 0 && (
          <label style={{ display:"flex", flexDirection:"column", gap:6, minWidth:230, color:"#536b7b", fontSize:11, fontWeight:700, fontFamily:"monospace" }}>
            Current and prior episodes
            <select value={selected.id} onChange={e=>setSelectedId(e.target.value)} style={{ background:"#fff", border:"1px solid #b9dce6", borderRadius:9, color:"#17324d", padding:"9px 10px", fontSize:12, outline:"none" }}>
              {podcasts.map(p => <option key={p.id} value={p.id}>{p.displayDate} · {p.duration}</option>)}
            </select>
          </label>
        )}
      </div>
      <audio key={selected.audioUrl} controls preload="none" src={selected.audioUrl} style={{ width:"100%", marginTop:16, borderRadius:12, background:"#eaf8fc" }}>
        <a href={selected.audioUrl}>Download {selected.title}</a>
      </audio>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap", marginTop:10 }}>
        <a href={selected.audioUrl} download style={{ color:"#0b779b", fontSize:12, fontWeight:700, textDecoration:"none" }}>Download MP3 ↧</a>
        <span style={{ color:"#536b7b", fontSize:11, fontFamily:"monospace" }}>Rolling archive: latest {podcasts.length} Weekly Update podcasts stored in-repo</span>
      </div>
    </section>
  );
}

function ContentSection({ type }) {
  const meta = SECTION_META[type];
  const [search, setSearch]     = useState("");
  const isRepoManaged = type === "weekly";
  const [items, setItems]       = useState(()=>sortByDate(STATIC[type]));
  const [loading, setLoading]   = useState(!isRepoManaged);
  const [status, setStatus]     = useState(isRepoManaged ? "repo" : "loading");
  const [ageHours, setAgeHours] = useState(null);
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(isRepoManaged ? STATIC[type].length : 0);

  useEffect(() => { setPage(1); }, [type]);

  useEffect(() => {
    async function load() {
      if (isRepoManaged) {
        const data = sortByDate(STATIC.weekly);
        setItems(data);
        setAgeHours(null);
        setStatus("repo");
        setPages(1);
        setTotal(data.length);
        setLoading(false);
        return;
      }
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
        const result = await apiCall({ type:"content", section:type, page });
        if (Array.isArray(result.data) && result.data.length > 0) {
          const sorted = sortByDate(result.data);
          sessionCache[type] = { data:sorted, ageHours:result.ageHours };
          setItems(sorted);
          setAgeHours(result.ageHours);
          setStatus("live");
          if (result.pages) { setPages(result.pages); setTotal(result.total || 0); }
        } else {
          setStatus("error");
        }
      } catch(e) {
        console.error(`${type} fetch failed:`, e.message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type, page, isRepoManaged]);

  const filtered = items.filter(i=>!search||JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  const statusEl = {
    loading: <><Spinner size={10} color="#536b7b"/> Loading…</>,
    repo:    <><span style={{ color:"#128566", fontWeight:700 }}>● Repo-managed</span> · {total} {type === "guidelines" ? "guidelines" : "items"} · Updated through GitHub</>,
    live:    <><span style={{ color:"#128566", fontWeight:700 }}>● Live</span> · {ageHours!=null?`Updated ${ageHours}h ago`:"Fresh from web"} · Sources: news.gastro.org · gastroendonews.com · healio.com</>,
    error:   <><span style={{ color:"#536b7b", fontWeight:700 }}>● Fallback</span> · Showing curated content · Live data updates weekly</>,
  }[status] || null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#17324d" }}>{meta.icon} {meta.label}</h1>
          <p style={{ marginTop:4, fontSize:12, color:"#536b7b", display:"flex", alignItems:"center", gap:8 }}>{statusEl}</p>
        </div>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#536b7b", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter…"
            style={{ background:"#fff", border:"1px solid #bfdce5", borderRadius:10, color:"#17324d", fontSize:13, padding:"9px 12px 9px 32px", outline:"none", width:170 }}/>
        </div>
      </div>
      {type === "weekly" && <WeeklyPodcastPanel />}
      {search&&<div style={{ marginBottom:14, fontSize:12, color:"#536b7b", fontFamily:"monospace" }}>{filtered.length} result{filtered.length!==1?"s":""} for "{search}" <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", color:"#0b93bb", fontSize:12, cursor:"pointer" }}>✕</button></div>}
      {filtered.length===0
        ?<div style={{ textAlign:"center", padding:"40px 0", color:"#536b7b" }}>No results for "{search}"</div>
        :<div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,440px),1fr))", gap:14 }}>
           {filtered.map((item,i)=><ContentCard key={i} item={item} type={type}/>)}
         </div>}
      {type === "guidelines" && pages > 1 && !search && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginTop:28 }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1||loading}
            style={{ background:"#f5fbfd", border:"1px solid #d1e5eb", color:page===1?"#536b7b":"#476177", padding:"8px 16px", borderRadius:8, fontSize:13, cursor:page===1?"not-allowed":"pointer" }}>← Prev</button>
          <span style={{ fontSize:12, color:"#536b7b", fontFamily:"monospace" }}>Page {page} of {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages||loading}
            style={{ background:"#f5fbfd", border:"1px solid #d1e5eb", color:page===pages?"#536b7b":"#476177", padding:"8px 16px", borderRadius:8, fontSize:13, cursor:page===pages?"not-allowed":"pointer" }}>Next →</button>
        </div>
      )}
    </div>
  );
}

function SocietyWidget({ org, guidelines, search }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [newOnly, setNewOnly]           = useState(false);
  const sentinelRef  = useRef(null);
  const containerRef = useRef(null);
  const sc = SOCIETY_COLORS[org] || SOCIETY_COLORS.AGA;

  useEffect(() => { setVisibleCount(3); setNewOnly(false); }, [guidelines]);

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const isRecent = g => { const d = new Date(`${g.month} ${g.year}`); return !isNaN(d) && d >= threeMonthsAgo; };
  const newCount = guidelines.filter(isRecent).length;

  const filtered = guidelines.filter(g => {
    if (newOnly && !isRecent(g)) return false;
    if (search) return (g.title + " " + (g.topic||"") + " " + (g.summary||"")).toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const isFiltering = newOnly || !!search;
  const visible  = isFiltering ? filtered : filtered.slice(0, visibleCount);
  const hasMore  = !isFiltering && visibleCount < filtered.length;

  useEffect(() => {
    if (!sentinelRef.current || !containerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(c => Math.min(c + 3, filtered.length)); },
      { root: containerRef.current, threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div style={{ background:"#fff", border:"1px solid #dcecf1", borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 5px 22px rgba(23,50,77,0.05)" }}>
      {/* Header */}
      <div style={{ background:sc.bg, borderBottom:`1px solid ${sc.border}`, padding:"11px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:15, fontWeight:800, color:sc.color, letterSpacing:0.5 }}>{org}</span>
        <span style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace" }}>{guidelines.length} guidelines</span>
      </div>
      {/* Controls */}
      <div style={{ display:"flex", gap:7, alignItems:"center", padding:"8px 12px", borderBottom:"1px solid #e3f0f3", background:"#f8fcfd" }}>
        <button onClick={()=>{setNewOnly(n=>!n);setVisibleCount(3);}}
          style={{ background:newOnly?sc.bg:"#fff", border:`1px solid ${newOnly?sc.border:"#cbdfe6"}`, color:newOnly?sc.color:"#536b7b", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:7, cursor:"pointer", whiteSpace:"nowrap" }}>
          {newOnly&&"● "}Last 3 months ({newCount})
        </button>
      </div>
      {/* List */}
      <div ref={containerRef} style={{ overflowY:"auto", maxHeight:480 }}>
        {visible.length === 0
          ? <div style={{ padding:"24px 18px", fontSize:12, color:"#536b7b", textAlign:"center" }}>No results</div>
          : visible.map((g, i) => {
              const link = resolveGuidelineLink(g);
              return (
                <div key={i} onClick={()=>link.url&&window.open(link.url,"_blank")}
                  style={{ padding:"13px 18px", borderBottom:i<visible.length-1?"1px solid #e6f1f4":"none", cursor:link.url?"pointer":"default" }}
                  onMouseEnter={e=>link.url&&(e.currentTarget.style.background="#f4fbfd")}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#0b779b", fontFamily:"monospace", marginBottom:5, letterSpacing:0.3 }}>{g.month} {g.year}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#17324d", lineHeight:1.5, marginBottom:5 }}>{g.title}</div>
                  <div style={{ fontSize:12, color:"#516779", lineHeight:1.65 }}>{g.summary}</div>
                  <div style={{ fontSize:11, color:sc.color, marginTop:6 }}>{link.label}</div>
                </div>
              );
            })
        }
        {hasMore && <div ref={sentinelRef} style={{ height:20 }}/>}
      </div>
    </div>
  );
}

function GuidelinesSection() {
  const [grouped, setGrouped]     = useState(null);
  const [status, setStatus]       = useState("loading");
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState("");
  const [newAlerts, setNewAlerts] = useState([]);

  function buildGrouped(list) {
    const g = {};
    list.forEach(item => {
      if (!g[item.org]) g[item.org] = [];
      g[item.org].push(item);
    });
    return g;
  }

  useEffect(() => {
    async function load() {
      // Load new-guideline banner alerts (non-critical — ignore failures)
      try {
        const r = await apiCall({ type:"content", section:"guidelines-new" });
        if (Array.isArray(r.data)) {
          const alertTime = (alert) => Date.parse(alert.addedAt || alert.approvedAt || alert.queuedAt || alert.detectedAt || alert.publishedAt || alert.date || "") || 0;
          const recent = r.data
            .filter(a => a && a.title)
            .sort((a, b) => alertTime(b) - alertTime(a))
            .slice(0, 5);
          setNewAlerts(recent);
        }
      } catch(_) {}

      try {
        const result = await apiCall({ type:"content", section:"guidelines", page:"all" });
        if (Array.isArray(result.data) && result.data.length > 0) {
          setGrouped(buildGrouped(result.data));
          setTotal(result.total || result.data.length);
          setStatus("live");
        } else {
          setGrouped(buildGrouped(STATIC.guidelines));
          setStatus("error");
        }
      } catch(e) {
        console.error("guidelines fetch failed:", e.message);
        setGrouped(buildGrouped(STATIC.guidelines));
        setStatus("error");
      }
    }
    load();
  }, []);

  const statusEl = {
    loading: <><Spinner size={10} color="#536b7b"/> Loading…</>,
    live:    <><span style={{ color:"#128566", fontWeight:700 }}>● Repository</span> · {total} guidelines</>,
    error:   <><span style={{ color:"#536b7b", fontWeight:700 }}>● Fallback</span> · Showing curated content · Live data updates weekly</>,
  }[status];

  return (
    <div>
      {newAlerts.length > 0 && (
        <div style={{ marginBottom:28, display:"flex", flexDirection:"column", gap:14 }}>
          {newAlerts.map((alert, i) => {
            const alertUrl = resolveGuidelineLink(alert).url;
            const Wrapper = alertUrl ? "a" : "div";
            const wrapperProps = alertUrl
              ? { href:alertUrl, target:"_blank", rel:"noopener noreferrer", title:`Open ${alert.title}` }
              : {};
            return (
            <Wrapper key={i} {...wrapperProps} style={{ display:"block", textDecoration:"none", background:"linear-gradient(135deg,#fff,#eaf8fc)", border:"1px solid #b9e3ee", borderLeft:"5px solid #0b93bb", borderRadius:16, padding:"20px 26px", boxShadow:"0 8px 28px rgba(23,50,77,0.07)", cursor:alertUrl?"pointer":"default" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#0b779b", letterSpacing:0.8, textTransform:"uppercase", lineHeight:1.25 }}>
                NEW {alert.org} GUIDELINE PUBLISHED
              </div>
              <div style={{ fontSize:15, fontWeight:600, color:"#17324d", marginTop:10, lineHeight:1.55 }}>{alert.title}</div>
              {(alert.month || alert.year) && (
                <div style={{ fontSize:11, color:"#536b7b", marginTop:8, fontFamily:"monospace" }}>{[alert.month, alert.year].filter(Boolean).join(" ")} · Added to repository{alertUrl ? " · Open guideline ↗" : ""}</div>
              )}
            </Wrapper>
          );})}
        </div>
      )}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:21, fontWeight:700, color:"#17324d" }}>⚕️ Clinical Guidelines</h1>
            <p style={{ marginTop:4, fontSize:12, color:"#536b7b", display:"flex", alignItems:"center", gap:8 }}>{statusEl}</p>
          </div>
        </div>
        <div style={{ position:"relative", maxWidth:380 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#536b7b", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search all guidelines…"
            style={{ width:"100%", background:"#fff", border:"1px solid #bfdce5", borderRadius:10, color:"#17324d", fontSize:13, padding:"10px 12px 10px 32px", outline:"none" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#0b93bb", fontSize:13, cursor:"pointer", padding:0 }}>✕</button>}
        </div>
      </div>
      {status === "loading" && <div style={{ textAlign:"center", padding:"60px 0" }}><Spinner size={28}/></div>}
      {grouped && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,440px),1fr))", gap:16 }}>
          {["ACG","AGA","ASGE","AASLD"].map(org =>
            grouped[org]?.length > 0 ? <SocietyWidget key={org} org={org} guidelines={grouped[org]} search={search}/> : null
          )}
        </div>
      )}
    </div>
  );
}

function EduCard({ edu }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>window.open(edu.url,"_blank")}
      style={{ background:"#fff", border:`1px solid ${hov?"#b9e3ee":"#dcecf1"}`, borderRadius:18, overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-3px)":"none", transition:"all 0.2s", boxShadow:hov?"0 14px 30px rgba(23,50,77,0.1)":"0 4px 18px rgba(23,50,77,0.04)" }}>
      <div style={{ background:edu.gradient, padding:"20px 22px 16px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", fontFamily:"monospace" }}>{edu.logo}</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{edu.name}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.88)", marginTop:2 }}>{edu.url.replace("https://","").split("/")[0]}</div>
        </div>
      </div>
      <div style={{ padding:"16px 20px 18px" }}>
        <p style={{ fontSize:13, color:"#516779", lineHeight:1.7, marginBottom:14 }}>{edu.description}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {edu.features.map(f=><span key={f} style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:edu.color+"22", color:edu.color, border:`1px solid ${edu.color}44`, fontWeight:600 }}>{f}</span>)}
        </div>
        {hov&&<div style={{ marginTop:12, fontSize:11, color:edu.color, fontFamily:"monospace" }}>Visit {edu.name} ↗</div>}
      </div>
    </div>
  );
}

function EducationSection() {
  return (
    <div>
      <h1 style={{ fontSize:21, fontWeight:700, color:"#17324d", marginBottom:6 }}>🎓 Education Hubs</h1>
      <p style={{ fontSize:12.5, color:"#536b7b", marginBottom:28 }}>Official learning platforms from ACG, AGA, and ASGE — CME, board review, endoscopy training, and more.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,300px),1fr))", gap:20 }}>
        {EDU_LINKS.map(edu=><EduCard key={edu.org} edu={edu}/>)}
      </div>
    </div>
  );
}

const firstDate  = new Date(CALENDAR_EVENTS[0].date + "T12:00:00");
const gridStart  = new Date(firstDate);
gridStart.setDate(gridStart.getDate() - gridStart.getDay());
const MONTH_DAYS = Array.from({ length:35 }, (_,i) => {
  const d = new Date(gridStart); d.setDate(d.getDate()+i);
  return d.toISOString().split("T")[0];
});
const DISPLAY_MONTH = firstDate.getMonth();

// ── QUIZ DISPLAY (static, pre-generated by cron) ──────────────────────────────
function QuizDisplay({ quiz }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers]     = useState({});

  useEffect(() => {
    setQuizIndex(0);
    setAnswers({});
  }, [quiz]);

  function selectAnswer(idx, letter) {
    if (answers[idx]) return;
    setAnswers(a => ({ ...a, [idx]: letter }));
  }

  const currentQ = quiz[quizIndex];
  if (!currentQ) return null;

  const hasAnswered = !!answers[quizIndex];

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#0b93bb", fontFamily:"monospace", letterSpacing:1, marginBottom:14 }}>🧠 TOPIC QUIZ</div>
        <div style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace" }}>Question {quizIndex+1} of {quiz.length}</div>
      </div>
      <div style={{ background:"#fff", border:"1px solid #dcecf1", borderRadius:12, padding:"16px" }}>
        <div style={{ fontSize:13, color:"#17324d", lineHeight:1.7, marginBottom:14 }}>{currentQ.question}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {currentQ.options.map((opt,oi)=>{
            const letter = ["A","B","C","D"][oi];
            const isChosen = answers[quizIndex] === letter;
            const isRight  = letter === currentQ.correct;
            let bg="#f8fcfd", border="#dcecf1", color="#17324d";
            if (hasAnswered) {
              if (isRight)          { bg="#eaf9f4";  border="#12856655"; color="#128566"; }
              else if (isChosen)    { bg="#fff1ef";   border="#f1c9c6"; color="#e05252"; }
            } else if (isChosen)    { bg="#eaf8fc"; border="#b9e3ee"; color="#0b93bb"; }
            return (
              <div key={oi} onClick={()=>selectAnswer(quizIndex, letter)}
                style={{ background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 12px", fontSize:12, color, cursor:hasAnswered?"default":"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontWeight:700, fontFamily:"monospace", fontSize:11, minWidth:14 }}>{letter}</span>
                <span>{opt.replace(/^[A-D][.)]\s*/i,"")}</span>
                {hasAnswered&&isRight  &&<span style={{ marginLeft:"auto" }}>✓</span>}
                {hasAnswered&&isChosen&&!isRight&&<span style={{ marginLeft:"auto" }}>✗</span>}
              </div>
            );
          })}
        </div>
        {hasAnswered&&(
          <div style={{ marginTop:12, background:"#f5fbfd", border:"1px solid #dcecf1", borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#536b7b", fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>EXPLANATION</div>
            <div style={{ fontSize:12, color:"#476177", lineHeight:1.7 }}>{currentQ.explanation}</div>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
          <button onClick={()=>setQuizIndex(i=>Math.max(0,i-1))} disabled={quizIndex===0}
            style={{ background:"#f5fbfd", border:"1px solid #dcecf1", color:quizIndex===0?"#536b7b":"#476177", padding:"6px 14px", borderRadius:7, fontSize:12, cursor:quizIndex===0?"not-allowed":"pointer" }}>← Prev</button>
          <div style={{ display:"flex", gap:6 }}>
            {quiz.map((_,i)=>(
              <div key={i} onClick={()=>setQuizIndex(i)}
                style={{ width:8, height:8, borderRadius:"50%", background:i===quizIndex?"#0b93bb":answers[i]?(answers[i]===quiz[i].correct?"#128566":"#e05252"):"#d1e5eb", cursor:"pointer", transition:"all 0.15s" }}/>
            ))}
          </div>
          <button onClick={()=>setQuizIndex(i=>Math.min(quiz.length-1,i+1))} disabled={quizIndex===quiz.length-1}
            style={{ background:"#f5fbfd", border:"1px solid #dcecf1", color:quizIndex===quiz.length-1?"#536b7b":"#476177", padding:"6px 14px", borderRadius:7, fontSize:12, cursor:quizIndex===quiz.length-1?"not-allowed":"pointer" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── LECTURE DETAIL PANEL ──────────────────────────────────────────────────────
function LectureDetailPanel({ event, onClose }) {
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [showQuiz, setShowQuiz]           = useState(false);
  const [showAllGuidelines, setShowAllGuidelines] = useState(false);

  useEffect(() => {
    setShowQuiz(false);
    setShowAllGuidelines(false);
    async function load() {
      setLoading(true);
      const localResource = scheduleResources[event.slug];
      if (localResource) {
        const publicResource = sanitizeScheduleResourceForPublic(localResource);
        setData({
          ...publicResource,
          guideline: publicResource.guidelines || publicResource.guideline || [],
          newsAndArticles: publicResource.newsAndArticles || [],
          quiz: publicResource.quiz || [],
        });
        setLoading(false);
        return;
      }
      try {
        const result = await apiCall({ type:"lecture", topic:event.slug });
        setData(result);
      } catch(e) { console.error("Lecture fetch failed:", e.message); }
      setLoading(false);
    }
    load();
  }, [event.slug]);

  const newsAndArticles = data?.newsAndArticles || [
    ...(data?.articles || []).map(a => ({ ...a, title:a.title, source:a.journal || a.source, oneLineSummary:a.summary })),
    ...(data?.news || []).map(n => ({ ...n, title:n.title || n.headline, oneLineSummary:n.summary })),
  ];
  const noData = !loading && (!data || (!data.guideline?.length && !newsAndArticles.length && !data.quiz?.length));
  const hasQuiz = data?.quiz?.length > 0;

  return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, width:"min(600px,100vw)", background:"#f8fdff", borderLeft:"1px solid #d3e7ed", zIndex:200, overflowY:"auto", boxShadow:"-8px 0 32px rgba(23,50,77,0.18)" }}>
      <div style={{ position:"sticky", top:0, background:"rgba(255,255,255,0.97)", borderBottom:"1px solid #dcecf1", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, zIndex:1 }}>
        <div>
          <div style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace", marginBottom:4 }}>{new Date(event.date+"T12:00:00").toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric", year:"numeric" })}</div>
          <div style={{ fontSize:16, fontWeight:700, color:"#17324d", lineHeight:1.4 }}>{event.topic}</div>
        </div>
        <button onClick={onClose} style={{ background:"#eaf8fc", border:"1px solid #c8e8f1", color:"#17324d", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16, flexShrink:0 }}>✕</button>
      </div>

      <div style={{ padding:24 }}>
        {loading&&<div style={{ textAlign:"center", padding:"60px 0" }}><Spinner size={28}/><div style={{ marginTop:14, fontSize:13, color:"#536b7b" }}>Loading lecture content…</div></div>}
        {noData&&<div style={{ textAlign:"center", padding:"60px 0", color:"#536b7b" }}><div style={{ fontSize:32, marginBottom:12 }}>📭</div><div style={{ fontSize:13 }}>No content yet. Run the schedule cron to populate.</div></div>}

        {!loading&&data&&(
          <div style={{ display:"flex", flexDirection:"column", gap:32 }}>

            {/* Guidelines — most recent shown by default, expand for rest */}
            {data.guideline?.length>0&&(()=>{
              const sorted = sortByDate(data.guideline);
              const visible = showAllGuidelines ? sorted : [sorted[0]];
              return (
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#0b93bb", fontFamily:"monospace", letterSpacing:1, marginBottom:12 }}>⚕️ RELEVANT GUIDELINE{data.guideline.length>1?"S":""}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {visible.map((g,i)=>{
                    const sc = SOCIETY_COLORS[g.org] || { color:"#0b93bb", border:"#c8e8f1" };
                    return (
                    <div key={i} onClick={()=>g.url&&window.open(g.url,"_blank")}
                      style={{ background:"#f2fafd", border:`1px solid ${sc.border}`, borderLeft:`3px solid ${sc.color}`, borderRadius:10, padding:"14px 16px", cursor:g.url?"pointer":"default" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:sc.color, background:sc.bg||"#eaf8fc", padding:"2px 8px", borderRadius:12 }}>{g.org}</span>
                        <span style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace" }}>{g.month} {g.year}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#17324d", lineHeight:1.5, marginBottom:6 }}>{g.title}</div>
                      <div style={{ fontSize:12, color:"#516779", lineHeight:1.7 }}>{g.summary}</div>
                    </div>
                  );})}
                </div>
                {sorted.length > 1 && (
                  <button onClick={()=>setShowAllGuidelines(s=>!s)}
                    style={{ marginTop:10, background:"none", border:"none", color:"#0b93bb", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace", padding:0 }}>
                    {showAllGuidelines ? "Show less ↑" : `Show ${sorted.length - 1} more guideline${sorted.length>2?"s":""} ↓`}
                  </button>
                )}

                {/* Quiz button — only shown if quiz data exists */}
                {hasQuiz&&!showQuiz&&(
                  <button onClick={()=>setShowQuiz(true)}
                    style={{ marginTop:14, background:"linear-gradient(135deg,#0b779b,#128566)", border:"1px solid #0b779b", color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                    🧠 Show Topic Quiz
                  </button>
                )}
                {hasQuiz&&showQuiz&&(
                  <QuizDisplay quiz={data.quiz}/>
                )}
              </div>
            );
          })()}

            {/* News and Articles */}
            {newsAndArticles.length>0&&(
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#0b779b", fontFamily:"monospace", letterSpacing:1, marginBottom:12 }}>📡 NEWS AND ARTICLES</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {newsAndArticles.map((item,i)=>(
                    <div key={i} onClick={()=>item.url&&window.open(item.url,"_blank")}
                      style={{ background:"#f2fafd", border:"1px solid #c8e8f1", borderLeft:"3px solid #0b779b", borderRadius:10, padding:"12px 14px", cursor:item.url?"pointer":"default" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#0b779b", background:"#eaf8fc", padding:"2px 8px", borderRadius:12 }}>{item.source || item.journal || item.sourceRepository || "Source"}</span>
                        {item.date&&<span style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace" }}>{item.date}</span>}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#17324d", lineHeight:1.5, marginBottom:4 }}>{item.title || item.headline}</div>
                      {item.authors&&<div style={{ fontSize:11, color:"#536b7b", fontStyle:"italic", marginBottom:4 }}>{item.authors}</div>}
                      <div style={{ fontSize:12, color:"#516779", lineHeight:1.7 }}>{item.oneLineSummary || item.summary}</div>
                      {(item.doi||item.pmid)&&<div style={{ marginTop:6, fontSize:10.5, color:"#536b7b", fontFamily:"monospace" }}>{item.doi?`DOI ${item.doi}`:`PMID ${item.pmid}`}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleSection() {
  const [selectedEvent, setSelectedEvent] = useState(() => {
    if (typeof window === "undefined") return null;
    const slug = new URLSearchParams(window.location.search).get("lecture");
    return slug ? CALENDAR_EVENTS.find(event => event.slug === slug) || null : null;
  });
  const closeSelectedEvent = () => {
    setSelectedEvent(null);
    if (typeof window !== "undefined" && window.location.search.includes("lecture=")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("lecture");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  };
  const eventMap = {};
  CALENDAR_EVENTS.forEach(e=>{ eventMap[e.date]=e; });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#17324d" }}>📅 Schedule</h1>
          <p style={{ marginTop:4, fontSize:12, color:"#536b7b" }}>{CALENDAR_MONTH} · Click highlighted lectures for guidelines, articles & news</p>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center", fontSize:11, color:"#536b7b" }}>
          <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#e05252", marginRight:4 }}/>Lecture</span>
          <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#a66b11", marginRight:4 }}/>Conference</span>
          <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"rgba(91,138,240,0.4)", border:"1px solid #0b93bb", marginRight:4 }}/>Clickable</span>
        </div>
      </div>
      <div style={{ background:"#fff", border:"1px solid #dcecf1", borderRadius:16, overflow:"hidden", boxShadow:"0 5px 22px rgba(23,50,77,0.05)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"1px solid #dcecf1", background:"#eaf8fc" }}>
          {DAY_LABELS.map(d=><div key={d} style={{ padding:"10px 0", textAlign:"center", fontSize:11, fontWeight:700, color:"#536b7b", fontFamily:"monospace", letterSpacing:1 }}>{d}</div>)}
        </div>
        {Array.from({ length:5 }, (_,week)=>(
          <div key={week} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:week<4?"1px solid #e3eef2":"none" }}>
            {Array.from({ length:7 }, (_,day)=>{
              const dateStr = MONTH_DAYS[week*7+day];
              const d = new Date(dateStr+"T12:00:00");
              const isCurrentMonth = d.getMonth()===DISPLAY_MONTH;
              const event = eventMap[dateStr];
              const isClickable = event?.slug!=null;
              return (
                <div key={day}
                  onClick={()=>isClickable&&setSelectedEvent(event)}
                  onMouseEnter={e=>{ if(isClickable) e.currentTarget.style.background="#dff3f8"; }}
                  onMouseLeave={e=>{ if(isClickable) e.currentTarget.style.background="#f0fafe"; }}
                  style={{ minHeight:90, padding:8, borderRight:day<6?"1px solid #e3eef2":"none", background:isClickable?"#f0fafe":"transparent", cursor:isClickable?"pointer":"default", transition:"background 0.15s" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:isCurrentMonth?"#17324d":"#8195a1", marginBottom:4 }}>{d.getDate()}</div>
                  {event&&(
                    <div style={{ fontSize:10.5, lineHeight:1.4, padding:"4px 6px", borderRadius:5,
                      background:isClickable?"#dbf2f9":event.topic?"#fff0ef":"#fff6e8",
                      border:isClickable?"1px solid #b4dfea":event.topic?"1px solid #f2d1cb":"1px solid #efdab4",
                      color:isClickable?"#0b779b":event.topic?"#ac4545":"#865709",
                      fontWeight:isClickable?600:400 }}>
                      {isClickable&&<span style={{ marginRight:3 }}>🔗</span>}
                      {event.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {selectedEvent&&(
        <>
          <div onClick={closeSelectedEvent} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:199 }}/>
          <LectureDetailPanel event={selectedEvent} onClose={closeSelectedEvent}/>
        </>
      )}
    </div>
  );
}

function QuizSection() {
  const [sel, setSel]             = useState(null);
  const [question, setQuestion]   = useState(null);
  const [answer, setAnswer]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [history, setHistory]     = useState(()=>{ try { return JSON.parse(localStorage.getItem("gihub_quiz_history")||"[]"); } catch { return []; } });

  const ti = QUIZ_TOPICS.find(t=>t.id===sel);

  async function generate(topicId) {
    setSel(topicId); setQuestion(null); setAnswer(null); setSubmitted(false); setError(null); setLoading(true);
    try {
      const result = await apiCall({ type:"quiz", topic:topicId });
      if (Array.isArray(result.data) && result.data.length>0) setQuestion(result.data[0]);
      else setError("Could not generate question. Please try again.");
    } catch(e) { setError(`Error: ${e.message}`); }
    setLoading(false);
  }

  function submit() {
    if (!answer) return;
    setSubmitted(true);
    const correct = answer===question.correct;
    const entry = { topic:sel, correct, date:new Date().toLocaleDateString(), time:new Date().toLocaleTimeString([],{ hour:"2-digit", minute:"2-digit" }) };
    const updated = [entry,...history].slice(0,20);
    setHistory(updated);
    try { localStorage.setItem("gihub_quiz_history", JSON.stringify(updated)); } catch {}
  }

  const pct = history.length ? Math.round(history.filter(h=>h.correct).length/history.length*100) : null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#17324d" }}>🧠 GI Quiz</h1>
          <p style={{ fontSize:12.5, color:"#536b7b", marginTop:4 }}>AI-generated board-style MCQ · Fresh question every time · Powered by Claude</p>
        </div>
        {pct!==null&&<div style={{ background:"#eaf8fc", border:"1px solid #c8e8f1", borderRadius:10, padding:"8px 16px", textAlign:"center" }}><div style={{ fontSize:20, fontWeight:700, color:"#0b93bb" }}>{pct}%</div><div style={{ fontSize:10, color:"#536b7b", fontFamily:"monospace" }}>AVG SCORE</div></div>}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, margin:"20px 0 28px" }}>
        {QUIZ_TOPICS.map(t=>(
          <button key={t.id} onClick={()=>generate(t.id)} disabled={loading}
            style={{ background:sel===t.id?t.color+"33":"#f5fbfd", border:`1px solid ${sel===t.id?t.color:"#d1e5eb"}`, color:sel===t.id?t.color:"#536b7b", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:7, cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1, transition:"all 0.18s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {error&&!loading&&<div style={{ background:"rgba(224,82,82,0.08)", border:"1px solid #e0525244", borderRadius:10, padding:"14px 18px", marginBottom:20 }}><div style={{ fontSize:12, fontWeight:700, color:"#e05252", marginBottom:4 }}>Error</div><div style={{ fontSize:12, color:"#a05050", fontFamily:"monospace" }}>{error}</div></div>}
      {loading&&<div style={{ textAlign:"center", padding:"60px 0" }}><Spinner size={32}/><div style={{ marginTop:16, fontSize:14, color:"#536b7b" }}>Generating question…</div></div>}
      {submitted&&question&&(
        <div style={{ background:answer===question.correct?"#eaf9f4":"#fff1ef", border:`1px solid ${answer===question.correct?"#128566":"#e05252"}55`, borderRadius:12, padding:"16px 22px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontSize:18, fontWeight:700, color:answer===question.correct?"#128566":"#e05252" }}>{answer===question.correct?"Correct! 🎉":"Incorrect 📚"}</div>
          <button onClick={()=>generate(sel)} style={{ background:"#eaf8fc", border:"1px solid #b9e3ee", color:"#0b779b", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>New Question →</button>
        </div>
      )}
      {!loading&&question&&(
        <div style={{ background:"#fff", border:"1px solid #dcecf1", borderRadius:12, padding:"20px 22px" }}>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            <span style={{ background:ti?.color+"33", color:ti?.color, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>Q</span>
            <div style={{ fontSize:14, color:"#17324d", lineHeight:1.7 }}>{question.question}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, paddingLeft:40 }}>
            {question.options.map((opt,oi)=>{
              const letter=["A","B","C","D"][oi], isChosen=answer===letter, isRight=letter===question.correct;
              let bg="#f8fcfd", border="#dcecf1", color="#17324d";
              if (submitted) { if(isRight){bg="#eaf9f4";border="#12856655";color="#128566";} else if(isChosen){bg="#fff1ef";border="#f1c9c6";color="#e05252";} }
              else if (isChosen) { bg=ti?.color+"22"; border=ti?.color+"88"; color=ti?.color; }
              return (
                <div key={oi} onClick={()=>!submitted&&setAnswer(letter)}
                  style={{ background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"10px 14px", fontSize:13, color, cursor:submitted?"default":"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontWeight:700, fontFamily:"monospace", fontSize:11, minWidth:14 }}>{letter}</span>
                  <span>{opt.replace(/^[A-D][.)]\s*/i,"")}</span>
                  {submitted&&isRight&&<span style={{ marginLeft:"auto" }}>✓</span>}
                  {submitted&&isChosen&&!isRight&&<span style={{ marginLeft:"auto" }}>✗</span>}
                </div>
              );
            })}
          </div>
          {!submitted&&<div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}><button onClick={submit} disabled={!answer} style={{ background:!answer?"#f3f9fb":"linear-gradient(135deg,#0b779b,#128566)", border:"none", color:!answer?"#536b7b":"#fff", padding:"11px 26px", borderRadius:10, fontSize:14, fontWeight:700, cursor:!answer?"not-allowed":"pointer", transition:"all 0.2s" }}>Submit</button></div>}
          {submitted&&question.explanation&&(
            <div style={{ marginTop:16, paddingLeft:40 }}>
              <div style={{ background:"#f5fbfd", border:"1px solid #dcecf1", borderRadius:8, padding:"12px 14px" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:"#536b7b", fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>EXPLANATION</div>
                <div style={{ fontSize:13, color:"#476177", lineHeight:1.7 }}>{question.explanation}</div>
              </div>
            </div>
          )}
        </div>
      )}
      {!loading&&!sel&&<div style={{ textAlign:"center", padding:"60px 0" }}><div style={{ fontSize:40, marginBottom:14 }}>🧠</div><div style={{ fontSize:15, color:"#536b7b" }}>Select a topic above to generate a question</div></div>}
      {history.length>0&&(
        <div style={{ marginTop:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#17324d" }}>📊 Score History</h2>
            <button onClick={()=>{ setHistory([]); try{ localStorage.removeItem("gihub_quiz_history"); }catch{} }} style={{ background:"none", border:"1px solid #dcecf1", color:"#536b7b", fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>Clear</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10 }}>
            {history.map((h,i)=>(
              <div key={i} style={{ background:"#fff", border:"1px solid #f1f9fc", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace" }}>{h.date} · {h.time}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#476177", marginTop:3 }}>{h.topic}</div>
                <div style={{ fontSize:16, fontWeight:700, color:h.correct?"#128566":"#e05252", marginTop:6 }}>{h.correct?"✓ Correct":"✗ Incorrect"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STANDALONE_QUIZ_ENABLED = false;

const TABS = [
  { id:"home",       label:"Home",                 icon:"⌂" },
  { id:"guidelines", label:"Clinical Guidelines",  icon:"⚕️" },
  { id:"weekly",     label:"Weekly Update",       icon:"📰" },
  { id:"education",  label:"Education",           icon:"🎓" },
  { id:"schedule",   label:"Schedule",            icon:"📅" },
  ...(STANDALONE_QUIZ_ENABLED ? [{ id:"quiz", label:"Quiz", icon:"🧠" }] : []),
];

export default function GIHub({ initialActive = "home" }) {
  const [active, setActive] = useState(
    initialActive === "quiz" && !STANDALONE_QUIZ_ENABLED ? "guidelines" : initialActive
  );
  useEffect(() => {
    const handleHistory = () => setActive(publicTabForPath(window.location.pathname));
    window.addEventListener("popstate", handleHistory);
    return () => window.removeEventListener("popstate", handleHistory);
  }, []);
  const navigate = tab => {
    setActive(tab);
    const path = publicPathForTab(tab);
    if (window.location.pathname !== path) window.history.pushState(null, "", path);
    window.scrollTo({ top:0, behavior:"instant" });
  };
  return (
    <div className="gihub-app" style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f8fcfd 0%,#eaf8fc 58%,#f4fcf8 100%)", color:"#17324d", fontFamily:"'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", paddingBottom:80 }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        button,input{font-family:inherit}
        ::placeholder{color:#657b8a;opacity:1}
        input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid #0b93bb!important;outline-offset:2px}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#bddce5;border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(24px)", borderBottom:"1px solid #d6eaf0", boxShadow:"0 5px 22px rgba(23,50,77,0.04)", padding:"0 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0 10px", gap:12, flexWrap:"wrap" }}>
            <button type="button" onClick={()=>navigate("home")} aria-label="GIHub home" style={{ display:"flex", alignItems:"center", gap:12, border:0, background:"transparent", cursor:"pointer", textAlign:"left" }}>
              <div style={{ width:42, height:42, borderRadius:13, background:"linear-gradient(135deg,#0b93bb,#16af88)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, boxShadow:"0 6px 16px rgba(11,147,187,0.2)" }}>⚕️</div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:"#17324d", letterSpacing:-0.6 }}>GI<span style={{ color:"#0b93bb" }}>Hub</span>{" "}<span style={{ fontSize:11, background:"#dff6f1", color:"#116e59", padding:"3px 8px", borderRadius:20, fontWeight:800, fontFamily:"monospace", verticalAlign:"middle" }}>AI</span></div>
                <div style={{ fontSize:9.5, color:"#536b7b", letterSpacing:1.4, textTransform:"uppercase", fontFamily:"monospace" }}>Gastroenterology Educational Hub</div>
              </div>
            </button>
            <div style={{ fontSize:11, color:"#536b7b", fontFamily:"monospace" }}>{new Date().toLocaleDateString("en-US",{ month:"long", day:"numeric", year:"numeric" })}</div>
          </div>
          <div style={{ display:"flex", borderTop:"1px solid #e6f1f4", overflowX:"auto", gap:4 }}>
            {TABS.map(t=>(
              <button key={t.id} type="button" onClick={()=>navigate(t.id)}
                style={{ background:active===t.id?"#eaf8fc":"transparent", border:"none", borderBottom:`3px solid ${active===t.id?"#0b93bb":"transparent"}`, borderRadius:"10px 10px 0 0", color:active===t.id?"#0b779b":"#536b7b", padding:"12px 18px", fontSize:13, fontWeight:active===t.id?700:600, transition:"all 0.18s", whiteSpace:"nowrap", cursor:"pointer" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"38px 32px 0" }}>
        {active==="home"&&<Home onNavigate={navigate}/>}
        {active==="guidelines"&&<GuidelinesSection/>}
        {active==="weekly"    &&<ContentSection key="weekly"     type="weekly"/>}
        {active==="education" &&<EducationSection/>}
        {active==="schedule"  &&<ScheduleSection/>}
        {STANDALONE_QUIZ_ENABLED&&active==="quiz"&&<QuizSection/>}
      </div>
      {active!=="home"&&<div style={{ maxWidth:1100, margin:"52px auto 0", padding:"18px 32px 0", borderTop:"1px solid #d6eaf0" }}>
        <p style={{ fontSize:10.5, color:"#536b7b", textAlign:"center", lineHeight:2, fontFamily:"monospace" }}>
          GIHub is a curated educational reference tool for gastroenterologists. AI content generated via Claude with web search.<br/>
          Always verify against official society sources. Quiz questions are for educational purposes only. Not a substitute for clinical judgment.
        </p>
      </div>}
    </div>
  );
}
